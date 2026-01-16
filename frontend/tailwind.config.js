/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",  // <--- This scans EVERY file in src
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}