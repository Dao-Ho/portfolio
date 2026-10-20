"use client";

import { useGlobal } from "../../context-providers/global-provider";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";

export default function Blog() {
    const { isLight, isMobile, toggleTheme } = useGlobal();

    if (isMobile === null) return null;

    return (
        <div className={`min-h-screen w-full bg-background text-foreground ${isLight ? "light" : "dark"}`}>
            {isMobile ? (
                <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <TopNav isLight={isLight} toggleTheme={toggleTheme} />
            )}
            <main className="flex min-h-screen items-center justify-center px-6 font-geistMono">
                <p className="text-[14px] lowercase tracking-[0.02em] opacity-60">
                    coming soon.
                    <span
                        aria-hidden="true"
                        className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                    />
                </p>
            </main>
        </div>
    );
}
