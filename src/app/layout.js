import { Inter, Playfair_Display } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import { GlobalProvider } from "../context-providers/global-provider";
import { PostHogInitializer } from "../context-providers/posthog-initializer";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
});

const fontPlayfairDisplay = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-playfair-display",
    weight: "400",
});

const fontGeistSans = localFont({
    src: [
        { path: "./fonts/geist-sans-latin-400-normal.woff2", weight: "400" },
        { path: "./fonts/geist-sans-latin-500-normal.woff2", weight: "500" },
    ],
    variable: "--font-geist-sans",
});

const fontGeistMono = localFont({
    src: "./fonts/geist-mono-latin-400-normal.woff2",
    variable: "--font-geist-mono",
});

export const metadata = {
    title: "Dao Ho",
    description: "expression of self",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body
                className={`${inter.variable} ${fontPlayfairDisplay.variable} ${fontGeistMono.variable} ${fontGeistSans.variable} scroll-smooth overflow-x-clip`}
            >
                <PostHogInitializer>
                    <GlobalProvider>{children}</GlobalProvider>
                </PostHogInitializer>
            </body>
            <Analytics />
        </html>
    );
}
