/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  corePlugins: { preflight: true },
  theme: {
    extend: {
      fontFamily: {
        display: ['Fredoka One', 'cursive'],
        game: ['Baloo 2', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
      colors: {
        "business-game-ticket-colors-group-blue":
          "var(--business-game-ticket-colors-group-blue)",
        "business-game-ticket-colors-group-green":
          "var(--business-game-ticket-colors-group-green)",
        "business-game-ticket-colors-group-red":
          "var(--business-game-ticket-colors-group-red)",
        "business-game-ticket-colors-group-utility":
          "var(--business-game-ticket-colors-group-utility)",
        "business-game-ticket-colors-group-yellow":
          "var(--business-game-ticket-colors-group-yellow)",
        "business-game-ticket-colors-UI-body-ink":
          "var(--business-game-ticket-colors-UI-body-ink)",
        "business-game-ticket-colors-UI-card-surface":
          "var(--business-game-ticket-colors-UI-card-surface)",
        "business-game-ticket-colors-UI-cream-surface":
          "var(--business-game-ticket-colors-UI-cream-surface)",
        "business-game-ticket-colors-UI-dark-navy":
          "var(--business-game-ticket-colors-UI-dark-navy)",
        "business-game-ticket-colors-UI-gold":
          "var(--business-game-ticket-colors-UI-gold)",
        "business-game-ticket-colors-UI-positive":
          "var(--business-game-ticket-colors-UI-positive)",
        board: {
          blue: '#1388C8',
          center: '#0B3C61',
          gold: '#FFB703',
          red: '#E63946',
          green: '#558B2F',
          yellow: '#F9A825',
          cyan: '#0288D1',
          grey: '#4E606A',
          jail: '#37474F'
        },
        clay: {
          bg: '#1a0533',
          surface: '#2d1052',
          card: '#3d1870',
          border: '#6b21d4',
          gold: '#FFD166',
          coral: '#FF6B6B',
          mint: '#06D6A0',
          sky: '#118AB2',
          sun: '#FFB703',
          grape: '#9B5DE5',
          pink: '#F15BB5',
          navy: '#0B3C61',
        }
      },
      boxShadow: {
        clay: '0 8px 0 rgba(0,0,0,0.3), 0 4px 16px rgba(0,0,0,0.4)',
        'clay-sm': '0 4px 0 rgba(0,0,0,0.25), 0 2px 8px rgba(0,0,0,0.3)',
        'clay-inset': 'inset 0 2px 4px rgba(255,255,255,0.15)',
        'clay-gold': '0 8px 0 #c8820a, 0 4px 20px rgba(255,183,3,0.4)',
        'clay-green': '0 8px 0 #0f7a56, 0 4px 20px rgba(6,214,160,0.3)',
        'clay-red': '0 8px 0 #b01c1c, 0 4px 20px rgba(255,107,107,0.4)',
        'clay-purple': '0 8px 0 #5b1fa0, 0 4px 20px rgba(155,93,229,0.4)',
        'tile': '0 3px 0 rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'wiggle': 'wiggle 0.5s ease-in-out',
        'slide-up': 'slide-up 0.4s cubic-bezier(0.34,1.56,0.64,1)',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,209,102,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(255,209,102,0)' },
        },
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'wiggle': {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px) scale(0.95)', opacity: '0' },
          to: { transform: 'translateY(0) scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
