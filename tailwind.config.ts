import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import plugin from "tailwindcss/plugin";

export default {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./app/**/*.{js,jsx,ts,tsx}",
        "./src/**/*.{js,jsx,ts,tsx}",
        "./public/icons/*.{svg}",
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
            "light-foreground": "#262523",
            "light-background": "#f5f4f1",
            "dark-foreground": "#fff7f0",
            "dark-background": "#1a1917",
            "text-hover": "#3c7cff",
            background: "var(--background-color)",
            foreground: "var(--foreground-color)",
        },
        extend: {
            keyframes: {
                blink: {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
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
                blink: "blink 1.1s step-end infinite",
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
            },
            fontFamily: {
                inter: "var(--font-inter)",
                playfairDisplay: "var(--font-playfair-display)",
                geistMono: "var(--font-geist-mono)",
                geistSans: "var(--font-geist-sans)",
            },
        },
    },
    plugins: [
        animate,
        plugin(({ addBase, theme }) => {
            addBase({
                // Dark text on a light page needs a heavier mix to read as clearly (both land near 4.5:1).
                ":root": {
                    "--background-color": theme("colors.light-background"),
                    "--foreground-color": theme("colors.light-foreground"),
                    "--muted-color": "color-mix(in srgb, var(--foreground-color) 64%, transparent)",
                },
                ".dark": {
                    "--background-color": theme("colors.dark-background"),
                    "--foreground-color": theme("colors.dark-foreground"),
                    "--muted-color": "color-mix(in srgb, var(--foreground-color) 50%, transparent)",
                },
            });
        }),
    ],
} satisfies Config;
