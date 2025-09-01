/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx,html}"
  ],
  theme: {
    extend: {
      colors: {
        abblue: {
          50: '#eaf5ff',
          100: '#d4eaff',
          200: '#a6d2ff',
          300: '#78baff',
          400: '#4aa2ff',
          500: '#1c8aff',
          600: '#006fe6',
          700: '#0057b4',
          800: '#003e82',
          900: '#002551',
        },
        aborange: {
          50: '#fff3e6',
          100: '#ffe7cc',
          200: '#ffce99',
          300: '#ffb666',
          400: '#ff9d33',
          500: '#ff8400',
          600: '#db7200',
          700: '#b76000',
          800: '#934e00',
          900: '#6f3c00',
        }
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Ubuntu", "Cantarell", "Noto Sans", "sans-serif"]
      }
    },
  },
  plugins: [],
}

