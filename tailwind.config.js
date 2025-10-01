/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4361ee',
          dark: '#3a56e3',
          light: '#5c74f0'
        },
        secondary: {
          DEFAULT: '#3a0ca3',
          dark: '#2e0984',
          light: '#4d26b5'
        },
        accent: {
          DEFAULT: '#f72585',
          dark: '#e31a77',
          light: '#f94897'
        },
        success: {
          DEFAULT: '#4cc9f0',
          dark: '#28bfee',
          light: '#6fd3f2'
        },
        warning: {
          DEFAULT: '#f8961e',
          dark: '#e7840c',
          light: '#f9a744'
        },
        info: {
          DEFAULT: '#4895ef',
          dark: '#1d7de9',
          light: '#6faaf2'
        }
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        card: '0 4px 6px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 10px 15px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
};