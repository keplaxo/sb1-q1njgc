/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      animation: {
        twinkle: 'twinkle 2s infinite',
        float: 'float 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};