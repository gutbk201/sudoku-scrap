/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {maxWidth: {
      '1/2': '50%',
      '1/3': '33%',
      '2/5': '40%',
    }},
  },
  plugins: [],
};

module.exports = config;
