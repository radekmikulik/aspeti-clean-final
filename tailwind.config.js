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
    },
  },
  plugins: [],
}