import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
    // next-themes puts `dark` or `light` on <html>.
    darkMode: "selector",
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "light-foreground": "#262523",
                "light-background": "#f5f4f1",
                "dark-foreground": "#fff7f0",
                "dark-background": "#1a1917",
                background: "var(--background-color)",
                foreground: "var(--foreground-color)",
            },
            keyframes: {
                blink: {
                    "0%, 49%": { opacity: "1" },
                    "50%, 100%": { opacity: "0" },
                },
            },
            animation: {
                blink: "blink 1.1s step-end infinite",
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
