/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ASPETi PLUS - KROK 8: FINÁLNÍ INTEGRACE
        // Barevné palety podle specifikace: --sage a --navy
        sage: {
          50: '#F7FAF9',
          100: '#E8F0F1',
          200: '#DDEBE3', // --sage
          300: '#C5D3D8', // --sage-dark
          400: '#B8C7CB', // --sage-darkest
          500: '#A1B5B9',
          600: '#8A9FA4',
          700: '#73898F',
          800: '#5C737A',
          900: '#455D65',
        },
        navy: {
          50: '#F0F4F8',
          100: '#DCE6ED',
          200: '#B8CCD7',
          300: '#94B2C1',
          400: '#7098AB',
          500: '#4C7E95', // --navy-light
          600: '#38647D',
          700: '#244A65', // --navy
          800: '#1A3A5A', // --navy-light
          900: '#0F2A43', // --navy-dark
        },
        // Legacy primary colors (pro kompatibilitu)
        primary: {
          50: '#E7EFEA',
          100: '#D1E1D9',
          200: '#A3C3B3',
          300: '#75A48D',
          400: '#478667',
          500: '#2F4B40',
          600: '#263D34',
          700: '#1D2F28',
          800: '#14211C',
          900: '#0B1310',
        },
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}