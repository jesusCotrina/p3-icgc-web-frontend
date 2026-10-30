import type { Config } from 'tailwindcss';

/**
 * Paleta institucional del ICGC (oct. 2026). Usos:
 *   brand-900 #173B65  azul institucional: header, botones principales, títulos destacados
 *   brand-700 #244F7D  azul secundario: fondos de secciones, hover, elementos gráficos
 *   brand-100 #DCE8F1  azul suave: fondos de tarjetas y bloques informativos
 *   brand-50  #F2F5F7  gris azulado: fondos alternativos de secciones
 *   arena     #F4F0E7  secciones de proyectos, comunidades y testimonios
 *   dorado    #B68A52  pequeños acentos, etiquetas y detalles decorativos
 *   texto     #263746  texto principal
 * El resto de la escala brand son pasos intermedios entre esos azules.
 */
const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F2F5F7', // gris azulado
          100: '#DCE8F1', // azul suave
          200: '#BFD3E4',
          300: '#95B4D0',
          400: '#6A92B8',
          500: '#3F6D99',
          600: '#2C5D8F',
          700: '#244F7D', // azul secundario
          800: '#1D4571',
          900: '#173B65', // azul institucional
          950: '#0F2944',
        },
        silver: {
          100: '#F2F5F7',
          200: '#E2E8EE',
          300: '#C9D3DC',
          400: '#A6B4C1',
        },
        arena: '#F4F0E7',
        dorado: {
          DEFAULT: '#B68A52',
          // Sobre fondos azul oscuro o fotos: más claro para que se lea
          claro: '#DCC19A',
          // Para letra chica sobre blanco: el dorado puro no llega al contraste mínimo (4.5:1)
          oscuro: '#8C6A3D',
        },
        texto: '#263746',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(23, 59, 101, 0.04), 0 8px 24px -12px rgba(23, 59, 101, 0.18)',
        'card-hover': '0 2px 4px rgba(23, 59, 101, 0.06), 0 20px 40px -16px rgba(23, 59, 101, 0.28)',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #173B65 0%, #244F7D 100%)',
        'brand-soft': 'linear-gradient(180deg, #F2F5F7 0%, #FFFFFF 100%)',
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
        // Hero de /nosotros: el logo entra creciendo y luego flota suave
        'logo-entra': {
          '0%': { opacity: '0', transform: 'scale(0.82) rotate(-8deg)' },
          '100%': { opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        flotar: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.5s ease-out both',
        'fade-up-lento': 'fade-up 0.9s cubic-bezier(0.22, 1, 0.36, 1) both',
        'logo-entra': 'logo-entra 1s cubic-bezier(0.22, 1, 0.36, 1) 0.2s both',
        flotar: 'flotar 6s ease-in-out 1.2s infinite',
        marquee: 'marquee 30s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;
