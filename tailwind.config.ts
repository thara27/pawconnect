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
        orange: {
          DEFAULT: "#FF5722",
          light: "#FFF3EE",
          dark: "#E64A19",
        },
        teal: {
          DEFAULT: "#00897B",
          light: "#E0F2F1",
        },
        purple: {
          DEFAULT: "#7C3AED",
          light: "#EDE9FE",
        },
        amber: {
          DEFAULT: "#F59E0B",
          light: "#FFFBEB",
        },
        ink: "#111111",
        muted: "#555555",
        border: "#EBEBEB",
        bg: "#F7F7F7",
      },
    },
  },
};

export default config;
