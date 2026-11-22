import React, { useState, useEffect } from 'react';
import { multiplayerManager } from '../services/multiplayerManager';
import { RoomMeta } from '../services/multiplayerTypes';
import { Player } from '../data/boardData';
import { soundService } from '../services/soundService';
import { 
  Users, 
  Copy, 
  Check, 
  Share2, 
  X, 
  ArrowRight, 
  MessageSquare,
  Sparkles,
  Loader2,
  Trash2,
  RefreshCw,
  LogOut
} from 'lucide-react';

interface OnlineRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnlineGame: (players: Player[], isHost: boolean, myPlayerId: number) => void;
  initialRoomCode?: string;
}

const PLAYER_COLORS = [
  { name: 'Red', hex: '#D97681' },
  { name: 'Blue', hex: '#63A2CF' },
  { name: 'Green', hex: '#89B46C' },
  { name: 'Gold', hex: '#E2B64D' },
  { name: 'Teal', hex: '#168B91' },
  { name: 'Navy', hex: '#193D5B' },
];

export const OnlineRoomModal: React.FC<OnlineRoomModalProps> = ({
  isOpen,
  onClose,
  onStartOnlineGame,
  initialRoomCode = '',
}) => {
  const [tab, setTab] = useState<'create' | 'join'>('create');
  
  // Host state
  const [hostName, setHostName] = useState<string>('Player 1');
  const [hostColor, setHostColor] = useState<string>(PLAYER_COLORS[0].hex);
  const [maxPlayers, setMaxPlayers] = useState<2 | 3 | 4 | 5 | 6>(4);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  
  // Friend join state
  const [joinCode, setJoinCode] = useState<string>(initialRoomCode);
  const [joinName, setJoinName] = useState<string>('Player 2');
  const [joinColor, setJoinColor] = useState<string>(PLAYER_COLORS[1].hex);
  
  // Active Room state (in waiting room)
  const [activeRoom, setActiveRoom] = useState<RoomMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const hasLaunchedRef = React.useRef<boolean>(false);

  useEffect(() => {
    hasLaunchedRef.current = false;
    if (initialRoomCode) {
      setTab('join');
      setJoinCode(initialRoomCode.toUpperCase());
    } else {
      setGeneratedCode(multiplayerManager.generateRoomCode());
    }
  }, [initialRoomCode, isOpen]);

  // Listen to live room updates (when friends join, leave, or start)
  useEffect(() => {
    const unsubRoom = multiplayerManager.onRoomUpdate((room) => {
      setActiveRoom({ ...room });
      soundService.triggerHaptic('light');

      // If friend and host started the game
      if (room.status === 'playing' && !multiplayerManager.isHost() && !hasLaunchedRef.current) {
        hasLaunchedRef.current = true;
        launchGame(room);
      }
    });

    const unsubDisconnect = multiplayerManager.onDisconnect(() => {
      setActiveRoom(null);
      setErrorMessage('The room was closed or disconnected.');
    });

    return () => {
      unsubRoom();
      unsubDisconnect();
    };
  }, [activeRoom]);

  if (!isOpen) return null;

  const handleCreateRoom = async () => {
    if (!hostName.trim()) {
      setErrorMessage('Please enter your player name');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      soundService.playPawnStep();
      const code = generatedCode || multiplayerManager.generateRoomCode();
      const room = await multiplayerManager.createRoom(
        { name: hostName.trim(), color: hostColor },
        maxPlayers,
        code
      );
      setActiveRoom(room);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      setErrorMessage('Please enter a room code');
      return;
    }
    if (!joinName.trim()) {
      setErrorMessage('Please enter your player name');
      return;
    }
    setErrorMessage('');
    setIsLoading(true);

    try {
      soundService.playPawnStep();
      const room = await multiplayerManager.joinRoom(joinCode.trim(), {
        name: joinName.trim(),
        color: joinColor,
      });
      setActiveRoom(room);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to connect to room. Check code & network.');
    } finally {
      setIsLoading(false);
    }
  };

  // Host closes room
  const handleCloseRoom = async () => {
    setIsLoading(true);
    try {
      await multiplayerManager.closeRoom();
      setActiveRoom(null);
      setGeneratedCode(multiplayerManager.generateRoomCode());
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to close room.');
    } finally {
      setIsLoading(false);
    }
  };

  // Host makes a brand new room
  const handleMakeNewRoom = async () => {
    await handleCloseRoom();
    setGeneratedCode(multiplayerManager.generateRoomCode());
  };

  // Guest leaves room
  const handleLeaveRoom = async () => {
    setIsLoading(true);
    try {
      await multiplayerManager.leaveRoom();
      setActiveRoom(null);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to leave room.');
    } finally {
      setIsLoading(false);
    }
  };

  const launchGame = (room: RoomMeta) => {
    const gamePlayers: Player[] = room.players.map((p) => {
      const matched = PLAYER_COLORS.find((c) => c.hex === p.color);
      return {
        id: p.id,
        name: p.name,
        color: p.color,
        colorName: matched ? matched.name : 'Red',
        cash: 25000,
        creditCardLimit: 10000,
        hasUsedCreditCard: false,
        creditCardInstallmentsLeft: 0,
        hasPassport: true,
        passportRoundsRemaining: 0,
        boardPosition: 0,
        isInJail: false,
        jailRollAttempts: 0,
        isBankrupt: false,
        ownedPropertyIndices: [],
        isAI: false,
      };
    });

    onStartOnlineGame(gamePlayers, multiplayerManager.isHost(), multiplayerManager.getMyId());
    onClose();
  };

  const handleHostStartGame = () => {
    if (!activeRoom) return;

    hasLaunchedRef.current = true;
    soundService.playVictory();
    const updatedRoom: RoomMeta = {
      ...activeRoom,
      status: 'playing',
    };

    multiplayerManager.sendAction({
      type: 'START_GAME',
      players: updatedRoom.players.map((p) => {
        const matched = PLAYER_COLORS.find((c) => c.hex === p.color);
        return {
          id: p.id,
          name: p.name,
          color: p.color,
          colorName: matched ? matched.name : 'Red',
          cash: 25000,
          creditCardLimit: 10000,
          hasUsedCreditCard: false,
          creditCardInstallmentsLeft: 0,
          hasPassport: true,
          passportRoundsRemaining: 0,
          boardPosition: 0,
          isInJail: false,
          jailRollAttempts: 0,
          isBankrupt: false,
          ownedPropertyIndices: [],
          isAI: false,
        };
      }),
      shorterGame: false,
      timerMinutes: 30,
    });

    multiplayerManager.updateRoomState(updatedRoom);
    launchGame(updatedRoom);
  };

  const getInviteLink = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://international-business-game.vercel.app';
    return `${baseUrl}/?join=${activeRoom?.roomCode || generatedCode}`;
  };

  const getShareText = () => {
    const code = activeRoom?.roomCode || generatedCode;
    const link = getInviteLink();
    return `🎲 Let's play International Business!\n👉 Tap to join instantly: ${link}\nOr enter Room Code: ${code}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareText());
    setCopied(true);
    soundService.triggerHaptic('light');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(getShareText());
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'International Business Game',
          text: getShareText(),
          url: getInviteLink(),
        });
      } catch (err) {
        handleCopyLink();
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-[fade-in_0.2s_ease-out]"
    >
      <div
        className="relative w-full max-w-lg rounded-[28px] overflow-hidden border border-[#DCEEF4] bg-white shadow-raised flex flex-col select-none"
      >
        {/* Top Header */}
        <header className="px-5 py-4 bg-[#193D5B] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#D69C49] flex items-center justify-center text-xl shadow-xs text-white">
              🌐
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-display font-bold text-white tracking-wide flex items-center gap-2">
                <span>ONLINE MULTIPLAYER</span>
              </h2>
              <p className="text-xs text-[#C5E7F1] font-medium">
                Play live with friends on mobile and web
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </header>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto max-h-[82vh] space-y-5 bg-white">
          {/* If already inside a Room Waiting Lobby */}
          {activeRoom ? (
            <div className="space-y-4">
              {/* Room Code & Invite Card */}
              <div className="bg-[#FFF9EE] border-2 border-[#E2B64D] rounded-2xl p-4 text-center shadow-xs relative overflow-hidden">
                <div className="text-xs font-game font-bold uppercase tracking-wider text-[#92723E] mb-1">
                  ROOM CODE
                </div>

                <div className="text-4xl sm:text-5xl font-display font-black text-[#D69C49] tracking-widest my-1">
                  {activeRoom.roomCode}
                </div>

                <p className="text-xs text-[#668195] font-game">
                  Share this code or invite link with your friends to join
                </p>

                {/* Share Actions */}
                <div className="flex items-center justify-center gap-2 mt-3.5 flex-wrap">
                  <button
                    onClick={handleCopyLink}
                    className="btn-dice px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'COPIED LINK & CODE!' : 'COPY INVITE LINK'}</span>
                  </button>

                  <button
                    onClick={handleShareWhatsApp}
                    className="btn-primary px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare size={14} />
                    <span>WHATSAPP</span>
                  </button>

                  <button
                    onClick={handleNativeShare}
                    className="btn-secondary px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    <Share2 size={14} />
                    <span>SHARE</span>
                  </button>
                </div>
              </div>

              {/* Waiting Room Players List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#163650] font-bold px-1 font-game">
                  <span>PLAYERS IN ROOM ({activeRoom.players.length}/{activeRoom.maxPlayers})</span>
                  {activeRoom.players.length < activeRoom.maxPlayers && (
                    <span className="text-[#D69C49] flex items-center gap-1 animate-pulse font-game font-bold">
                      <Loader2 size={13} className="animate-spin" /> Waiting for friends to join...
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeRoom.players.map((p) => (
                    <div
                      key={p.id}
                      className="bg-[#F1F5F8] border border-[#DAEDF0] rounded-xl p-3 flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-sm shadow-xs border border-white"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-bold text-sm text-[#163650] flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {p.isHost && (
                              <span className="text-[9px] bg-[#FFF0D6] text-[#92723E] font-extrabold px-1.5 rounded border border-[#E2B64D]/40">
                                HOST
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-[#207E68] font-game font-bold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#207E68] animate-ping" />
                            Connected
                          </span>
                        </div>
                      </div>

                      <div className="text-[#207E68]">
                        <Check size={18} />
                      </div>
                    </div>
                  ))}

                  {/* Empty Slot placeholders */}
                  {Array.from({ length: activeRoom.maxPlayers - activeRoom.players.length }).map((_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="bg-white border-2 border-dashed border-[#DAEDF0] rounded-xl p-3 flex items-center justify-center text-xs text-[#668195] font-game"
                    >
                      Slot {activeRoom.players.length + i + 1} • Waiting...
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Start Action or Friend Waiting Banner */}
              <div className="pt-2 space-y-2">
                {multiplayerManager.isHost() ? (
                  <>
                    <button
                      onClick={handleHostStartGame}
                      disabled={activeRoom.players.length < 2 || isLoading}
                      className={`w-full py-3.5 text-base flex items-center justify-center gap-2 ${
                        activeRoom.players.length >= 2
                          ? 'btn-dice'
                          : 'opacity-50 grayscale cursor-not-allowed bg-gray-200 text-gray-500 rounded-2xl'
                      }`}
                    >
                      <Sparkles size={18} />
                      <span>
                        {activeRoom.players.length >= 2
                          ? `START GAME (${activeRoom.players.length} PLAYERS READY) 🎲`
                          : 'WAITING FOR AT LEAST 1 FRIEND TO JOIN...'}
                      </span>
                    </button>

                    {/* Room Management Controls for Host */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        onClick={handleCloseRoom}
                        disabled={isLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-game font-bold text-[#D97681] bg-[#FFF0F0] border border-[#D97681]/40 flex items-center justify-center gap-1.5 hover:bg-[#FFE5E5] transition-colors"
                      >
                        <Trash2 size={14} />
                        <span>Close Room</span>
                      </button>

                      <button
                        onClick={handleMakeNewRoom}
                        disabled={isLoading}
                        className="flex-1 py-2 rounded-xl text-xs font-game font-bold text-[#168B91] bg-[#DAEDF0] border border-[#168B91]/40 flex items-center justify-center gap-1.5 hover:bg-[#CDE8EC] transition-colors"
                      >
                        <RefreshCw size={14} />
                        <span>Make New Room</span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <div className="text-center py-3 bg-[#DAEDF0] rounded-2xl border border-[#168B91]/30 text-sm text-[#168B91] font-bold">
                      👑 Waiting for host ({activeRoom.hostName}) to start the game...
                    </div>
                    <button
                      onClick={handleLeaveRoom}
                      disabled={isLoading}
                      className="w-full py-2 rounded-xl text-xs font-game font-bold text-[#668195] bg-[#F1F5F8] border border-[#DAEDF0] flex items-center justify-center gap-1.5 hover:bg-gray-200 transition-colors"
                    >
                      <LogOut size={14} />
                      <span>Leave Room</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Room Create / Join Selector */
            <div className="space-y-4">
              {/* Tabs */}
              <div className="flex bg-[#F1F5F8] p-1 rounded-2xl border border-[#DAEDF0]">
                <button
                  onClick={() => setTab('create')}
                  className={`flex-1 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
                    tab === 'create'
                      ? 'nav-selected shadow-xs'
                      : 'nav-inactive'
                  }`}
                >
                  CREATE ROOM
                </button>
                <button
                  onClick={() => setTab('join')}
                  className={`flex-1 py-2 rounded-xl text-sm font-display font-semibold transition-all ${
                    tab === 'join'
                      ? 'nav-selected shadow-xs'
                      : 'nav-inactive'
                  }`}
                >
                  JOIN WITH CODE
                </button>
              </div>

              {errorMessage && (
                <div className="bg-[#FFF0F0] border border-[#D97681]/40 rounded-xl p-2.5 text-xs text-[#D97681] text-center font-bold">
                  ⚠️ {errorMessage}
                </div>
              )}

              {tab === 'create' ? (
                /* ── Create Room Form ── */
                <div className="space-y-4">
                  {/* Player Name */}
                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1">
                      YOUR PLAYER NAME
                    </label>
                    <input
                      type="text"
                      value={hostName}
                      onChange={(e) => setHostName(e.target.value)}
                      maxLength={14}
                      className="w-full bg-[#F1F5F8] border border-[#DAEDF0] rounded-xl px-3.5 py-2.5 text-[#163650] font-bold text-sm focus:outline-none focus:border-[#168B91]"
                      placeholder="Enter your name"
                    />
                  </div>

                  {/* Player Color */}
                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1.5">
                      CHOOSE PAWN COLOR
                    </label>
                    <div className="flex gap-2.5 flex-wrap">
                      {PLAYER_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setHostColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            hostColor === c.hex
                              ? 'border-[#193D5B] scale-110 shadow-md ring-2 ring-[#168B91]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Player Count Selection (2 to 6 Players) */}
                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1.5">
                      TOTAL PLAYERS (2 TO 6)
                    </label>
                    <div className="grid grid-cols-5 gap-2">
                      {([2, 3, 4, 5, 6] as const).map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setMaxPlayers(num)}
                          className={`py-2.5 rounded-xl font-display font-extrabold text-sm transition-all border ${
                            maxPlayers === num
                              ? 'bg-[#DAEDF0] border-[#168B91] text-[#168B91] shadow-xs scale-[1.03]'
                              : 'bg-[#F1F5F8] border-[#DAEDF0] text-[#668195] hover:text-[#163650]'
                          }`}
                        >
                          {num}P
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    className="btn-dice w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Users size={18} />}
                    <span>CREATE ROOM & GET CODE</span>
                  </button>
                </div>
              ) : (
                /* ── Join Room Form ── */
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1">
                      ENTER ROOM CODE
                    </label>
                    <input
                      type="text"
                      value={joinCode}
                      onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                      maxLength={8}
                      className="w-full bg-[#FFF9EE] border-2 border-[#E2B64D] rounded-xl px-3.5 py-3 text-center text-[#D69C49] font-black font-display text-2xl tracking-widest uppercase focus:outline-none focus:border-[#D69C49] shadow-inner"
                      placeholder="e.g. IB7429"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1">
                      YOUR PLAYER NAME
                    </label>
                    <input
                      type="text"
                      value={joinName}
                      onChange={(e) => setJoinName(e.target.value)}
                      maxLength={14}
                      className="w-full bg-[#F1F5F8] border border-[#DAEDF0] rounded-xl px-3.5 py-2.5 text-[#163650] font-bold text-sm focus:outline-none focus:border-[#168B91]"
                      placeholder="Enter your name"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1.5">
                      CHOOSE PAWN COLOR
                    </label>
                    <div className="flex gap-2.5 flex-wrap">
                      {PLAYER_COLORS.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => setJoinColor(c.hex)}
                          style={{ backgroundColor: c.hex }}
                          title={c.name}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            joinColor === c.hex
                              ? 'border-[#193D5B] scale-110 shadow-md ring-2 ring-[#168B91]'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    disabled={isLoading}
                    className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <ArrowRight size={18} />}
                    <span>CONNECT & JOIN GAME</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
