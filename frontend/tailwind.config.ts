import type { Config } from "tailwindcss";

  const config: Config = {
    content: [
      "./app/**/*.{ts,tsx}",
      "./components/**/*.{ts,tsx}",
      "./lib/**/*.{ts,tsx}",],
    theme: {
      extend: {
        colors: {
          // Brand palette extracted from TI logos
          background: {
            DEFAULT: "#0a0a0a",
            secondary: "#111111",
            elevated: "#1a1a1a",
            card: "#161616",
          },
          gold: {
            DEFAULT: "#c9a84c",
            light: "#dbbe6e",
            dark: "#b8860b",
            muted: "#a07830",
          },
          silver: {
            DEFAULT: "#a8a8a8",
            light: "#d4d4d4",
            dark: "#6b6b6b",
          },
          brand: {
            white: "#f5f5f5",
            black: "#0a0a0a",
          },
          border: {
            DEFAULT: "#2a2a2a",
            gold: "#c9a84c40",
            subtle: "#1e1e1e",
          },},
        fontFamily: {
          sans: ["var(--font-inter)", "Inter", "sans-serif"],
          display: ["var(--font-montserrat)", "Montserrat", "sans-serif"],
        },
        backgroundImage: {
          "gold-gradient": "linear-gradient(135deg, #c9a84c 0%, #b8860b 50%, #c9a84c 100%)",
          "dark-gradient": "linear-gradient(180deg, #0a0a0a 0%, #111111 100%)",
          "card-gradient": "linear-gradient(145deg, #1a1a1a 0%, #111111 100%)",
        },boxShadow: {
          "gold-glow": "0 0 20px rgba(201, 168, 76, 0.15)",
          "gold-glow-strong": "0 0 40px rgba(201, 168, 76, 0.3)",
          "card": "0 4px 24px rgba(0, 0, 0, 0.6)",
          "card-hover": "0 8px 40px rgba(0, 0, 0, 0.8)",
        },
        animation: {
          "fade-in": "fadeIn 0.4s ease-out",
          "slide-up": "slideUp 0.5s ease-out",
          "slide-in-right": "slideInRight 0.3s ease-out",
          "pulse-gold": "pulseGold 2s ease-in-out infinite",
          "shimmer": "shimmer 1.8s linear infinite",
        },
        keyframes: {
          fadeIn: {
            "0%": { opacity: "0" },
            "100%": { opacity: "1" },
          },
          slideUp: {
            "0%": { opacity: "0", transform: "translateY(20px)" },
            "100%": { opacity: "1", transform: "translateY(0)" },
          },
          slideInRight: {
            "0%": { opacity: "0", transform: "translateX(100%)" },
            "100%": { opacity: "1", transform: "translateX(0)" },
          },
          pulseGold: {
            "0%, 100%": { boxShadow: "0 0 20px rgba(201, 168, 76, 0.15)" },
            "50%": { boxShadow: "0 0 40px rgba(201, 168, 76, 0.35)" },
          },
          shimmer: {
            "0%": { backgroundPosition: "-200% 0" },
            "100%": { backgroundPosition: "200% 0" },
          },
        },backdropBlur: {
          xs: "2px",
        },
      },
    },
    plugins: [],
  };

  export default config;