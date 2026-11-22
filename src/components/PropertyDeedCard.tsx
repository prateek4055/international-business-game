import React from 'react';
import { BoardSpace, Player, SPACE_ASSETS } from '../data/boardData';

interface PropertyDeedCardProps {
  space: BoardSpace;
  owner?: Player;
  housesCount?: number;
  hasHotel?: boolean;
  isMortgaged?: boolean;
  onClick?: () => void;
  scale?: number;
  className?: string;
  compact?: boolean;
}

export const PropertyDeedCard: React.FC<PropertyDeedCardProps> = ({
  space,
  owner,
  housesCount = 0,
  hasHotel = false,
  isMortgaged = false,
  onClick,
  scale,
  className = '',
  compact = false,
}) => {
  const isUtility = space.type === 'Utility';
  const assetImage = SPACE_ASSETS[space.index]?.image || '';

  const getHeaderColor = () => {
    switch (space.group) {
      case 'Red':     return '#D86672';
      case 'Yellow':  return '#EDB64D';
      case 'Green':   return '#91B65A';
      case 'Blue':    return '#619CCC';
      case 'Utility': return '#A8B7C9';
      default:        return '#193D5A';
    }
  };

  const headerColor = getHeaderColor();

  // If a scale is explicitly provided and not 1, we wrap with transform
  const hasScale = scale !== undefined && scale !== 1;

  const cardContent = (
    <article
      onClick={onClick}
      aria-label={`${space.name} Property Deed`}
      style={{
        background: '#F7FCFF',
        boxShadow:
          '0px 14px 22px rgba(21, 59, 90, 0.235), inset -2px -2px 4px rgba(255, 255, 255, 0.75)',
        fontFamily: "'Fredoka', cursive, sans-serif",
      }}
      className={`relative w-full max-w-[370px] rounded-[23px] overflow-hidden border border-white/80 select-none flex flex-col transition-shadow ${
        onClick ? 'cursor-pointer hover:shadow-2xl hover:brightness-[1.02]' : ''
      }`}
    >
      {/* ── 1. Header Shell ── */}
      <header
        style={{ backgroundColor: headerColor }}
        className="relative w-full px-4 pt-2.5 pb-2.5 rounded-b-[18px] shadow-sm overflow-hidden flex flex-col gap-0.5 shrink-0"
      >
        {/* Subtle Light Rim Overlay */}
        <div className="absolute inset-1 rounded-[14px] bg-white/10 pointer-events-none" />

        {/* Top Header Row: Category Badge + Price Coin */}
        <div className="relative z-10 flex items-center justify-between gap-2 min-h-[26px]">
          <span className="font-semibold text-[11px] sm:text-xs text-[#243A4C] uppercase tracking-wider truncate">
            {isUtility ? 'TRANSPORT / UTILITY' : `PROPERTY DEED  •  ${space.group}`}
          </span>

          {space.price && (
            <div className="bg-white/95 backdrop-blur-sm rounded-[12px] px-2.5 py-0.5 shadow-sm flex items-center justify-center shrink-0 border border-black/5">
              <span className="font-bold text-xs sm:text-sm text-[#163D5A] leading-none">
                ${space.price.toLocaleString()}
              </span>
            </div>
          )}
        </div>

        {/* Country / Space Name */}
        <div className="relative z-10 font-bold text-xl sm:text-[23px] text-[#183C5A] uppercase tracking-wide leading-tight truncate">
          {space.name}
        </div>

        {/* Location (Capital & Currency) */}
        {space.capital && (
          <div className="relative z-10 font-medium text-[11px] sm:text-xs text-[#244A63] uppercase truncate">
            {space.capital} • {space.currency}
          </div>
        )}
      </header>

      {/* ── 2. Landmark Slot ── */}
      <div className="px-3 pt-2 pb-0.5 shrink-0">
        <div className="relative w-full h-[130px] sm:h-[150px] rounded-[14px] overflow-hidden bg-slate-100 shadow-inner flex items-center justify-center border border-black/5">
          {assetImage ? (
            <img
              src={assetImage}
              alt={space.name}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="text-3xl">🏛️</div>
          )}

          {/* Active Status Badges on Landmark */}
          {owner && (
            <div
              style={{ backgroundColor: owner.color }}
              className="absolute top-1.5 right-1.5 px-2 py-0.5 rounded-full text-white font-bold text-[10px] shadow-md border border-white/70 flex items-center gap-1 z-10"
            >
              <span>OWNED: {owner.name.toUpperCase()}</span>
            </div>
          )}

          {hasHotel && (
            <div className="absolute top-1.5 left-1.5 bg-red-600 px-2 py-0.5 rounded-full text-white font-bold text-[10px] shadow-md border border-white/70 z-10">
              🏨 HOTEL
            </div>
          )}

          {housesCount > 0 && !hasHotel && (
            <div className="absolute top-1.5 left-1.5 bg-emerald-600 px-2 py-0.5 rounded-full text-white font-bold text-[10px] shadow-md border border-white/70 z-10">
              🏠 {housesCount} {housesCount === 1 ? 'HOUSE' : 'HOUSES'}
            </div>
          )}
        </div>
      </div>

      {/* ── 3. Content Details: Country vs Utility ── */}
      <div className="p-3 space-y-2 flex-1 flex flex-col justify-between">
        {!isUtility && space.rents ? (
          <>
            {/* Rent Schedule Section */}
            <div>
              <div className="font-semibold text-xs sm:text-sm text-[#163D5A] tracking-wide mb-1 px-0.5">
                RENT SCHEDULE
              </div>

              {/* Rent Rows Table */}
              <div className="bg-white rounded-[13px] p-1 shadow-sm space-y-0.5 border border-slate-100">
                {[
                  { label: 'Site only', value: space.rents.siteOnly, isHotel: false },
                  { label: '1 house', value: space.rents.house1, isHotel: false },
                  { label: '2 houses', value: space.rents.house2, isHotel: false },
                  { label: '3 houses', value: space.rents.house3, isHotel: false },
                  { label: 'Hotel', value: space.rents.hotel, isHotel: true },
                ].map((row, i) => (
                  <div
                    key={i}
                    style={{ backgroundColor: row.isHotel ? '#E5F4F2' : '#F2F6FA' }}
                    className="flex items-center justify-between px-2.5 py-1 rounded-[8px] min-h-[25px]"
                  >
                    <span
                      className={`text-[11px] sm:text-xs ${
                        row.isHotel ? 'font-semibold text-[#185949]' : 'font-medium text-[#22425D]'
                      }`}
                    >
                      {row.label}
                    </span>
                    <span className="font-semibold text-xs sm:text-sm text-[#143F62]">
                      ${row.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Build Cost Panel */}
            <div className="bg-[#F3F5FA] rounded-[11px] px-2.5 py-1.5 border border-slate-100">
              <div className="font-bold text-[9px] sm:text-[10px] text-[#58738C] uppercase tracking-wider mb-0.5">
                BUILD COST
              </div>
              <div className="flex items-center justify-between text-[11px] sm:text-xs font-semibold text-[#1F4560]">
                <span>House: ${space.houseCost?.toLocaleString()}</span>
                <span>Hotel: ${(space.hotelCost ?? space.houseCost)?.toLocaleString()}</span>
              </div>
            </div>

            {/* Bank Mortgage Panel */}
            <div className="bg-[#FFEED8] rounded-[11px] px-2.5 py-1.5 flex items-center justify-between border border-amber-100/60">
              <span className="font-semibold text-[10px] sm:text-[11px] text-[#91672F] uppercase tracking-wider">
                BANK MORTGAGE
              </span>
              <span className="font-bold text-sm sm:text-base text-[#785529]">
                ${space.mortgage?.toLocaleString()}
              </span>
            </div>

            {/* 3-Property Bonus Ribbon */}
            <div className="bg-[#E5F4EA] rounded-[11px] px-2.5 py-1.5 border border-emerald-100/60 flex items-center">
              <span className="font-semibold text-[11px] sm:text-xs text-[#27755D] leading-tight">
                ⭐ 3 same-colour sites → 2× BASE RENT
              </span>
            </div>
          </>
        ) : (
          /* ── Utility Layout ── */
          <>
            <div>
              <div className="font-bold text-sm sm:text-base text-[#1C445F] tracking-wide mb-1.5 px-0.5">
                PASSIVE INCOME
              </div>

              {/* Base Rent Panel */}
              <div className="bg-[#E8F4FA] rounded-[14px] p-2.5 border border-sky-100/80 mb-2">
                <div className="font-semibold text-[10px] text-[#58738C] uppercase tracking-wider">
                  BASE RENT
                </div>
                <div className="font-bold text-xl sm:text-2xl text-[#173D5A] mt-0.5">
                  ${space.baseRent?.toLocaleString()}
                </div>
              </div>

              {/* Pair Bonus Panel */}
              <div className="bg-[#E1F3EE] rounded-[14px] p-2.5 border border-emerald-100/80 mb-2">
                <div className="font-semibold text-[10px] text-[#287663] uppercase tracking-wider">
                  PAIR OWNERSHIP BONUS
                </div>
                <div className="font-semibold text-xs sm:text-sm text-[#1D6558] mt-0.5">
                  Both owned → ${space.pairedRent?.toLocaleString()} RENT
                </div>
              </div>

              {/* Mortgage Panel */}
              <div className="bg-[#FFEBD8] rounded-[13px] p-2.5 border border-amber-100/80">
                <div className="font-medium text-[10px] text-[#9A6E43] uppercase tracking-wider">
                  BANK MORTGAGE VALUE
                </div>
                <div className="font-bold text-lg sm:text-xl text-[#805E37] mt-0.5">
                  ${space.mortgage?.toLocaleString()}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Mortgaged Overlay */}
      {isMortgaged && (
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-20 rounded-[23px] p-4">
          <div className="bg-red-600 text-white font-bold text-lg sm:text-xl px-5 py-2.5 rounded-full shadow-2xl border-2 border-white tracking-wider text-center">
            🏦 MORTGAGED TO BANK
          </div>
        </div>
      )}
    </article>
  );

  if (hasScale) {
    return (
      <div
        className={`relative inline-block ${className}`}
        style={{
          width: `${370 * (scale || 1)}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
        }}
      >
        {cardContent}
      </div>
    );
  }

  return <div className={`w-full max-w-[370px] ${className}`}>{cardContent}</div>;
};
