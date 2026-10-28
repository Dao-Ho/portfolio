"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
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
                                                sizes="(min-width: 1024px) 33vw, 100vw"
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

const SIDE_BUTTON =
    "h-24 w-[6vw] shrink-0 text-[22px] opacity-40 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100 max-lg:hidden";
// Clicks anywhere else in the viewer close it.
const STAY_OPEN = "img, button, [data-stay-open]";
const SMALL_BUTTON = "opacity-50 outline-none transition-opacity hover:opacity-100 focus-visible:opacity-100 lg:hidden";

/** One piece on its own, as large as fits. Arrow keys or a swipe step through the works and Escape closes. */
function Lightbox({
    index,
    onClose,
    onStep,
}: {
    index: number | null;
    onClose: () => void;
    onStep: (i: number) => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const swipeStart = useRef<{ x: number; y: number } | null>(null);
    const isOpen = index !== null;

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

    // A modal <dialog> keeps focus inside it and hands focus back to the work that opened it on close.
    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog || !isOpen) return;
        dialog.showModal();
        const overflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        return () => {
            dialog.close();
            document.body.style.overflow = overflow;
        };
    }, [isOpen]);

    // On the window, since clicking the work or its label can leave focus outside the dialog.
    useEffect(() => {
        if (!isOpen) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowRight") step(1);
            else if (e.key === "ArrowLeft") step(-1);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [isOpen, step]);

    const work = index === null ? null : WORKS[index];

    return (
        <dialog
            ref={dialogRef}
            aria-label={work?.title}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            // Browsers can still close it themselves (e.g. Android back), so keep the state in step.
            onClose={onClose}
            className="m-0 size-full max-h-none max-w-none bg-background p-0 font-geistMono text-foreground"
        >
            {work && index !== null && (
                <div
                    className="flex h-full cursor-zoom-out flex-col"
                    onClick={(e) => {
                        if (!(e.target as Element).closest(STAY_OPEN)) onClose();
                    }}
                >
                    <div className="flex items-center justify-between px-6 py-5 text-[13px] lg:px-[6vw]">
                        <button
                            type="button"
                            onClick={onClose}
                            className={`${UNDERLINE} opacity-60 hover:opacity-100 focus-visible:opacity-100`}
                        >
                            close
                        </button>
                        <span className="flex items-center gap-4 tabular-nums">
                            <button
                                type="button"
                                aria-label="Previous work"
                                onClick={() => step(-1)}
                                className={SMALL_BUTTON}
                            >
                                ←
                            </button>
                            <span aria-live="polite" className="opacity-40">
                                {HANG.indexOf(index) + 1} / {HANG.length}
                            </span>
                            <button
                                type="button"
                                aria-label="Next work"
                                onClick={() => step(1)}
                                className={SMALL_BUTTON}
                            >
                                →
                            </button>
                        </span>
                    </div>

                    <div
                        className="flex min-h-0 flex-1 items-center px-6 lg:px-0"
                        onTouchStart={(e) => {
                            const { clientX: x, clientY: y } = e.touches[0];
                            swipeStart.current = { x, y };
                        }}
                        onTouchEnd={(e) => {
                            const start = swipeStart.current;
                            const { clientX: x, clientY: y } = e.changedTouches[0];
                            if (start && Math.abs(x - start.x) > 50 && Math.abs(x - start.x) > Math.abs(y - start.y))
                                step(x < start.x ? 1 : -1);
                            swipeStart.current = null;
                        }}
                    >
                        <button
                            type="button"
                            aria-label="Previous work"
                            onClick={() => step(-1)}
                            className={SIDE_BUTTON}
                        >
                            ‹
                        </button>
                        <div className="flex h-full min-w-0 flex-1 items-center justify-center">
                            {/* Sized to the work itself, so a click beside it lands on the background and closes. */}
                            <Image
                                src={work.src}
                                alt={work.title}
                                placeholder="blur"
                                sizes="(min-width: 1024px) 88vw, 100vw"
                                className="h-auto max-h-full w-auto max-w-full cursor-auto"
                            />
                        </div>
                        <button type="button" aria-label="Next work" onClick={() => step(1)} className={SIDE_BUTTON}>
                            ›
                        </button>
                    </div>

                    {/* Every label shares one cell, so the row keeps the tallest one's height and the work never jumps. */}
                    <div data-stay-open className="grid cursor-auto self-start px-6 pb-6 pt-5 text-[13px] lg:px-[6vw]">
                        {WORKS.map((w, i) => (
                            <div
                                key={w.title}
                                className={`flex flex-col gap-1 [grid-area:1/1] ${i === index ? "" : "invisible"}`}
                            >
                                <span>
                                    {w.title} <span className="opacity-40">{details(w)}</span>
                                </span>
                                {w.honours?.map((h) => (
                                    <span key={h} className="font-geistSans text-[12px] opacity-60">
                                        {h}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </dialog>
    );
}
