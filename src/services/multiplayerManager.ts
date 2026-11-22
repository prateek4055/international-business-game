import { firebaseService } from './firebaseService';
import { GameAction, NetworkMode, RoomMeta, RoomPlayer } from './multiplayerTypes';

type ActionCallback = (action: GameAction) => void;
type RoomCallback = (room: RoomMeta) => void;

class MultiplayerManager {
  private activeMode: NetworkMode = 'firebase';
  private myPlayerId: number = 1;
  private isUserHost: boolean = false;
  private currentRoom: RoomMeta | null = null;
  private actionListeners: Set<ActionCallback> = new Set();
  private roomListeners: Set<RoomCallback> = new Set();
  private disconnectListeners: Set<() => void> = new Set();

  constructor() {
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

  // Host creates a new room (2 to 6 players)
  public async createRoom(
    hostPlayer: { name: string; color: string },
    maxPlayers: 2 | 3 | 4 | 5 | 6,
    customCode?: string,
    timerMinutes: number = 30,
    quickDeal: boolean = false
  ): Promise<RoomMeta> {
    this.cleanup();
    const code = customCode || this.generateRoomCode();
    this.myPlayerId = 1;
    this.isUserHost = true;
    this.activeMode = 'firebase';

    const room = await firebaseService.createRoom(code, hostPlayer, maxPlayers, timerMinutes, quickDeal);
    this.currentRoom = room;
    return room;
  }

  // Friend joins an existing room
  public async joinRoom(
    roomCode: string,
    friendPlayer: { name: string; color: string }
  ): Promise<RoomMeta> {
    this.cleanup();
    const cleanCode = roomCode.trim().toUpperCase();
    this.isUserHost = false;
    this.activeMode = 'firebase';

    const { room, myPlayerId } = await firebaseService.joinRoom(cleanCode, friendPlayer);
    this.myPlayerId = myPlayerId;
    this.currentRoom = room;
    return room;
  }

  // Host closes / deletes the room
  public async closeRoom(): Promise<void> {
    if (this.currentRoom && this.isUserHost) {
      await firebaseService.closeRoom(this.currentRoom.roomCode);
    }
    this.cleanup();
  }

  // Guest leaves the room
  public async leaveRoom(): Promise<void> {
    if (this.currentRoom) {
      if (this.isUserHost) {
        await firebaseService.closeRoom(this.currentRoom.roomCode);
      } else {
        await firebaseService.leaveRoom(this.currentRoom.roomCode, this.myPlayerId);
      }
    }
    this.cleanup();
  }

  public sendAction(action: GameAction) {
    firebaseService.broadcastAction(action);
  }

  public updateRoomState(room: RoomMeta) {
    this.currentRoom = room;
    firebaseService.broadcastRoomUpdate(room);
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
        console.error('[Multiplayer] Action dispatch error:', err);
      }
    });
  }

  private dispatchRoomUpdate(room: RoomMeta) {
    this.currentRoom = room;
    this.roomListeners.forEach((cb) => {
      try {
        cb(room);
      } catch (err) {
        console.error('[Multiplayer] Room dispatch error:', err);
      }
    });
  }

  private dispatchDisconnect() {
    this.disconnectListeners.forEach((cb) => {
      try {
        cb();
      } catch (err) {
        console.error('[Multiplayer] Disconnect error:', err);
      }
    });
  }

  public isHost(): boolean {
    return this.isUserHost;
  }

  public getMyId(): number {
    return this.myPlayerId;
  }

  public getRoom(): RoomMeta | null {
    return this.currentRoom;
  }

  public getMode(): NetworkMode {
    return this.activeMode;
  }

  public cleanup() {
    this.currentRoom = null;
    this.isUserHost = false;
    this.myPlayerId = 1;
    firebaseService.cleanup();
  }
}

export const multiplayerManager = new MultiplayerManager();
