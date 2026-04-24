"use client";

import React, { createContext, useContext, useState, useLayoutEffect, useEffect } from "react";

interface GlobalContextType {
    isMobile: boolean | null;
    isLight: boolean;
    toggleTheme: () => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);
    const [isLight, setIsLight] = useState<boolean>(false);

    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored === "light") setIsLight(true);
    }, []);

    const toggleTheme = () => {
        setIsLight((v) => {
            const next = !v;
            localStorage.setItem("theme", next ? "light" : "dark");
            return next;
        });
    };

    const debounce = (func: () => void, delay: number | undefined) => {
        let timeoutId: NodeJS.Timeout;
        return () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func();
            }, delay);
        };
    };

    useLayoutEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < window.innerHeight);
        };

        const debouncedResize = debounce(handleResize, 200);

        handleResize();
        window.addEventListener("resize", debouncedResize);

        return () => {
            window.removeEventListener("resize", debouncedResize);
        };
    }, []);

    return <GlobalContext.Provider value={{ isMobile, isLight, toggleTheme }}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within an GlobalProvider");
    }
    return context;
};
