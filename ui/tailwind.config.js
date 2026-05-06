/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: { gold: { 500: '#D4AF37' } },
      keyframes: {
        shake: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '25%': { transform: 'translate(-4px, 2px)' },
          '50%': { transform: 'translate(4px, -2px)' },
          '75%': { transform: 'translate(-2px, 1px)' },
        }
      },
      animation: {
        squeeze: 'shake 0.3s cubic-bezier(.36,.07,.19,.97) both',
      }
    },
  },
  plugins: [],
}
