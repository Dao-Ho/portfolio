"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { label: "pond", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "gallery", href: "/gallery" },
];

const ITEM = "transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 outline-none";

export default function TopNav({ isLight, toggleTheme }: { isLight: boolean; toggleTheme: () => void }) {
    const pathname = usePathname();

    return (
        <nav
            data-koi-avoid
            aria-label="Main"
            className="fixed inset-x-0 top-0 z-30 flex justify-center gap-8 pt-8 font-geistMono text-[13px] lowercase text-foreground"
        >
            {LINKS.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                    aria-current={pathname === href ? "page" : undefined}
                    className={`${ITEM} ${pathname === href ? "opacity-100" : "opacity-50"}`}
                >
                    {label}
                </Link>
            ))}
            <button
                type="button"
                onClick={toggleTheme}
                aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
                className={`${ITEM} opacity-50`}
            >
                {isLight ? "dark" : "light"}
            </button>
        </nav>
    );
}
