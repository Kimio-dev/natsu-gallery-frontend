// tailwind.config.js

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        'xs': '475px', 
      },
      lineHeight: {
        'extra-loose': '2.2',
        '10': '2.5rem',
      },
    },
  },
  plugins: [
  ],
}