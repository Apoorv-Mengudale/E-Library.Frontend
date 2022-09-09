/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require("flowbite/plugin")],
};
