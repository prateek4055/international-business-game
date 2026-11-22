import { p2pService } from './p2pService';
import { firebaseService } from './firebaseService';
import { GameAction, NetworkMode, RoomMeta, RoomPlayer } from './multiplayerTypes';

type ActionCallback = (action: GameAction) => void;
type RoomCallback = (room: RoomMeta) => void;

class MultiplayerManager {
  private activeMode: NetworkMode = 'local';
  private myPlayerId: number = 1;
  private isUserHost: boolean = false;
  private currentRoom: RoomMeta | null = null;
  private actionListeners: Set<ActionCallback> = new Set();
  private roomListeners: Set<RoomCallback> = new Set();
  private disconnectListeners: Set<() => void> = new Set();

  constructor() {
    // Bind P2P handlers
    p2pService.onAction((action) => this.dispatchAction(action));
    p2pService.onRoomUpdate((room) => this.dispatchRoomUpdate(room));
    p2pService.onDisconnect(() => this.dispatchDisconnect());

    // Bind Firebase handlers
    firebaseService.onAction((action) => this.dispatchAction(action));
    firebaseService.onRoomUpdate((room) => this.dispatchRoomUpdate(room));
    firebaseService.onDisconnect(() => this.dispatchDisconnect());
  }

  // Generate short alphanumeric room code e.g. "IB8421"
  public generateRoomCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'IB';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Host creates a new room
  public async createRoom(
    hostPlayer: { name: string; color: string },
    maxPlayers: 2 | 3 | 4,
    customCode?: string
  ): Promise<RoomMeta> {
    this.cleanup();
    const code = customCode || this.generateRoomCode();
    this.myPlayerId = 1;
    this.isUserHost = true;

    // RULE: For 2 Players → WebRTC P2P (Zero Server, direct connection)
    //       For 3 or 4 Players → Google Firebase Synced Room
    if (maxPlayers === 2) {
      this.activeMode = 'p2p';
      const room = await p2pService.createRoom(code, hostPlayer);
      this.currentRoom = room;
      return room;
    } else {
      this.activeMode = 'firebase';
      const room = await firebaseService.createRoom(code, hostPlayer, maxPlayers);
      this.currentRoom = room;
      return room;
    }
  }

  // Friend joins an existing room
  public async joinRoom(
    roomCode: string,
    friendPlayer: { name: string; color: string }
  ): Promise<RoomMeta> {
    this.cleanup();
    const cleanCode = roomCode.trim().toUpperCase();
    this.isUserHost = false;

    // Auto-detect mode: Try P2P first if code matches peer convention or attempt Firebase
    // P2P peerId is 'ib-game-<code.toLowerCase()>'
    try {
      // First attempt P2P (for 2 players)
      const p2pRoom = await p2pService.joinRoom(cleanCode, friendPlayer);
      this.activeMode = 'p2p';
      this.myPlayerId = 2;
      this.currentRoom = p2pRoom;
      return p2pRoom;
    } catch (p2pErr) {
      console.log('[Multiplayer] P2P connection did not connect, trying Firebase room:', p2pErr);
      // Fallback / 3-4 players room on Firebase
      this.activeMode = 'firebase';
      const fbRoom = await firebaseService.joinRoom(cleanCode, friendPlayer);
      const myPlayer = fbRoom.players.find(
        (p) => p.name === friendPlayer.name || p.name.startsWith(friendPlayer.name)
      );
      this.myPlayerId = myPlayer ? myPlayer.id : fbRoom.players.length;
      this.currentRoom = fbRoom;
      return fbRoom;
    }
  }

  public sendAction(action: GameAction) {
    if (this.activeMode === 'p2p') {
      p2pService.broadcastAction(action);
    } else if (this.activeMode === 'firebase') {
      firebaseService.broadcastAction(action);
    }
  }

  public updateRoomState(room: RoomMeta) {
    this.currentRoom = room;
    if (this.activeMode === 'p2p') {
      p2pService.broadcastRoomUpdate(room);
    } else if (this.activeMode === 'firebase') {
      firebaseService.broadcastRoomUpdate(room);
    }
  }

  public onAction(cb: ActionCallback) {
    this.actionListeners.add(cb);
    return () => this.actionListeners.delete(cb);
  }

  public onRoomUpdate(cb: RoomCallback) {
    this.roomListeners.add(cb);
    return () => this.roomListeners.delete(cb);
  }

  public onDisconnect(cb: () => void) {
    this.disconnectListeners.add(cb);
    return () => this.disconnectListeners.delete(cb);
  }

  private dispatchAction(action: GameAction) {
    this.actionListeners.forEach((cb) => {
      try {
        cb(action);
      } catch (err) {
        console.error('[Multiplayer] Error in action listener:', err);
      }
    });
  }

  private dispatchRoomUpdate(room: RoomMeta) {
    this.currentRoom = room;
    this.roomListeners.forEach((cb) => {
      try {
        cb(room);
      } catch (err) {
        console.error('[Multiplayer] Error in room listener:', err);
      }
    });
  }

  private dispatchDisconnect() {
    this.disconnectListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('[Multiplayer] Error in disconnect listener:', err);
      }
    });
  }

  public getMode(): NetworkMode {
    return this.activeMode;
  }

  public getMyId(): number {
    return this.myPlayerId;
  }

  public isHost(): boolean {
    return this.isUserHost;
  }

  public getRoom(): RoomMeta | null {
    return this.currentRoom;
  }

  public leaveRoom() {
    this.cleanup();
  }

  private cleanup() {
    p2pService.cleanup();
    firebaseService.cleanup();
    this.activeMode = 'local';
    this.currentRoom = null;
    this.isUserHost = false;
    this.myPlayerId = 1;
  }
}

export const multiplayerManager = new MultiplayerManager();
