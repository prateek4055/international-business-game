import React from 'react';
import { Player } from '../data/boardData';
import { CreditCard, Lock, ShieldCheck, ShieldAlert, Clock, ArrowRight, Dices, Award, CheckCircle2 } from 'lucide-react';

interface PlayerHUDProps {
  players: Player[];
  activePlayer: Player;
  timeRemaining?: number;
  canRoll: boolean;
  canEndTurn: boolean;
  onRollDice: () => void;
  onOpenCreditCard: () => void;
  onOpenJail: () => void;
  onEndTurn: () => void;
  logs: string[];
  lastDice?: [number, number];
  turnStatus?: string;
  diceSlot?: React.ReactNode;
  isOnlineSession?: boolean;
  myPlayerId?: number;
}

export const PlayerHUD: React.FC<PlayerHUDProps> = ({
  players,
  activePlayer,
  timeRemaining,
  canRoll,
  canEndTurn,
  onRollDice,
  onOpenCreditCard,
  onOpenJail,
  onEndTurn,
  logs,
  lastDice = [1, 1],
  turnStatus = 'idle',
  diceSlot,
  isOnlineSession = false,
  myPlayerId = 1,
}) => {
  const isMyTurn = !isOnlineSession || activePlayer.id === myPlayerId;
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* ─────────────────────────────────────────────────────────────
          📱 MOBILE GAME CONSOLE DOCK (Visible on screens < lg)
      ────────────────────────────────────────────────────────────── */}
      <div className="lg:hidden w-full flex flex-col gap-2 select-none">
        {/* Horizontal Players Ribbon with 3D Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
          {players.map((p) => {
            const isActive = p.id === activePlayer.id;

            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border shrink-0 ${
                  p.isBankrupt
                    ? 'opacity-30 grayscale bg-black/40 border-gray-700'
                    : isActive
                    ? 'bg-gradient-to-b from-[#1F5382] to-[#113554] border-t-2 border-[#FFD23F] border-b-[3px] border-[#081B2B] shadow-[0_0_14px_rgba(255,210,63,0.4)] scale-[1.03]'
                    : 'bg-gradient-to-b from-[#14395A] to-[#0D263D] border-[#224F79] border-b-[2px] border-[#071725]'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-display text-white text-[10px] font-extrabold shrink-0 border border-white/60 shadow"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.charAt(0)}
                </div>
                <span className="font-game font-bold text-xs text-white truncate max-w-[65px]">
                  {p.name}
                </span>
                <span className="font-display font-extrabold text-xs text-[#34D399] drop-shadow-sm">
                  ${p.cash >= 1000 ? `${(p.cash / 1000).toFixed(p.cash % 1000 === 0 ? 0 : 1)}k` : p.cash}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#FFD23F] animate-ping ml-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls Bar - Physical Arcade Console Style */}
        <div className="flex items-center justify-between gap-2 bg-gradient-to-b from-[#1A4770] to-[#0E2C48] border-t-2 border-white/30 border-b-[4px] border-[#071827] rounded-2xl p-2.5 shadow-2xl">
          {/* Active Player Status */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-display text-lg text-white border-2 border-white/80 shadow-md shrink-0"
              style={{ backgroundColor: activePlayer.color }}
            >
              {activePlayer.name.charAt(0)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-display text-sm text-white font-extrabold truncate drop-shadow-sm">
                  {activePlayer.name}
                </span>
                {activePlayer.isAI && (
                  <span className="text-[8px] bg-[#38BDF8]/20 text-[#38BDF8] font-game font-extrabold px-1 rounded border border-[#38BDF8]/40">
                    BOT
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-display text-sm font-extrabold text-[#34D399] drop-shadow-sm">
                  ${activePlayer.cash.toLocaleString()}
                </span>
                {!activePlayer.hasUsedCreditCard && (
                  <button
                    onClick={onOpenCreditCard}
                    className="text-[9px] font-game font-bold text-[#FFD23F] bg-[#FFD23F]/20 px-1.5 py-0.5 rounded-lg border border-[#FFD23F]/50 active:scale-95 transition-transform"
                  >
                    💳 $10k Card
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dice Slot & 3D Arcade Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {diceSlot ? (
              <div className="w-[84px] h-[52px] rounded-xl overflow-hidden bg-gradient-to-b from-[#0B2135] to-[#061522] border-2 border-[#1B4B75] shrink-0 flex items-center justify-center shadow-inner">
                {diceSlot}
              </div>
            ) : (
              <div className="bg-gradient-to-b from-[#0B2135] to-[#061522] border-2 border-[#1B4B75] rounded-xl px-2.5 py-1 text-center shadow-inner">
                <span className="text-[8px] font-game text-[#94A3B8] uppercase block font-extrabold leading-none">
                  Dice
                </span>
                <span className="font-display text-base text-[#FFD23F] font-black leading-tight drop-shadow-sm">
                  {lastDice[0] + lastDice[1]}
                </span>
              </div>
            )}

            {/* Primary Action Button */}
            {isOnlineSession && !isMyTurn ? (
              <div className="bg-[#0B2135] border border-[#2B608F] rounded-xl px-3 py-2 text-center shadow-inner">
                <span className="text-[10px] font-bold text-amber-300 flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  Waiting for {activePlayer.name}...
                </span>
              </div>
            ) : (
              <>
                {canRoll && (
                  <button
                    onClick={onRollDice}
                    disabled={activePlayer.isAI}
                    className="btn-arcade-gold px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center gap-1.5 shadow-xl disabled:opacity-40"
                  >
                    <Dices size={17} />
                    <span>ROLL DICE</span>
                  </button>
                )}

                {canEndTurn && (
                  <button
                    onClick={onEndTurn}
                    disabled={activePlayer.isAI}
                    className="btn-arcade-green px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center gap-1.5 shadow-xl disabled:opacity-40"
                  >
                    <CheckCircle2 size={17} />
                    <span>END TURN</span>
                  </button>
                )}
              </>
            )}

            {activePlayer.isInJail && (
              <button
                onClick={onOpenJail}
                className="btn-arcade-red px-3 py-2 text-xs flex items-center gap-1 shadow-lg"
              >
                <Lock size={14} />
                <span>JAIL</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          💻 DESKTOP HUD (Visible on screens >= lg)
      ────────────────────────────────────────────────────────────── */}
      <div className="hidden lg:flex flex-col gap-3 w-full">
        {/* Player Cards Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {players.map((p) => {
            const isActive = p.id === activePlayer.id;

            return (
              <div
                key={p.id}
                className={`rounded-2xl p-2.5 transition-all border select-none ${
                  p.isBankrupt
                    ? 'opacity-40 grayscale bg-black/40 border-gray-700'
                    : isActive
                    ? 'bg-gradient-to-b from-[#1F5382] to-[#113554] border-t-2 border-[#FFD23F] border-b-[4px] border-[#081B2B] shadow-[0_0_16px_rgba(255,210,63,0.35)] scale-[1.02]'
                    : 'bg-gradient-to-b from-[#14395A] to-[#0D263D] border-[#224F79] border-b-[3px] border-[#071725]'
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-display text-white text-xs border-2 border-white/60 shrink-0 shadow"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span className="font-game font-bold text-xs text-white truncate flex-1">{p.name}</span>
                  {p.isAI && (
                    <span className="text-[8px] bg-[#38BDF8]/20 text-[#38BDF8] font-game font-extrabold px-1 py-0.5 rounded border border-[#38BDF8]/40 shrink-0">
                      BOT
                    </span>
                  )}
                </div>

                {/* Cash & Assets */}
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-extrabold text-[#34D399] drop-shadow-sm">
                    ${p.cash.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-game text-[#94A3B8] font-bold">
                    {p.ownedPropertyIndices.length} {p.ownedPropertyIndices.length === 1 ? 'Site' : 'Sites'}
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-1 mt-2">
                  {/* Passport Badge */}
                  {p.hasPassport ? (
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#34D399] bg-[#34D399]/15 px-1.5 py-0.5 rounded-md border border-[#34D399]/40 shadow-xs">
                      <ShieldCheck size={10} className="text-[#34D399]" />
                      <span>PASSPORT: VALID</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#FFD23F] bg-[#FFD23F]/15 px-1.5 py-0.5 rounded-md border border-[#FFD23F]/40 shadow-xs">
                      <ShieldAlert size={10} className="text-[#FFD23F]" />
                      <span>NO PASSPORT ({p.passportRoundsRemaining} rds)</span>
                    </div>
                  )}

                  {/* Credit Card Facility Badge */}
                  <div
                    className="flex items-center justify-between text-[8px] font-game font-bold px-1.5 py-0.5 rounded-md border shadow-xs"
                    style={
                      p.creditCardInstallmentsLeft > 0
                        ? { backgroundColor: 'rgba(56,189,248,0.15)', borderColor: 'rgba(56,189,248,0.4)', color: '#38BDF8' }
                        : p.hasUsedCreditCard
                        ? { backgroundColor: 'rgba(148,163,184,0.15)', borderColor: 'rgba(148,163,184,0.3)', color: '#94A3B8' }
                        : { backgroundColor: 'rgba(255,210,63,0.15)', borderColor: 'rgba(255,210,63,0.4)', color: '#FFD23F' }
                    }
                  >
                    <span className="flex items-center gap-0.5">
                      <CreditCard size={10} />
                      {p.creditCardInstallmentsLeft > 0
                        ? `LOAN: ${p.creditCardInstallmentsLeft}/6 left`
                        : p.hasUsedCreditCard
                        ? 'CARD: USED'
                        : 'CARD: $10K AVAIL'}
                    </span>
                  </div>

                  {/* Jail Notice */}
                  {p.isInJail && (
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#F87171] bg-[#F87171]/20 px-1.5 py-0.5 rounded-md border border-[#F87171]/50">
                      <Lock size={10} />
                      <span>IN JAIL (Bail: $500)</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Turn Control Dock */}
        <div className="rounded-3xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-gradient-to-b from-[#1C4770] to-[#102F4C] border-t-2 border-white/30 border-b-[4px] border-[#081B2B] shadow-2xl">
          {/* Active player info & credentials */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-2xl text-white border-2 border-white shadow-md shrink-0"
              style={{ backgroundColor: activePlayer.color }}
            >
              {activePlayer.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg text-white font-extrabold tracking-wide drop-shadow-sm">
                  {activePlayer.name}'s Turn
                </span>
                {activePlayer.isAI && (
                  <span className="text-[9px] bg-[#38BDF8]/20 text-[#38BDF8] font-game font-extrabold px-1.5 py-0.5 rounded border border-[#38BDF8]/40">
                    BOT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs font-game">
                <span className="font-display font-extrabold text-[#34D399]">
                  ${activePlayer.cash.toLocaleString()}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-[#FFD23F] font-bold">
                  {activePlayer.hasUsedCreditCard ? 'Card Drawn' : '$10K Credit Line'}
                </span>
                <span className="text-gray-400">•</span>
                <span className={activePlayer.hasPassport ? 'text-[#34D399] font-bold' : 'text-[#FFD23F] font-bold'}>
                  {activePlayer.hasPassport ? 'Passport Active' : 'Passport Forfeited'}
                </span>
              </div>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining !== undefined && timeRemaining > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display font-bold shadow-inner"
              style={{
                background: timeRemaining < 120 ? 'rgba(239,68,68,0.25)' : 'rgba(15,40,64,0.7)',
                border: `1.5px solid ${timeRemaining < 120 ? '#EF4444' : 'rgba(255,255,255,0.25)'}`,
                color: timeRemaining < 120 ? '#F87171' : '#FFD23F',
              }}
            >
              <Clock size={16} />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isOnlineSession && !isMyTurn ? (
              <div className="bg-[#0B2135] border border-[#2B608F] rounded-2xl px-4 py-2.5 text-center shadow-inner">
                <span className="text-xs font-bold text-amber-300 flex items-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  Spectating • Waiting for {activePlayer.name}'s move...
                </span>
              </div>
            ) : (
              <>
                {/* Escape Jail */}
                {activePlayer.isInJail && (
                  <button
                    onClick={onOpenJail}
                    className="btn-arcade-red px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-lg"
                  >
                    <Lock size={14} />
                    <span>JAIL OPTIONS</span>
                  </button>
                )}

                {/* Credit Card Drawer */}
                <button
                  onClick={onOpenCreditCard}
                  className="btn-arcade-purple px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-lg"
                >
                  <CreditCard size={14} />
                  <span>CREDIT CARD ({!activePlayer.hasUsedCreditCard ? '$10K' : 'VIEW'})</span>
                </button>

                {/* Roll Dice */}
                {canRoll && (
                  <button
                    onClick={onRollDice}
                    disabled={!canRoll || activePlayer.isAI}
                    className="btn-arcade-gold px-5 py-2.5 text-sm flex items-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Dices size={17} />
                    <span>ROLL DICE</span>
                  </button>
                )}

                {/* End Turn */}
                {canEndTurn && (
                  <button
                    onClick={onEndTurn}
                    disabled={activePlayer.isAI}
                    className="btn-arcade-green px-5 py-2.5 text-sm flex items-center gap-2 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>END TURN</span>
                    <ArrowRight size={16} />
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
