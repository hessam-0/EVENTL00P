// tailwind.config.js
const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    `./components/**/*.{vue,js,ts}`,
    `./layouts/**/*.vue`,
    `./pages/**/*.vue`,
    `./plugins/**/*.{js,ts}`,
    `./nuxt.config.{js,ts}`,
    `./app.vue`,
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Manrope"', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary: colors.lime, // Match app.config.ts
        gray: colors.zinc, // Match app.config.ts
      },
    },
  },
  plugins: [],
};
