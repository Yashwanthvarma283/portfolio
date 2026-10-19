/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Cabinet Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        script: ['"Mr Dafoe"', 'cursive'],
      },
      colors: {
        paper: {
          50:  '#FEFDFB',
          100: '#FAF9F6',
          200: '#F5F3EE',
          300: '#EDE9E0',
          400: '#E2DDD4',
          500: '#CFC9BE',
        },
        ink: {
          50:  '#F6F5F4',
          100: '#E8E6E3',
          200: '#CCC9C4',
          300: '#A8A49E',
          400: '#827D76',
          500: '#605B55',
          600: '#46413C',
          700: '#302C28',
          800: '#1E1B18',
          900: '#141210',
          950: '#0D0B09',
        },
        accent: {
          DEFAULT: '#C2622D',
          hover:   '#A84E1F',
          light:   '#F7EDE6',
          dark:    '#7A3A18',
        },
      },
      fontSize: {
        'hero': ['clamp(3.5rem, 8vw, 9rem)', { lineHeight: '0.92', letterSpacing: '-0.02em' }],
        'display': ['clamp(2.5rem, 5vw, 5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
      },
      transitionTimingFunction: {
        'out-strong':   'cubic-bezier(0.16, 1, 0.3, 1)',
        'in-out-sharp': 'cubic-bezier(0.77, 0, 0.175, 1)',
        'drawer':       'cubic-bezier(0.32, 0.72, 0, 1)',
      },
      transitionDuration: {
        '160': '160ms',
        '240': '240ms',
        '400': '400ms',
        '700': '700ms',
        '900': '900ms',
      },
    },
  },
  plugins: [],
};