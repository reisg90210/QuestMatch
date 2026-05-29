/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#7c3aed', // purple-600
          light: '#a78bfa',
          dark: '#5b21b6',
        },
        secondary: {
          DEFAULT: '#06b6d4', // cyan-500
          light: '#22d3ee',
          dark: '#0891b2',
        },
        accent: {
          pink: '#ec4899',
          green: '#10b981',
          red: '#ef4444',
        },
        dark: {
          DEFAULT: '#0a0a0f',
          card: '#1a1a2e',
          surface: '#14141f',
          input: '#1e1e32',
          border: '#2a2a3e',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      animation: {
        'heartbeat': 'heartbeat 0.6s ease-in-out infinite',
        'bounce-in': 'bounceIn 0.5s ease-out',
        'fade-up': 'fadeUp 0.3s ease-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        },
        bounceIn: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '60%': { transform: 'scale(1.1)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        fadeUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
