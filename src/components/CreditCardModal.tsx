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
      className="p-0 bg-transparent border-0 rounded-3xl focus:outline-none w-[92vw] max-w-sm m-auto"
      onClose={onClose}
    >
      <div
        className="rounded-3xl overflow-hidden flex flex-col event-pop"
        style={{
          boxShadow: '0 10px 0 #78350f, 0 16px 40px rgba(255,183,3,0.25)',
          border: '2px solid rgba(251,191,36,0.4)',
        }}
      >
        {/* Card Face */}
        <div
          className="relative p-5 overflow-hidden"
          style={{
            background: '#193D5A',
            borderBottom: '3px solid #EDB64D',
            minHeight: '140px',
          }}
        >
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full" aria-label="Close">
            <X size={15} className="text-white" />
          </button>

          {/* Card chip */}
          <div
            className="w-10 h-7 rounded-lg mb-3 absolute top-5 right-16"
            style={{ background: '#EDB64D', border: '1px solid rgba(255,255,255,0.4)', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          />

          <div className="font-game text-xs tracking-widest text-[#EDB64D] uppercase mb-1">International Business Bank</div>
          <h2 id="card-facility-title" className="font-display text-2xl text-white">GOLD CREDIT</h2>

          <div className="mt-4 flex items-end justify-between">
            <div>
              <div className="text-[9px] font-game text-[#A8B7C9] uppercase tracking-wider">Cardholder</div>
              <div className="font-game font-bold text-white text-sm">{player.name}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] font-game text-[#A8B7C9] uppercase tracking-wider">Credit Limit</div>
              <div className="font-display text-[#EDB64D] text-xl font-bold">${GAME_CONSTANTS.CREDIT_CARD_LIMIT.toLocaleString()}</div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3" style={{ background: '#163D5A' }}>
          {/* Status */}
          {canTakeLoan ? (
            <div className="rounded-2xl p-3 border border-[#91B65A]/50 bg-[#91B65A]/15">
              <div className="font-game font-bold text-[#91B65A] text-sm mb-1">✅ Facility Available</div>
              <div className="font-game text-xs text-[#E8F4F7]">
                Draw $10,000 emergency loan to buy properties or pay debts.
              </div>
            </div>
          ) : player.creditCardInstallmentsLeft > 0 ? (
            <div className="rounded-2xl p-3 border border-[#EDB64D]/50 bg-[#EDB64D]/15 space-y-2">
              <div className="flex items-center justify-between font-game text-sm">
                <span className="text-[#EDB64D] font-bold">Repayment Active</span>
                <span className="text-white font-mono">{paidInstallments}/{GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS}</span>
              </div>
              <div className="w-full bg-[#10273D] rounded-full h-3 overflow-hidden border border-[#23435B]">
                <div
                  className="h-full rounded-full transition-all bg-[#EDB64D]"
                  style={{
                    width: `${(paidInstallments / GAME_CONSTANTS.CREDIT_CARD_TOTAL_INSTALLMENTS) * 100}%`,
                  }}
                />
              </div>
              <div className="font-game text-xs text-[#E8F4F7]">
                Next installment <span className="text-[#EDB64D] font-bold">$2,000</span> deducted when you pass START.
              </div>
            </div>
          ) : (
            <div className="rounded-2xl p-3 border border-[#23435B] bg-[#10273D] text-center font-game text-sm text-[#A8B7C9]">
              💳 Credit facility already fully utilized this game.
            </div>
          )}

          {/* Warning */}
          <div className="rounded-2xl p-3 border border-[#D86672]/40 bg-[#D86672]/15 flex items-start gap-2">
            <AlertTriangle size={16} className="text-[#D86672] shrink-0 mt-0.5" />
            <div className="font-game text-xs text-[#E8F4F7] leading-relaxed">
              <strong className="text-[#D86672]">Official Rule:</strong> You repay $2,000 × 6 = $12,000 total. Miss a payment → sent to <strong>JAIL!</strong>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {canTakeLoan && (
              <button onClick={onTakeLoan} className="btn-arcade-gold flex-1 py-3 text-sm font-display shadow-lg active:scale-95">
                💰 DRAW $10,000 NOW
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-3 rounded-xl font-game font-bold text-xs text-[#A8B7C9] bg-[#10273D] border border-[#23435B] hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
