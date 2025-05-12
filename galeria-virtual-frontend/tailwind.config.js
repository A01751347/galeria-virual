/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
  "./index.html",
  "./src/**/*.{js,jsx,ts,tsx}",
],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5A11CB',
          light: '#7B3FE4',
          dark: '#4A0DB3',
        },
        secondary: {
          DEFAULT: '#2575FC',
          light: '#4A8FFD',
          dark: '#0F5FD7',
        },
        neutral: {
          lightest: '#F8F9FA',
          light: '#E9ECEF',
          medium: '#DEE2E6',
          dark: '#6C757D',
          darkest: '#212529',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'monospace'],
        heading: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      boxShadow: {
        card: '0 2px 8px rgba(0, 0, 0, 0.1)',
        elevated: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      gridTemplateColumns: {
        gallery: 'repeat(auto-fill, minmax(300px, 1fr))',
      },
      height: {
        'screen-90': '90vh',
        'screen-80': '80vh',
      },
    },
  },
  plugins: [],
};