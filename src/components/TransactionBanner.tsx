import React, { useEffect, useState } from 'react';
import { X, TrendingUp, TrendingDown } from 'lucide-react';

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
          bgColor: '#DDF3EA',
          borderColor: '#89B46C',
          textColor: '#207E68',
          badgeBg: '#207E68',
          badgeText: '#FFFFFF',
          amountColor: '#207E68',
        };
      case 'rent':
      case 'loss':
        return {
          bgColor: '#FFF0F0',
          borderColor: '#D97681',
          textColor: '#D97681',
          badgeBg: '#D97681',
          badgeText: '#FFFFFF',
          amountColor: '#D97681',
        };
      case 'buy':
      case 'build':
        return {
          bgColor: '#FFF9EE',
          borderColor: '#E2B64D',
          textColor: '#92723E',
          badgeBg: '#D69C49',
          badgeText: '#FFFFFF',
          amountColor: '#92723E',
        };
      case 'jail':
        return {
          bgColor: '#F1F5F8',
          borderColor: '#697788',
          textColor: '#697788',
          badgeBg: '#697788',
          badgeText: '#FFFFFF',
          amountColor: '#697788',
        };
      default:
        return {
          bgColor: '#DAEDF0',
          borderColor: '#168B91',
          textColor: '#163650',
          badgeBg: '#168B91',
          badgeText: '#FFFFFF',
          amountColor: '#168B91',
        };
    }
  };

  const style = getStyle();

  return (
    /* Top Center Container: Fixed at the top of screen, horizontally centered */
    <div className="fixed top-3 sm:top-5 inset-x-0 z-[100] flex justify-center px-3 sm:px-4 pointer-events-none">
      <div className="w-full max-w-sm sm:max-w-md pointer-events-auto event-pop select-none">
        <div
          className="rounded-[20px] px-3.5 py-3 flex items-center justify-between gap-3 border shadow-raised"
          style={{
            backgroundColor: style.bgColor,
            borderColor: style.borderColor,
          }}
        >
          {/* Big Gamified Icon */}
          <div
            className="w-11 h-11 rounded-[14px] flex items-center justify-center text-2xl shrink-0 shadow-xs bg-white/80 border border-white"
          >
            {event.icon}
          </div>

          {/* Gamified Content Block */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span
                className="text-[10px] font-display font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full"
                style={{ backgroundColor: style.badgeBg, color: style.badgeText }}
              >
                {event.title}
              </span>

              {event.amount !== undefined && (
                <span
                  className="font-display text-lg sm:text-xl font-extrabold tracking-wide flex items-center gap-0.5"
                  style={{ color: style.amountColor }}
                >
                  {isPositive ? (
                    <TrendingUp size={16} className="inline stroke-[3]" />
                  ) : (
                    <TrendingDown size={16} className="inline stroke-[3]" />
                  )}
                  {isPositive ? '+' : '-'}${event.amount.toLocaleString()}
                </span>
              )}
            </div>

            <p
              className="font-game font-bold text-xs sm:text-[13px] mt-0.5 leading-snug truncate"
              style={{ color: '#163650' }}
            >
              {event.description}
            </p>
          </div>

          {/* Close / Dismiss Button */}
          <button
            onClick={() => {
              setVisible(false);
              onDismiss();
            }}
            className="p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-[#163650] transition-all shrink-0 active:scale-90"
            aria-label="Dismiss alert"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
