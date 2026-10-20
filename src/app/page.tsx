"use client";
import React, { useState } from "react";
import { useGlobal } from "../context-providers/global-provider";

import MobileNav from "./components/mobile-nav";
import FrontPage from "./components/front-page";
import KoiPond, { type PondStats } from "./components/koi-pond/koi-pond";
import TopNav from "./components/top-nav";

export default function Home() {
    const { isLight, isMobile, toggleTheme } = useGlobal();
    const [stats, setStats] = useState<PondStats>({ koi: 0, pellets: 0 });

    if (isMobile === null) return null;

    return (
        <div
            id="mainPage"
            className={`relative min-h-screen w-full bg-background transition-colors duration-300 ${isLight ? "light" : "dark"}`}
        >
            <KoiPond isLight={isLight} onStats={setStats} className="absolute inset-0 h-full w-full" />
            {isMobile ? (
                <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <TopNav isLight={isLight} toggleTheme={toggleTheme} />
            )}
            <main className="relative z-20 flex flex-col">
                <FrontPage isLight={isLight} stats={stats} />
            </main>
        </div>
    );
}
