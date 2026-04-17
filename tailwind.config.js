/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'Inter', 'Geist', 'sans-serif'],
        display: ['Source Sans 3', 'Open Sans', 'Inter', 'Geist', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#305d73',
          dark: '#1e3d4e',
          light: '#4a7d97',
          50: '#e8f0f4',
        },
        gold: {
          DEFAULT: '#f9b935',
          dark: '#b8831a',
        },
        canvas: '#f4f7f9',
        surface: '#ffffff',
        ink: {
          DEFAULT: '#1a1a1a',
          secondary: '#4b5563',
          muted: '#9ca3af',
        },
        line: '#d1d5db',
        success: '#16a34a',
        error: '#dc2626',
        warning: '#d97706',
        'navy': {
          900: '#111827',
          800: '#162034',
          700: '#1c2940',
          600: '#243452',
        },
        'accent': {
          DEFAULT: '#1773E2',
          light: '#3d8de6',
          dark: '#1259b8',
        },
        'brand-green': {
          DEFAULT: '#10B981',
          light: '#34d399',
          dark: '#059669',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
