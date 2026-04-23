"use client";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { useGlobal } from "../context-providers/global-provider";

import MobileNav from "./components/mobile-nav";
import FrontPage from "./components/front-page";
import ExperiencePage from "./components/experience";
import GlobalDock from "./components/global-dock";

export default function Home() {
    const { isLight, toggleTheme } = useGlobal();
    const oldScrollY = useRef(0);
    const [isMobile, setIsMobile] = useState(true);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };
        oldScrollY.current = window.scrollY;
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div
            id="mainPage"
            className={`w-[100vw] min-h-[100vh] overflow-y-scroll transition-colors duration-300 bg-background ${
                isLight ? "light" : "dark"
            }`}
        >
            <div className={`flex flex-col absolute z-20 w-[100vw] items-center`}>
                {isMobile && <MobileNav isLight={isLight} toggleTheme={toggleTheme} />}
                <FrontPage isLight={isLight} />
                <ExperiencePage isLight={isLight} />
            </div>
            {!isMobile && <GlobalDock isLight={isLight} toggleTheme={toggleTheme} />}
        </div>
    );
}
