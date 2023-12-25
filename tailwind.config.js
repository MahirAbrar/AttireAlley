/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  // change to media for dark mode
  darkMode: "media",
  theme: {
    extend: {
      colors: {
        text: "#0a1414",
        background: "#f8fbfc",
        primary: "#57a7a8",
        secondary: "#aab9d3",
        accent: "#858ec0",
        textDark: "#ebf5f5",
        backgroundDark: "#030607",
        primaryDark: "#57a7a8",
        secondaryDark: "#2b3a54",
        accentDark: "#3e4779",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss"],
};
