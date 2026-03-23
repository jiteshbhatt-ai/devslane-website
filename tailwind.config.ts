import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#87CEEB",
        foreground: "#1e293b",
        "devslane-purple": "#6B21A8",
        "devslane-glow": "#C084FC",
        "neon-purple": "#A855F7",
        "neon-blue": "#3B82F6",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        serif: ["var(--font-dm-serif)", "serif"],
      },
      animation: {
        "neon-pulse": "neonPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.8s ease-out forwards",
        "fade-in": "fadeIn 1s ease-out forwards",
        "glow-bar": "glowBar 2s ease-in-out infinite",
      },
      keyframes: {
        neonPulse: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(60px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glowBar: {
          "0%, 100%": { boxShadow: "0 0 10px #C084FC, 0 0 20px #C084FC" },
          "50%": { boxShadow: "0 0 20px #C084FC, 0 0 40px #C084FC, 0 0 60px #6B21A8" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
