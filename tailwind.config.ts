import type { Config } from "tailwindcss";

const config: Config = {
  // ダークモード：classベース（next-themesと連携）
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ブランドカラー（後から変更しやすいよう集約）
      colors: {
        brand: {
          50: "#eff6ff",
          100: "#dbeafe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#1e3a8a",
        },
      },
      // Google Fontsフォント（layout.tsxで設定）
      fontFamily: {
        sans: ["var(--font-noto-sans-jp)", "var(--font-inter)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      // ガラスモーフィズム用のブラー
      backdropBlur: {
        xs: "2px",
      },
      // アニメーション
      animation: {
        "fade-in": "fadeIn 0.3s ease-in-out",
        "slide-up": "slideUp 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
