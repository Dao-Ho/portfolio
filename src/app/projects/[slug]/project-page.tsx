"use client";

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

    if (isMobile === null || !project?.page) return null;
    const { page } = project;

    return (
        <div className={`min-h-screen w-full bg-background text-foreground ${isLight ? "light" : "dark"}`}>
            {isMobile ? (
                <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <TopNav isLight={isLight} toggleTheme={toggleTheme} />
            )}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={`${FRAME} px-6 pb-40 pt-28 font-geistSans lg:box-content lg:pt-40`}
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
