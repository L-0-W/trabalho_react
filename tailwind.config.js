const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/*.{js,jsx,ts,tsx}", // Garanta que este caminho cobre seus arquivos React
    "./index.html"
  ],
  theme: {
    extend: {
      fontFamily: {
        // Define 'Inter' como a fonte principal
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
}