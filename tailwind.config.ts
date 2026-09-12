import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-cormorant)", "Georgia", "serif"],
        sans: ["var(--font-poppins)", "Arial", "Helvetica", "sans-serif"],
        mono: ["var(--font-poppins)", "monospace"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      letterSpacing: {
        tight: "-0.025em",
        normal: "0",
        wide: "0.025em",
        wider: "0.05em",
        widest: "0.1em",
        'luxury-wide': "0.08em",
        'luxury-wider': "0.12em",
      },
      lineHeight: {
        'serif-tight': '1.15',
        'serif-normal': '1.25',
        'serif-relaxed': '1.4',
        'sans-tight': '1.35',
        'sans-normal': '1.5',
        'sans-relaxed': '1.65',
      },
    },
  },
  plugins: [],
};

export default config;