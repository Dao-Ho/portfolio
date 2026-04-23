"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";

const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Gallery", href: "/gallery" },
];

const secondaryLinks = [{ label: "LinkedIn ↗", href: "https://www.linkedin.com/in/dao-ho/" }];

interface MobileNavProps {
    isLight?: boolean;
    toggleTheme?: () => void;
}

export default function MobileNav({ isLight, toggleTheme }: MobileNavProps) {
    const [open, setOpen] = useState(false);

    const fg = isLight ? "#262523" : "#fff7f0";
    const fgDim = isLight ? "rgba(38,37,35,0.35)" : "rgba(255,247,240,0.35)";
    const fgIcon = isLight ? "rgba(38,37,35,0.5)" : "rgba(255,247,240,0.5)";
    const bg = isLight ? "#fff7f0" : "#1a1921";
    const pillBg = isLight ? "rgba(38,37,35,0.06)" : "rgba(255,247,240,0.06)";

    return (
        <>
            {/* Single persistent pill — always on top */}
            <div className="fixed top-[3vw] left-[3vw] right-[3vw] z-50">
                <button
                    onClick={() => setOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-[5vw] py-[3.5vw] rounded-2xl backdrop-blur-md cursor-pointer"
                    style={{ background: pillBg }}
                >
                    <span className="font-bebas text-[4.5vw] tracking-[0.15em]" style={{ color: fg }}>
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
                        className="fixed inset-0 z-40 flex flex-col"
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
                                    className="font-inter text-[3.5vw] tracking-wide"
                                    style={{ color: fgDim }}
                                >
                                    {link.label}
                                </a>
                            ))}
                            {toggleTheme && (
                                <button
                                    onClick={toggleTheme}
                                    className="font-inter text-[3.5vw] tracking-wide cursor-pointer"
                                    style={{ color: fgDim }}
                                >
                                    {isLight ? "Dark mode" : "Light mode"}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function GridIcon({ color }: { color: string }) {
    return (
        <svg style={{ width: "5vw", height: "5vw" }} viewBox="0 0 16 16" fill={color}>
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
            style={{ width: "4.5vw", height: "4.5vw" }}
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
