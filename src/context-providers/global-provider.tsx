"use client";

import React, { createContext, useContext, useState, useLayoutEffect } from "react";

interface GlobalContextType {
    isMobile: boolean | null;
}

/*
 * The one definition of "mobile"; nothing else should measure window.innerWidth.
 * Must stay the exact complement of Container's `lg:` gutter prefix, or one
 * viewport band renders the mobile layout with desktop gutters.
 */
export const MOBILE_BREAKPOINT_PX = 1024;
export const MOBILE_QUERY = `(max-width: ${MOBILE_BREAKPOINT_PX - 1}px)`;

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const [isMobile, setIsMobile] = useState<boolean | null>(null);

    useLayoutEffect(() => {
        const query = window.matchMedia(MOBILE_QUERY);
        const update = () => setIsMobile(query.matches);

        update();
        query.addEventListener("change", update);

        return () => {
            query.removeEventListener("change", update);
        };
    }, []);

    return <GlobalContext.Provider value={{ isMobile }}>{children}</GlobalContext.Provider>;
};

export const useGlobal = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error("useGlobal must be used within an GlobalProvider");
    }
    return context;
};
