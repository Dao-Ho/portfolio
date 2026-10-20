"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobal } from "../../context-providers/global-provider";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import transaction from "../../../public/gallery/the-transaction.webp";
import haku from "../../../public/gallery/haku.webp";
import fishMarket from "../../../public/gallery/fish-market.webp";
import holdingOn from "../../../public/gallery/holding-on.webp";
import duality from "../../../public/gallery/duality.webp";
import held from "../../../public/gallery/held.webp";
import engulfed from "../../../public/gallery/engulfed.webp";

type Work = {
    title: string;
    src: StaticImageData;
    /** Size in inches, when known. */
    size?: string;
    year: string;
    honours?: string[];
};

const WORKS: Work[] = [
    {
        title: "The Transaction",
        src: transaction,
        size: "11×14",
        year: "2023",
        honours: [
            "Best in Show, James Laubheimer's Award",
            "Baltimore Watercolor Society Award for Excellence in Water-Media",
            "Schwab Lipowitz & Solter 1st Place Award",
        ],
    },
    { title: "Haku", src: haku, size: "8.5×11", year: "2023" },
    {
        title: "Fish Market",
        src: fishMarket,
        size: "10×12",
        year: "2023",
        honours: ["Featured at the Baltimore Museum of Art"],
    },
    { title: "Holding On", src: holdingOn, size: "10×8", year: "2022" },
    { title: "Duality", src: duality, size: "22×17", year: "2022" },
    { title: "Held", src: held, year: "2022" },
    { title: "Engulfed", src: engulfed, year: "2022" },
];

/**
 * A salon hang on a 12-column wall: each piece gets its own column span and a drop from the row above,
 * so sizes and gaps vary the way works hang in a show. Ink and colour alternate down the wall.
 */
const HANG: { work: number; col: string; drop: string }[] = [
    { work: 0, col: "1 / span 7", drop: "0" },
    { work: 1, col: "9 / span 4", drop: "7rem" },
    { work: 2, col: "3 / span 6", drop: "2rem" },
    { work: 4, col: "10 / span 3", drop: "9rem" },
    { work: 5, col: "1 / span 4", drop: "4rem" },
    { work: 6, col: "6 / span 7", drop: "11rem" },
    { work: 3, col: "8 / span 4", drop: "4rem" },
];

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const details = (work: Work) => [work.size, work.year].filter(Boolean).join(" · ");

export default function Gallery() {
    const { isLight, isMobile, toggleTheme } = useGlobal();
    const [open, setOpen] = useState<number | null>(null);

    if (isMobile === null) return null;

    return (
        <div className={`min-h-screen w-full bg-background text-foreground ${isLight ? "light" : "dark"}`}>
            {isMobile ? (
                <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <TopNav isLight={isLight} toggleTheme={toggleTheme} />
            )}
            <main className="mx-auto flex w-full max-w-[1280px] flex-col gap-14 px-6 pb-24 pt-28 lg:gap-20 lg:px-[6vw] lg:pt-36">
                <header className="flex flex-col gap-6 font-geistMono lg:flex-row lg:items-end lg:justify-between">
                    <div className="flex flex-col gap-4">
                        <h1 className="sr-only">Gallery</h1>
                        <p className="text-[14px] lowercase leading-relaxed tracking-[0.02em] opacity-60">
                            beauty in the mundane.
                            <span
                                aria-hidden="true"
                                className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                            />
                        </p>
                        <p className="max-w-[32rem] font-geistSans text-[16px] leading-[1.6] opacity-80 [text-wrap:pretty]">
                            Quiet observations of ordinary life.
                        </p>
                    </div>
                    <a
                        href="https://www.instagram.com/artdaoho/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`${UNDERLINE} self-start text-[14px] opacity-60 hover:opacity-100 focus-visible:opacity-100 lg:self-end`}
                    >
                        instagram
                    </a>
                </header>

                <section aria-label="Works" className="grid grid-cols-1 gap-y-16 lg:grid-cols-12 lg:gap-x-6 lg:gap-y-0">
                    {HANG.map(({ work: i, col, drop }) => {
                        const work = WORKS[i];
                        return (
                            <figure
                                key={work.title}
                                className="min-w-0"
                                style={isMobile ? undefined : { gridColumn: col, marginTop: drop }}
                            >
                                <button
                                    type="button"
                                    onClick={() => setOpen(i)}
                                    aria-label={`View ${work.title} larger`}
                                    className="block w-full overflow-hidden rounded-[3px] outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                                >
                                    <Image
                                        src={work.src}
                                        alt={work.title}
                                        placeholder="blur"
                                        sizes="(min-width: 1024px) 50vw, 100vw"
                                        className="h-auto w-full transition-transform duration-500 ease-out hover:scale-[1.02]"
                                        priority={i < 2}
                                    />
                                </button>
                                <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-geistMono text-[12px]">
                                    <span className="truncate">{work.title}</span>
                                    <span className="shrink-0 tabular-nums opacity-40">{details(work)}</span>
                                </figcaption>
                            </figure>
                        );
                    })}
                </section>
            </main>

            <Lightbox index={open} onClose={() => setOpen(null)} onStep={setOpen} />
        </div>
    );
}

/** Full-screen view of one piece; arrow keys step through the works and Escape closes. */
function Lightbox({
    index,
    onClose,
    onStep,
}: {
    index: number | null;
    onClose: () => void;
    onStep: (i: number) => void;
}) {
    const step = useCallback(
        (by: number) => {
            if (index === null) return;
            onStep((index + by + WORKS.length) % WORKS.length);
        },
        [index, onStep]
    );

    useEffect(() => {
        if (index === null) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            else if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = overflow;
        };
    }, [index, onClose, step]);

    const work = index === null ? null : WORKS[index];

    return (
        <AnimatePresence>
            {work && index !== null && (
                <motion.div
                    role="dialog"
                    aria-modal="true"
                    aria-label={work.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onClick={onClose}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-5 bg-[color-mix(in_srgb,var(--background-color)_94%,transparent)] px-6 font-geistMono text-foreground backdrop-blur-sm"
                >
                    <motion.div
                        key={work.title}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2 }}
                        className="flex flex-col gap-5"
                    >
                        <Image
                            src={work.src}
                            alt={work.title}
                            placeholder="blur"
                            sizes="90vw"
                            className="h-auto max-h-[72vh] w-auto max-w-[90vw] rounded-[4px] object-contain"
                        />
                        <div className="flex w-full items-start justify-between gap-6 text-[13px]">
                            <span className="flex flex-col gap-1">
                                <span>
                                    {work.title} <span className="opacity-40">{details(work)}</span>
                                </span>
                                {work.honours?.map((h) => (
                                    <span key={h} className="font-geistSans text-[12px] opacity-60">
                                        {h}
                                    </span>
                                ))}
                            </span>
                            <span className="flex items-center gap-4 tabular-nums">
                                <button
                                    type="button"
                                    aria-label="Previous work"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        step(-1);
                                    }}
                                    className="opacity-50 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100"
                                >
                                    ←
                                </button>
                                <span className="opacity-40">
                                    {index + 1} / {WORKS.length}
                                </span>
                                <button
                                    type="button"
                                    aria-label="Next work"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        step(1);
                                    }}
                                    className="opacity-50 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100"
                                >
                                    →
                                </button>
                            </span>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
