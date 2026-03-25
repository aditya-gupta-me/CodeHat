/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Design system – dark-first palette
        "ch-dark": "#0d1117",
        "ch-surface": "#161b22",
        "ch-surface-raised": "#1c2333",
        "ch-border": "#30363d",
        "ch-accent": "#00e5a0",
        "ch-accent-hover": "#00cc8e",
        "ch-text": "#e6edf3",
        "ch-muted": "#8b949e",
        "ch-danger": "#f85149",
        "ch-success": "#3fb950",
        "ch-warning": "#d29922",
        // Legacy colors (kept for non-redesigned pages)
        nero: "#282828",
        gray7: "#121212",
        "dark-blue": "#2196f3",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        code: ["JetBrains Mono", "monospace"],
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
