/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Overpass", "Arial", "sans-serif"],
      },
      colors: {
        textRegular: "#525252",
        textLight: "#737373",
        textExtraLight: "#a3a3a3",
        textDark: "#404040",
        textExtraDark: "#262626",
        borderExtraLightGray: "#f3f4f6",
        borderLightGray: "#e5e7eb",
        borderGray: "#d1d5db",
        borderDarkGray: "#6b7280",
        borderExtraDarkGray: "#374151",
        blueLighter: "#93c5fd",
        blueLight: "#60a5fa",
        blueBase: "#2096F3",
        blueDark: "#098df2",
        error: "#dc2626",
        orangeLight: "#ff9e66",
        orangeBase: "#FF904D",
        orangeDark: "#ff8138",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
