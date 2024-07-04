/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      opacity: {
        '15': '0.15',
        '35': '0.35',
        '65': '0.65',
       },
      keyframes: {
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
      },
      animation: {
        fadeOut: 'fadeOut 1s ease-out forwards',
      },
    },
  },
  plugins: [],
};
