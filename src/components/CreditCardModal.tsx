import React, { useEffect, useRef } from 'react';
import { Player, GAME_CONSTANTS } from '../data/boardData';
import { X, AlertTriangle } from 'lucide-react';

interface CreditCardModalProps {
  isOpen: boolean;
  player: Player;
  canTakeLoan: boolean;
  onTakeLoan: () => void;
  onClose: () => void;
}

export const CreditCardModal: React.FC<CreditCardModalProps> = ({
  isOpen, player, canTakeLoan, onTakeLoan, onClose
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const paidInstallments = GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS - player.creditCardInstallmentsLeft;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="card-facility-title"
      className="p-0 bg-transparent border-0 rounded-3xl focus:outline-none w-[92vw] max-w-sm m-auto backdrop:bg-slate-900/40 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <div
        className="rounded-3xl overflow-hidden flex flex-col event-pop bg-white border border-[#DCEEF4] shadow-raised"
      >
        {/* Card Face */}
        <div
          className="relative p-5 overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #193D5B 0%, #163650 100%)',
            borderBottom: '3px solid #D69C49',
            minHeight: '135px',
          }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-colors" aria-label="Close">
            <X size={15} className="text-white" />
          </button>

          {/* Card chip */}
          <div
            className="w-10 h-7 rounded-lg mb-3 absolute top-5 right-14"
            style={{ background: '#D69C49', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          />

          <div className="font-game text-xs tracking-widest text-[#C5E7F1] uppercase mb-1">International Business Bank</div>
          <h2 id="card-facility-title" className="font-display text-2xl text-white">GOLD CREDIT</h2>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[9px] font-game text-[#C5E7F1] uppercase tracking-wider">Cardholder</div>
              <div className="font-game font-bold text-white text-sm">{player.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-game text-[#C5E7F1] uppercase tracking-wider">Credit Limit</div>
              <div className="font-display text-[#D69C49] text-xl font-bold">${GAME_CONSTANTS.CREDIT_CARD_LIMIT.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 bg-white">
          {/* Status */}
          {canTakeLoan ? (
            <div className="rounded-2xl p-3 border border-[#89B46C]/50 bg-[#DDF3EA]">
              <div className="font-game font-bold text-[#207E68] text-sm mb-1">✅ Facility Available</div>
              <div className="font-game text-xs text-[#163650]">
                Draw $10,000 emergency loan to buy properties or pay debts.
              </div>
            </div>
          ) : player.creditCardInstallmentsLeft > 0 ? (
            <div className="rounded-2xl p-3 border border-[#E2B64D]/50 bg-[#FFF0D6] space-y-2">
              <div className="flex items-center justify-between font-game text-sm">
                <span className="text-[#92723E] font-bold">Repayment Active</span>
                <span className="text-[#163650] font-mono font-bold">{paidInstallments}/{GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS}</span>
              </div>
              <div className="w-full bg-white rounded-full h-3 overflow-hidden border border-[#E2B64D]/40">
                <div
                  className="h-full rounded-full transition-all bg-[#D69C49]"
                  style={{
                    width: `${(paidInstallments / GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS) * 100}%`,
                  }}
                />
              </div>
              <div className="font-game text-xs text-[#6E5735]">
                Next installment <span className="text-[#92723E] font-bold">$2,000</span> deducted when you pass START.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-3 border border-[#DCEEF4] bg-[#F1F5F8] text-center font-game text-sm text-[#668195]">
              💳 Credit facility already fully utilized this game.
            </div>
          )}

          {/* Warning */}
          <div className="rounded-2xl p-3 border border-[#D97681]/40 bg-[#FFF0F0] flex items-start gap-2">
            <AlertTriangle size={16} className="text-[#D97681] shrink-0 mt-0.5" />
            <div className="font-game text-xs text-[#163650] leading-relaxed">
              <strong className="text-[#D97681]">Official Rule:</strong> You repay $2,000 × 6 = $12,000 total. Miss a payment → sent to <strong>JAIL!</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canTakeLoan && (
              <button onClick={onTakeLoan} className="btn-dice flex-1 py-3 text-sm font-display shadow-md active:scale-95">
                💰 DRAW $10,000 NOW
              </button>
            )}
            <button
              onClick={onClose}
              className="btn-secondary px-4 py-3 text-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
