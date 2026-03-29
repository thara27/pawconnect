import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ["var(--font-fraunces)", "serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
      colors: {
        brand: {
          DEFAULT: "#FF5722",
          light: "#FFF3EE",
          dark: "#E64A19",
        },
        sage: {
          DEFAULT: "#00897B",
          light: "#E0F2F1",
        },
        ink: "#111111",
        muted: "#555555",
        border: "#EBEBEB",
        bg: "#F7F7F5",
        cream: "#FFFBF5",
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "14px",
        xl: "20px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 4px rgba(0,0,0,0.06)",
        md: "0 4px 16px rgba(0,0,0,0.09)",
        lg: "0 8px 32px rgba(0,0,0,0.12)",
        brand: "0 4px 14px rgba(255,87,34,0.35)",
      },
    },
  },
};

export default config;
