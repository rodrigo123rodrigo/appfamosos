import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'elite-black': '#0a0a0a',
        'elite-charcoal': '#1a1a1a',
        'elite-dark': '#0f0f0f',
        'midnight': '#0F1419',
        'navy': '#1A2332',
        'slate': '#2D3748',
        'white': '#FFFFFF',
        'pearl': '#F8F9FA',
        'gold': '#D4AF37',
        'gold-light': '#E8C468',
        'gold-dark': '#B8941F',
        'champagne': '#F7E7CE',
        'emerald': '#2D8659',
        'ruby': '#A73636',
        'silver': '#C0C0C0',
        'platinum': '#E5E4E2',
        'teal': '#0A9396',
        'copper': '#E76F51',
        'gray': '#6B7280',
        'gray-light': '#D3D3D3',
        'gray-mid': '#999999',
        'gray-dark': '#4A4A4A',
        'ivory': '#FAFAF8',
        'purple-neon': '#B565D8',
        'purple-dark': '#1a0b2e',
        'purple-mid': '#2d1b4e',
        'purple-light': '#4a2c6e',
      },
      fontFamily: {
        'display': ['var(--font-crimson)', 'Georgia', 'serif'],
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-crimson)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'purple': '0 4px 20px rgba(181, 101, 216, 0.4)',
        'purple-glow': '0 0 20px rgba(181, 101, 216, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.2s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out',
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
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #1A2332, #2D3748)',
        'gradient-gold': 'linear-gradient(135deg, #D4A574, #F7E7CE)',
        'gradient-dark': 'linear-gradient(180deg, #0F1419, #1A2332)',
        'gradient-emerald': 'linear-gradient(135deg, #2D8659, #3BA76D)',
        'gradient-teal': 'linear-gradient(135deg, #0A9396, #094E50)',
      },
    },
  },
  plugins: [],
}

export default config