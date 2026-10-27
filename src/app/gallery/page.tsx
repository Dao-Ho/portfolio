"use client";

import { useCallback, useEffect, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { motion, AnimatePresence } from "motion/react";
import posthog from "posthog-js";
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

/** Works by column on desktop, top to bottom, picked so the columns come out close in height. */
const COLUMNS = [
    [0, 2, 6],
    [5, 3],
    [1, 4],
];
/** The order the works read in, and step through in the lightbox. */
const HANG = COLUMNS.flat();
const GAP_REM = 1; // matches lg:gap-4 between and within columns
const MOST = Math.max(...COLUMNS.map((c) => c.length));

/**
 * Sizes a column so every column ends at the same height: width grows with 1/(sum of height/width), and the basis
 * makes up for columns with fewer gaps.
 */
function columnFlex(works: number[]) {
    const ratio = works.reduce((sum, i) => sum + WORKS[i].src.height / WORKS[i].src.width, 0);
    return `${1 / ratio} 1 ${((MOST - works.length) * GAP_REM) / ratio}rem`;
}

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const details = (work: Work) => [work.size, work.year].filter(Boolean).join(" · ");

export default function Gallery() {
    const [open, setOpen] = useState<number | null>(null);

    return (
        <div className="min-h-screen w-full bg-background text-foreground">
            <MobileNav />
            <TopNav />
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

                <section aria-label="Works" className="flex flex-col gap-y-16 lg:flex-row lg:items-start lg:gap-4">
                    {COLUMNS.map((column) => (
                        // On phones the columns drop away and the works stack in one list.
                        <div
                            key={column[0]}
                            className="contents lg:flex lg:min-w-0 lg:flex-col lg:gap-4"
                            style={{ flex: columnFlex(column) }}
                        >
                            {column.map((i) => {
                                const work = WORKS[i];
                                return (
                                    <figure key={work.title} className="group relative min-w-0">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpen(i);
                                                posthog.capture("gallery_work_opened", { work_position: i + 1 });
                                            }}
                                            aria-label={`View ${work.title} larger`}
                                            className="block w-full overflow-hidden rounded-[3px] outline-none focus-visible:ring-1 focus-visible:ring-foreground"
                                        >
                                            <Image
                                                src={work.src}
                                                alt={work.title}
                                                placeholder="blur"
                                                sizes="(min-width: 1024px) 40vw, 100vw"
                                                className="h-auto w-full transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                                                preload={i === HANG[0]}
                                            />
                                        </button>
                                        {/* Under the work on phones; on desktop it shows over the corner on hover, so the tiles sit flush. */}
                                        <figcaption className="mt-3 flex items-baseline justify-between gap-3 font-geistMono text-[12px] lg:pointer-events-none lg:absolute lg:bottom-3 lg:left-3 lg:mt-0 lg:max-w-[calc(100%-1.5rem)] lg:rounded-full lg:bg-[rgb(0_0_0/0.55)] lg:px-3 lg:py-1.5 lg:text-dark-foreground lg:opacity-0 lg:backdrop-blur-md lg:transition-opacity lg:duration-300 lg:group-focus-within:opacity-100 lg:group-hover:opacity-100">
                                            <span className="truncate">{work.title}</span>
                                            <span className="shrink-0 tabular-nums opacity-40 lg:opacity-60">
                                                {details(work)}
                                            </span>
                                        </figcaption>
                                    </figure>
                                );
                            })}
                        </div>
                    ))}
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
            const nextIndex = HANG[(HANG.indexOf(index) + by + HANG.length) % HANG.length];
            onStep(nextIndex);
            posthog.capture("gallery_work_navigated", {
                direction: by > 0 ? "next" : "previous",
                work_position: nextIndex + 1,
            });
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
                                    {HANG.indexOf(index) + 1} / {HANG.length}
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
