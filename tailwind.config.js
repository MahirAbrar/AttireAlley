/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        primary: "#57a7a8",
        secondary: "#ff7e67",
        background: "#f8fbfc",
        accent: "#ffd166",
        backgroundDark: "#030607",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: ["prettier-plugin-tailwindcss", require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          primary: "#57a7a8",
          secondary: "#ff7e67",
          accent: "#ffd166",
          neutral: "#f8fbfc",
          "base-100": "#ffffff",
          "base-200": "#f8fbfc",
          "base-300": "#f1f5f9",
        },
      },
    ],
  },
};
