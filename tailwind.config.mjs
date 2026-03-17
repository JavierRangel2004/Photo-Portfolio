/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#ffffff',
          dark: '#d4d4d4',
          light: '#a3a3a3',
        },
        secondary: {
          DEFAULT: '#D6B36A',
          dark: '#D6B36A',
        },
        accent: {
          DEFAULT: '#D6B36A',
          dim: 'rgba(214, 179, 106, 0.15)',
        },
        background: {
          DEFAULT: '#0A0A0A',
          alt: '#121212',
          light: '#1A1A1A',
          card: '#121212',
          hover: '#222222',
        },
        text: {
          DEFAULT: '#F5F1E8',
          light: '#ffffff',
          muted: '#A8A29E',
          dim: '#807A75',
        }
      },
      spacing: {
        xs: '0.5rem',
        sm: '0.75rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '3rem',
        '3xl': '4rem',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      transitionDuration: {
        fast: '200ms',
        base: '300ms',
        slow: '400ms',
      },
      borderRadius: {
        sm: '10px',
        md: '20px',
        lg: '50px',
      },
      zIndex: {
        background: '-1',
        base: '1',
        dropdown: '10',
        modal: '100',
        navbar: '1000',
      }
    },
  },
  plugins: [],
}
