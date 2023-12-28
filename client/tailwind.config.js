/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'montserrat': 'Montserrat, sans-serif',
        'dancing':'Dancing Script, cursive',
        'league': 'League Script, cursive'
      },
      boxShadow: {
        'xl': '4px 4px 60px rgba(0, 0, 0, 0.2)',
        'xlc': '4px 4px 60px 8px rgba(0, 0, 0, 0.2)',
        '2xln': '10px 10px 60px -8px rgba(0, 0, 0, 0.2)',
        '3xl': '20px 20px 40px -6px rgba(0, 0, 0, 0.2)',
      },
      objectPosition: {
        'center-bottom' : '0px -270px',
      }
    },
  },
  plugins: [],
}