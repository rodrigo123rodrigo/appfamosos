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
        'ivory': '#FFFEF7',
        'black': '#0A0A0A',
        'gold': '#D4A853',
        'gold-light': '#F0E5C9',
        'gray': '#6B7280',
        'gray-light': '#F9FAFB',
      },
      fontFamily: {
        'display': ['var(--font-crimson)', 'Georgia', 'serif'],
        'body': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'sans': ['var(--font-inter)', 'system-ui', 'sans-serif'],
        'serif': ['var(--font-crimson)', 'Georgia', 'serif'],
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
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
        'gradient-gold': 'linear-gradient(135deg, #D4A853, #B8941F)',
      },
    },
  },
  plugins: [],
}

export default config