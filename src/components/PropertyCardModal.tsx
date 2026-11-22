import React, { useEffect, useRef } from 'react';
import { BoardSpace, Player } from '../data/boardData';
import { PropertyDeedCard } from './PropertyDeedCard';
import { X, Building2, Home, Landmark, Ban } from 'lucide-react';

interface PropertyCardModalProps {
  space: BoardSpace | null;
  owner?: Player;
  activePlayer: Player;
  canBuy: boolean;
  canBuildHouse: boolean;
  canBuildHotel: boolean;
  canMortgage: boolean;
  canLiftMortgage: boolean;
  onBuy: () => void;
  onBuildHouse: () => void;
  onBuildHotel: () => void;
  onMortgage: () => void;
  onLiftMortgage: () => void;
  onClose: () => void;
}

export const PropertyCardModal: React.FC<PropertyCardModalProps> = ({
  space,
  owner,
  activePlayer,
  canBuy,
  canBuildHouse,
  canBuildHotel,
  canMortgage,
  canLiftMortgage,
  onBuy,
  onBuildHouse,
  onBuildHotel,
  onMortgage,
  onLiftMortgage,
  onClose,
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (space) {
      if (!dialog.open) dialog.showModal();
    } else {
      if (dialog.open) dialog.close();
    }
  }, [space]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      const handler = (e: MouseEvent) => {
        if (e.target !== dialog) return;
        const r = dialog.getBoundingClientRect();
        const inside =
          r.top <= e.clientY &&
          e.clientY <= r.top + r.height &&
          r.left <= e.clientX &&
          e.clientX <= r.left + r.width;
        if (!inside) onClose();
      };
      dialog.addEventListener('click', handler);
      return () => dialog.removeEventListener('click', handler);
    }
  }, [onClose]);

  if (!space) return null;

  const isSmallScreen = typeof window !== 'undefined' && window.innerWidth < 390;
  const cardScale = isSmallScreen ? Math.min(1, (window.innerWidth - 24) / 370) : 1;

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="card-modal-title"
      className="p-0 bg-transparent border-0 rounded-[28px] focus:outline-none w-[94vw] max-w-[410px] m-auto backdrop:bg-slate-950/70 backdrop:backdrop-blur-sm"
      onClose={onClose}
    >
      <div className="relative flex flex-col items-center py-4 px-2 max-h-[92vh] overflow-y-auto overflow-x-hidden no-scrollbar">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-4 z-30 p-2 bg-[#193D5B] hover:brightness-110 text-white rounded-full shadow-lg border border-white/30 transition-all active:scale-95"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ── Official Figma 370px Ticket ── */}
        <div className="drop-shadow-2xl">
          <PropertyDeedCard space={space} owner={owner} scale={cardScale} />
        </div>

        {/* ── Action Buttons Dock (Clay Card Surface) ── */}
        <div
          style={{ width: `${370 * cardScale}px` }}
          className="mt-3.5 space-y-2 bg-white p-3.5 rounded-2xl shadow-[0_5px_12px_rgba(27,65,99,0.16)] border border-[#DAEDF0]"
        >
          {canBuy && (
            <button
              onClick={onBuy}
              className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 font-display font-semibold tracking-wide shadow-md active:scale-95"
            >
              <Landmark size={17} />
              BUY SITE — ${space.price?.toLocaleString()}
            </button>
          )}

          {canBuildHouse && (
            <button
              onClick={onBuildHouse}
              className="w-full py-2.5 text-xs flex items-center justify-center gap-2 font-display font-semibold bg-[#DDF3EA] text-[#207E68] border border-[#207E68]/30 rounded-[16px] shadow-sm active:scale-95 transition-all"
            >
              <Home size={15} />
              BUILD HOUSE — ${space.houseCost?.toLocaleString()}
            </button>
          )}

          {canBuildHotel && (
            <button
              onClick={onBuildHotel}
              className="w-full py-2.5 text-xs flex items-center justify-center gap-2 font-display font-semibold bg-[#D97681] text-white rounded-[16px] shadow-md active:scale-95 transition-all"
            >
              <Building2 size={15} />
              ERECT HOTEL — ${(space.hotelCost ?? space.houseCost)?.toLocaleString()}
            </button>
          )}

          <div className="flex gap-2">
            {canMortgage && (
              <button
                onClick={onMortgage}
                className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 font-display font-semibold shadow-sm active:scale-95"
              >
                <Ban size={13} /> MORTGAGE +${space.mortgage?.toLocaleString()}
              </button>
            )}

            {canLiftMortgage && (
              <button
                onClick={onLiftMortgage}
                className="btn-secondary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 font-display font-semibold shadow-sm active:scale-95"
              >
                LIFT −${space.mortgage?.toLocaleString()}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-[16px] font-game font-semibold text-xs text-[#668195] bg-[#F1F5F8] hover:bg-[#E2ECF2] transition-colors active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
