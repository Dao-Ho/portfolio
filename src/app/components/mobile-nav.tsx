"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { ExternalLink, Github } from "lucide-react";
import ThemeIcon from "./theme-icon";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
];

const secondaryLinks = [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/dao-ho/" },
    { label: "GitHub", href: "https://github.com/Dao-Ho" },
];

const fg = "var(--foreground-color)";
const fgDim = "color-mix(in srgb, var(--foreground-color) 35%, transparent)";
const fgIcon = "color-mix(in srgb, var(--foreground-color) 50%, transparent)";
const bg = "var(--background-color)";
const pillBg = "color-mix(in srgb, var(--foreground-color) 6%, transparent)";

export default function MobileNav() {
    const [open, setOpen] = useState(false);
    const { resolvedTheme, setTheme } = useTheme();

    return (
        <>
            {/* Single persistent pill — always on top */}
            <div className="fixed top-[3vw] left-[3vw] right-[3vw] z-50 lg:hidden">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-[5vw] py-[3.5vw] rounded-full cursor-pointer"
                    style={{ background: pillBg, backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}
                >
                    <span className="font-inter font-normal text-20 tracking-normal" style={{ color: fg }}>
                        Dao Ho
                    </span>
                    <div className="relative" style={{ width: "5vw", height: "5vw" }}>
                        <AnimatePresence mode="wait">
                            {open ? (
                                <motion.div
                                    key="close"
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, rotate: 45 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: 45 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <CloseIcon color={fgIcon} />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="grid"
                                    className="absolute inset-0"
                                    initial={{ opacity: 0, rotate: -45 }}
                                    animate={{ opacity: 1, rotate: 0 }}
                                    exit={{ opacity: 0, rotate: -45 }}
                                    transition={{ duration: 0.18 }}
                                >
                                    <GridIcon color={fgIcon} />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </button>
            </div>

            {/* Full screen overlay */}
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 z-40 flex flex-col lg:hidden"
                        style={{ backgroundColor: bg }}
                    >
                        <div className="flex-1 flex flex-col items-center justify-center gap-[0.5vh]">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.href}
                                    initial={{ opacity: 0, y: 16 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.07 + 0.08, duration: 0.28, ease: "easeOut" }}
                                >
                                    <Link
                                        href={link.href}
                                        onClick={() => setOpen(false)}
                                        className="font-playfairDisplay font-bold text-[14vw] leading-[17vw] block text-center"
                                        style={{ color: fg }}
                                    >
                                        {link.label}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex-shrink-0 flex justify-center items-center gap-[8vw] pb-[10vh]">
                            {secondaryLinks.map((link) => (
                                <a
                                    key={link.href}
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-inter text-[3.5vw] tracking-wide flex items-center gap-[1.5vw]"
                                    style={{ color: fgDim }}
                                >
                                    {link.label}
                                    {link.label === "GitHub" ? (
                                        <Github size="3vw" strokeWidth={1.5} />
                                    ) : (
                                        <ExternalLink size="3vw" strokeWidth={1.5} />
                                    )}
                                </a>
                            ))}
                            <button
                                onClick={() => setTheme(resolvedTheme === "light" ? "dark" : "light")}
                                aria-label="Toggle theme"
                                className="cursor-pointer"
                                style={{ color: fgDim }}
                            >
                                <ThemeIcon size="4.5vw" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function GridIcon({ color }: { color: string }) {
    return (
        <svg style={{ width: "4vw", height: "4vw" }} viewBox="0 0 16 16" fill={color}>
            <circle cx="4" cy="4" r="1.5" />
            <circle cx="12" cy="4" r="1.5" />
            <circle cx="4" cy="12" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
        </svg>
    );
}

function CloseIcon({ color }: { color: string }) {
    return (
        <svg
            style={{ width: "4vw", height: "4vw" }}
            viewBox="0 0 16 16"
            fill="none"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
        >
            <path d="M3 3L13 13M13 3L3 13" />
        </svg>
    );
}
