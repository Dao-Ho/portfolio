"use client";
import { useEffect, useState, useRef } from "react";
import ParticleEffect from "./components/particles";
import React from "react";
import { GlobalProvider } from "../context-providers/global-provider";

import NavBar from "./components/navBar";
import FrontPage from "./components/front-page";
import ExperiencePage from "./components/experience";
import Footer from "./components/footer";
import GlobalDock from "./components/global-dock";

export default function Home() {
    const [isLight, setIsLight] = useState(false);
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
        <GlobalProvider>
            <div
                id="mainPage"
                className={`w-[100vw] min-h-[100vh] overflow-y-scroll transition-colors duration-300 bg-background ${
                    isLight ? "light" : "dark"
                }`}
            >
                <div className={`flex flex-col absolute z-20 w-[100vw] items-center`}>
                    {isMobile && (
                        <div className={`fixed z-20`}>
                            <NavBar toggleTheme={() => setIsLight((v) => !v)} isLight={isLight} />
                        </div>
                    )}
                    <FrontPage isLight={isLight} />
                    <ExperiencePage isLight={isLight} />
                    <Footer />
                </div>
                <div className="relative z-10">{isMobile && <ParticleEffect isLight={isLight} />}</div>
                {!isMobile && <GlobalDock isLight={isLight} toggleTheme={() => setIsLight((v) => !v)} />}
            </div>
        </GlobalProvider>
    );
}
