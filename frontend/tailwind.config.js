/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#09090B",
        },
        surface: {
          DEFAULT: "#FAFAFA",
          dark: "#18181B",
        },
        muted: {
          DEFAULT: "#F4F4F5",
          dark: "#27272A",
        },
        border: {
          DEFAULT: "#E4E4E7",
          dark: "#27272A",
        },
        text: {
          primary: "#09090B",
          secondary: "#71717A",
          darkPrimary: "#FAFAFA",
          darkSecondary: "#A1A1AA",
        },
        accent: {
          DEFAULT: "#18181B",
          secondary: "#52525B",
          glow: "#27272A",
          dark: "#FFFFFF",
        },
      },
      boxShadow: {
        card: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        cardHover: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      },
      borderRadius: {
        xl: "12px", 
        "2xl": "16px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};