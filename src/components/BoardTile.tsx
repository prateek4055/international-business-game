import React from 'react';
import { BoardSpace, Player, SPACE_ASSETS } from '../data/boardData';

interface BoardTileProps {
  space: BoardSpace;
  owner?: Player;
  housesCount: number;
  hasHotel: boolean;
  isMortgaged: boolean;
  playersHere: Player[];
  isHighlighted: boolean;
  onClick: () => void;
}

export const BoardTile: React.FC<BoardTileProps> = ({
  space,
  owner,
  housesCount,
  hasHotel,
  isMortgaged,
  playersHere,
  isHighlighted,
  onClick,
}) => {
  const isCorner = [0, 9, 18, 27].includes(space.index);
  const asset = SPACE_ASSETS[space.index] || {
    image: '/board-assets/start.webp',
    headerColor: '#1b4161'
  };

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`${space.name}${space.price ? ` $${space.price}` : ''}`}
      className={`relative w-full h-full flex flex-col justify-between overflow-hidden cursor-pointer select-none transition-all ${
        isHighlighted
          ? 'ring-4 ring-yellow-400 scale-[1.04] z-30 shadow-[0_0_25px_rgba(250,204,21,0.7)]'
          : 'hover:scale-[1.02] hover:z-20'
      } ${isMortgaged ? 'opacity-60 grayscale-[70%]' : ''}`}
      style={{
        backgroundColor: '#f8fcff',
        borderRadius: isCorner ? '16px' : '10px',
        border: '2px solid #ffffff',
        boxShadow: '-2px -2px 7px 0px rgba(255,255,255,0.7), 1px 6px 9px 0px rgba(28,69,99,0.3)',
      }}
    >
      {/* ── Top Header Name Band (Figma specification) ── */}
      <div
        className="w-full flex flex-col items-center justify-center relative shrink-0"
        style={{
          backgroundColor: asset.headerColor,
          padding: isCorner ? '3px 2px' : '2px 1px',
          boxShadow: 'inset 0px -1px 3px 0px rgba(255,255,255,0.31)',
        }}
      >
        <span
          className="font-display text-white text-center tracking-tight truncate max-w-full px-0.5 leading-tight"
          style={{
            fontSize: isCorner ? 'clamp(7px, 1vw, 12px)' : 'clamp(6px, 0.8vw, 9.5px)',
            textShadow: '0 1px 2px rgba(0,0,0,0.4)',
          }}
        >
          {space.name}
        </span>
        {/* Gold accent line */}
        <div className="w-full h-[1.5px] bg-[#d9b36f] opacity-90 mt-0.5" />
      </div>

      {/* ── Center 3D Claymorphic Illustration from Figma ── */}
      <div className="relative flex-1 w-full p-0.5 sm:p-1 overflow-hidden flex items-center justify-center">
        <div
          className="w-full h-full relative rounded-[5px] sm:rounded-[7px] overflow-hidden border border-white/80 shadow-[inset_0px_2px_4px_0px_rgba(35,72,99,0.26)]"
        >
          <img
            src={asset.image}
            alt={space.name}
            className="w-full h-full object-cover pointer-events-none"
            loading="lazy"
          />

          {/* Owner tint bar on illustration */}
          {owner && (
            <div
              className="absolute top-0 left-0 right-0 h-1.5 z-10 shadow-xs"
              style={{ backgroundColor: owner.color }}
              title={`Owned by ${owner.name}`}
            />
          )}

          {/* House / Hotel badges on illustration */}
          {(housesCount > 0 || hasHotel) && (
            <div className="absolute top-1 right-1 flex items-center gap-0.5 z-10 bg-black/50 p-0.5 rounded">
              {hasHotel ? (
                <span className="bg-red-600 text-white font-display text-[7px] px-1 rounded shadow-xs">
                  HOTEL
                </span>
              ) : (
                Array.from({ length: housesCount }).map((_, i) => (
                  <div
                    key={i}
                    className="w-2 h-2 bg-emerald-500 border border-white rounded-xs shadow-xs"
                  />
                ))
              )}
            </div>
          )}

          {/* Mortgage stamp */}
          {isMortgaged && (
            <div className="absolute inset-0 bg-red-950/70 flex items-center justify-center text-[7px] font-display text-white tracking-widest uppercase">
              MORTGAGED
            </div>
          )}
        </div>
      </div>

      {/* ── Bottom Raised Price / Action Token (Figma specification) ── */}
      <div
        className="w-full shrink-0 flex items-center justify-center py-0.5 px-0.5 border-t border-[#f0dab6]"
        style={{
          backgroundColor: '#fff8ec',
          boxShadow: 'inset -1px -2px 3px 0px rgba(255,255,255,0.97)',
        }}
      >
        <span
          className="font-display text-[#173b55] text-center font-bold tracking-tight leading-none"
          style={{ fontSize: isCorner ? 'clamp(7px, 0.95vw, 11px)' : 'clamp(6px, 0.85vw, 9.5px)' }}
        >
          {space.price ? (
            `$${space.price.toLocaleString()}`
          ) : space.type === 'Start' ? (
            <span className="text-emerald-700">+$1,500</span>
          ) : space.type === 'Jail' ? (
            <span className="text-red-700">$500 BAIL</span>
          ) : (
            <span className="text-slate-600 text-[6.5px] uppercase">{space.type}</span>
          )}
        </span>
      </div>

      {/* ── Animated 3D Pawns ── */}
      {playersHere.length > 0 && (
        <div className="absolute inset-0 flex flex-wrap items-center justify-center gap-0.5 pointer-events-none z-30 p-0.5">
          {playersHere.map((p) => (
            <div
              key={p.id}
              className="pawn rounded-full flex items-center justify-center font-display text-white border-2 border-white shadow-xl"
              style={{
                backgroundColor: p.color,
                width: 'clamp(14px, 2.2vw, 24px)',
                height: 'clamp(14px, 2.2vw, 24px)',
                fontSize: 'clamp(7px, 1.1vw, 12px)',
                boxShadow: `0 3px 6px rgba(0,0,0,0.5), 0 0 10px ${p.color}`,
              }}
              title={`${p.name} ($${p.cash.toLocaleString()})`}
            >
              {p.name.charAt(0).toUpperCase()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
