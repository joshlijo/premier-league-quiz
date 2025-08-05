// tailwind.config.js
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.8s ease-out forwards",
        "netRipple": "netRipple 0.6s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0, transform: "translateY(20px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        netRipple: {
          "0%": { transform: "scale(1)", opacity: 0.7 },
          "50%": { transform: "scale(1.2)", opacity: 1 },
          "100%": { transform: "scale(1)", opacity: 0 },
        },
      },
    },
  },
  plugins: [],
};
