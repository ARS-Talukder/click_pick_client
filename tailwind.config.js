/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),

    function ({ addUtilities }) {
      const newUtilities = {
        ".no-scrollbar::-webkit-scrollbar": {
          display: "none"
        },
        '.no-scrollbar': {
          "-ms-overflow-style": "none",
          "scrollbar-width": "none"
        },

      };

      addUtilities(newUtilities);
    }
  ],
  daisyui: {
    themes: ["light"], // force light theme even in dark mode
  },
}

