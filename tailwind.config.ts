import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          50: '#f0f0ff',
          100: '#e1e1ff',
          200: '#c7c7ff',
          300: '#a0a0ff',
          400: '#7878ff',
          500: '#5151ff',
          600: '#3a3af0',
          700: '#2c2cd1',
          800: '#2828ab',
          900: '#25258a',
          950: '#141440'
        },
        dark: {
          900: '#0a0a0a',
          800: '#121212',
          700: '#1a1a1a',
          600: '#222222',
          500: '#2a2a2a'
        },
        gold: '#FFD700',
        deepBlue: {
          900: '#0a1025',
          800: '#0f172a',
          700: '#1e293b',
          600: '#334155',
          500: '#475569'
        },
        purple: {
          900: '#2e1065',
          800: '#4c1d95',
          700: '#6d28d9',
          600: '#7c3aed',
          500: '#8b5cf6'
        }
      },
      fontFamily: {
        sans: ['var(--font-poppins)', 'var(--font-inter)', 'var(--font-dm-sans)', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'hero-pattern': 'linear-gradient(to right bottom, rgba(10, 16, 37, 0.8), rgba(46, 16, 101, 0.8))',
        'card-gradient': 'linear-gradient(to right bottom, rgba(28, 25, 73, 0.8), rgba(46, 16, 101, 0.7))',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'bento': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'bento-hover': '0 10px 25px rgba(0, 0, 0, 0.2)',
      },
      borderRadius: {
        'bento': '14px',
      },
    },
  },
  plugins: [],
} satisfies Config;
