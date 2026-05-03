export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 🌌 BASE
        background: {
          DEFAULT: "#F8FAFC",
          dark: "#070B10", // deeper + richer
        },

        // 🧩 SURFACE (cards)
        surface: {
          DEFAULT: "#FFFFFF",
          dark: "#0F172A", // less gray, more navy
        },

        // 🌫️ SOFT SURFACE
        surfaceAlt: {
          dark: "#111827",
        },

        // 🪶 MUTED
        muted: {
          DEFAULT: "#F1F5F9",
          dark: "#1E293B",
        },

        // 🧱 BORDER (subtle)
        border: {
          DEFAULT: "#E5E7EB",
          dark: "rgba(255,255,255,0.06)",
        },

        // ✍️ TEXT
        text: {
          primary: "#0F172A",
          secondary: "#64748B",
          darkPrimary: "#E5E7EB",
          darkSecondary: "#94A3B8",
        },

        // 🎯 ACCENT (STRONGER IDENTITY)
        accent: {
          DEFAULT: "#6366F1",
          secondary: "#8B5CF6",
          glow: "#7C3AED",
        },
      },

      // ✨ SHADOWS (premium depth)
      boxShadow: {
        card: "0 4px 20px rgba(0,0,0,0.25)",
        cardHover: "0 12px 40px rgba(0,0,0,0.45)",
        glow: "0 0 0 1px rgba(99,102,241,0.2), 0 8px 30px rgba(99,102,241,0.25)",
      },

      borderRadius: {
        xl: "14px",
        "2xl": "18px",
        "3xl": "24px",
      },
    },
  },
  plugins: [],
};