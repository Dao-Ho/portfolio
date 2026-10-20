"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
    { label: "pond", href: "/" },
    { label: "projects", href: "/projects" },
    { label: "gallery", href: "/gallery" },
    { label: "blog", href: "/blog" },
];

const ITEM = "transition-opacity duration-150 hover:opacity-100 focus-visible:opacity-100 outline-none";

type TopNavProps = {
    isLight: boolean;
    toggleTheme: () => void;
    /** The nav is sitting over a dark cover image, so it uses light text whatever the theme. */
    overCover?: boolean;
};

export default function TopNav({ isLight, toggleTheme, overCover = false }: TopNavProps) {
    const pathname = usePathname();
    // A project's own page still counts as being in projects.
    const active = (href: string) => pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

    return (
        <nav
            data-koi-avoid
            aria-label="Main"
            className={`fixed inset-x-0 top-0 z-30 flex justify-center gap-8 pt-8 font-geistMono text-[13px] lowercase transition-colors duration-200 ${
                overCover ? "text-dark-foreground" : "text-foreground"
            }`}
        >
            {LINKS.map(({ label, href }) => (
                <Link
                    key={href}
                    href={href}
                    aria-current={active(href) ? "page" : undefined}
                    className={`${ITEM} ${active(href) ? "opacity-100" : "opacity-50"}`}
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
