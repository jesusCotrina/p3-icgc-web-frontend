import type { Config } from 'tailwindcss';

/**
 * Paleta tomada del logo del ICGC: blanco de base y una escala de azules
 * que va del celeste del isotipo al azul marino del aro exterior.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F8FD',
          100: '#E3F0FB',
          200: '#C0DEF5',
          300: '#8FC5ED',
          400: '#56A5E1',
          500: '#2E8BE0', // celeste del isotipo
          600: '#1C6DD0',
          700: '#1452A3',
          800: '#103A7A',
          900: '#0B2545', // azul marino del aro
          950: '#06162B',
        },
        silver: {
          100: '#F4F6F8',
          200: '#E4E8EC',
          300: '#C9D1D9',
          400: '#A8B3BD',
        },
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(11, 37, 69, 0.04), 0 8px 24px -12px rgba(11, 37, 69, 0.18)',
        'card-hover': '0 2px 4px rgba(11, 37, 69, 0.06), 0 20px 40px -16px rgba(11, 37, 69, 0.28)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0B2545 0%, #1452A3 55%, #2E8BE0 100%)',
        'brand-soft': 'linear-gradient(180deg, #F2F8FD 0%, #FFFFFF 100%)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
