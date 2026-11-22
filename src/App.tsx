import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  BOARD_SPACES,
  BoardSpace,
  Player,
  GAME_CONSTANTS,
  getUnoEvent,
  getChanceEvent,
  UnoChanceEvent
} from './data/boardData';
import { Board } from './components/Board';
import { ThreeDiceRoll, ThreeDiceRollHandle } from './components/ThreeDiceRoll';
import { PlayerHUD } from './components/PlayerHUD';
import { PropertyCardModal } from './components/PropertyCardModal';
import { PropertyDeedCollection } from './components/PropertyDeedCollection';
import { UnoChanceModal } from './components/UnoChanceModal';
import { JailModal } from './components/JailModal';
import { CreditCardModal } from './components/CreditCardModal';
import { GameLobby } from './components/GameLobby';
import { OnlineRoomModal } from './components/OnlineRoomModal';
import { TransactionBanner, TransactionEvent } from './components/TransactionBanner';
import { soundService } from './services/soundService';
import { multiplayerManager } from './services/multiplayerManager';
import { GameAction } from './services/multiplayerTypes';
import { Trophy, RotateCcw, Volume2, VolumeX, Wifi, Users } from 'lucide-react';

export const App: React.FC = () => {
  // Game Setup
  const [phase, setPhase] = useState<'lobby' | 'playing' | 'game_over'>('lobby');
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const search = window.location.search;
    if (search.includes('start=true') && phase === 'lobby') {
      const defaultPlayers: Player[] = [
        { id: 0, name: 'You', color: '#E53935', colorName: 'Red', isAI: false, cash: 25000, creditCardLimit: 10000, hasUsedCreditCard: false, creditCardInstallmentsLeft: 0, hasPassport: true, passportRoundsRemaining: 0, boardPosition: 0, isInJail: false, jailRollAttempts: 0, isBankrupt: false, ownedPropertyIndices: [] },
        { id: 1, name: 'Bot Alice', color: '#1E88E5', colorName: 'Blue', isAI: true, cash: 25000, creditCardLimit: 10000, hasUsedCreditCard: false, creditCardInstallmentsLeft: 0, hasPassport: true, passportRoundsRemaining: 0, boardPosition: 0, isInJail: false, jailRollAttempts: 0, isBankrupt: false, ownedPropertyIndices: [] },
        { id: 2, name: 'Bot Bob', color: '#43A047', colorName: 'Green', isAI: true, cash: 25000, creditCardLimit: 10000, hasUsedCreditCard: false, creditCardInstallmentsLeft: 0, hasPassport: true, passportRoundsRemaining: 0, boardPosition: 0, isInJail: false, jailRollAttempts: 0, isBankrupt: false, ownedPropertyIndices: [] },
        { id: 3, name: 'Bot Charlie', color: '#FB8C00', colorName: 'Yellow', isAI: true, cash: 25000, creditCardLimit: 10000, hasUsedCreditCard: false, creditCardInstallmentsLeft: 0, hasPassport: true, passportRoundsRemaining: 0, boardPosition: 0, isInJail: false, jailRollAttempts: 0, isBankrupt: false, ownedPropertyIndices: [] },
      ];
      handleStartGame(defaultPlayers, false, 30);
    }
    if (search.includes('uno=true')) {
      const ev = getUnoEvent(4);
      setUnoChanceState({ isOpen: true, type: 'UNO', diceTotal: 4, lastDice: [2, 2], event: ev });
    }
    if (search.includes('toast=true')) {
      setTimeout(() => {
        showTransaction({
          type: 'gain',
          title: 'PROFIT REWARD',
          amount: 2500,
          isPositive: true,
          playerName: 'You',
          playerColor: '#E53935',
          description: '1st prize in Beauty contest! Received $2,500 from Bank.',
          icon: '👑'
        });
      }, 500);
    }
  }, []);
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [isShortGame, setIsShortGame] = useState<boolean>(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(1800); // 30m default

  // Board State
  const [spacesState, setSpacesState] = useState<
    Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>
  >({});

  // Turn State Machine: 'idle' -> 'rolling' -> 'moving' -> 'action' -> 'done'
  const [turnStatus, setTurnStatus] = useState<'idle' | 'rolling' | 'moving' | 'action' | 'done'>('idle');
  const [lastDice, setLastDice] = useState<[number, number]>([1, 1]);
  const [logs, setLogs] = useState<string[]>([]);
  const [winner, setWinner] = useState<Player | null>(null);

  // Active Transaction Toast
  const [transactionEvent, setTransactionEvent] = useState<TransactionEvent | null>(null);

  // Modals
  const [selectedSpace, setSelectedSpace] = useState<BoardSpace | null>(null);
  const [isDeedCollectionOpen, setDeedCollectionOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.search.includes('deeds=true');
  });
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const [unoChanceState, setUnoChanceState] = useState<{
    isOpen: boolean;
    type: 'UNO' | 'CHANCE';
    diceTotal: number;
    lastDice: [number, number];
    event: UnoChanceEvent | null;
  }>({ isOpen: false, type: 'UNO', diceTotal: 4, lastDice: [2, 2], event: null });
  const [jailModalOpen, setJailModalOpen] = useState<boolean>(false);
  const [creditCardModalOpen, setCreditCardModalOpen] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Online Multiplayer State
  const [onlineModalOpen, setOnlineModalOpen] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.location.search.includes('join=');
  });
  const [urlJoinCode] = useState<string>(() => {
    if (typeof window === 'undefined') return '';
    const params = new URLSearchParams(window.location.search);
    return params.get('join') || '';
  });
  const [isOnlineSession, setIsOnlineSession] = useState<boolean>(false);
  const [myPlayerId, setMyPlayerId] = useState<number>(1);
  const [isHost, setIsHost] = useState<boolean>(false);

  const diceRef = useRef<ThreeDiceRollHandle>(null);
  const activePlayer = players[activePlayerIndex];

  const logMessage = (msg: string) => {
    setLogs((prev) => [...prev.slice(-20), msg]);
  };

  const showTransaction = (event: Omit<TransactionEvent, 'id'>) => {
    setTransactionEvent({ ...event, id: Math.random().toString(36).substring(7) });
  };

  // Remote Action Dispatcher Listener
  useEffect(() => {
    const unsub = multiplayerManager.onAction((action: GameAction) => {
      handleRemoteAction(action);
    });
    return () => {
      unsub();
    };
  }, [players, activePlayerIndex, spacesState, isOnlineSession, myPlayerId]);

  const handleRemoteAction = (action: GameAction) => {
    switch (action.type) {
      case 'START_GAME':
        handleStartGame(action.players, action.shorterGame, action.timerMinutes);
        break;

      case 'ROLL_DICE':
        setTurnStatus('rolling');
        setLastDice(action.dice);
        logMessage(`🎲 Remote player rolled ${action.dice[0]} + ${action.dice[1]} = ${action.total}`);
        soundService.playDiceRoll();
        advancePawn(action.total, action.dice);
        break;

      case 'BUY_PROPERTY': {
        const space = BOARD_SPACES[action.spaceIndex];
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === action.playerId
              ? {
                  ...p,
                  cash: p.cash - action.price,
                  ownedPropertyIndices: [...p.ownedPropertyIndices, space.index],
                }
              : p
          )
        );
        setSpacesState((prev) => ({
          ...prev,
          [space.index]: { ...prev[space.index], ownerId: action.playerId },
        }));
        soundService.playBuyProperty();
        showTransaction({
          type: 'gain',
          title: 'PROPERTY ACQUIRED',
          playerName: players.find((p) => p.id === action.playerId)?.name || 'Player',
          playerColor: players.find((p) => p.id === action.playerId)?.color || '#10B981',
          description: `Acquired ${space.name} for $${action.price.toLocaleString()}!`,
          icon: '🏡',
        });
        break;
      }

      case 'BUILD_UPGRADE': {
        const space = BOARD_SPACES[action.spaceIndex];
        setPlayers((prev) =>
          prev.map((p) => (p.id === action.playerId ? { ...p, cash: p.cash - action.cost } : p))
        );
        setSpacesState((prev) => {
          const current = prev[space.index] || { housesCount: 0, hasHotel: false, isMortgaged: false };
          return {
            ...prev,
            [space.index]: {
              ...current,
              housesCount: action.isHotel ? 3 : current.housesCount + 1,
              hasHotel: action.isHotel,
            },
          };
        });
        soundService.playCashPay();
        break;
      }

      case 'MORTGAGE': {
        const space = BOARD_SPACES[action.spaceIndex];
        setSpacesState((prev) => ({
          ...prev,
          [space.index]: { ...prev[space.index], isMortgaged: action.isMortgage },
        }));
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === action.playerId
              ? { ...p, cash: action.isMortgage ? p.cash + action.amount : p.cash - action.amount }
              : p
          )
        );
        break;
      }

      case 'END_TURN':
        setTurnStatus('idle');
        setActivePlayerIndex(action.nextPlayerIndex);
        break;
    }
  };

  const handleStartOnlineSession = (onlinePlayers: Player[], hostFlag: boolean, playerId: number) => {
    setIsOnlineSession(true);
    setIsHost(hostFlag);
    setMyPlayerId(playerId);
    handleStartGame(onlinePlayers, false, 30);
    const mode = multiplayerManager.getMode();
    logMessage(`🌐 Connected to Online Game (${mode === 'p2p' ? '2-Player P2P WebRTC' : '3-4P Google Firebase'})!`);
  };

  // Timer countdown for Shorter Game
  useEffect(() => {
    if (phase !== 'playing' || !isShortGame) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [phase, isShortGame]);

  const handleTimeUp = () => {
    logMessage('⏳ Time is up! Evaluating scores...');
    let topPlayer: Player | null = null;
    let maxWealth = -1;

    players.forEach((p) => {
      if (p.isBankrupt) return;
      let wealth = p.cash;
      p.ownedPropertyIndices.forEach((idx) => {
        const s = BOARD_SPACES[idx];
        const state = spacesState[idx];
        wealth += s.price || 0;
        wealth += (state?.housesCount || 0) * (s.houseCost || 0);
        if (state?.hasHotel) wealth += s.hotelCost || 0;
      });
      if (wealth > maxWealth) {
        maxWealth = wealth;
        topPlayer = p;
      }
    });

    declareWinner(topPlayer);
  };

  const declareWinner = (w: Player | null) => {
    setWinner(w);
    setPhase('game_over');
    soundService.playVictory();
    confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
    logMessage(`🏆 WINNER: ${w?.name} with the greatest business empire! 🏆`);
  };

  // Start Game from Lobby
  const handleStartGame = (initialPlayers: Player[], shorter: boolean, timerMins: number) => {
    // Ensure every player starts with $25,000 Cash, $10,000 Credit Card, and a Passport
    const finalizedPlayers: Player[] = initialPlayers.map((p) => ({
      ...p,
      cash: GAME_CONSTANTS.STARTING_CASH,
      creditCardLimit: GAME_CONSTANTS.CREDIT_CARD_LIMIT,
      hasUsedCreditCard: false,
      creditCardInstallmentsLeft: 0,
      hasPassport: true,
      passportRoundsRemaining: 0,
      boardPosition: 0,
      isInJail: false,
      jailRollAttempts: 0,
      isBankrupt: false,
      ownedPropertyIndices: [] as number[]
    }));

    setPlayers(finalizedPlayers);
    setActivePlayerIndex(0);
    setIsShortGame(shorter);
    setTimeRemaining(timerMins * 60);
    setLogs([]);
    setWinner(null);
    setTurnStatus('idle');
    setTransactionEvent(null);

    // Initialize all 36 spaces as unowned
    const initialSpacesState: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }> = {};
    BOARD_SPACES.forEach((s) => {
      initialSpacesState[s.index] = { housesCount: 0, hasHotel: false, isMortgaged: false };
    });

    // Shorter game deals 2 random properties
    if (shorter) {
      const purchasable = BOARD_SPACES.filter((s) => s.type === 'Property' || s.type === 'Utility').sort(() => 0.5 - Math.random());
      let cardIdx = 0;
      finalizedPlayers.forEach((p) => {
        for (let c = 0; c < 2 && cardIdx < purchasable.length; c++) {
          const prop = purchasable[cardIdx++];
          initialSpacesState[prop.index].ownerId = p.id;
          p.ownedPropertyIndices.push(prop.index);
          p.cash -= prop.price || 0;
          logMessage(`${p.name} dealt ${prop.name} for $${prop.price}`);
        }
      });
    }

    setSpacesState(initialSpacesState);
    setPhase('playing');
    logMessage(`🎲 Game Started! Starting capital: $25,000 Cash, $10,000 Credit Line, and Passport issued to all players.`);
  };

  // ==========================================
  // TRAINED AI BOT ROUTINE
  // ==========================================
  useEffect(() => {
    if (phase !== 'playing' || !activePlayer || !activePlayer.isAI) return;

    if (turnStatus === 'idle') {
      const aiActionTimer = setTimeout(() => {
        // 1. Jail Decision
        if (activePlayer.isInJail) {
          if (activePlayer.cash >= 1500) {
            handlePayJailBail();
          } else {
            // Roll for escape (need 12)
            diceRef.current?.roll();
          }
        } else {
          // Normal roll
          diceRef.current?.roll();
        }
      }, 1100);

      return () => clearTimeout(aiActionTimer);
    }

    if (turnStatus === 'done') {
      // AI auto ends turn after brief viewing pause
      const endTimer = setTimeout(() => {
        handleEndTurn();
      }, 1600);

      return () => clearTimeout(endTimer);
    }
  }, [phase, activePlayerIndex, turnStatus, activePlayer?.isAI]);

  // Dice Roll Completed (Called by ThreeDiceRoll)
  const handleRollDiceComplete = (d1: number, d2: number) => {
    if (turnStatus !== 'idle') return;
    setTurnStatus('rolling');
    setLastDice([d1, d2]);
    const total = d1 + d2;
    logMessage(`${activePlayer.name} rolled ${d1} + ${d2} = ${total}`);

    if (isOnlineSession && activePlayer.id === myPlayerId) {
      multiplayerManager.sendAction({
        type: 'ROLL_DICE',
        playerId: activePlayer.id,
        dice: [d1, d2],
        total,
      });
    }

    // If in Jail
    if (activePlayer.isInJail) {
      if (total === GAME_CONSTANTS.JAIL_DICE_ESCAPE_TOTAL) {
        logMessage(`🎲 ${activePlayer.name} rolled a 12! ESCAPED from JAIL!`);
        showTransaction({
          type: 'gain',
          title: 'JAIL ESCAPE!',
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${activePlayer.name} rolled a 12 and broke free from JAIL!`,
          icon: '🔓'
        });
        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, isInJail: false, jailRollAttempts: 0 } : p))
        );
        advancePawn(total, [d1, d2]);
      } else {
        const nextAttempts = activePlayer.jailRollAttempts + 1;
        logMessage(`${activePlayer.name} failed jail escape roll (${nextAttempts}/${GAME_CONSTANTS.JAIL_MAX_ATTEMPTS})`);
        
        if (nextAttempts >= GAME_CONSTANTS.JAIL_MAX_ATTEMPTS) {
          logMessage(`Exceeded 3 jail attempts. Automatically paying $500 bail.`);
          handlePayJailBail();
          setTurnStatus('done');
        } else {
          setPlayers((prev) =>
            prev.map((p) => (p.id === activePlayer.id ? { ...p, jailRollAttempts: nextAttempts } : p))
          );
          setTurnStatus('done');
        }
      }
      return;
    }

    advancePawn(total, [d1, d2]);
  };

  // Pawn Movement along 36 Perimeter Tiles
  const advancePawn = (steps: number, rolledDice: [number, number]) => {
    setTurnStatus('moving');
    let current = activePlayer.boardPosition;
    let stepCount = 0;

    const interval = setInterval(() => {
      current = (current + 1) % 36;
      stepCount++;
      soundService.playPawnStep();

      // Passed or landed on START (Space 0)
      if (current === 0) {
        soundService.playCashCollect();
        logMessage(`💰 ${activePlayer.name} passed START and collected $${GAME_CONSTANTS.PASS_START_BONUS}!`);

        showTransaction({
          type: 'gain',
          title: 'SALARY COLLECTED',
          amount: GAME_CONSTANTS.PASS_START_BONUS,
          isPositive: true,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${activePlayer.name} passed START and received $${GAME_CONSTANTS.PASS_START_BONUS} salary!`,
          icon: '💰'
        });

        // Credit Card Repayment & Passport check
        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id !== activePlayer.id) return p;

            let updatedCash = p.cash + GAME_CONSTANTS.PASS_START_BONUS;
            let updatedPassport = p.hasPassport;
            let updatedPassportRounds = p.passportRoundsRemaining;
            let updatedInstallments = p.creditCardInstallmentsLeft;
            let jailed = p.isInJail;

            // Passport recovery check (6 rounds)
            if (!updatedPassport) {
              updatedPassportRounds--;
              if (updatedPassportRounds <= 0) {
                updatedPassport = true;
                logMessage(`🛂 ${p.name} completed 6 rounds and redeemed their PASSPORT!`);
              }
            }

            // Credit card installment ($2,000)
            if (updatedInstallments > 0) {
              if (updatedCash >= GAME_CONSTANTS.CREDIT_CARD_INSTALLMENT) {
                updatedCash -= GAME_CONSTANTS.CREDIT_CARD_INSTALLMENT;
                updatedInstallments--;
                logMessage(`💳 ${p.name} paid $2,000 credit installment (${GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS - updatedInstallments}/6).`);
              } else {
                logMessage(`⚠️ ${p.name} failed to pay $2,000 credit card installment! Sent directly to JAIL!`);
                jailed = true;
              }
            }

            return {
              ...p,
              cash: updatedCash,
              hasPassport: updatedPassport,
              passportRoundsRemaining: updatedPassportRounds,
              creditCardInstallmentsLeft: updatedInstallments,
              isInJail: jailed
            };
          })
        );
      }

      setPlayers((prev) =>
        prev.map((p) => (p.id === activePlayer.id ? { ...p, boardPosition: current } : p))
      );

      if (stepCount >= steps) {
        clearInterval(interval);
        setTurnStatus('action');
        resolveSpaceLanding(BOARD_SPACES[current], rolledDice);
      }
    }, 140);
  };

  // Landing on a space
  const resolveSpaceLanding = (space: BoardSpace, rolledDice: [number, number] = lastDice) => {
    logMessage(`${activePlayer.name} landed on ${space.name} (#${space.index})`);
    const state = spacesState[space.index];

    switch (space.type) {
      case 'Start':
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;

      case 'Property':
      case 'Utility':
        if (state.ownerId === undefined) {
          // Unowned: prompt to buy
          if (activePlayer.isAI) {
            // Trained Bot Buy Decision:
            // High priority if completes monopoly or safe cash balance
            const groupProps = BOARD_SPACES.filter((s) => s.group === space.group && (s.type === 'Property' || s.type === 'Utility'));
            const botOwnedInGroup = activePlayer.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].group === space.group).length;
            const isMonopolyCloser = botOwnedInGroup === 2;

            if (activePlayer.cash >= (space.price || 0)) {
              handleBuyProperty(space);
            } else if (isMonopolyCloser && !activePlayer.hasUsedCreditCard) {
              // Bot draws credit card to secure monopoly
              handleTakeCreditCard(activePlayer);
              handleBuyProperty(space);
            }
            setTurnStatus('done');
          } else {
            setSelectedSpace(space);
          }
        } else if (state.ownerId !== activePlayer.id) {
          const owner = players.find((p) => p.id === state.ownerId);
          if (owner) {
            if (!owner.hasPassport) {
              logMessage(`🛂 ${owner.name} lost their PASSPORT! Rent is WAIVED!`);
              showTransaction({
                type: 'passport',
                title: 'RENT WAIVED (NO PASSPORT)',
                playerName: activePlayer.name,
                playerColor: activePlayer.color,
                targetName: owner.name,
                targetColor: owner.color,
                description: `${owner.name} has no passport! ${activePlayer.name} pays $0 rent on ${space.name}.`,
                icon: '🛂'
              });
            } else if (state.isMortgaged) {
              logMessage(`🏷️ ${space.name} is MORTGAGED! No rent owed.`);
            } else {
              let rent = 0;
              if (space.type === 'Property') {
                rent = calculateRent(space, state, owner);
              } else {
                const paired = BOARD_SPACES.find((s) => s.name === space.pairedWith);
                const ownsPaired = paired && spacesState[paired.index]?.ownerId === owner.id;
                rent = ownsPaired ? space.pairedRent || 0 : space.baseRent || 0;
              }
              payRent(activePlayer, owner, rent, space.name);
            }
          }
          setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        } else {
          // Landed on own property
          if (activePlayer.isAI) {
            // Check if can build house
            const canBuild = space.type === 'Property' &&
              state.housesCount < GAME_CONSTANTS.MAX_HOUSES &&
              !state.hasHotel &&
              activePlayer.cash >= (space.houseCost || 0) + 2000 &&
              activePlayer.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].group === space.group).length >= GAME_CONSTANTS.MONOPOLY_COUNT;

            if (canBuild) {
              handleBuildHouse(space);
            }
          }
          setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        }
        break;

      case 'Uno': {
        const total = rolledDice[0] + rolledDice[1];
        const unoEvent = getUnoEvent(total);
        logMessage(`🇺🇳 UNO LANDING: Rolled ${rolledDice[0]} + ${rolledDice[1]} = ${total}. Using UNO Position #${total}.`);
        setUnoChanceState({
          isOpen: true,
          type: 'UNO',
          diceTotal: total,
          lastDice: rolledDice,
          event: unoEvent
        });
        break;
      }

      case 'Chance': {
        const total = rolledDice[0] + rolledDice[1];
        const chanceEvent = getChanceEvent(total);
        logMessage(`❓ CHANCE LANDING: Rolled ${rolledDice[0]} + ${rolledDice[1]} = ${total}. Using CHANCE Position #${total}.`);
        setUnoChanceState({
          isOpen: true,
          type: 'CHANCE',
          diceTotal: total,
          lastDice: rolledDice,
          event: chanceEvent
        });
        break;
      }

      case 'CustomDuty': {
        const countriesCount = activePlayer.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].type === 'Property').length;
        const tax = Math.min(countriesCount * GAME_CONSTANTS.CUSTOM_DUTY_PER_COUNTRY, GAME_CONSTANTS.CUSTOM_DUTY_MAX);
        logMessage(`🛃 CUSTOM DUTY: ${activePlayer.name} pays $${tax} ($100 × ${countriesCount} countries owned).`);
        
        soundService.playCashPay();
        showTransaction({
          type: 'loss',
          title: 'CUSTOM DUTY PAID',
          amount: tax,
          isPositive: false,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${activePlayer.name} paid $${tax} Custom Duty ($100 × ${countriesCount} countries owned) to the Bank.`,
          icon: '🛃'
        });

        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - tax } : p))
        );
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;
      }

      case 'TravellingDuty': {
        const tCountriesCount = activePlayer.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].type === 'Property').length;
        const tTax = Math.min(tCountriesCount * GAME_CONSTANTS.TRAVELLING_DUTY_PER_COUNTRY, GAME_CONSTANTS.TRAVELLING_DUTY_MAX);
        logMessage(`🚌 TRAVELLING DUTY: ${activePlayer.name} pays $${tTax} ($50 × ${tCountriesCount} countries owned).`);
        
        soundService.playCashPay();
        showTransaction({
          type: 'loss',
          title: 'TRAVELLING DUTY PAID',
          amount: tTax,
          isPositive: false,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${activePlayer.name} paid $${tTax} Travelling Duty ($50 × ${tCountriesCount} countries owned) to the Bank.`,
          icon: '🚌'
        });

        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - tTax } : p))
        );
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;
      }

      case 'PartyHouse': {
        soundService.playCashCollect();
        const activeOthers = players.filter((p) => p.id !== activePlayer.id && !p.isBankrupt);
        const partyTotal = activeOthers.length * GAME_CONSTANTS.PARTY_HOUSE_BONUS_EACH;

        showTransaction({
          type: 'party',
          title: 'PARTY HOUSE BONUS',
          amount: partyTotal,
          isPositive: true,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🎉 Party House! ${activePlayer.name} collected $200 from each player (Total: +$${partyTotal.toLocaleString()})!`,
          icon: '🎉'
        });

        logMessage(`🎉 PARTY HOUSE: ${activePlayer.name} received $200 from each player (+$${partyTotal})!`);

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === activePlayer.id) return { ...p, cash: p.cash + partyTotal };
            if (!p.isBankrupt) return { ...p, cash: p.cash - GAME_CONSTANTS.PARTY_HOUSE_BONUS_EACH };
            return p;
          })
        );
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;
      }

      case 'Resort': {
        soundService.playCashPay();
        const activeOthers = players.filter((p) => p.id !== activePlayer.id && !p.isBankrupt);
        const resortTotal = activeOthers.length * GAME_CONSTANTS.RESORT_FEE_EACH;

        showTransaction({
          type: 'resort',
          title: 'RESORT EXPENSE',
          amount: resortTotal,
          isPositive: false,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🏖️ Resort: ${activePlayer.name} gave $200 to each other player (Total: -$${resortTotal.toLocaleString()}).`,
          icon: '🏖️'
        });

        logMessage(`🏖️ RESORT: ${activePlayer.name} gave $200 to each player (-$${resortTotal}).`);

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === activePlayer.id) return { ...p, cash: p.cash - resortTotal };
            if (!p.isBankrupt) return { ...p, cash: p.cash + GAME_CONSTANTS.RESORT_FEE_EACH };
            return p;
          })
        );
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;
      }

      case 'Jail':
        // Rule: "A player goes to jail in following cases: (1) When your pawn arrives usually by throwing dice."
        sendToJail(activePlayer);
        setTurnStatus(activePlayer.isAI ? 'done' : 'action');
        break;
    }
  };

  const calculateRent = (
    space: BoardSpace,
    state: { housesCount: number; hasHotel: boolean; isMortgaged: boolean },
    owner: Player
  ): number => {
    if (!space.rents) return 0;
    if (state.hasHotel) return space.rents.hotel;
    if (state.housesCount === 3) return space.rents.house3;
    if (state.housesCount === 2) return space.rents.house2;
    if (state.housesCount === 1) return space.rents.house1;

    // Rule: "If a Player owns THREE sites of any colour-group, the rent is Doubled on unimproved sites"
    const groupOwned = owner.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].group === space.group).length;
    if (groupOwned >= GAME_CONSTANTS.MONOPOLY_COUNT) {
      return space.rents.siteOnly * 2;
    }
    return space.rents.siteOnly;
  };

  const payRent = (debtor: Player, creditor: Player, amount: number, propName: string) => {
    soundService.playCashPay();
    logMessage(`💸 ${debtor.name} paid $${amount.toLocaleString()} rent to ${creditor.name} for ${propName}.`);

    showTransaction({
      type: 'rent',
      title: 'RENT PAID',
      amount: amount,
      isPositive: false,
      playerName: debtor.name,
      playerColor: debtor.color,
      targetName: creditor.name,
      targetColor: creditor.color,
      description: `💸 ${debtor.name} paid $${amount.toLocaleString()} rent to ${creditor.name} on ${propName}!`,
      icon: '💸'
    });

    setPlayers((prev) =>
      prev.map((p) => {
        if (p.id === debtor.id) return { ...p, cash: p.cash - amount };
        if (p.id === creditor.id) return { ...p, cash: p.cash + amount };
        return p;
      })
    );

    if (debtor.cash - amount < 0) {
      checkBankruptcy(debtor, creditor);
    }
  };

  const checkBankruptcy = (debtor: Player, creditor?: Player) => {
    logMessage(`⚠️ ${debtor.name} is in debt!`);
    const unmortgaged = debtor.ownedPropertyIndices.filter((idx) => !spacesState[idx].isMortgaged);
    if (unmortgaged.length === 0 && debtor.hasUsedCreditCard) {
      soundService.playJail();
      logMessage(`💀 ${debtor.name} IS BANKRUPT and eliminated!`);

      showTransaction({
        type: 'loss',
        title: 'BANKRUPTCY ELIMINATION',
        playerName: debtor.name,
        playerColor: debtor.color,
        description: `💀 ${debtor.name} has gone BANKRUPT and is eliminated from the game!`,
        icon: '💀'
      });

      setPlayers((prev) =>
        prev.map((p) => (p.id === debtor.id ? { ...p, isBankrupt: true } : p))
      );

      // Transfer properties
      setSpacesState((prev) => {
        const next = { ...prev };
        debtor.ownedPropertyIndices.forEach((idx) => {
          if (creditor) next[idx].ownerId = creditor.id;
          else delete next[idx].ownerId;
        });
        return next;
      });

      // Check remaining players
      const remaining = players.filter((p) => !p.isBankrupt && p.id !== debtor.id);
      if (remaining.length <= 1) {
        declareWinner(remaining[0] || null);
      }
    }
  };

  const sendToJail = (p: Player) => {
    soundService.playJail();
    soundService.triggerHaptic('heavy');
    logMessage(`🔒 ${p.name} was sent directly to JAIL!`);

    showTransaction({
      type: 'jail',
      title: 'ARRESTED & JAILED',
      playerName: p.name,
      playerColor: p.color,
      description: `🚔 ${p.name} was locked in JAIL! Bail: $500, Roll 12, or $3,000 Credit Card.`,
      icon: '🏛️'
    });

    setPlayers((prev) =>
      prev.map((player) =>
        player.id === p.id
          ? { ...player, isInJail: true, boardPosition: 27, jailRollAttempts: 0 }
          : player
      )
    );
  };

  // Execute Event from UNO / CHANCE
  const handleConfirmUnoChance = () => {
    const { event, type } = unoChanceState;
    if (!event) {
      setUnoChanceState((prev) => ({ ...prev, isOpen: false }));
      setTurnStatus('done');
      return;
    }

    switch (event.action) {
      case 'receive': {
        const amt = event.amount || 0;
        soundService.playCashCollect();
        showTransaction({
          type: 'gain',
          title: `${type} REWARD`,
          amount: amt,
          isPositive: true,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${type}: ${event.text} (+${amt.toLocaleString()})`,
          icon: '🎁'
        });
        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash + amt } : p))
        );
        break;
      }

      case 'pay': {
        const amt = event.amount || 0;
        soundService.playCashPay();
        showTransaction({
          type: 'loss',
          title: `${type} PENALTY`,
          amount: amt,
          isPositive: false,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `${type}: ${event.text} (-${amt.toLocaleString()})`,
          icon: '💸'
        });
        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - amt } : p))
        );
        if (activePlayer.cash - amt < 0) checkBankruptcy(activePlayer);
        break;
      }

      case 'collect_all': {
        const amt = event.amount || 500;
        const activeOthers = players.filter((p) => p.id !== activePlayer.id && !p.isBankrupt);
        const total = activeOthers.length * amt;

        soundService.playCashCollect();
        showTransaction({
          type: 'gain',
          title: 'ANNIVERSARY COLLECTION',
          amount: total,
          isPositive: true,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🎂 Anniversary: ${activePlayer.name} collected $${amt} from each player (Total: +$${total.toLocaleString()})!`,
          icon: '🎂'
        });

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === activePlayer.id) return { ...p, cash: p.cash + total };
            if (!p.isBankrupt) return { ...p, cash: p.cash - amt };
            return p;
          })
        );
        break;
      }

      case 'collect_sites': {
        const feePerSite = event.amount || 100;
        const sites = activePlayer.ownedPropertyIndices.length;
        const totalSitesFee = sites * feePerSite;
        const activeOthers = players.filter((p) => p.id !== activePlayer.id && !p.isBankrupt);
        const totalCollected = activeOthers.length * totalSitesFee;

        soundService.playCashCollect();
        showTransaction({
          type: 'gain',
          title: 'SITE RENTS COLLECTED',
          amount: totalCollected,
          isPositive: true,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🏠 ${activePlayer.name} collected $${feePerSite}/site from each player (Total: +$${totalCollected.toLocaleString()})!`,
          icon: '🏠'
        });

        setPlayers((prev) =>
          prev.map((p) => {
            if (p.id === activePlayer.id) return { ...p, cash: p.cash + totalCollected };
            if (!p.isBankrupt) return { ...p, cash: p.cash - totalSitesFee };
            return p;
          })
        );
        break;
      }

      case 'party_house':
        setUnoChanceState((prev) => ({ ...prev, isOpen: false }));
        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, boardPosition: 18 } : p))
        );
        resolveSpaceLanding(BOARD_SPACES[18], unoChanceState.lastDice);
        return;

      case 'jail':
        sendToJail(activePlayer);
        break;

      case 'passport':
        soundService.playCashPay();
        soundService.triggerHaptic('warning');
        logMessage(`🛂 ${activePlayer.name} surrendered their PASSPORT!`);

        showTransaction({
          type: 'passport',
          title: 'PASSPORT FORFEITED',
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🛂 ${activePlayer.name} lost their Passport! Cannot collect rent for 6 rounds or until $5,000 paid.`,
          icon: '🛂'
        });

        setPlayers((prev) =>
          prev.map((p) =>
            p.id === activePlayer.id
              ? { ...p, hasPassport: false, passportRoundsRemaining: GAME_CONSTANTS.PASSPORT_REDEEM_ROUNDS }
              : p
          )
        );
        break;

      case 'repairs': {
        let hCount = 0;
        let htCount = 0;
        activePlayer.ownedPropertyIndices.forEach((idx) => {
          const st = spacesState[idx];
          hCount += st.housesCount;
          if (st.hasHotel) htCount++;
        });
        const repCost = hCount * (event.houseCost || 50) + htCount * (event.hotelCost || 100);
        soundService.playCashPay();
        logMessage(`🔨 ${activePlayer.name} paid $${repCost} for repairs (${hCount} houses, ${htCount} hotels).`);

        showTransaction({
          type: 'loss',
          title: 'REPAIRS PAID',
          amount: repCost,
          isPositive: false,
          playerName: activePlayer.name,
          playerColor: activePlayer.color,
          description: `🔨 ${activePlayer.name} paid $${repCost} repairs for ${hCount} houses and ${htCount} hotels.`,
          icon: '🔨'
        });

        setPlayers((prev) =>
          prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - repCost } : p))
        );
        break;
      }
    }

    setUnoChanceState((prev) => ({ ...prev, isOpen: false }));
    setTurnStatus('done');
  };

  // Bot Auto-confirm for UNO / CHANCE
  useEffect(() => {
    if (unoChanceState.isOpen && activePlayer && activePlayer.isAI) {
      const timer = setTimeout(() => {
        handleConfirmUnoChance();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [unoChanceState.isOpen, activePlayer]);

  // Property Actions
  const handleBuyProperty = (space: BoardSpace) => {
    if (!space.price || activePlayer.cash < space.price) return;
    const price = space.price;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === activePlayer.id
          ? {
              ...p,
              cash: p.cash - price,
              ownedPropertyIndices: [...p.ownedPropertyIndices, space.index]
            }
          : p
      )
    );

    setSpacesState((prev) => ({
      ...prev,
      [space.index]: { ...prev[space.index], ownerId: activePlayer.id }
    }));

    soundService.playBuyProperty();
    soundService.triggerHaptic('success');
    logMessage(`🏡 ${activePlayer.name} purchased ${space.name} for $${price.toLocaleString()}!`);

    showTransaction({
      type: 'buy',
      title: 'PROPERTY BOUGHT',
      amount: price,
      isPositive: false,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `🏡 ${activePlayer.name} acquired ${space.name} ${space.flag || ''} for $${price.toLocaleString()}!`,
      icon: '🏡'
    });

    if (isOnlineSession && activePlayer.id === myPlayerId) {
      multiplayerManager.sendAction({
        type: 'BUY_PROPERTY',
        playerId: activePlayer.id,
        spaceIndex: space.index,
        price,
      });
    }

    setSelectedSpace(null);
    setTurnStatus('done');
  };

  const handleBuildHouse = (space: BoardSpace) => {
    if (!space.houseCost || activePlayer.cash < space.houseCost) return;
    const cost = space.houseCost;

    setPlayers((prev) =>
      prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - cost } : p))
    );

    setSpacesState((prev) => ({
      ...prev,
      [space.index]: { ...prev[space.index], housesCount: prev[space.index].housesCount + 1 }
    }));

    soundService.playBuild();
    soundService.triggerHaptic('success');
    logMessage(`🔨 ${activePlayer.name} built a House on ${space.name}!`);

    showTransaction({
      type: 'build',
      title: 'HOUSE BUILT',
      amount: cost,
      isPositive: false,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `🏠 ${activePlayer.name} erected a house on ${space.name} (Rent increased)!`,
      icon: '🏠'
    });
  };

  const handleBuildHotel = (space: BoardSpace) => {
    if (!space.hotelCost || activePlayer.cash < space.hotelCost) return;
    const cost = space.hotelCost;

    setPlayers((prev) =>
      prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - cost } : p))
    );

    setSpacesState((prev) => ({
      ...prev,
      [space.index]: { ...prev[space.index], housesCount: 0, hasHotel: true }
    }));

    soundService.playBuild();
    soundService.triggerHaptic('success');
    logMessage(`🏨 ${activePlayer.name} erected a HOTEL on ${space.name}!`);

    showTransaction({
      type: 'build',
      title: 'HOTEL ERECTED',
      amount: cost,
      isPositive: false,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `🏨 ${activePlayer.name} erected a LUXURY HOTEL on ${space.name}!`,
      icon: '🏨'
    });
  };

  const handleMortgage = (space: BoardSpace) => {
    if (!space.mortgage) return;
    const mort = space.mortgage;

    setPlayers((prev) =>
      prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash + mort } : p))
    );

    setSpacesState((prev) => ({
      ...prev,
      [space.index]: { ...prev[space.index], isMortgaged: true }
    }));

    soundService.playCashCollect();
    logMessage(`🏷️ ${activePlayer.name} mortgaged ${space.name} to the Bank for $${mort.toLocaleString()}.`);

    showTransaction({
      type: 'gain',
      title: 'PROPERTY MORTGAGED',
      amount: mort,
      isPositive: true,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `🏷️ ${activePlayer.name} mortgaged ${space.name} to the Bank for +$${mort.toLocaleString()}.`,
      icon: '🏷️'
    });
  };

  const handleLiftMortgage = (space: BoardSpace) => {
    if (!space.mortgage || activePlayer.cash < space.mortgage) return;
    const mort = space.mortgage;

    setPlayers((prev) =>
      prev.map((p) => (p.id === activePlayer.id ? { ...p, cash: p.cash - mort } : p))
    );

    setSpacesState((prev) => ({
      ...prev,
      [space.index]: { ...prev[space.index], isMortgaged: false }
    }));

    soundService.playCashPay();
    logMessage(`✅ ${activePlayer.name} lifted mortgage on ${space.name}.`);

    showTransaction({
      type: 'loss',
      title: 'MORTGAGE LIFTED',
      amount: mort,
      isPositive: false,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `✅ ${activePlayer.name} redeemed ${space.name} by paying $${mort.toLocaleString()}!`,
      icon: '✅'
    });
  };

  // Jail Bail
  const handlePayJailBail = () => {
    if (activePlayer.cash < GAME_CONSTANTS.JAIL_BAIL_FEE) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === activePlayer.id
          ? { ...p, cash: p.cash - GAME_CONSTANTS.JAIL_BAIL_FEE, isInJail: false, jailRollAttempts: 0 }
          : p
      )
    );

    soundService.playCashPay();
    logMessage(`🔓 ${activePlayer.name} paid $500 bail and is released from Jail!`);

    showTransaction({
      type: 'gain',
      title: 'RELEASED FROM JAIL',
      amount: GAME_CONSTANTS.JAIL_BAIL_FEE,
      isPositive: false,
      playerName: activePlayer.name,
      playerColor: activePlayer.color,
      description: `🔓 ${activePlayer.name} paid $500 bail and is officially free!`,
      icon: '🔓'
    });

    setJailModalOpen(false);
  };

  const handleJailCreditCard = () => {
    if (activePlayer.cash >= GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE) {
      setPlayers((prev) =>
        prev.map((p) =>
          p.id === activePlayer.id
            ? { ...p, cash: p.cash - GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE, isInJail: false, jailRollAttempts: 0 }
            : p
        )
      );

      soundService.playCashPay();
      logMessage(`🔓 ${activePlayer.name} paid $3,000 fine via Card facility and escaped Jail!`);

      showTransaction({
        type: 'gain',
        title: 'JAIL CREDIT ESCAPE',
        amount: GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE,
        isPositive: false,
        playerName: activePlayer.name,
        playerColor: activePlayer.color,
        description: `🔓 ${activePlayer.name} paid $3,000 from Card facility and escaped Jail!`,
        icon: '💳'
      });

      setJailModalOpen(false);
    }
  };

  // Credit Card Loan Draw
  const handleTakeCreditCard = (targetPlayer: Player) => {
    if (targetPlayer.hasUsedCreditCard) return;

    setPlayers((prev) =>
      prev.map((p) =>
        p.id === targetPlayer.id
          ? {
              ...p,
              cash: p.cash + GAME_CONSTANTS.CREDIT_CARD_LIMIT,
              hasUsedCreditCard: true,
              creditCardInstallmentsLeft: GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS
            }
          : p
      )
    );

    soundService.playCashCollect();
    logMessage(`💳 ${targetPlayer.name} drew $10,000 Bank Credit Card emergency loan!`);

    showTransaction({
      type: 'gain',
      title: 'CREDIT LINE DRAWN',
      amount: GAME_CONSTANTS.CREDIT_CARD_LIMIT,
      isPositive: true,
      playerName: targetPlayer.name,
      playerColor: targetPlayer.color,
      description: `💳 ${targetPlayer.name} drew $10,000 emergency loan (Repay 6 × $2,000 = $12,000)!`,
      icon: '💳'
    });

    setCreditCardModalOpen(false);
  };

  // End Turn
  const handleEndTurn = () => {
    setTurnStatus('idle');
    let nextIdx = (activePlayerIndex + 1) % players.length;
    while (players[nextIdx].isBankrupt) {
      nextIdx = (nextIdx + 1) % players.length;
    }
    setActivePlayerIndex(nextIdx);
    logMessage(`--- ${players[nextIdx].name}'s Turn ---`);

    if (isOnlineSession && activePlayer.id === myPlayerId) {
      multiplayerManager.sendAction({
        type: 'END_TURN',
        playerId: activePlayer.id,
        nextPlayerIndex: nextIdx,
      });
    }
  };

  const toggleSound = () => {
    const s = !soundEnabled;
    setSoundEnabled(s);
    soundService.enabled = s;
  };

  return (
    <div className={`min-h-[100dvh] ${phase === 'playing' ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : ''} relative z-10 text-white flex flex-col justify-between p-1.5 sm:p-4 pb-[max(env(safe-area-inset-bottom),10px)]`}>
      {/* ── Transaction Toast / Animated Alert ────────────── */}
      <TransactionBanner
        event={transactionEvent}
        onDismiss={() => setTransactionEvent(null)}
      />

      {/* ── Top Navbar ───────────────────────────── */}
      <header
        className="flex items-center justify-between py-1.5 sm:py-2.5 px-3 sm:px-4 max-w-7xl w-full mx-auto mb-1 sm:mb-2 rounded-xl sm:rounded-2xl shrink-0 bg-gradient-to-b from-[#1C4870] to-[#0E2A44] border-t-2 border-white/35 border-b-[4px] border-[#071625] shadow-2xl"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center font-display text-xs sm:text-sm font-extrabold shadow-md shrink-0 bg-gradient-to-b from-[#FFD23F] to-[#F59E0B] border-t border-white/70 border-b-2 border-[#B45309] text-[#381A00]"
          >
            IB
          </div>
          <div>
            <span className="font-display text-xs sm:text-sm text-white font-extrabold leading-none tracking-wide drop-shadow-sm">
              INTERNATIONAL <span className="text-[#FFD23F]">BUSINESS</span>
            </span>
            <div className="text-[8px] sm:text-[9px] font-game text-[#34D399] leading-none font-bold mt-0.5">
              ★ Official $25k Cash & $10k Bank Card ★
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Online Room Badge */}
          {isOnlineSession ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/40 border border-emerald-400/50 shadow-sm text-xs font-game">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="font-extrabold text-emerald-300">
                {multiplayerManager.getMode() === 'p2p' ? '⚡ P2P (2P)' : '🌐 CLOUD (3-4P)'}
              </span>
              <span className="text-white/60">|</span>
              <span className="text-[#FFD23F] font-black">{multiplayerManager.getRoom()?.roomCode || 'LIVE'}</span>
            </div>
          ) : (
            <button
              onClick={() => setOnlineModalOpen(true)}
              className="btn-arcade-green px-2.5 sm:px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-md"
              title="Play Online with Friends"
            >
              <Users size={14} />
              <span className="hidden sm:inline">PLAY ONLINE</span>
            </button>
          )}

          <button
            onClick={() => setDeedCollectionOpen(true)}
            className="btn-arcade-gold px-3 py-1.5 text-xs flex items-center gap-1.5 shadow-md"
            title="Browse 20 Countries + 6 Utilities Deed Collection"
          >
            <span>📜</span>
            <span className="hidden sm:inline">DEEDS GALLERY</span>
          </button>

          <button
            onClick={toggleSound}
            className="btn-arcade-blue p-2 rounded-xl text-white shadow-md flex items-center justify-center"
            title="Toggle Sound"
          >
            {soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {phase === 'playing' && (
            <button
              onClick={() => {
                if (isOnlineSession) multiplayerManager.leaveRoom();
                setIsOnlineSession(false);
                setPhase('lobby');
              }}
              className="btn-arcade-red px-3 py-1.5 text-xs flex items-center gap-1 shadow-md"
            >
              <RotateCcw size={13} />
              <span className="hidden sm:inline">LOBBY</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Main View ───────────────────────────── */}
      <main className="flex-1 flex flex-col items-center justify-center max-w-7xl w-full mx-auto min-h-0 overflow-hidden">
        {phase === 'lobby' && (
          <GameLobby
            onStartGame={handleStartGame}
            onOpenOnlineRoom={() => setOnlineModalOpen(true)}
          />
        )}

        {phase === 'playing' && activePlayer && (
          <div className="w-full h-full flex-1 flex flex-col lg:flex-row items-center lg:items-start justify-between lg:justify-center gap-1 lg:gap-4 min-h-0 overflow-hidden">
            {/* Board Column - Centered & Auto-Fitting without scroll */}
            <div className="w-full lg:max-w-[840px] flex-1 flex items-center justify-center min-h-0 overflow-hidden p-0.5">
              <Board
                spacesState={spacesState}
                players={players}
                activePlayer={activePlayer}
                onTileClick={(space) => setSelectedSpace(space)}
              />
            </div>

            {/* Mobile Dock (Fixed below the board on mobile screens < lg) */}
            <div className="w-full lg:hidden shrink-0 max-w-lg mx-auto px-1 pb-1">
              <PlayerHUD
                players={players}
                activePlayer={activePlayer}
                timeRemaining={isShortGame ? timeRemaining : undefined}
                canRoll={turnStatus === 'idle' && !activePlayer.isInJail}
                canEndTurn={turnStatus === 'done' || (turnStatus === 'action' && !activePlayer.isAI)}
                onRollDice={() => diceRef.current?.roll()}
                onOpenCreditCard={() => setCreditCardModalOpen(true)}
                onOpenJail={() => setJailModalOpen(true)}
                onEndTurn={handleEndTurn}
                logs={logs}
                lastDice={lastDice}
                turnStatus={turnStatus}
                isOnlineSession={isOnlineSession}
                myPlayerId={myPlayerId}
                diceSlot={isMobile ? (
                  <ThreeDiceRoll
                    ref={diceRef}
                    onRollComplete={handleRollDiceComplete}
                    disabled={turnStatus !== 'idle' || activePlayer.isAI || (isOnlineSession && activePlayer.id !== myPlayerId)}
                    compact={true}
                  />
                ) : undefined}
              />
            </div>

            {/* Side Column (Desktop Only >= lg) */}
            <div className="hidden lg:flex w-full lg:max-w-[380px] flex-col gap-3 shrink-0">
              <PlayerHUD
                players={players}
                activePlayer={activePlayer}
                timeRemaining={isShortGame ? timeRemaining : undefined}
                canRoll={turnStatus === 'idle' && !activePlayer.isInJail}
                canEndTurn={turnStatus === 'done' || (turnStatus === 'action' && !activePlayer.isAI)}
                onRollDice={() => diceRef.current?.roll()}
                onOpenCreditCard={() => setCreditCardModalOpen(true)}
                onOpenJail={() => setJailModalOpen(true)}
                onEndTurn={handleEndTurn}
                logs={logs}
                lastDice={lastDice}
                turnStatus={turnStatus}
                isOnlineSession={isOnlineSession}
                myPlayerId={myPlayerId}
              />

              {/* 3D Dice Roller Container (Desktop) */}
              {!isMobile && (
                <div
                  className="w-full rounded-2xl overflow-hidden shrink-0"
                  style={{
                    background: '#193D5A',
                    border: '2px solid rgba(255,255,255,0.18)',
                    boxShadow: '0 8px 24px rgba(10,25,40,0.4), inset 0 1px 0 rgba(255,255,255,0.12)'
                  }}
                >
                  <ThreeDiceRoll
                    ref={diceRef}
                    onRollComplete={handleRollDiceComplete}
                    disabled={turnStatus !== 'idle' || activePlayer.isAI}
                  />
                </div>
              )}

              {/* Game Log (Desktop) */}
              <div
                className="rounded-2xl p-3 flex flex-col overflow-hidden"
                style={{
                  height: '160px',
                  background: '#163D5A',
                  border: '2px solid rgba(255,255,255,0.18)',
                  boxShadow: '0 6px 18px rgba(10,25,40,0.35)',
                }}
              >
                <div className="font-game font-bold text-[#EDB64D] pb-1.5 mb-1 border-b border-[#23435B] uppercase tracking-widest text-[10px] flex items-center justify-between">
                  <span>📜 Live Action History</span>
                  <span className="text-[9px] text-[#A8B7C9] font-normal">{logs.length} events</span>
                </div>
                <div className="flex-1 overflow-y-auto space-y-0.5 font-game text-[10px] text-[#E8F4F7]">
                  {logs.length === 0 ? (
                    <div className="text-[#A8B7C9] italic">Roll the dice to begin trading...</div>
                  ) : (
                    logs.map((log, i) => (
                      <div key={i} className="py-0.5 border-b border-[#23435B]/40 last:border-0 leading-relaxed">
                        {log}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {phase === 'game_over' && (
          <div
            className="rounded-3xl text-center max-w-md w-full space-y-5 event-pop p-8"
            style={{
              background: '#193D5A',
              border: '3px solid #EDB64D',
              boxShadow: '0 12px 0 #0E2437, 0 20px 50px rgba(0,0,0,0.6)',
            }}
          >
            <div className="text-7xl animate-[float_2s_ease-in-out_infinite]">🏆</div>
            <h2 className="font-display text-4xl text-[#EDB64D] text-glow-gold">GAME OVER!</h2>
            <div className="font-display text-2xl text-[#91B65A] text-glow-mint">
              {winner?.name} Wins!
            </div>
            <p className="font-game text-sm text-[#E8F4F7]/80">
              The wealthiest business tycoon in the world!
            </p>
            <button
              onClick={() => setPhase('lobby')}
              className="btn-clay-gold w-full py-4 font-display text-lg tracking-wide"
            >
              🎮 PLAY AGAIN
            </button>
          </div>
        )}
      </main>

      {/* Property Deed Modal */}
      {selectedSpace && (
        <PropertyCardModal
          space={selectedSpace}
          owner={spacesState[selectedSpace.index]?.ownerId !== undefined ? players.find((p) => p.id === spacesState[selectedSpace.index].ownerId) : undefined}
          activePlayer={activePlayer}
          canBuy={
            spacesState[selectedSpace.index]?.ownerId === undefined &&
            activePlayer.boardPosition === selectedSpace.index &&
            activePlayer.cash >= (selectedSpace.price || 0)
          }
          canBuildHouse={
            spacesState[selectedSpace.index]?.ownerId === activePlayer.id &&
            selectedSpace.type === 'Property' &&
            spacesState[selectedSpace.index].housesCount < GAME_CONSTANTS.MAX_HOUSES &&
            !spacesState[selectedSpace.index].hasHotel &&
            activePlayer.cash >= (selectedSpace.houseCost || 0) &&
            activePlayer.ownedPropertyIndices.filter((idx) => BOARD_SPACES[idx].group === selectedSpace.group).length >= GAME_CONSTANTS.MONOPOLY_COUNT
          }
          canBuildHotel={
            spacesState[selectedSpace.index]?.ownerId === activePlayer.id &&
            selectedSpace.type === 'Property' &&
            spacesState[selectedSpace.index].housesCount >= GAME_CONSTANTS.MAX_HOUSES &&
            !spacesState[selectedSpace.index].hasHotel &&
            activePlayer.cash >= (selectedSpace.hotelCost || 0)
          }
          canMortgage={
            spacesState[selectedSpace.index]?.ownerId === activePlayer.id &&
            !spacesState[selectedSpace.index].isMortgaged &&
            spacesState[selectedSpace.index].housesCount === 0 &&
            !spacesState[selectedSpace.index].hasHotel
          }
          canLiftMortgage={
            spacesState[selectedSpace.index]?.ownerId === activePlayer.id &&
            spacesState[selectedSpace.index].isMortgaged &&
            activePlayer.cash >= (selectedSpace.mortgage || 0)
          }
          onBuy={() => handleBuyProperty(selectedSpace)}
          onBuildHouse={() => handleBuildHouse(selectedSpace)}
          onBuildHotel={() => handleBuildHotel(selectedSpace)}
          onMortgage={() => handleMortgage(selectedSpace)}
          onLiftMortgage={() => handleLiftMortgage(selectedSpace)}
          onClose={() => {
            setSelectedSpace(null);
            setTurnStatus('done');
          }}
        />
      )}

      {/* UNO / CHANCE Modal */}
      <UnoChanceModal
        isOpen={unoChanceState.isOpen}
        type={unoChanceState.type}
        diceTotal={unoChanceState.diceTotal}
        lastDice={unoChanceState.lastDice}
        event={unoChanceState.event}
        activePlayer={activePlayer}
        players={players}
        onConfirm={handleConfirmUnoChance}
      />

      {/* Jail Modal */}
      {activePlayer && (
        <JailModal
          isOpen={jailModalOpen}
          jailRollAttempts={activePlayer.jailRollAttempts}
          playerCash={activePlayer.cash}
          hasUsedCreditCard={activePlayer.hasUsedCreditCard}
          onPayBail={handlePayJailBail}
          onRollForFreedom={() => {
            setJailModalOpen(false);
            diceRef.current?.roll();
          }}
          onUseCreditCard={handleJailCreditCard}
          onClose={() => setJailModalOpen(false)}
        />
      )}

      {/* Credit Card Drawer */}
      {activePlayer && (
        <CreditCardModal
          isOpen={creditCardModalOpen}
          player={activePlayer}
          canTakeLoan={!activePlayer.hasUsedCreditCard}
          onTakeLoan={() => handleTakeCreditCard(activePlayer)}
          onClose={() => setCreditCardModalOpen(false)}
        />
      )}

      {/* Property Deed Collection Gallery Modal */}
      <PropertyDeedCollection
        isOpen={isDeedCollectionOpen}
        onClose={() => setDeedCollectionOpen(false)}
        onSelectProperty={(space) => {
          setDeedCollectionOpen(false);
          setSelectedSpace(space);
        }}
        players={players}
        spacesState={spacesState}
      />

      {/* Online Multiplayer Modal */}
      <OnlineRoomModal
        isOpen={onlineModalOpen}
        onClose={() => setOnlineModalOpen(false)}
        onStartOnlineGame={handleStartOnlineSession}
        initialRoomCode={urlJoinCode}
      />
    </div>
  );
};
export default App;
