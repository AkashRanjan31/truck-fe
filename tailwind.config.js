/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f97316',
          dark: '#ea580c',
          light: '#fed7aa',
          50: '#fff7ed',
        },
        surface: {
          DEFAULT: '#1e293b',
          dark: '#0f172a',
          light: '#334155',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Arial', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      boxShadow: {
        'glow-orange': '0 0 30px rgba(249, 115, 22, 0.3)',
        'glow-red': '0 0 40px rgba(239, 68, 68, 0.5)',
        'card': '0 4px 24px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
