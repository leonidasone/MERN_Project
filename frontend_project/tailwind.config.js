/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Instagram-inspired color palette
        'ig-primary': '#E4405F',
        'ig-secondary': '#833AB4',
        'ig-accent': '#F56040',
        'ig-blue': '#405DE6',
        'ig-yellow': '#FCCC63',
        'ig-pink': '#C13584',
        'ig-purple': '#833AB4',
        'ig-orange': '#FD1D1D',
        'ig-gradient-start': '#833AB4',
        'ig-gradient-middle': '#C13584',
        'ig-gradient-end': '#E4405F',
        'ig-dark': '#262626',
        'ig-gray': '#8E8E8E',
        'ig-light-gray': '#FAFAFA',
        'ig-border': '#DBDBDB',
        'ig-text': '#262626',
        'ig-text-light': '#8E8E8E',
      },
      fontFamily: {
        'instagram': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'ig-card': '0 2px 8px rgba(0, 0, 0, 0.1)',
        'ig-button': '0 1px 3px rgba(0, 0, 0, 0.12)',
      },
      borderRadius: {
        'ig': '8px',
        'ig-sm': '4px',
        'ig-lg': '12px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-ig': 'pulseIg 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseIg: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

