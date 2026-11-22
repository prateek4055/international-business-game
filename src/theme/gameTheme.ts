/**
 * International Business — Centralized Design System & Game Theme Tokens
 * Premium claymorphism mobile board-game palette with soft rounded 3D surfaces.
 */

export const GAME_THEME = {
  colors: {
    // ── Primary Palette ──
    primaryNavy: '#193D5B',
    mainBackground: '#E9F5F8',
    cardBackground: '#FFFFFF',
    primaryActionTeal: '#168B91',
    diceRewardGold: '#D69C49',
    darkText: '#163650',
    secondaryText: '#668195',
    headerSubtitle: '#C5E7F1',
    selectedNavigation: '#DAEDF0',
    inactiveNavigation: '#F1F5F8',
    secondaryBoardBackground: '#DCEEF4',
    positiveStatusBackground: '#DDF3EA',
    positiveStatusText: '#207E68',

    // ── Country Property Groups ──
    country: {
      red: '#D97681',
      yellow: '#E2B64D',
      green: '#89B46C',
      blue: '#63A2CF',
      utility: '#A3AFC2',
    },

    // ── Event & Special Spaces ──
    events: {
      uno: '#317DB0',
      chance: '#D49A45',
      start: '#D86A75',
      jail: '#697788',
      partyHouse: '#B58567',
      resort: '#329E91',
      duty: '#9781A6',
    },

    // ── Property Ticket Design ──
    ticket: {
      purchasePriceSurface: '#FFF9EE',
      alternateRentRow: '#E7F0F6',
      developmentSurface: '#E2F4F0',
      developmentText: '#246D62',
      mortgageSurface: '#FFF0D6',
      mortgageLabel: '#92723E',
      mortgageValue: '#6E5735',
      ownershipBonusSurface: '#E1F4ED',
      ownershipBonusText: '#26766E',
    },
  },

  // ── Claymorphic Shadows ──
  shadows: {
    // Standard Mobile Card Shadow
    card: '0 5px 12px rgba(27, 65, 99, 0.16)', // #1B416329
    // Raised Property Ticket Shadow
    ticket: '0 14px 22px rgba(21, 59, 90, 0.235), inset -2px -2px 4px rgba(255, 255, 255, 0.75)',
    // Primary Button Shadow
    buttonPrimary: '0 4px 0 #10666A, 0 8px 16px rgba(22, 139, 145, 0.28)',
    // Secondary Button Shadow
    buttonSecondary: '0 3px 0 #D0DEE5, 0 6px 12px rgba(25, 61, 91, 0.08)',
    // Dice / Reward Button Shadow
    buttonDice: '0 4px 0 #A8752B, 0 8px 18px rgba(214, 156, 73, 0.35)',
    // Tile soft drop shadow
    tile: '0 3px 8px rgba(27, 65, 99, 0.12), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
  },

  // ── Radii ──
  radii: {
    chips: '10px',
    buttons: '16px',
    cards: '20px',
    panels: '26px',
  },

  // ── Typography ──
  fonts: {
    heading: "'Fredoka', cursive, sans-serif",
    body: "'Outfit', sans-serif",
  },
} as const;
