/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flex-green': '#1C4B4B',
        'flex-green-dark': '#0a3c26',
        'flex-green-light': '#1a6844',
        'natural': '#0f0f0eff',
        'vanilla': '#f5f2e0ff',
      },
      fontFamily: {
        'serif': ['serif'],
      },
    },
  },
  plugins: [],
}
