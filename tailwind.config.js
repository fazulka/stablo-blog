const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#FAF6F0",
          50: "#FFFDF9",
          100: "#FAF6F0",
          200: "#F0E9DD"
        },
        ink: {
          DEFAULT: "#241F35",
          soft: "#3F3850",
          muted: "#6B6481"
        },
        rose: {
          DEFAULT: "#E8809E",
          light: "#FCE6EC",
          soft: "#F4B5C6",
          dark: "#C4607E",
          deep: "#9B4866"
        },
        azure: {
          DEFAULT: "#7BA0C4",
          light: "#DEEAF5",
          soft: "#A8C0D9",
          dark: "#5A82A8",
          deep: "#3E5F80"
        }
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-caveat)", ...defaultTheme.fontFamily.sans]
      },
      aspectRatio: {
        "4/3": "4 / 3",
        "3/2": "3 / 2"
      },
      backgroundImage: {
        "rose-glow":
          "radial-gradient(circle at 30% 30%, rgba(232,128,158,0.18), transparent 60%)",
        "azure-glow":
          "radial-gradient(circle at 70% 30%, rgba(123,160,196,0.20), transparent 60%)",
        "duo-glow":
          "radial-gradient(circle at 20% 20%, rgba(232,128,158,0.16), transparent 55%), radial-gradient(circle at 80% 80%, rgba(123,160,196,0.18), transparent 55%)"
      },
      keyframes: {
        "wiggle": {
          "0%, 100%": { transform: "rotate(-2deg)" },
          "50%": { transform: "rotate(2deg)" }
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" }
        }
      },
      animation: {
        "wiggle": "wiggle 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
