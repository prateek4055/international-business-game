import { BoardSpace, Player } from '../data/boardData';

export type NetworkMode = 'local' | 'p2p' | 'firebase';

export interface RoomPlayer {
  id: number;
  name: string;
  color: string;
  isHost: boolean;
  peerId?: string;
  isReady: boolean;
  isOnline: boolean;
}

export interface RoomMeta {
  roomCode: string;
  hostName: string;
  maxPlayers: 2 | 3 | 4;
  mode: 'p2p' | 'firebase';
  status: 'lobby' | 'playing' | 'ended';
  players: RoomPlayer[];
  createdAt: number;
}

export type GameAction =
  | {
      type: 'START_GAME';
      players: Player[];
      shorterGame: boolean;
      timerMinutes: number;
    }
  | {
      type: 'ROLL_DICE';
      playerId: number;
      dice: [number, number];
      total: number;
    }
  | {
      type: 'BUY_PROPERTY';
      playerId: number;
      spaceIndex: number;
      price: number;
    }
  | {
      type: 'BUILD_UPGRADE';
      playerId: number;
      spaceIndex: number;
      isHotel: boolean;
      cost: number;
    }
  | {
      type: 'MORTGAGE';
      playerId: number;
      spaceIndex: number;
      isMortgage: boolean;
      amount: number;
    }
  | {
      type: 'CREDIT_CARD';
      playerId: number;
    }
  | {
      type: 'PAY_BAIL';
      playerId: number;
    }
  | {
      type: 'RESOLVE_UNO_CHANCE';
      playerId: number;
      cardType: 'UNO' | 'CHANCE';
      diceTotal: number;
      event: { title: string; subtitle: string; amount: number; isGain: boolean; text: string };
    }
  | {
      type: 'END_TURN';
      playerId: number;
      nextPlayerIndex: number;
    }
  | {
      type: 'SYNC_FULL_STATE';
      state: {
        activePlayerIndex: number;
        players: Player[];
        spacesState: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>;
        turnStatus: string;
        lastDice: [number, number];
        logs: string[];
      };
    };
