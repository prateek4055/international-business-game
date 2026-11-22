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
          className="absolute top-2 right-4 z-30 p-2 bg-slate-900/80 hover:bg-slate-900 text-white rounded-full shadow-lg border border-white/20 transition-all hover:scale-110"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {/* ── Official Figma 370px Ticket ── */}
        <div className="drop-shadow-2xl">
          <PropertyDeedCard space={space} owner={owner} scale={cardScale} />
        </div>

        {/* ── Action Buttons Dock ── */}
        <div
          style={{ width: `${370 * cardScale}px` }}
          className="mt-4 space-y-2 bg-[#0F2840] p-3.5 rounded-2xl shadow-2xl border-2 border-white/30"
        >
          {canBuy && (
            <button
              onClick={onBuy}
              className="btn-arcade-gold w-full py-3 text-sm flex items-center justify-center gap-2 font-display font-extrabold tracking-wide shadow-xl active:scale-95"
            >
              <Landmark size={17} />
              BUY SITE — ${space.price?.toLocaleString()}
            </button>
          )}

          {canBuildHouse && (
            <button
              onClick={onBuildHouse}
              className="btn-arcade-green w-full py-2.5 text-xs flex items-center justify-center gap-2 font-display font-extrabold shadow-xl active:scale-95"
            >
              <Home size={15} />
              BUILD HOUSE — ${space.houseCost?.toLocaleString()}
            </button>
          )}

          {canBuildHotel && (
            <button
              onClick={onBuildHotel}
              className="btn-arcade-red w-full py-2.5 text-xs flex items-center justify-center gap-2 font-display font-extrabold shadow-xl active:scale-95"
            >
              <Building2 size={15} />
              ERECT HOTEL — ${(space.hotelCost ?? space.houseCost)?.toLocaleString()}
            </button>
          )}

          <div className="flex gap-2">
            {canMortgage && (
              <button
                onClick={onMortgage}
                className="btn-arcade-blue flex-1 py-2 text-xs flex items-center justify-center gap-1.5 font-display font-extrabold shadow-md active:scale-95"
              >
                <Ban size={13} /> MORTGAGE +${space.mortgage?.toLocaleString()}
              </button>
            )}

            {canLiftMortgage && (
              <button
                onClick={onLiftMortgage}
                className="btn-arcade-purple flex-1 py-2 text-xs flex items-center justify-center gap-1.5 font-display font-extrabold shadow-md active:scale-95"
              >
                LIFT −${space.mortgage?.toLocaleString()}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl font-game font-bold text-xs text-white bg-white/10 hover:bg-white/20 transition-colors shadow-sm active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </dialog>
  );
};
