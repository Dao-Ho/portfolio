"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGlobal } from "../../../context-providers/global-provider";
import MobileNav from "../../components/mobile-nav";
import TopNav from "../../components/top-nav";
import InlineLink from "../../components/inline-link";
import { projects, type StoryBlock } from "../../data/projects";

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
                            className="object-cover object-[78%_center]"
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
                    <p className={`${BODY} mt-8`}>{page.about}</p>
                </header>

                <div className="mt-16">
                    {/* Muted autoplay loops like a gif; with reduced motion it waits for the viewer to press play. */}
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
                        {block.parts.map((part, j) =>
                            typeof part === "string" ? (
                                part
                            ) : (
                                <InlineLink key={j} href={part.href}>
                                    {part.text}
                                </InlineLink>
                            )
                        )}
                    </p>
                );
            })}
        </div>
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
