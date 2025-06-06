/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#635FC7",
        "primary-light": "#A8A4FF",
        secondary: "#828FA3",
        "background-light": "#F4F7FD",
        "background-dark": "#20212C",
        "board-light": "#FFFFFF",
        "board-dark": "#2B2C37",
      },
    },
  },
  plugins: [],
};
