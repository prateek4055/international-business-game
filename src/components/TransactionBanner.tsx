import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown, Sparkles } from 'lucide-react';

export interface TransactionEvent {
  id: string;
  type: 'rent' | 'gain' | 'loss' | 'buy' | 'build' | 'jail' | 'passport' | 'party' | 'resort';
  title: string;
  amount?: number;
  isPositive?: boolean;
  playerName: string;
  playerColor: string;
  targetName?: string;
  targetColor?: string;
  description: string;
  icon: string;
}

interface TransactionBannerProps {
  event: TransactionEvent | null;
  onDismiss: () => void;
}

export const TransactionBanner: React.FC<TransactionBannerProps> = ({ event, onDismiss }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss();
      }, 3800);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [event, onDismiss]);

  if (!event || !visible) return null;

  const isPositive = event.isPositive ?? (event.type === 'gain' || event.type === 'party');

  const getStyle = () => {
    switch (event.type) {
      case 'gain':
      case 'party':
        return {
          gradient: 'linear-gradient(180deg, #10B981 0%, #059669 100%)',
          bottomBorder: '#045E42',
          glow: 'rgba(16, 185, 129, 0.45)',
          badgeBg: '#045E42',
          badgeText: '#A7F3D0',
          amountColor: '#FDE047', // Glowing Gold
        };
      case 'rent':
      case 'loss':
        return {
          gradient: 'linear-gradient(180deg, #EF4444 0%, #DC2626 100%)',
          bottomBorder: '#991B1B',
          glow: 'rgba(239, 68, 68, 0.45)',
          badgeBg: '#7F1D1D',
          badgeText: '#FECACA',
          amountColor: '#FFFFFF',
        };
      case 'buy':
      case 'build':
        return {
          gradient: 'linear-gradient(180deg, #F59E0B 0%, #D97706 100%)',
          bottomBorder: '#92400E',
          glow: 'rgba(245, 158, 11, 0.45)',
          badgeBg: '#78350F',
          badgeText: '#FEF3C7',
          amountColor: '#FFFFFF',
        };
      case 'jail':
        return {
          gradient: 'linear-gradient(180deg, #64748B 0%, #475569 100%)',
          bottomBorder: '#1E293B',
          glow: 'rgba(100, 116, 139, 0.45)',
          badgeBg: '#1E293B',
          badgeText: '#E2E8F0',
          amountColor: '#F87171',
        };
      default:
        return {
          gradient: 'linear-gradient(180deg, #0284C7 0%, #0369A1 100%)',
          bottomBorder: '#075985',
          glow: 'rgba(2, 132, 199, 0.45)',
          badgeBg: '#0C4A6E',
          badgeText: '#BAE6FD',
          amountColor: '#FFFFFF',
        };
    }
  };

  const style = getStyle();

  return (
    /* Top Center Container: Fixed at the very top of screen, horizontally centered */
    <div className="fixed top-3 sm:top-5 inset-x-0 z-[100] flex justify-center px-3 sm:px-4 pointer-events-none">
      <div
        className="w-full max-w-sm sm:max-w-md pointer-events-auto event-pop select-none"
        style={{
          filter: `drop-shadow(0 10px 18px ${style.glow})`,
        }}
      >
        <div
          className="rounded-[22px] px-3.5 py-3 text-white flex items-center justify-between gap-3 border-t-2 border-white/60 shadow-xl"
          style={{
            background: style.gradient,
            borderBottom: `5px solid ${style.bottomBorder}`,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4)',
          }}
        >
          {/* Big Gamified Icon with 3D Bevel */}
          <div
            className="w-12 h-12 rounded-[16px] flex items-center justify-center text-2xl shrink-0 shadow-md border-t border-white/40"
            style={{
              background: 'rgba(0,0,0,0.22)',
              borderBottom: '2.5px solid rgba(0,0,0,0.3)',
            }}
          >
            {event.icon}
          </div>

          {/* Gamified Content Block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-inner"
                style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
              >
                {event.title}
              </span>

              {event.amount !== undefined && (
                <span
                  className="font-display text-lg sm:text-xl font-extrabold tracking-wide drop-shadow-md flex items-center gap-0.5"
                  style={{ color: style.amountColor }}
                >
                  {isPositive ? (
                    <TrendingUp size={16} className="inline text-yellow-300 stroke-[3]" />
                  ) : (
                    <TrendingDown size={16} className="inline text-white stroke-[3]" />
                  )}
                  {isPositive ? '+' : '-'}${event.amount.toLocaleString()}
                </span>
              )}
            </div>

            <p className="font-game font-bold text-xs sm:text-[13px] text-white/95 mt-0.5 leading-snug truncate drop-shadow-sm">
              {event.description}
            </p>
          </div>

          {/* Close / Dismiss Pill Button */}
          <button
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            className="p-1.5 rounded-full bg-black/25 hover:bg-black/45 text-white transition-all shrink-0 active:scale-90"
            aria-label="Dismiss alert"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
