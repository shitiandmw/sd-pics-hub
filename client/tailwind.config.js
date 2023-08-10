/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  purge: ['./index.html', './src/*.vue', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bc: '#82ebeb',
        ec: '#f7b2a2',
      },
      borderWidth: {
        10: '10px',
      },
      inset: {
        '1/5': '20%',
        '2/5': '40%',
        '2.5': '0.625rem',
        '0.5': '0.125rem',
      },
      margin: {
        14.5: '3.7rem',
      },
      scale: {
        101: '1.01',
        102: '1.01',
        103: '1.01',
      },
      width: {
        '13': '3.25rem',
        '18': '4.5rem',
      },
      height: {
        '13': '3.25rem',
        '18': '4.5rem',
      },
      minHeight: {
        '14': '3.5rem',
      }
    },
  },
  plugins: [],
};
