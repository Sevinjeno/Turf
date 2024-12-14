/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Update this path based on your project structure
  ],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '976px',
      xl: '1440px',
    },
    extend: {
      colors:{
        myBlue:"#0A32B3",
        myPink:"#BD365D",
      }
    },
  },
  plugins: [],
};