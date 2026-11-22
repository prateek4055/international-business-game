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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="jail-modal-title"
      className="p-0 bg-transparent border-0 rounded-3xl focus:outline-none w-[92vw] max-w-sm m-auto backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <div
        className="rounded-3xl overflow-hidden flex flex-col event-pop bg-white border border-[#DCEEF4] shadow-raised"
      >
        {/* Header with Jail event color #697788 */}
        <div
          className="p-5 text-center relative"
          style={{ background: '#697788' }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/20 hover:bg-black/30 rounded-full transition-colors" aria-label="Close">
            <X size={15} className="text-white" />
          </button>

          <div className="flex justify-center mb-2">
            <img
              src="/board-assets/jail.webp"
              alt="Jail"
              className="w-18 h-18 object-contain drop-shadow-md rounded-2xl border-2 border-white/40 bg-white/10 p-1"
            />
          </div>
          <div className="font-game text-xs tracking-widest text-[#C5E7F1] uppercase mb-1">YOU ARE IN CUSTODY!</div>
          <h2 id="jail-modal-title" className="font-display text-3xl text-white">JAIL</h2>
          <div className="font-game text-xs text-white/90 mt-1">
            {attemptsLeft > 0 ? `${attemptsLeft} escape roll${attemptsLeft > 1 ? 's' : ''} remaining` : 'No escape rolls left!'}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-3 bg-white">
          <p className="font-game text-sm text-[#163650] text-center font-bold">
            Choose your escape strategy:
          </p>

          {/* Option 1: Pay bail */}
          <button
            onClick={onPayBail}
            disabled={!canAffordBail}
            className="btn-dice w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            💰 Pay Bail — ${GAME_CONSTANTS.JAIL_BAIL_FEE.toLocaleString()}
          </button>

          {/* Option 2: Roll for freedom */}
          <button
            onClick={onRollForFreedom}
            disabled={attemptsLeft <= 0}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            🎲 Roll for Freedom (need 12) — {attemptsLeft} try left
          </button>

          {/* Option 3: Credit card */}
          {!hasUsedCreditCard && (
            <button
              onClick={onUseCreditCard}
              className="btn-secondary w-full py-3 text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              💳 Use Credit Card — ${GAME_CONSTANTS.JAIL_CREDIT_CARD_FEE.toLocaleString()}
            </button>
          )}

          <div className="rounded-2xl p-3 font-game text-xs text-[#668195] text-center border border-[#DCEEF4] bg-[#F1F5F8]">
            💡 Bail: $500 · Roll 12 to escape (3 tries) · Credit Card: $3,000
          </div>

          <button onClick={onClose} className="w-full py-2 text-xs font-game text-[#668195] hover:text-[#163650]">
            Cancel (Stay in Jail this turn)
          </button>
        </div>
      </div>
    </dialog>
  );
};
