import React, { useState } from 'react';
import { BOARD_SPACES, BoardSpace, Player } from '../data/boardData';
import { PropertyDeedCard } from './PropertyDeedCard';
import { X, Filter } from 'lucide-react';

interface PropertyDeedCollectionProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProperty?: (space: BoardSpace) => void;
  players?: Player[];
  spacesState?: Record<number, { ownerId?: number; housesCount: number; hasHotel: boolean; isMortgaged: boolean }>;
}

const GROUPS = [
  { name: 'All', color: '#193D5A' },
  { name: 'Red', color: '#D97681' },
  { name: 'Yellow', color: '#E2B64D' },
  { name: 'Green', color: '#89B46C' },
  { name: 'Blue', color: '#63A2CF' },
  { name: 'Utility', color: '#A3AFC2' },
];

export const PropertyDeedCollection: React.FC<PropertyDeedCollectionProps> = ({
  isOpen,
  onClose,
  onSelectProperty,
  players = [],
  spacesState = {},
}) => {
  const [selectedGroup, setSelectedGroup] = useState<string>('All');

  if (!isOpen) return null;

  // Filter 20 Countries + 6 Utilities (excluding Special spaces like Start, Jail, Uno, Chance, Duties, Resort, Party)
  const deeds = BOARD_SPACES.filter((s) => s.type === 'Property' || s.type === 'Utility');
  const filteredDeeds =
    selectedGroup === 'All' ? deeds : deeds.filter((s) => s.group === selectedGroup);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="collection-gallery-title"
      className="fixed inset-0 z-[70] bg-slate-950/92 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 overflow-hidden animate-[fade-in_0.2s_ease-out]"
    >
      <div className="relative w-full max-w-7xl h-[96vh] sm:max-h-[94vh] bg-[#E8F4F7] rounded-[22px] sm:rounded-[26px] shadow-[0px_20px_50px_rgba(15,35,55,0.6)] border-2 sm:border-4 border-white flex flex-col overflow-hidden">
        {/* ── Header Navy Panel ── */}
        <div className="relative mx-2 sm:mx-6 mt-2.5 sm:mt-6 bg-[#193D5A] rounded-[18px] sm:rounded-[22px] px-3.5 sm:px-6 py-2.5 sm:py-4 flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3 shadow-lg shrink-0">
          <div>
            <h2
              id="collection-gallery-title"
              className="font-display font-bold text-lg sm:text-2xl lg:text-3xl text-white tracking-wide flex items-center gap-2 sm:gap-3"
            >
              <span>📜 PROPERTY DEED COLLECTION</span>
            </h2>
            <div className="text-blue-200/80 font-game text-[10px] sm:text-xs lg:text-sm mt-0.5">
              Official Title Deeds • 20 Famous Countries + 6 Transport & Utilities
            </div>
          </div>

          <div className="flex items-center justify-between gap-2">
            {/* Filter Buttons */}
            <div className="flex items-center gap-1 sm:gap-1.5 bg-black/20 p-1 sm:p-1.5 rounded-xl border border-white/10 overflow-x-auto no-scrollbar">
              {GROUPS.map((g) => (
                <button
                  key={g.name}
                  onClick={() => setSelectedGroup(g.name)}
                  className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-display transition-all whitespace-nowrap ${
                    selectedGroup === g.name
                      ? 'bg-white text-[#193D5A] shadow-md font-bold scale-105'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                  style={{
                    borderLeft: selectedGroup === g.name && g.name !== 'All' ? `3px solid ${g.color}` : undefined,
                  }}
                >
                  {g.name}
                </button>
              ))}
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all hover:scale-110 shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── Scrollable Gallery Grid ── */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8">
          {['Red', 'Yellow', 'Green', 'Blue', 'Utility'].map((group) => {
            if (selectedGroup !== 'All' && selectedGroup !== group) return null;

            const groupDeeds = deeds.filter((d) => d.group === group);
            if (groupDeeds.length === 0) return null;

            const groupKeyColor =
              group === 'Red'
                ? '#D86672'
                : group === 'Yellow'
                ? '#EDB64D'
                : group === 'Green'
                ? '#91B65A'
                : group === 'Blue'
                ? '#619CCC'
                : '#A8B7C9';

            return (
              <section key={group} className="space-y-4">
                {/* Category Header with Colored Key Pill */}
                <div className="flex items-center gap-3 px-2">
                  <div
                    style={{ backgroundColor: groupKeyColor }}
                    className="w-3.5 h-10 rounded-[6px] shadow-sm shrink-0"
                  />
                  <h3 className="font-display font-semibold text-2xl text-[#23435B] tracking-wide">
                    {group === 'Utility' ? 'Transport & Utility Network' : `${group} Group Countries`}
                  </h3>
                  <span className="text-xs font-game text-[#23435B]/70 font-bold ml-2">
                    ({groupDeeds.length} deeds)
                  </span>
                </div>

                {/* Grid of Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                  {groupDeeds.map((space) => {
                    const state = spacesState[space.index];
                    const owner = state?.ownerId !== undefined ? players.find((p) => p.id === state.ownerId) : undefined;

                    return (
                      <div
                        key={space.index}
                        onClick={() => {
                          if (onSelectProperty) onSelectProperty(space);
                        }}
                        className="w-full max-w-[370px] flex justify-center cursor-pointer transition-transform duration-200 hover:-translate-y-1.5 rounded-[23px]"
                      >
                        <PropertyDeedCard
                          space={space}
                          owner={owner}
                          housesCount={state?.housesCount || 0}
                          hasHotel={state?.hasHotel || false}
                          isMortgaged={state?.isMortgaged || false}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
};
