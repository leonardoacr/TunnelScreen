/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
  theme: {
    fontFamily: {
      //  sans: ['Montserrat', 'Helvetica', 'Arial', 'sans-serif'],
      sans: ['Roboto', 'Helvetica', 'Arial', 'sans-serif'],
    },
  },
}
