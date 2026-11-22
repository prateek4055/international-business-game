import { BoardSpace, Player } from '../data/boardData';

export type NetworkMode = 'local' | 'firebase' | 'p2p';

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
  maxPlayers: 2 | 3 | 4 | 5 | 6;
  timerMinutes?: number;
  quickDeal?: boolean;
  mode: 'firebase' | 'p2p';
  status: 'lobby' | 'playing' | 'ended' | 'closed';
  players: RoomPlayer[];
  createdAt: number;
}

export interface PlayerScoreSummary {
  rank: number;
  player: Player;
  totalWealth: number;
  cash: number;
  propertyValue: number;
  constructionValue: number;
  isBankrupt: boolean;
}

export type GameAction =
  | {
      type: 'START_GAME';
      players: Player[];
      shorterGame: boolean;
      timerMinutes: number;
      initialSpacesState?: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>;
    }
  | {
      type: 'GAME_OVER';
      rankings: PlayerScoreSummary[];
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
      type: 'LIFT_MORTGAGE';
      playerId: number;
      spaceIndex: number;
      cost: number;
    }
  | {
      type: 'END_TURN';
      playerId?: number;
      nextPlayerIndex: number;
      players?: Player[];
      spacesState?: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>;
    }
  | {
      type: 'ROOM_CLOSED';
    };
