/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00F5FF', // Electric Cyan
          light: '#66F9FF',
          dark: '#00C2CC',
        },
        secondary: {
          DEFAULT: '#7B2CBF', // Deep Purple
          light: '#9D4EDD',
          dark: '#5A189A',
        },
        background: '#0B0C10', // Obsidian
        surface: '#1F2833',    // Dark Slate
        text: {
          high: '#E1E1E1',     // Frost White
          low: '#C5C6C7',      // Silver
        },
        alert: '#FF006E',      // Neon Rose
      },
      fontFamily: {
        rajdhani: ['Rajdhani', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
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
