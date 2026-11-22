import React, { useState } from 'react';
import { Player, GAME_CONSTANTS } from '../data/boardData';
import { Users, Bot, User, Clock, Trophy, Zap } from 'lucide-react';

interface GameLobbyProps {
  onStartGame: (players: Player[], isShortGame: boolean, timerMinutes: number) => void;
  onOpenOnlineRoom?: () => void;
}

export const GameLobby: React.FC<GameLobbyProps> = ({ onStartGame, onOpenOnlineRoom }) => {
  const [playerCount, setPlayerCount] = useState<number>(4);
  const [isShortGame, setIsShortGame] = useState<boolean>(false);
  const [timerMinutes, setTimerMinutes] = useState<number>(30);

  const [players, setPlayers] = useState<Array<{ name: string; isAI: boolean; colorIndex: number }>>([
    { name: 'You', isAI: false, colorIndex: 0 },
    { name: 'Bot Alice', isAI: true, colorIndex: 1 },
    { name: 'Bot Bob', isAI: true, colorIndex: 2 },
    { name: 'Bot Charlie', isAI: true, colorIndex: 3 },
    { name: 'Player 5', isAI: true, colorIndex: 4 },
    { name: 'Player 6', isAI: true, colorIndex: 5 },
  ]);

  const updatePlayerName = (idx: number, name: string) =>
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, name } : p)));

  const togglePlayerAI = (idx: number) =>
    setPlayers((prev) => prev.map((p, i) => (i === idx ? { ...p, isAI: !p.isAI } : p)));

  const handleStart = () => {
    const activePlayers: Player[] = [];
    for (let i = 0; i < playerCount; i++) {
      const cfg = players[i];
      const color = GAME_CONSTANTS.PLAYER_COLORS[cfg.colorIndex % GAME_CONSTANTS.PLAYER_COLORS.length];
      activePlayers.push({
        id: i,
        name: cfg.name || `Player ${i + 1}`,
        color: color.hex,
        colorName: color.name,
        isAI: cfg.isAI,
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
        ownedPropertyIndices: [],
      });
    }
    onStartGame(activePlayers, isShortGame, timerMinutes);
  };

  return (
    <div className="relative z-10 w-full max-w-lg mx-auto px-4 py-3 sm:py-8 flex flex-col items-center gap-3.5 sm:gap-6 select-none">
      {/* ── Title Block ─────────────────────────── */}
      <div className="text-center animate-[slide-up_0.5s_ease-out]">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DAEDF0] border border-[#168B91]/40 text-[#168B91] text-[11px] font-game font-bold tracking-widest uppercase mb-1.5 shadow-sm">
          <Trophy size={12} />
          <span>International Board Game</span>
          <Trophy size={12} />
        </div>

        <h1 className="font-display text-4xl sm:text-6xl leading-none tracking-wide text-[#193D5B] drop-shadow-sm">
          INTERNATIONAL
        </h1>
        <h1 className="font-display text-4xl sm:text-6xl leading-none tracking-wide text-[#D69C49] drop-shadow-sm -mt-1 sm:-mt-2">
          BUSINESS
        </h1>
        <p className="text-xs sm:text-sm font-game text-[#668195] mt-1.5 sm:mt-2">
          🌍 Buy • Sell • Trade • Dominate the World 🌏
        </p>
      </div>

      {/* ── Mode Selection Switcher ────────────────── */}
      <div className="w-full flex bg-[#F1F5F8] p-1.5 rounded-2xl border border-[#DAEDF0] shadow-sm">
        <button
          className="flex-1 py-2.5 rounded-xl font-display text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 bg-[#DAEDF0] text-[#168B91] shadow-sm transition-all"
        >
          <span>🎮 PASS & PLAY / BOTS</span>
        </button>

        {onOpenOnlineRoom && (
          <button
            onClick={onOpenOnlineRoom}
            className="flex-1 py-2.5 rounded-xl font-display text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-[#668195] hover:text-[#168B91] hover:bg-white/50 transition-all"
          >
            <span>🌐 PLAY WITH FRIENDS</span>
            <span className="text-[9px] bg-[#DDF3EA] text-[#207E68] font-bold px-1.5 py-0.5 rounded border border-[#207E68]/30">
              FREE
            </span>
          </button>
        )}
      </div>

      {/* ── Main Setup Card (Clay White Card #FFFFFF) ─────────────────────── */}
      <div className="clay-card w-full p-4 sm:p-5 space-y-3.5 sm:space-y-5">

        {/* Player Count */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="font-game font-bold text-[#163650] text-sm flex items-center gap-2">
              <Users size={16} className="text-[#668195]" />
              Players
            </span>
            <span className="font-display text-[#D69C49] text-lg font-bold">{playerCount} Players</span>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {[2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setPlayerCount(num)}
                className={`py-2.5 rounded-2xl font-display text-xl transition-all active:translate-y-0.5 ${
                  playerCount === num
                    ? 'btn-dice'
                    : 'bg-[#F1F5F8] text-[#668195] border border-[#E2ECF2] hover:bg-[#DAEDF0] hover:text-[#168B91]'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Player Slots */}
        <div className="space-y-2.5">
          <span className="font-game font-bold text-[#668195] text-xs uppercase tracking-wider">Player Lineup</span>
          {Array.from({ length: playerCount }).map((_, i) => {
            const p = players[i];
            const color = GAME_CONSTANTS.PLAYER_COLORS[p.colorIndex % GAME_CONSTANTS.PLAYER_COLORS.length];
            return (
              <div
                key={i}
                className="flex items-center gap-2.5 bg-[#F1F5F8] border border-[#E2ECF2] rounded-2xl p-2.5 shadow-sm"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center font-display text-lg text-white border border-white/60 shrink-0 shadow-sm"
                  style={{ backgroundColor: color.hex }}
                >
                  {i + 1}
                </div>

                {/* Name Input */}
                <input
                  type="text"
                  value={p.name}
                  onChange={(e) => updatePlayerName(i, e.target.value)}
                  className="flex-1 bg-white border border-[#E2ECF2] rounded-xl px-3 py-1.5 text-sm font-game font-bold text-[#163650] placeholder-[#668195]/60 focus:outline-none focus:border-[#168B91] focus:ring-2 focus:ring-[#168B91]/20 transition-all"
                  placeholder={`Player ${i + 1}`}
                />

                {/* AI Toggle */}
                <button
                  onClick={() => togglePlayerAI(i)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-game font-bold flex items-center gap-1.5 transition-all border ${
                    p.isAI
                      ? 'bg-[#DAEDF0] text-[#168B91] border-[#168B91]/40'
                      : 'bg-[#DDF3EA] text-[#207E68] border-[#207E68]/40'
                  }`}
                >
                  {p.isAI ? <Bot size={13} /> : <User size={13} />}
                  <span>{p.isAI ? 'BOT' : 'HUMAN'}</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Game Mode */}
        <div className="bg-[#F1F5F8] border border-[#E2ECF2] rounded-2xl p-3.5 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="font-game font-bold text-[#163650] text-sm flex items-center gap-2">
              <Clock size={15} className="text-[#D69C49]" />
              Shorter Timed Game
            </span>
            <div
              onClick={() => setIsShortGame(!isShortGame)}
              className={`w-12 h-6 rounded-full relative transition-all cursor-pointer border ${
                isShortGame ? 'bg-[#D69C49] border-[#A8752B]' : 'bg-[#E2ECF2] border-[#D0DEE5]'
              }`}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                  isShortGame ? 'translate-x-6' : 'translate-x-0.5'
                }`}
              />
            </div>
          </label>

          {isShortGame && (
            <div className="pt-2 border-t border-[#E2ECF2] flex items-center justify-between gap-2">
              <span className="text-xs font-game text-[#668195]">Time Limit:</span>
              <div className="flex gap-1.5">
                {[15, 30, 45, 60].map((m) => (
                  <button
                    key={m}
                    onClick={() => setTimerMinutes(m)}
                    className={`px-2.5 py-1 rounded-xl text-xs font-game font-bold transition-all ${
                      timerMinutes === m
                        ? 'btn-dice'
                        : 'bg-white text-[#668195] border border-[#E2ECF2] hover:bg-[#DAEDF0]'
                    }`}
                  >
                    {m}m
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Start Button ────────────────────────── */}
      <button
        onClick={handleStart}
        className="btn-dice w-full py-3.5 sm:py-4 text-xl sm:text-2xl font-display font-bold tracking-wider flex items-center justify-center gap-3 shadow-lg active:scale-95"
      >
        <Zap size={22} className="fill-current" />
        START PASS & PLAY / BOTS!
        <Zap size={22} className="fill-current" />
      </button>

      {/* ── Online Multiplayer Option ────────── */}
      {onOpenOnlineRoom && (
        <button
          onClick={onOpenOnlineRoom}
          className="btn-primary w-full py-3 sm:py-3.5 text-base sm:text-lg font-display font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md active:scale-95"
        >
          <span>🌐</span>
          <span>PLAY WITH FRIENDS ONLINE (ROOM CODE)</span>
          <span>👉</span>
        </button>
      )}

      {/* ── Official Starting Kit Notice ──────────────────────────────── */}
      <div className="w-full bg-[#DCEEF4] border border-[#DAEDF0] rounded-2xl p-3 text-center space-y-1 shadow-sm">
        <div className="text-[11px] font-display text-[#193D5B] uppercase tracking-widest font-bold">
          ★ Official Starting Kit Per Player ★
        </div>
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs font-game text-[#163650]">
          <span className="flex items-center gap-1 font-bold text-[#207E68]">
            💵 $25,000 Cash
          </span>
          <span className="text-[#668195]">•</span>
          <span className="flex items-center gap-1 font-bold text-[#D69C49]">
            💳 $10,000 Bank Card
          </span>
          <span className="text-[#668195]">•</span>
          <span className="flex items-center gap-1 font-bold text-[#168B91]">
            🛂 1 Travel Passport
          </span>
        </div>
      </div>
    </div>
  );
};
