/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [],
  
  purge: ['./index.html', './src/*.vue', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        wiggle: 'wiggle 1s ease-in-out',
        popup2: 'popup2 0.1s ease',
        popup3: 'popup3 2s ease infinite',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        popup2: {
          '0%': { transform: 'translateY(50%)' },
          '50%': { transform: 'translateY(25%)' },
          '75%': { transform: 'translateY(5%)' },
          '100%': { transform: 'translateY(0%)' },
        },
        popup3: {
          '0%': { transform: 'translateX(-66.66%)' },
          '50%': { transform: 'translateX(-33.33%)' },
          '75%': { transform: 'translateX(0%)' },
        },
      },
      colors: {
        bg:'#F5F9FF',
        bc: '#82ebeb',
        ec: '#f7b2a2',
        primary: '#2969FF',
        primary2: '#3b82f6',
        accent: '#8BC34A',
      },
      borderWidth: {
        10: '10px',
        "px": '1px',
      },
      inset: {
        '1/5': '20%',
        '2/5': '40%',
        '2.5': '0.625rem',
        '0.5': '0.125rem',
      },
      margin: {
        14.5: '3.7rem',
        '1/2': '50%',
      },
      scale: {
        101: '1.01',
        102: '1.01',
        103: '1.01',
      },
      width: {
        '13': '3.25rem',
        '18': '4.5rem',
        '42': '10.5rem',
        '50': '12.5rem',
        '76': '19rem',
      },
      height: {
        '13': '3.25rem',
        '18': '4.5rem',
        'safari-screen': '-webkit-fill-available',
      },
      maxHeight: {
        '4/5': '80%',
        '9/10': '90%',
      },
      minHeight: {
        '14': '3.5rem',
      }
    },
  },
  plugins: [],
  corePlugins: {
    // 禁用掉在小程序环境中不可能用到的 plugins
    container: false
  }
};
