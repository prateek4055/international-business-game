import { Peer, DataConnection } from 'peerjs';
import { GameAction, RoomMeta, RoomPlayer } from './multiplayerTypes';

type ActionCallback = (action: GameAction) => void;
type RoomCallback = (room: RoomMeta) => void;

class P2PService {
  private peer: Peer | null = null;
  private connection: DataConnection | null = null;
  private isHost: boolean = false;
  private currentRoom: RoomMeta | null = null;
  private onActionCallback: ActionCallback | null = null;
  private onRoomCallback: RoomCallback | null = null;
  private onDisconnectCallback: (() => void) | null = null;

  // Initialize Host for 2-Player Room
  public async createRoom(
    roomCode: string,
    hostPlayer: { name: string; color: string }
  ): Promise<RoomMeta> {
    this.cleanup();
    this.isHost = true;

    const peerId = `ib-game-${roomCode.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer(peerId, {
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
            ],
          },
        });

        this.peer.on('open', (id) => {
          const room: RoomMeta = {
            roomCode: roomCode.toUpperCase(),
            hostName: hostPlayer.name,
            maxPlayers: 2,
            mode: 'p2p',
            status: 'lobby',
            createdAt: Date.now(),
            players: [
              {
                id: 1,
                name: hostPlayer.name,
                color: hostPlayer.color,
                isHost: true,
                peerId: id,
                isReady: true,
                isOnline: true,
              },
            ],
          };

          this.currentRoom = room;
          resolve(room);
        });

        this.peer.on('connection', (conn) => {
          this.connection = conn;
          this.setupHostConnectionHandlers(conn);
        });

        this.peer.on('error', (err) => {
          console.error('[P2P] Peer host error:', err);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  // Join existing 2-Player Room as Friend
  public async joinRoom(
    roomCode: string,
    friendPlayer: { name: string; color: string }
  ): Promise<RoomMeta> {
    this.cleanup();
    this.isHost = false;

    const hostPeerId = `ib-game-${roomCode.toLowerCase()}`;

    return new Promise((resolve, reject) => {
      try {
        this.peer = new Peer({
          config: {
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
            ],
          },
        });

        const connectionTimeout = setTimeout(() => {
          reject(new Error('Connection timed out. Check room code or host connection.'));
        }, 12000);

        this.peer.on('open', () => {
          const conn = this.peer!.connect(hostPeerId, { reliable: true });
          this.connection = conn;

          conn.on('open', () => {
            clearTimeout(connectionTimeout);

            // Send handshake
            conn.send({
              type: 'P2P_JOIN_REQUEST',
              player: {
                id: 2,
                name: friendPlayer.name,
                color: friendPlayer.color,
                isHost: false,
                peerId: this.peer!.id,
                isReady: true,
                isOnline: true,
              },
            });
          });

          conn.on('data', (data: any) => {
            if (data?.type === 'P2P_ROOM_SYNC') {
              this.currentRoom = data.room;
              if (this.onRoomCallback) this.onRoomCallback(data.room);
              resolve(data.room);
            } else if (data?.action) {
              if (this.onActionCallback) this.onActionCallback(data.action);
            }
          });

          conn.on('close', () => {
            if (this.onDisconnectCallback) this.onDisconnectCallback();
          });

          conn.on('error', (err) => {
            clearTimeout(connectionTimeout);
            reject(err);
          });
        });

        this.peer.on('error', (err) => {
          clearTimeout(connectionTimeout);
          reject(err);
        });
      } catch (err) {
        reject(err);
      }
    });
  }

  private setupHostConnectionHandlers(conn: DataConnection) {
    conn.on('data', (data: any) => {
      if (data?.type === 'P2P_JOIN_REQUEST') {
        if (!this.currentRoom) return;

        const joiningPlayer: RoomPlayer = data.player;
        const exists = this.currentRoom.players.some((p) => p.name.toLowerCase() === joiningPlayer.name.toLowerCase());
        const playerWithUniqueId: RoomPlayer = {
          ...joiningPlayer,
          id: 2,
          name: exists ? `${joiningPlayer.name} (2)` : joiningPlayer.name,
        };

        this.currentRoom.players = [this.currentRoom.players[0], playerWithUniqueId];

        // Send synced room back to friend
        conn.send({
          type: 'P2P_ROOM_SYNC',
          room: this.currentRoom,
        });

        // Notify host UI
        if (this.onRoomCallback) this.onRoomCallback(this.currentRoom);
      } else if (data?.action) {
        if (this.onActionCallback) this.onActionCallback(data.action);
      }
    });

    conn.on('close', () => {
      if (this.currentRoom) {
        this.currentRoom.players = this.currentRoom.players.filter((p) => p.isHost);
        if (this.onRoomCallback) this.onRoomCallback(this.currentRoom);
      }
      if (this.onDisconnectCallback) this.onDisconnectCallback();
    });
  }

  public broadcastAction(action: GameAction) {
    if (this.connection && this.connection.open) {
      this.connection.send({ action });
    }
  }

  public broadcastRoomUpdate(room: RoomMeta) {
    this.currentRoom = room;
    if (this.isHost && this.connection && this.connection.open) {
      this.connection.send({
        type: 'P2P_ROOM_SYNC',
        room,
      });
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

  public getRoom(): RoomMeta | null {
    return this.currentRoom;
  }

  public cleanup() {
    if (this.connection) {
      try {
        this.connection.close();
      } catch (e) {
        // ignore
      }
      this.connection = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {
        // ignore
      }
      this.peer = null;
    }
    this.currentRoom = null;
    this.isHost = false;
  }
}

export const p2pService = new P2PService();
