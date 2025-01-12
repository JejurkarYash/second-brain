/** @type {import('tailwindcss').Config} */
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#6b04fd",
        secondary: "#d9ceff",
        "primary-hover": "#7816ff",
        "secondary-hover": "#c4aeff",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        satoshi: ["Satoshi", "sans-serif"], // defining the font
      },
    },
  },
  plugins: [tailwindcssAnimate],
};
