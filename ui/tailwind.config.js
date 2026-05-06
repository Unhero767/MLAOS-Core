/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        'glitch-shake': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-5px, 5px) skewX(2deg)' },
          '40%': { transform: 'translate(-5px, -5px) skewX(-2deg)' },
          '60%': { transform: 'translate(5px, 5px)' },
          '80%': { transform: 'translate(5px, -5px)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100%)' }
        }
      },
      animation: {
        'squeeze': 'glitch-shake 0.3s cubic-bezier(.36,.07,.19,.97) both',
        'scan': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
