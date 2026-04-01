module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        brand: {
          50: "#e9fff1",
          100: "#c5ffd7",
          200: "#92ffb4",
          300: "#5eff90",
          400: "#2ef56f",
          500: "#11da52",
          600: "#06ad3e",
          700: "#0a8734",
          800: "#0c6a2d",
          900: "#0d5728"
        },
        ink: {
          900: "#06142b",
          800: "#0e2141",
          700: "#16315b"
        }
      },
      boxShadow: {
        card: "0 12px 30px -18px rgba(6, 20, 43, 0.55)"
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        "fade-up": "fade-up 500ms ease forwards"
      }
    }
  },
  plugins: []
};
