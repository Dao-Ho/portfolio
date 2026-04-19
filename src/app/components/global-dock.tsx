"use client";

import { House, FolderOpen, Linkedin, Palette, Sun, Moon } from "lucide-react";
import Dock from "./dock";
import { useRouter } from "next/navigation";

interface GlobalDockProps {
    isLight?: boolean;
    toggleTheme?: () => void;
}

export default function GlobalDock({ isLight = false, toggleTheme }: GlobalDockProps) {
    const router = useRouter();
    const ITEMSTYLING = "text-white/90 hover:text-white flex flex-col items-center justify-center";

    const items = [
        { icon: <House size={18} />, label: "Home", onClick: () => router.push("/"), iconClassName: ITEMSTYLING },
        { icon: <FolderOpen size={18} />, label: "Projects", onClick: () => router.push("/projects"), iconClassName: ITEMSTYLING },
        { icon: <Palette size={18} />, label: "Gallery", onClick: () => router.push("/gallery"), iconClassName: ITEMSTYLING },
        ...(toggleTheme
            ? [{ icon: isLight ? <Moon size={18} /> : <Sun size={18} />, label: isLight ? "Dark Mode" : "Light Mode", onClick: toggleTheme, iconClassName: ITEMSTYLING }]
            : [{ icon: <Sun size={18} />, label: "Light Mode", onClick: () => {}, iconClassName: "text-white/20 flex flex-col items-center justify-center cursor-not-allowed" }]
        ),
        { icon: <Linkedin size={18} />, label: "LinkedIn", onClick: () => window.open("https://www.linkedin.com/in/dao-ho/", "_blank"), iconClassName: ITEMSTYLING },
    ];

    return (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
            <Dock
                items={items}
                panelHeight={68}
                baseItemSize={50}
                magnification={70}
                dockHeight={60}
                distance={200}
                isLight={isLight}
            />
        </div>
    );
}
