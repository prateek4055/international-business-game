import React, { useEffect, useRef } from 'react';
import { GAME_CONSTANTS } from '../data/boardData';
import { X } from 'lucide-react';

interface JailModalProps {
  isOpen: boolean;
  jailRollAttempts: number;
  playerCash: number;
  hasUsedCreditCard: boolean;
  onPayBail: () => void;
  onRollForFreedom: () => void;
  onUseCreditCard: () => void;
  onClose: () => void;
}

export const JailModal: React.FC<JailModalProps> = ({
  isOpen, jailRollAttempts, playerCash, hasUsedCreditCard,
  onPayBail, onRollForFreedom, onUseCreditCard, onClose
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) { if (!dialog.open) dialog.showModal(); }
    else { if (dialog.open) dialog.close(); }
  }, [isOpen]);

  const attemptsLeft = GAME_CONSTANTS.JAIL_MAX_ATTEMPTS - jailRollAttempts;
  const canAffordBail = playerCash >= GAME_CONSTANTS.JAIL_BAIL_FEE;
  const canAffordCreditJail = !hasUsedCreditCard || playerCash >= GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="jail-modal-title"
      className="p-0 bg-transparent border-0 rounded-3xl focus:outline-none w-[92vw] max-w-sm m-auto"
      onClose={onClose}
    >
      <div
        className="rounded-3xl overflow-hidden flex flex-col event-pop"
        style={{
          boxShadow: '0 10px 0 #0f172a, 0 16px 40px rgba(0,0,0,0.7)',
          border: '2px solid rgba(239,68,68,0.3)',
        }}
      >
        {/* Header */}
        <div
          className="p-5 text-center relative"
          style={{ background: '#D86672', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.25)' }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/40 rounded-full" aria-label="Close">
            <X size={15} className="text-white" />
          </button>

          <div className="flex justify-center mb-2">
            <img
              src="/board-assets/jail.webp"
              alt="Jail"
              className="w-20 h-20 object-contain drop-shadow-xl rounded-2xl border-2 border-white/20 bg-slate-900/60 p-1 animate-[float_3s_ease-in-out_infinite]"
            />
          </div>
          <div className="font-game text-xs tracking-widest text-white/90 uppercase mb-1">YOU ARE IN CUSTODY!</div>
          <h2 id="jail-modal-title" className="font-display text-3xl text-white">JAIL</h2>
          <div className="font-game text-xs text-white/80 mt-1">
            {attemptsLeft > 0 ? `${attemptsLeft} escape roll${attemptsLeft > 1 ? 's' : ''} remaining` : 'No escape rolls left!'}
          </div>
        </div>

        {/* Body (Ticket Navy #163D5A) */}
        <div className="p-5 space-y-3" style={{ background: '#163D5A' }}>
          <p className="font-game text-sm text-[#E8F4F7] text-center">
            Choose your escape strategy:
          </p>

          {/* Option 1: Pay bail */}
          <button
            onClick={onPayBail}
            disabled={!canAffordBail}
            className="btn-arcade-gold w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            💰 Pay Bail — ${GAME_CONSTANTS.JAIL_BAIL_FEE.toLocaleString()}
          </button>

          {/* Option 2: Roll for freedom */}
          <button
            onClick={onRollForFreedom}
            disabled={attemptsLeft <= 0}
            className="btn-arcade-blue w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg"
          >
            🎲 Roll for Freedom (need 12) — {attemptsLeft} try left
          </button>

          {/* Option 3: Credit card */}
          {!hasUsedCreditCard && (
            <button
              onClick={onUseCreditCard}
              className="btn-arcade-purple w-full py-3 text-sm flex items-center justify-center gap-2 shadow-lg"
            >
              💳 Use Credit Card — ${GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE.toLocaleString()}
            </button>
          )}

          <div className="rounded-2xl p-3 font-game text-xs text-[#A8B7C9] text-center border border-[#23435B] bg-[#10273D]">
            💡 Bail: $500 · Roll 12 to escape (3 tries) · Credit Card: $3,000
          </div>

          <button onClick={onClose} className="w-full py-2 text-xs font-game text-[#A8B7C9] hover:text-white">
            Cancel (Stay in Jail this turn)
          </button>
        </div>
      </div>
    </dialog>
  );
};
