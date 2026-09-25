/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F1E7D2",
          light: "#F8F1E3",
          dark: "#E5D8BB",
        },
        ink: {
          DEFAULT: "#232C3D",
          700: "#2E3A4F",
          500: "#4B5A72",
          300: "#8792A2",
          100: "#D8DCE3",
        },
        vermilion: {
          DEFAULT: "#B9451D",
          dark: "#8F3416",
          light: "#D66B41",
        },
        sage: {
          DEFAULT: "#7C8B6F",
          dark: "#5E6B54",
          light: "#A4B097",
        },
        ochre: {
          DEFAULT: "#C08A28",
          dark: "#96691C",
          light: "#DCAE5C",
        },
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["\"Source Serif 4\"", "Georgia", "serif"],
      },
      backgroundImage: {
        "paper-grain":
          "radial-gradient(circle at 1px 1px, rgba(35,44,61,0.06) 1px, transparent 0)",
      },
      backgroundSize: {
        grain: "18px 18px",
      },
      boxShadow: {
        postcard: "0 1px 0 rgba(35,44,61,0.08), 0 12px 24px -12px rgba(35,44,61,0.35)",
        stamp: "0 0 0 1px rgba(35,44,61,0.15), 0 0 0 4px rgba(241,231,210,1), 0 0 0 5px rgba(35,44,61,0.15)",
      },
      borderRadius: {
        card: "0.25rem",
      },
    },
  },
  plugins: [],
};
