import { ref, set, get, update, remove, onValue, Unsubscribe } from 'firebase/database';
import { rtdb } from './firebaseConfig';
import { GameAction, RoomMeta, RoomPlayer } from './multiplayerTypes';

type ActionCallback = (action: GameAction) => void;
type RoomCallback = (room: RoomMeta) => void;

class FirebaseService {
  private currentRoomCode: string | null = null;
  private unsubscribeRoom: Unsubscribe | null = null;
  private onActionCallback: ActionCallback | null = null;
  private onRoomCallback: RoomCallback | null = null;
  private onDisconnectCallback: (() => void) | null = null;
  private lastActionTimestamp: number = 0;

  public async createRoom(
    roomCode: string,
    hostPlayer: { name: string; color: string },
    maxPlayers: 2 | 3 | 4 | 5 | 6
  ): Promise<RoomMeta> {
    this.cleanup();
    this.currentRoomCode = roomCode.toUpperCase();

    const room: RoomMeta = {
      roomCode: this.currentRoomCode,
      hostName: hostPlayer.name,
      maxPlayers,
      mode: 'firebase',
      status: 'lobby',
      createdAt: Date.now(),
      players: [
        {
          id: 1,
          name: hostPlayer.name,
          color: hostPlayer.color,
          isHost: true,
          isReady: true,
          isOnline: true,
        },
      ],
    };

    try {
      const roomRef = ref(rtdb, `ib_rooms/${this.currentRoomCode}`);
      await set(roomRef, {
        ...room,
        lastAction: null,
        updatedAt: Date.now(),
      });

      this.listenToRoom(this.currentRoomCode);
      return room;
    } catch (err) {
      console.error('[Firebase RTDB] Room creation error:', err);
      throw err;
    }
  }

  public async joinRoom(
    roomCode: string,
    friendPlayer: { name: string; color: string }
  ): Promise<{ room: RoomMeta; myPlayerId: number }> {
    this.cleanup();
    const formattedCode = roomCode.toUpperCase();
    this.currentRoomCode = formattedCode;

    const roomRef = ref(rtdb, `ib_rooms/${formattedCode}`);
    const snap = await get(roomRef);

    if (!snap.exists()) {
      throw new Error(`Room "${formattedCode}" does not exist. Please check the code.`);
    }

    const roomData = snap.val() as RoomMeta;

    if (roomData.status === 'closed') {
      throw new Error('This room has been closed by the host.');
    }

    if (roomData.status !== 'lobby') {
      throw new Error('This game is already in progress!');
    }

    if (roomData.players && roomData.players.length >= roomData.maxPlayers) {
      throw new Error(`Room is full (${roomData.players.length}/${roomData.maxPlayers} players).`);
    }

    const currentPlayers = roomData.players || [];
    const newId = currentPlayers.length + 1;
    const exists = currentPlayers.some((p) => p.name.toLowerCase() === friendPlayer.name.toLowerCase());
    const newPlayer: RoomPlayer = {
      id: newId,
      name: exists ? `${friendPlayer.name} (${newId})` : friendPlayer.name,
      color: friendPlayer.color,
      isHost: false,
      isReady: true,
      isOnline: true,
    };

    const updatedPlayers = [...currentPlayers, newPlayer];

    await update(roomRef, {
      players: updatedPlayers,
      updatedAt: Date.now(),
    });

    this.listenToRoom(formattedCode);
    return { room: { ...roomData, players: updatedPlayers }, myPlayerId: newId };
  }

  // Host closes the room: notify peers then remove room
  public async closeRoom(roomCode: string): Promise<void> {
    const formattedCode = roomCode.toUpperCase();
    try {
      const roomRef = ref(rtdb, `ib_rooms/${formattedCode}`);
      // Mark as closed first so all listeners update their UI
      await update(roomRef, {
        status: 'closed',
        updatedAt: Date.now(),
        lastAction: { type: 'ROOM_CLOSED' },
      });
      // Give peers a moment to receive closed status, then remove
      setTimeout(async () => {
        try {
          await remove(roomRef);
        } catch (_) {}
      }, 2500);
    } catch (err) {
      console.warn('[Firebase RTDB] Close room error:', err);
    } finally {
      this.cleanup();
    }
  }

  // Guest leaves the room
  public async leaveRoom(roomCode: string, playerId: number): Promise<void> {
    const formattedCode = roomCode.toUpperCase();
    try {
      const roomRef = ref(rtdb, `ib_rooms/${formattedCode}`);
      const snap = await get(roomRef);
      if (snap.exists()) {
        const roomData = snap.val() as RoomMeta;
        const updatedPlayers = (roomData.players || []).filter((p) => p.id !== playerId);
        await update(roomRef, {
          players: updatedPlayers,
          updatedAt: Date.now(),
        });
      }
    } catch (err) {
      console.warn('[Firebase RTDB] Leave room error:', err);
    } finally {
      this.cleanup();
    }
  }

  private listenToRoom(roomCode: string) {
    if (this.unsubscribeRoom) this.unsubscribeRoom();

    const roomRef = ref(rtdb, `ib_rooms/${roomCode}`);
    this.unsubscribeRoom = onValue(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          if (this.onDisconnectCallback) this.onDisconnectCallback();
          return;
        }

        const data = snapshot.val();
        if (data.status === 'closed') {
          if (this.onDisconnectCallback) this.onDisconnectCallback();
          return;
        }

        const roomMeta: RoomMeta = {
          roomCode: data.roomCode,
          hostName: data.hostName,
          maxPlayers: data.maxPlayers,
          mode: 'firebase',
          status: data.status,
          players: data.players || [],
          createdAt: data.createdAt,
        };

        if (this.onRoomCallback) this.onRoomCallback(roomMeta);

        // Check if a new game action occurred
        if (data.lastAction && data.updatedAt && data.updatedAt > this.lastActionTimestamp) {
          this.lastActionTimestamp = data.updatedAt;
          if (this.onActionCallback) this.onActionCallback(data.lastAction);
        }
      },
      (error) => {
        console.warn('[Firebase RTDB] Listener error:', error);
      }
    );
  }

  public async broadcastAction(action: GameAction) {
    if (!this.currentRoomCode) return;
    try {
      const roomRef = ref(rtdb, `ib_rooms/${this.currentRoomCode}`);
      const timestamp = Math.max(Date.now(), this.lastActionTimestamp + 1);
      this.lastActionTimestamp = timestamp;
      await update(roomRef, {
        lastAction: action,
        updatedAt: timestamp,
      });
    } catch (err) {
      console.warn('[Firebase RTDB] Broadcast action failed:', err);
    }
  }

  public async broadcastRoomUpdate(room: RoomMeta) {
    if (!this.currentRoomCode) return;
    try {
      const roomRef = ref(rtdb, `ib_rooms/${this.currentRoomCode}`);
      await update(roomRef, {
        status: room.status,
        players: room.players,
        updatedAt: Date.now(),
      });
    } catch (err) {
      console.warn('[Firebase RTDB] Broadcast room update failed:', err);
    }
  }

  public onAction(callback: ActionCallback) {
    this.onActionCallback = callback;
  }

  public onRoomUpdate(callback: RoomCallback) {
    this.onRoomCallback = callback;
  }

  public onDisconnect(callback: () => void) {
    this.onDisconnectCallback = callback;
  }

  public cleanup() {
    if (this.unsubscribeRoom) {
      this.unsubscribeRoom();
      this.unsubscribeRoom = null;
    }
    this.currentRoomCode = null;
    this.lastActionTimestamp = 0;
  }
}

export const firebaseService = new FirebaseService();
