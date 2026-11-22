import React, { useState, useEffect } from 'react';
import { multiplayerManager } from '../services/multiplayerManager';
import { RoomMeta } from '../services/multiplayerTypes';
import { Player } from '../data/boardData';
import { soundService } from '../services/soundService';
import { 
  Users, 
  Wifi, 
  Copy, 
  Check, 
  Share2, 
  X, 
  ArrowRight, 
  Zap, 
  Cloud, 
  MessageSquare,
  Sparkles,
  Loader2
} from 'lucide-react';

interface OnlineRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartOnlineGame: (players: Player[], isHost: boolean, myPlayerId: number) => void;
  initialRoomCode?: string;
}

const PLAYER_COLORS = [
  '#D97681', // Red
  '#63A2CF', // Blue
  '#89B46C', // Green
  '#E2B64D', // Yellow
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
  const [hostColor, setHostColor] = useState<string>(PLAYER_COLORS[0]);
  const [maxPlayers, setMaxPlayers] = useState<2 | 3 | 4>(2);
  const [generatedCode, setGeneratedCode] = useState<string>('');
  
  // Friend join state
  const [joinCode, setJoinCode] = useState<string>(initialRoomCode);
  const [joinName, setJoinName] = useState<string>('Player 2');
  const [joinColor, setJoinColor] = useState<string>(PLAYER_COLORS[1]);
  
  // Active Room state (in waiting room)
  const [activeRoom, setActiveRoom] = useState<RoomMeta | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (initialRoomCode) {
      setTab('join');
      setJoinCode(initialRoomCode.toUpperCase());
    } else {
      setGeneratedCode(multiplayerManager.generateRoomCode());
    }
  }, [initialRoomCode, isOpen]);

  // Listen to live room updates (when friends join)
  useEffect(() => {
    const unsubRoom = multiplayerManager.onRoomUpdate((room) => {
      setActiveRoom({ ...room });
      soundService.triggerHaptic('light');

      // If friend and host started the game
      if (room.status === 'playing') {
        launchGame(room);
      }
    });

    return () => {
      unsubRoom();
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
      const room = await multiplayerManager.createRoom(
        { name: hostName.trim(), color: hostColor },
        maxPlayers,
        generatedCode
      );
      setActiveRoom(room);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Could not create room. Try again.');
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

  const launchGame = (room: RoomMeta) => {
    const gamePlayers: Player[] = room.players.map((p) => ({
      id: p.id,
      name: p.name,
      color: p.color,
      colorName: p.color === '#D97681' ? 'Red' : p.color === '#63A2CF' ? 'Blue' : p.color === '#89B46C' ? 'Green' : 'Yellow',
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
    }));

    onStartOnlineGame(gamePlayers, multiplayerManager.isHost(), multiplayerManager.getMyId());
    onClose();
  };

  const handleHostStartGame = () => {
    if (!activeRoom) return;

    soundService.playVictory();
    const updatedRoom: RoomMeta = {
      ...activeRoom,
      status: 'playing',
    };

    multiplayerManager.sendAction({
      type: 'START_GAME',
      players: updatedRoom.players.map((p) => ({
        id: p.id,
        name: p.name,
        color: p.color,
        colorName: p.color === '#D97681' ? 'Red' : p.color === '#63A2CF' ? 'Blue' : p.color === '#89B46C' ? 'Green' : 'Yellow',
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
      })),
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

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getInviteLink());
    setCopied(true);
    soundService.triggerHaptic('light');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const link = getInviteLink();
    const code = activeRoom?.roomCode || generatedCode;
    const text = encodeURIComponent(
      `🎲 Let's play International Business! Join my room with code: ${code}\n👉 Link: ${link}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'International Business Game',
          text: `Join my room in International Business: ${activeRoom?.roomCode || generatedCode}`,
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
        {/* Top Header Shell */}
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
                Play in real-time with your friends across mobile and web
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
          {/* If already in a Room Waiting Lobby */}
          {activeRoom ? (
            <div className="space-y-4">
              {/* Room Code Badge */}
              <div className="bg-[#FFF9EE] border-2 border-[#E2B64D] rounded-2xl p-4 text-center shadow-xs relative overflow-hidden">
                <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#92723E] mb-1">
                  {activeRoom.mode === 'p2p' ? (
                    <span className="flex items-center gap-1.5 text-[#207E68]">
                      <Zap size={15} /> 2-PLAYER PEER-TO-PEER (0ms LAG)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-[#168B91]">
                      <Cloud size={15} /> 3-4 PLAYER GOOGLE CLOUD SYNCED
                    </span>
                  )}
                </div>

                <div className="text-4xl sm:text-5xl font-display font-black text-[#D69C49] tracking-widest my-1">
                  {activeRoom.roomCode}
                </div>

                <p className="text-xs text-[#668195]">
                  Share this code with friends or tap Invite below
                </p>

                {/* Share Actions */}
                <div className="flex items-center justify-center gap-2 mt-3 flex-wrap">
                  <button
                    onClick={handleCopyLink}
                    className="btn-dice px-3.5 py-1.5 text-xs flex items-center gap-1.5 shadow-sm"
                  >
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copied ? 'COPIED!' : 'COPY CODE'}</span>
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
                    <span>SHARE LINK</span>
                  </button>
                </div>
              </div>

              {/* Waiting Room Players List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-[#163650] font-bold px-1">
                  <span>PLAYERS IN ROOM ({activeRoom.players.length}/{activeRoom.maxPlayers})</span>
                  {activeRoom.players.length < activeRoom.maxPlayers && (
                    <span className="text-[#D69C49] flex items-center gap-1 animate-pulse">
                      <Loader2 size={13} className="animate-spin" /> Waiting for friend...
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
                          <span className="text-[10px] text-[#207E68] flex items-center gap-1">
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
                      className="bg-white border-2 border-dashed border-[#DAEDF0] rounded-xl p-3 flex items-center justify-center text-xs text-[#668195]"
                    >
                      Slot {activeRoom.players.length + i + 1} • Waiting...
                    </div>
                  ))}
                </div>
              </div>

              {/* Host Start Action or Friend Waiting Banner */}
              <div className="pt-2">
                {multiplayerManager.isHost() ? (
                  <button
                    onClick={handleHostStartGame}
                    disabled={activeRoom.players.length < 2}
                    className={`w-full py-3.5 text-base flex items-center justify-center gap-2 ${
                      activeRoom.players.length >= 2
                        ? 'btn-dice'
                        : 'opacity-50 grayscale cursor-not-allowed bg-gray-200 text-gray-500 rounded-2xl'
                    }`}
                  >
                    <Sparkles size={18} />
                    <span>
                      {activeRoom.players.length >= 2
                        ? 'START ONLINE GAME 🎲'
                        : 'WAITING FOR AT LEAST 1 FRIEND TO JOIN...'}
                    </span>
                  </button>
                ) : (
                  <div className="text-center py-3 bg-[#DAEDF0] rounded-2xl border border-[#168B91]/30 text-sm text-[#168B91] font-bold">
                    👑 Host ({activeRoom.hostName}) will launch the game shortly...
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
                      PAWN COLOR
                    </label>
                    <div className="flex gap-3">
                      {PLAYER_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setHostColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            hostColor === c
                              ? 'border-[#193D5B] scale-110 shadow-md'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Player Count & Hybrid Tech Rule */}
                  <div>
                    <label className="text-xs text-[#163650] font-bold block mb-1.5">
                      GAME ROOM SIZE
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setMaxPlayers(2)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          maxPlayers === 2
                            ? 'bg-[#DAEDF0] border-[#168B91] shadow-xs'
                            : 'bg-[#F1F5F8] border-[#DAEDF0] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#163650]">2 PLAYERS</span>
                          <span className="text-[10px] bg-[#DDF3EA] text-[#207E68] font-extrabold px-1.5 py-0.5 rounded">
                            ⚡ P2P WebRTC
                          </span>
                        </div>
                        <div className="text-[11px] text-[#668195] mt-1">
                          Direct phone-to-phone • 0ms server lag • Free forever
                        </div>
                      </button>

                      <button
                        onClick={() => setMaxPlayers(4)}
                        className={`p-3 rounded-2xl border-2 text-left transition-all ${
                          maxPlayers >= 3
                            ? 'bg-[#DAEDF0] border-[#168B91] shadow-xs'
                            : 'bg-[#F1F5F8] border-[#DAEDF0] opacity-70 hover:opacity-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm text-[#163650]">3 OR 4 PLAYERS</span>
                          <span className="text-[10px] bg-[#DAEDF0] text-[#168B91] font-extrabold px-1.5 py-0.5 rounded">
                            🌐 Google Cloud
                          </span>
                        </div>
                        <div className="text-[11px] text-[#668195] mt-1">
                          Google Firebase Room sync • Free Spark plan
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleCreateRoom}
                    disabled={isLoading}
                    className="btn-dice w-full py-3 text-base flex items-center justify-center gap-2 mt-2"
                  >
                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Wifi size={18} />}
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
                      PAWN COLOR
                    </label>
                    <div className="flex gap-3">
                      {PLAYER_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setJoinColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-9 h-9 rounded-xl border-2 transition-transform ${
                            joinColor === c
                              ? 'border-[#193D5B] scale-110 shadow-md'
                              : 'border-transparent opacity-70 hover:opacity-100'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleJoinRoom}
                    disabled={isLoading}
                    className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2 mt-2"
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
