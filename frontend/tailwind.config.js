/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'flex-green': '#0f5132',
        'flex-green-dark': '#0a3c26',
        'flex-green-light': '#1a6844',
      },
      fontFamily: {
        'serif': ['serif'],
      },
    },
  },
  plugins: [],
}
