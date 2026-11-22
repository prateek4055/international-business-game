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
        {/* Horizontal Players Ribbon with Clay Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 px-1">
          {players.map((p) => {
            const isActive = p.id === activePlayer.id;

            return (
              <div
                key={p.id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all border shrink-0 ${
                  p.isBankrupt
                    ? 'opacity-30 grayscale bg-gray-100 border-gray-200'
                    : isActive
                    ? 'bg-[#DAEDF0] border-2 border-[#168B91] shadow-md scale-[1.02]'
                    : 'bg-white border border-[#DCEEF4] shadow-xs'
                }`}
              >
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center font-display text-white text-[10px] font-extrabold shrink-0 border border-white/80 shadow-xs"
                  style={{ backgroundColor: p.color }}
                >
                  {p.name.charAt(0)}
                </div>
                <span className={`font-game font-bold text-xs truncate max-w-[65px] ${isActive ? 'text-[#163650]' : 'text-[#668195]'}`}>
                  {p.name}
                </span>
                <span className="font-display font-extrabold text-xs text-[#207E68]">
                  ${p.cash >= 1000 ? `${(p.cash / 1000).toFixed(p.cash % 1000 === 0 ? 0 : 1)}k` : p.cash}
                </span>
                {isActive && (
                  <span className="w-2 h-2 rounded-full bg-[#168B91] animate-ping ml-0.5" />
                )}
              </div>
            );
          })}
        </div>

        {/* Action Controls Bar - Claymorphic Dock */}
        <div className="flex items-center justify-between gap-2 bg-white border border-[#DCEEF4] rounded-2xl p-2.5 shadow-clay">
          {/* Active Player Status */}
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-2xl flex items-center justify-center font-display text-lg text-white border-2 border-white/80 shadow-xs shrink-0"
              style={{ backgroundColor: activePlayer.color }}
            >
              {activePlayer.name.charAt(0)}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-display text-sm text-[#163650] font-extrabold truncate">
                  {activePlayer.name}
                </span>
                {activePlayer.isAI && (
                  <span className="text-[8px] bg-[#DAEDF0] text-[#168B91] font-game font-extrabold px-1 rounded border border-[#168B91]/30">
                    BOT
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-display text-sm font-extrabold text-[#207E68]">
                  ${activePlayer.cash.toLocaleString()}
                </span>
                {!activePlayer.hasUsedCreditCard && (
                  <button
                    onClick={onOpenCreditCard}
                    className="text-[9px] font-game font-bold text-[#92723E] bg-[#FFF0D6] px-1.5 py-0.5 rounded-lg border border-[#E2B64D]/40 active:scale-95 transition-transform"
                  >
                    💳 $10k Card
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Dice Slot & Clay Action Buttons */}
          <div className="flex items-center gap-2 shrink-0">
            {diceSlot ? (
              <div className="w-[84px] h-[52px] rounded-xl overflow-hidden bg-[#E9F5F8] border border-[#DCEEF4] shrink-0 flex items-center justify-center shadow-inner">
                {diceSlot}
              </div>
            ) : (
              <div className="bg-[#E9F5F8] border border-[#DCEEF4] rounded-xl px-2.5 py-1 text-center shadow-xs">
                <span className="text-[8px] font-game text-[#668195] uppercase block font-extrabold leading-none">
                  Dice
                </span>
                <span className="font-display text-base text-[#D69C49] font-black leading-tight">
                  {lastDice[0] + lastDice[1]}
                </span>
              </div>
            )}

            {/* Primary Action Button */}
            {isOnlineSession && !isMyTurn ? (
              <div className="bg-[#F1F5F8] border border-[#DAEDF0] rounded-xl px-3 py-2 text-center shadow-xs">
                <span className="text-[10px] font-bold text-[#168B91] flex items-center gap-1.5 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-[#168B91]" />
                  Waiting for {activePlayer.name}...
                </span>
              </div>
            ) : (
              <>
                {canRoll && (
                  <button
                    onClick={onRollDice}
                    disabled={activePlayer.isAI}
                    className="btn-dice px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center gap-1.5 shadow-md disabled:opacity-40"
                  >
                    <Dices size={17} />
                    <span>ROLL DICE</span>
                  </button>
                )}

                {canEndTurn && (
                  <button
                    onClick={onEndTurn}
                    disabled={activePlayer.isAI}
                    className="btn-primary px-4 sm:px-5 py-2.5 text-xs sm:text-sm flex items-center gap-1.5 shadow-md disabled:opacity-40"
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
                className="bg-[#D97681] text-white font-game font-bold px-3 py-2 text-xs rounded-xl flex items-center gap-1 shadow-sm active:scale-95"
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
                    ? 'opacity-40 grayscale bg-gray-100 border-gray-200'
                    : isActive
                    ? 'bg-[#DAEDF0]/70 border-2 border-[#168B91] shadow-md scale-[1.02]'
                    : 'bg-white border border-[#DCEEF4] shadow-clay'
                }`}
              >
                {/* Header */}
                <div className="flex items-center gap-1.5 mb-1.5">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center font-display text-white text-xs border-2 border-white/80 shrink-0 shadow-xs"
                    style={{ backgroundColor: p.color }}
                  >
                    {p.name.charAt(0)}
                  </div>
                  <span className={`font-game font-bold text-xs truncate flex-1 ${isActive ? 'text-[#163650]' : 'text-[#668195]'}`}>
                    {p.name}
                  </span>
                  {p.isAI && (
                    <span className="text-[8px] bg-[#DAEDF0] text-[#168B91] font-game font-extrabold px-1 py-0.5 rounded border border-[#168B91]/30 shrink-0">
                      BOT
                    </span>
                  )}
                </div>

                {/* Cash & Assets */}
                <div className="flex items-baseline justify-between">
                  <span className="font-display text-sm font-extrabold text-[#207E68]">
                    ${p.cash.toLocaleString()}
                  </span>
                  <span className="text-[9px] font-game text-[#668195] font-bold">
                    {p.ownedPropertyIndices.length} {p.ownedPropertyIndices.length === 1 ? 'Site' : 'Sites'}
                  </span>
                </div>

                {/* Status Badges */}
                <div className="flex flex-col gap-1 mt-2">
                  {/* Passport Badge */}
                  {p.hasPassport ? (
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#207E68] bg-[#DDF3EA] px-1.5 py-0.5 rounded-md border border-[#89B46C]/40">
                      <ShieldCheck size={10} className="text-[#207E68]" />
                      <span>PASSPORT: VALID</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#92723E] bg-[#FFF0D6] px-1.5 py-0.5 rounded-md border border-[#E2B64D]/40">
                      <ShieldAlert size={10} className="text-[#92723E]" />
                      <span>NO PASSPORT ({p.passportRoundsRemaining} rds)</span>
                    </div>
                  )}

                  {/* Credit Card Facility Badge */}
                  <div
                    className="flex items-center justify-between text-[8px] font-game font-bold px-1.5 py-0.5 rounded-md border shadow-2xs"
                    style={
                      p.creditCardInstallmentsLeft > 0
                        ? { backgroundColor: '#DAEDF0', borderColor: '#168B91', color: '#168B91' }
                        : p.hasUsedCreditCard
                        ? { backgroundColor: '#F1F5F8', borderColor: '#DAEDF0', color: '#668195' }
                        : { backgroundColor: '#FFF0D6', borderColor: '#E2B64D', color: '#92723E' }
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
                    <div className="flex items-center gap-1 text-[8px] font-game font-black text-[#D97681] bg-[#D97681]/15 px-1.5 py-0.5 rounded-md border border-[#D97681]/40">
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
        <div className="rounded-3xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 bg-white border border-[#DCEEF4] shadow-clay">
          {/* Active player info & credentials */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center font-display text-2xl text-white border-2 border-white shadow-xs shrink-0"
              style={{ backgroundColor: activePlayer.color }}
            >
              {activePlayer.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-lg text-[#163650] font-extrabold tracking-wide">
                  {activePlayer.name}'s Turn
                </span>
                {activePlayer.isAI && (
                  <span className="text-[9px] bg-[#DAEDF0] text-[#168B91] font-game font-extrabold px-1.5 py-0.5 rounded border border-[#168B91]/30">
                    BOT
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 mt-0.5 text-xs font-game">
                <span className="font-display font-extrabold text-[#207E68]">
                  ${activePlayer.cash.toLocaleString()}
                </span>
                <span className="text-[#DAEDF0]">•</span>
                <span className="text-[#D69C49] font-bold">
                  {activePlayer.hasUsedCreditCard ? 'Card Drawn' : '$10K Credit Line'}
                </span>
                <span className="text-[#DAEDF0]">•</span>
                <span className={activePlayer.hasPassport ? 'text-[#207E68] font-bold' : 'text-[#D69C49] font-bold'}>
                  {activePlayer.hasPassport ? 'Passport Active' : 'Passport Forfeited'}
                </span>
              </div>
            </div>
          </div>

          {/* Timer */}
          {timeRemaining !== undefined && timeRemaining > 0 && (
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl font-display font-bold shadow-xs"
              style={{
                background: timeRemaining < 120 ? '#FDF2F2' : '#DAEDF0',
                border: `1.5px solid ${timeRemaining < 120 ? '#D97681' : '#168B91'}`,
                color: timeRemaining < 120 ? '#D97681' : '#168B91',
              }}
            >
              <Clock size={16} />
              <span className="text-lg">{formatTime(timeRemaining)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {isOnlineSession && !isMyTurn ? (
              <div className="bg-[#F1F5F8] border border-[#DAEDF0] rounded-2xl px-4 py-2.5 text-center shadow-xs">
                <span className="text-xs font-bold text-[#168B91] flex items-center gap-2 animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#168B91]" />
                  Spectating • Waiting for {activePlayer.name}'s move...
                </span>
              </div>
            ) : (
              <>
                {/* Escape Jail */}
                {activePlayer.isInJail && (
                  <button
                    onClick={onOpenJail}
                    className="bg-[#D97681] text-white px-3.5 py-2 text-xs font-game font-bold rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95"
                  >
                    <Lock size={14} />
                    <span>JAIL OPTIONS</span>
                  </button>
                )}

                {/* Credit Card Drawer */}
                <button
                  onClick={onOpenCreditCard}
                  className="btn-secondary px-3.5 py-2 text-xs flex items-center gap-1.5 shadow-sm"
                >
                  <CreditCard size={14} />
                  <span>CREDIT CARD ({!activePlayer.hasUsedCreditCard ? '$10K' : 'VIEW'})</span>
                </button>

                {/* Roll Dice */}
                {canRoll && (
                  <button
                    onClick={onRollDice}
                    disabled={!canRoll || activePlayer.isAI}
                    className="btn-dice px-5 py-2.5 text-sm flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
                    className="btn-primary px-5 py-2.5 text-sm flex items-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
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
