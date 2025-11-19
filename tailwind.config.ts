/** @type {import('tailwindcss').Config} */


module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './public/icons/*.{svg}',
  ],
  prefix: "",
  
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      'light-foreground': '#262523',
      'light-background': '#fff7f0',
      'dark-foreground': '#fff7f0',
      'dark-background': '#1a1921',
      'text-hover': '#3c7cff',
      'background': 'var(--background-color)',
      'foreground': 'var(--foreground-color)',

    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        inter: 'var(--font-inter)',
        bebas: 'var(--font-bebas)',
        roboto: 'var(--font-roboto)',
        libre: 'var(--font-libre)',
        robotoCondensed: 'var(--font-roboto-condensed)',
        oswald: 'var(--font-oswald)',
        sourceSans3: 'var(--font-source-sans-3)',
      },
    },
  },
  plugins: [require("tailwindcss-animate"),
    function({ addBase, theme }: { addBase: any, theme: any }) {
      addBase({
        ':root': {
          '--background-color': theme('colors.light-background'),
          '--foreground-color': theme('colors.light-foreground'),
        },
        '.dark': {
          '--background-color': theme('colors.dark-background'),
          '--foreground-color': theme('colors.dark-foreground'),
        },
      });
    },
  ],
};