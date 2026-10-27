"use client";

import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";

export default function Blog() {
    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
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
