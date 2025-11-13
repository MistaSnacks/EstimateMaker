/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          green: '#10B981',
          greenDark: '#059669',
          greenLight: '#34D399',
        },
      },
    },
  },
  plugins: [],
}
