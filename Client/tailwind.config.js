/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        "main-color": "#1B75BC",
        "second-color": "#8A8A8A",
        "third-color": "#F1F6FF",
        icon: "#1b75bc",
      },
      container: {
        center: true,
        padding: "1rem",
      },
      backgroundImage: {
        "background-contact": "url('/src/assets/contact/back-contact.png')",
        "card-contact": "url('/src/assets/contact/card-contant.png')",
        How_Work: "url('/src/assets/how_it_work/How_Work.png')",
        chat: "url('/src/assets/chat/chat.png')",
        orderBg: "url('/src/assets/Rectangle 4584.png')",
        bgCompanies: "url('/src/assets/companies/background.png')",
      },
      dropShadow: {
        smooth: "rgba(0, 0, 0, 0.1) 0px 2px 4px",
      },
      fontFamily: {
        sans: ['"DM Sans"', "sans-serif"],
      },
      screens: {
        'sm': '640px',
        // => @media (min-width: 640px) { ... }

        'md': '868px',
        // => @media (min-width: 768px) { ... }

        'lg': '1124px',
        // => @media (min-width: 1024px) { ... }

        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      }
    },
  },
  darkMode: "class",
  plugins: [require("tw-elements/dist/plugin.cjs")],
};
