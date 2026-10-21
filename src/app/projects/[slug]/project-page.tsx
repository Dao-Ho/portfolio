"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGlobal } from "../../../context-providers/global-provider";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import InlineLink from "../../components/inline-link";
import { projects, type Prose, type Shot, type StoryBlock } from "../../data/projects";

/** One centred frame holds everything, so text and media share both edges. */
const FRAME = "mx-auto w-full max-w-[56rem]";
const BODY = "text-[16px] leading-[1.7] [text-wrap:pretty]";
const MUTED = "text-[color-mix(in_srgb,var(--foreground-color)_50%,transparent)]";
const MEDIA =
    "block aspect-video h-auto w-full rounded-[6px] bg-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_8%,transparent)]";

export default function ProjectPage({ slug }: { slug: string }) {
    const { isLight, isMobile, toggleTheme } = useGlobal();
    const project = projects.find((p) => p.slug === slug);
    const [still, setStill] = useState(false);

    useEffect(() => {
        setStill(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    }, []);

    // The nav switches to light text while it sits over the cover, and back once the cover scrolls past it.
    const coverRef = useRef<HTMLDivElement>(null);
    const [overCover, setOverCover] = useState(false);
    const hasCover = Boolean(project?.page?.cover);
    useEffect(() => {
        const cover = coverRef.current;
        if (!hasCover || !cover) return;
        const update = () => setOverCover(cover.getBoundingClientRect().bottom > 56);
        update();
        window.addEventListener("scroll", update, { passive: true });
        window.addEventListener("resize", update);
        return () => {
            window.removeEventListener("scroll", update);
            window.removeEventListener("resize", update);
        };
    }, [hasCover, isMobile]);

    if (isMobile === null || !project?.page) return null;
    const { page } = project;

    return (
        <div className={`min-h-screen w-full bg-background text-foreground ${isLight ? "light" : "dark"}`}>
            {isMobile ? (
                <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <TopNav isLight={isLight} toggleTheme={toggleTheme} overCover={overCover} />
            )}
            {page.cover && (
                // Full-bleed cover. On desktop it runs to the top edge with the nav over it; on mobile it sits under the
                // nav pill (padding, not margin, so the page colour shows above it). The lower edge fades into the page.
                <div className="pt-20 lg:pt-0">
                    <div ref={coverRef} className="relative h-[clamp(180px,26vw,440px)] w-full overflow-hidden">
                        <Image
                            src={page.cover}
                            alt=""
                            fill
                            priority
                            sizes="100vw"
                            className="object-cover object-[78%_top]"
                        />
                        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[linear-gradient(to_bottom,transparent,var(--background-color))]" />
                    </div>
                </div>
            )}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`${FRAME} px-6 pb-40 font-geistSans lg:box-content ${page.cover ? "pt-10 lg:pt-14" : "pt-28 lg:pt-40"}`}
            >
                <header>
                    <Link
                        href="/projects"
                        className={`text-[14px] ${MUTED} outline-none transition-colors hover:text-foreground focus-visible:text-foreground`}
                    >
                        ← Projects
                    </Link>
                    <h1 className="mt-10 text-[28px] font-medium leading-[1.2] tracking-[-0.015em]">{project.name}</h1>
                    <p className={`mt-1 text-[16px] ${MUTED}`}>{page.tagline}</p>
                    <p className={`${BODY} mt-8`}>
                        <Parts parts={page.about} />
                    </p>
                    {project.link && (
                        <p className="mt-4 text-[14px]">
                            <InlineLink href={project.link}>
                                {new URL(project.link).hostname.replace(/^www\./, "")}
                            </InlineLink>
                        </p>
                    )}
                </header>

                <div className="mt-16">
                    {page.video ? (
                        // Muted autoplay loops like a gif; with reduced motion it waits for the viewer to press play.
                        <video
                            src={page.video}
                            poster={page.poster}
                            autoPlay={!still}
                            controls={still}
                            muted
                            loop
                            playsInline
                            preload="metadata"
                            aria-label={`${project.name} demo`}
                            className={MEDIA}
                        />
                    ) : (
                        <Image
                            src={page.poster}
                            alt={`${project.name}, ${page.tagline}`}
                            width={1920}
                            height={1080}
                            priority
                            sizes="(min-width: 1024px) 56rem, 100vw"
                            className={MEDIA}
                        />
                    )}
                </div>

                {page.story && <Story blocks={page.story} still={still} />}
            </motion.main>
        </div>
    );
}

/** The story as quiet sections of prose, with the clips set wider between them. */
function Story({ blocks, still }: { blocks: StoryBlock[]; still: boolean }) {
    return (
        <div className="mt-24 flex flex-col">
            {blocks.map((block, i) => {
                if (block.kind === "heading") {
                    return (
                        <h2
                            key={i}
                            className={`mb-3 text-[16px] font-medium leading-[1.6] [&:not(:first-child)]:mt-16`}
                        >
                            {block.text}
                        </h2>
                    );
                }
                if (block.kind === "gallery") {
                    return <Gallery key={i} title={block.title} shots={block.shots} start={block.start} />;
                }
                if (block.kind === "image") {
                    return (
                        <Image
                            key={i}
                            src={block.src}
                            alt={block.alt}
                            width={block.width}
                            height={block.height}
                            sizes="(min-width: 1024px) 40rem, 100vw"
                            className="my-6 h-auto w-full rounded-[6px] border border-[color-mix(in_srgb,var(--foreground-color)_10%,transparent)]"
                        />
                    );
                }
                if (block.kind === "clip") {
                    return (
                        <div key={i} className="my-12">
                            <LoopVideo src={block.src} poster={block.poster} label={block.label} still={still} />
                        </div>
                    );
                }
                return (
                    <p
                        key={i}
                        className={`${BODY} text-[color-mix(in_srgb,var(--foreground-color)_72%,transparent)] [p+&]:mt-5`}
                    >
                        <Parts parts={block.parts} />
                    </p>
                );
            })}
        </div>
    );
}

function Parts({ parts }: { parts: Prose }) {
    return parts.map((part, i) =>
        typeof part === "string" ? (
            part
        ) : (
            <InlineLink key={i} href={part.href}>
                {part.text}
            </InlineLink>
        )
    );
}

const HOVER_INTENT_MS = 150;
const PEEK_MS = 700;

/** A captioned still, framed like a small widget: the image, then a short title and one line under it. */
function ShotCard({ shot, sizes }: { shot: Shot; sizes: string }) {
    return (
        <figure className="flex min-w-0 flex-col gap-3">
            <Image
                src={shot.src}
                alt={shot.alt}
                width={shot.width}
                height={shot.height}
                sizes={sizes}
                className="h-auto w-full rounded-[10px] bg-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_8%,transparent)]"
            />
            <figcaption className="text-[14px] leading-[1.55] [text-wrap:pretty]">
                <span className="font-medium">{shot.title}.</span> <span className={MUTED}>{shot.caption}</span>
            </figcaption>
        </figure>
    );
}

/**
 * A group of shots. On desktop it's an accordion: panels share one row, the active one opens wide in colour and the
 * rest fold into grey slivers. On smaller screens it's a row of cards that scrolls sideways.
 */
function Gallery({ title, shots, start = 0 }: { title?: string; shots: Shot[]; start?: number }) {
    const [active, setActive] = useState(start);
    const current = shots[active];
    // Hover only opens a panel once the cursor settles, so sweeping past the row on the way down does nothing.
    const intent = useRef<ReturnType<typeof setTimeout>>();
    const hoverOpen = (i: number) => {
        clearTimeout(intent.current);
        intent.current = setTimeout(() => setActive(i), HOVER_INTENT_MS);
    };
    const cancelHover = () => clearTimeout(intent.current);
    useEffect(() => () => clearTimeout(intent.current), []);

    // The first time the row scrolls into view, the next panel nudges open and back, hinting that the slivers move.
    const row = useRef<HTMLDivElement>(null);
    const [peek, setPeek] = useState<number | null>(null);
    useEffect(() => {
        const el = row.current;
        if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        let timer: ReturnType<typeof setTimeout>;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                observer.disconnect();
                timer = setTimeout(() => {
                    setPeek((start + 1) % shots.length);
                    timer = setTimeout(() => setPeek(null), PEEK_MS);
                }, 400);
            },
            { threshold: 0.6 }
        );
        observer.observe(el);
        return () => {
            observer.disconnect();
            clearTimeout(timer);
        };
    }, [start, shots.length]);

    return (
        <section aria-label={title} className="my-12 flex flex-col gap-4">
            <div className="flex items-baseline justify-between font-geistMono text-[13px]">
                {title && <span className={MUTED}>{title.toLowerCase()}</span>}
                <span className={`hidden tabular-nums lg:inline ${MUTED}`}>
                    {active + 1} / {shots.length}
                </span>
            </div>

            {/* Hovering the row lifts every sliver a little, so the whole strip reads as interactive. */}
            <div ref={row} className="group/row hidden h-[26rem] gap-2 lg:flex">
                {shots.map((shot, i) => {
                    const open = i === active;
                    return (
                        <button
                            key={shot.frame}
                            type="button"
                            aria-label={shot.title}
                            aria-pressed={open}
                            onMouseEnter={() => hoverOpen(i)}
                            onMouseLeave={cancelHover}
                            onFocus={() => setActive(i)}
                            onClick={() => {
                                cancelHover();
                                setActive(i);
                            }}
                            className={`group relative h-full min-w-0 overflow-hidden rounded-[10px] bg-black shadow-[0_0_0_1px_color-mix(in_srgb,var(--foreground-color)_8%,transparent)] outline-none transition-[flex-grow] duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)] focus-visible:ring-1 focus-visible:ring-foreground motion-reduce:transition-none ${
                                open ? "grow-[8]" : i === peek ? "grow-[2.2]" : "grow"
                            }`}
                            style={{ flexBasis: 0 }}
                        >
                            <Image
                                src={shot.frame}
                                alt={open ? shot.alt : ""}
                                fill
                                sizes="(min-width: 1024px) 48rem, 1px"
                                className={`object-cover object-[50%_35%] transition-[filter,opacity] duration-500 motion-reduce:transition-none ${
                                    open
                                        ? ""
                                        : "opacity-30 grayscale group-hover/row:opacity-45 group-hover:!opacity-70"
                                }`}
                            />
                            <span
                                className={`absolute bottom-4 left-4 flex items-center gap-2 font-geistMono text-[13px] text-dark-foreground transition-opacity duration-300 ${
                                    open ? "opacity-100 delay-200" : "opacity-0"
                                }`}
                            >
                                <span className="h-3.5 w-[2px] bg-dark-foreground" />
                                {shot.title.toLowerCase()}
                            </span>
                            {/* Folded panels say what's inside them, so the hidden states invite a look. */}
                            <span
                                aria-hidden="true"
                                className={`absolute inset-0 flex items-end justify-center pb-4 font-geistMono text-[13px] text-dark-foreground transition-opacity duration-300 ${
                                    open ? "opacity-0" : "opacity-80 group-hover:opacity-100"
                                }`}
                            >
                                <span className="whitespace-nowrap [writing-mode:vertical-rl] rotate-180">
                                    {shot.title.toLowerCase()}
                                </span>
                            </span>
                        </button>
                    );
                })}
            </div>
            {/* Two lines reserved, so a longer caption never pushes the page down. */}
            <p className={`hidden min-h-[3.1em] text-[14px] leading-[1.55] lg:block ${MUTED}`} aria-live="polite">
                <span className="font-medium text-foreground">{current.title}.</span> {current.caption}
            </p>

            <div className="-mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 [scrollbar-width:none] lg:hidden [&::-webkit-scrollbar]:hidden">
                {shots.map((shot) => (
                    <div key={shot.src} className="w-[88%] shrink-0 snap-start">
                        <ShotCard shot={shot} sizes="90vw" />
                    </div>
                ))}
            </div>
        </section>
    );
}

/** A muted looping clip that only plays while it's on screen, so a page of them stays light. */
function LoopVideo({ src, poster, label, still }: { src: string; poster?: string; label: string; still: boolean }) {
    const ref = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = ref.current;
        if (!video || still) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) video.play().catch(() => {});
            else video.pause();
        });
        observer.observe(video);
        return () => observer.disconnect();
    }, [still]);

    return (
        <video
            ref={ref}
            src={src}
            poster={poster}
            controls={still}
            muted
            loop
            playsInline
            preload="none"
            aria-label={label}
            className={MEDIA}
        />
    );
}
