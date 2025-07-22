// postcss.config.js

export default {
  plugins: {
    '@tailwindcss/postcss': {}, // <-- これが Vite での正しい形式です
    autoprefixer: {},
  },
};