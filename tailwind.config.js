const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      gray: colors.trueGray,
    },
    extend: {
      boxShadow: {
        hard: '2px 2px 0 0 rgba(0, 0, 0, 0.69)',
      },
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      boxShadow: ['active'],
      pointerEvents: ['disabled'],
    },
  },
  plugins: [],
};
