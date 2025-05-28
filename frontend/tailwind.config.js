/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontWeight: {
        'extra-bold': '800',
        'black': '900',
        'ultra-black': '950',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', fontWeight: '700' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', fontWeight: '700' }],
        'base': ['1rem', { lineHeight: '1.5rem', fontWeight: '600' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '700' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '800' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', fontWeight: '800' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', fontWeight: '900' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', fontWeight: '900' }],
        '5xl': ['3rem', { lineHeight: '1', fontWeight: '900' }],
        '6xl': ['3.75rem', { lineHeight: '1', fontWeight: '900' }],
        '7xl': ['4.5rem', { lineHeight: '1', fontWeight: '900' }],
        '8xl': ['6rem', { lineHeight: '1', fontWeight: '900' }],
        '9xl': ['8rem', { lineHeight: '1', fontWeight: '900' }],
      },
      boxShadow: {
        'bold': '0 10px 25px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.15)',
        'bold-lg': '0 20px 40px -4px rgba(0, 0, 0, 0.4), 0 8px 16px -4px rgba(0, 0, 0, 0.2)',
        'bold-xl': '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        'bold-2xl': '0 35px 60px -12px rgba(0, 0, 0, 0.6)',
        'inner-bold': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
        '6': '6px',
        '8': '8px',
        '10': '10px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
      },
      colors: {
        'bold-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554',
        },
        'bold-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        }
      },
      animation: {
        'bounce-bold': 'bounce 1s infinite',
        'pulse-bold': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'ping-bold': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
        '104': '1.04',
        '106': '1.06',
        '107': '1.07',
        '108': '1.08',
      }
    },
  },
  plugins: [],
}

