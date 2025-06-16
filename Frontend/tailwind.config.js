/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        primary: '#6C63FF',
        accent: '#00FFFF',
        neonPink: '#D946EF',
        success: '#10B981',
        bgDark: '#1F1B24',
        rose: { DEFAULT: '#f72585', /* rest... */ },
        fandango: { DEFAULT: '#b5179e', /* ... */ },
        grape: { DEFAULT: '#7209b7', /* ... */ },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
        grotesk: ['Space Grotesk', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
