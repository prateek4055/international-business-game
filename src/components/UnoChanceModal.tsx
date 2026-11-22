import React, { useEffect, useRef } from 'react';
import { UnoChanceEvent, Player } from '../data/boardData';
import { Zap, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';

interface UnoChanceModalProps {
  isOpen: boolean;
  type: 'UNO' | 'CHANCE';
  diceTotal: number;
  lastDice: [number, number];
  event: UnoChanceEvent | null;
  activePlayer?: Player;
  players?: Player[];
  onConfirm: () => void;
}

export const UnoChanceModal: React.FC<UnoChanceModalProps> = ({
  isOpen,
  type,
  diceTotal,
  lastDice = [2, 2],
  event,
  activePlayer,
  players = [],
  onConfirm,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && event) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen, event]);

  if (!isOpen || !event) return null;

  const isEven = diceTotal % 2 === 0;
  const isUno = type === 'UNO';

  // In International Business rules:
  // UNO: Even = Profit Reward, Odd = Loss Penalty
  // CHANCE: Odd = Profit Reward, Even = Loss Penalty
  const isPositive = isUno ? isEven : !isEven;

  const otherPlayers = players.filter((p) => p.id !== activePlayer?.id && !p.isBankrupt);

  // Compute exact profit or loss amount
  let calculatedAmount: number | null = null;
  let breakdownText = '';

  if (event.action === 'receive' || event.action === 'pay') {
    calculatedAmount = event.amount || 0;
    breakdownText = isPositive ? 'Direct reward cash from the Bank' : 'Penalty cash paid to the Bank';
  } else if (event.action === 'collect_all') {
    const perPlayer = event.amount || 500;
    calculatedAmount = perPlayer * otherPlayers.length;
    breakdownText = `$${perPlayer} collected from each of ${otherPlayers.length} active players`;
  } else if (event.action === 'collect_sites') {
    const perSite = event.amount || 100;
    const siteCount = activePlayer?.ownedPropertyIndices.length || 0;
    calculatedAmount = perSite * siteCount * otherPlayers.length;
    breakdownText = `$${perSite} × ${siteCount} sites from ${otherPlayers.length} active players`;
  } else if (event.action === 'party_house') {
    calculatedAmount = 200 * otherPlayers.length;
    breakdownText = `Party House gift: $200 from each of ${otherPlayers.length} players`;
  } else if (event.action === 'repairs') {
    calculatedAmount = 250;
    breakdownText = 'General property repairs for your houses and hotels';
  }

  // Visual Dice Faces helper
  const getDicePip = (val: number) => {
    const pips = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
    return pips[Math.max(0, Math.min(5, val - 1))] || `${val}`;
  };

  const headerColor = isUno ? '#317DB0' : '#D49A45';

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="event-modal-title"
      className="p-0 bg-transparent border-0 rounded-[28px] focus:outline-none w-[92vw] max-w-sm m-auto backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
    >
      <div
        className="rounded-[24px] overflow-hidden flex flex-col event-pop select-none border border-[#DCEEF4] bg-white shadow-raised"
      >
        {/* ── Event Header ── */}
        <div
          className="px-5 pt-5 pb-4 text-center relative"
          style={{ backgroundColor: headerColor }}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-game font-extrabold uppercase tracking-widest mb-1 shadow-inner">
            <span>{isUno ? '🇺🇳 UNITED NATIONS' : '❓ CHANCE OF FORTUNE'}</span>
          </div>

          <h2
            id="event-modal-title"
            className="font-display font-extrabold text-3xl sm:text-4xl uppercase tracking-wider text-white drop-shadow-xs"
          >
            {type}
          </h2>

          {/* ── Collective Dice Equation Pill ── */}
          <div className="mt-2.5 inline-flex flex-col items-center gap-1 bg-white px-4 py-2 rounded-2xl shadow-clay border border-[#DCEEF4]">
            <div className="flex items-center gap-2 text-sm sm:text-base font-display font-extrabold text-[#163650]">
              <span className="text-xl leading-none text-[#193D5B]">{getDicePip(lastDice[0])}</span>
              <span>{lastDice[0]}</span>
              <span className="text-[#668195] font-normal">+</span>
              <span className="text-xl leading-none text-[#193D5B]">{getDicePip(lastDice[1])}</span>
              <span>{lastDice[1]}</span>
              <span className="text-[#668195] font-normal">=</span>
              <span className="text-lg font-black text-[#168B91] px-2 py-0.5 bg-[#DAEDF0] rounded-lg">
                {diceTotal}
              </span>
            </div>

            {/* Position Match Badge */}
            <div className="flex items-center gap-1.5 text-[11px] font-game font-bold">
              <span className="text-[#668195]">Applied Rule:</span>
              <span className="text-[#163650] font-extrabold bg-[#FFF0D6] px-2 py-0.5 rounded-md border border-[#E2B64D]/40">
                POSITION #{diceTotal}
              </span>
              <span
                className={`px-1.5 py-0.5 rounded text-[10px] text-white font-extrabold ${
                  isEven ? 'bg-[#317DB0]' : 'bg-[#D49A45]'
                }`}
              >
                {isEven ? 'EVEN' : 'ODD'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Event Body ── */}
        <div className="p-4 sm:p-5 space-y-3.5 bg-white">
          {/* Card Presentation */}
          <div
            className={`rounded-2xl p-4 text-center border transition-all flex flex-col items-center ${
              isPositive
                ? 'bg-[#DDF3EA] border-[#89B46C]/40 text-[#207E68]'
                : 'bg-[#FFF0F0] border-[#D97681]/40 text-[#D97681]'
            }`}
          >
            {/* Outcome Pill */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-display font-extrabold uppercase tracking-wider mb-2.5 shadow-xs text-white ${
                isPositive ? 'bg-[#207E68]' : 'bg-[#D97681]'
              }`}
            >
              {isPositive ? <CheckCircle2 size={14} /> : <AlertTriangle size={14} />}
              <span>{isPositive ? 'PROFIT GAIN' : 'LOSS PENALTY'}</span>
            </div>

            {/* Event Description */}
            <p className="font-game font-bold text-[#163650] text-base sm:text-lg leading-snug">
              "{event.text}"
            </p>

            {/* Calculated Profit / Loss Number */}
            {calculatedAmount !== null && (
              <div
                className={`font-display text-4xl sm:text-5xl mt-2 tracking-wide font-extrabold ${
                  isPositive ? 'text-[#207E68]' : 'text-[#D97681]'
                }`}
              >
                {isPositive ? '+' : '-'}${calculatedAmount.toLocaleString()}
              </div>
            )}

            {breakdownText && (
              <div className="text-xs font-game text-[#668195] mt-1.5 font-medium">
                {breakdownText}
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            onClick={onConfirm}
            className={`w-full py-3.5 text-sm sm:text-base font-display font-extrabold tracking-wider flex items-center justify-center gap-2 cursor-pointer ${
              isPositive ? 'btn-primary' : 'bg-[#D97681] text-white rounded-2xl shadow-md active:scale-95'
            }`}
          >
            <Zap size={18} />
            <span>
              {isPositive
                ? calculatedAmount
                  ? `COLLECT +$${calculatedAmount.toLocaleString()} & CONTINUE`
                  : 'COLLECT REWARD & CONTINUE'
                : calculatedAmount
                ? `PAY -$${calculatedAmount.toLocaleString()} & CONTINUE`
                : 'ACCEPT & CONTINUE'}
            </span>
            <ArrowRight size={17} />
          </button>
        </div>
      </div>
    </dialog>
  );
};
