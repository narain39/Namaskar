/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          850: '#1a2234',
          950: '#0d1117',
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
