"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { useGlobal } from "../../context-providers/global-provider";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import Container from "../components/container";
import { isExternal, projectHref, projects } from "../data/projects";

// The ring repeats the projects so it reads as a full loop; only the first lap is in the tab order.
const LAPS = 3;
const SPIN = 0.035; // radians per second
const TILT = (-14 * Math.PI) / 180; // the ring leans so it reads as a loop seen at an angle
const WHEEL_KICK = 0.012; // radians per second added per pixel scrolled
const WHEEL_FRICTION = 2.2; // how quickly a flick spins down

export default function ProjectsRoute() {
    const { isLight, isMobile, toggleTheme } = useGlobal();

    if (isMobile === null) return null;

    return (
        <div className={`h-screen w-full overflow-hidden bg-background text-foreground ${isLight ? "light" : "dark"}`}>
            {isMobile ? (
                <MobileLayout isLight={isLight} toggleTheme={toggleTheme} />
            ) : (
                <>
                    <TopNav isLight={isLight} toggleTheme={toggleTheme} />
                    <DesktopRing />
                </>
            )}
        </div>
    );
}

/** Project previews orbit the page on a slow ellipse; hovering one dims the rest and names it in the centre. */
function DesktopRing() {
    const [hovered, setHovered] = useState<number | null>(null);
    const router = useRouter();
    const ringRef = useRef<HTMLDivElement>(null);
    const tileRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    const hoveredRef = useRef<number | null>(null);
    hoveredRef.current = hovered;

    useEffect(() => {
        const ring = ringRef.current;
        if (!ring) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let angle = 0;
        let speed = SPIN;
        let flick = 0;
        let last = performance.now();
        let raf = 0;
        const count = projects.length * LAPS;

        const place = () => {
            const { width, height } = ring.getBoundingClientRect();
            const rx = Math.min(width * 0.34, 520);
            const ry = Math.min(height * 0.31, 300);
            const cos = Math.cos(TILT);
            const sin = Math.sin(TILT);
            tileRefs.current.forEach((tile, i) => {
                if (!tile) return;
                const a = angle + (i / count) * Math.PI * 2;
                const ex = Math.cos(a) * rx;
                const ey = Math.sin(a) * ry;
                // depth runs 0 at the far side of the loop to 1 at the near side.
                const depth = (Math.sin(a) + 1) / 2;
                const hovered = hoveredRef.current === i % projects.length;
                const scale = (0.82 + 0.22 * depth) * (hovered ? 1.08 : 1);
                tile.style.transform = `translate(-50%, -50%) translate(${ex * cos - ey * sin}px, ${ex * sin + ey * cos}px) scale(${scale})`;
                // Near tiles sit in front of far ones.
                tile.style.zIndex = String(hovered ? 1000 : Math.round(depth * 900));
            });
        };

        const frame = (now: number) => {
            const dt = Math.min(0.05, (now - last) / 1000);
            last = now;
            // Ease to a stop while something is hovered, so the preview holds still.
            const cruise = still || hoveredRef.current !== null ? 0 : SPIN;
            speed += (cruise - speed) * Math.min(1, dt * 4);
            flick *= Math.exp(-dt * WHEEL_FRICTION);
            angle += (speed + flick) * dt;
            place();
            raf = requestAnimationFrame(frame);
        };

        // Scrolling flicks the ring around; the spin carries on and eases off on its own.
        const onWheel = (e: WheelEvent) => {
            e.preventDefault();
            const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            const px = e.deltaMode === 1 ? delta * 16 : delta;
            flick = Math.max(-5, Math.min(5, flick + px * WHEEL_KICK));
        };

        place();
        raf = requestAnimationFrame(frame);
        const onResize = () => place();
        window.addEventListener("resize", onResize);
        ring.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("resize", onResize);
            ring.removeEventListener("wheel", onWheel);
        };
    }, []);

    const active = hovered === null ? null : projects[hovered];

    return (
        <main ref={ringRef} className="relative h-full font-geistMono">
            {Array.from({ length: projects.length * LAPS }, (_, i) => {
                const index = i % projects.length;
                const project = projects[index];
                const href = projectHref(project);
                const external = href !== undefined && isExternal(href);
                const dimmed = hovered !== null && hovered !== index;
                return (
                    <a
                        key={i}
                        ref={(el) => {
                            tileRefs.current[i] = el;
                        }}
                        // Without a link the tile still previews on hover and focus, it just doesn't navigate.
                        {...(href && { href })}
                        {...(external && { target: "_blank", rel: "noopener noreferrer" })}
                        onClick={(e) => {
                            if (!href || external) return;
                            e.preventDefault();
                            router.push(href);
                        }}
                        tabIndex={i < projects.length ? 0 : -1}
                        aria-label={external ? `${project.name}, opens in a new tab` : project.name}
                        onMouseEnter={() => setHovered(index)}
                        onMouseLeave={() => setHovered(null)}
                        onFocus={() => setHovered(index)}
                        onBlur={() => setHovered(null)}
                        className={`absolute left-1/2 top-1/2 block overflow-hidden rounded-[4px] outline-none ${href ? "" : "cursor-default"} transition-[filter,opacity] duration-300 focus-visible:ring-1 focus-visible:ring-foreground`}
                        style={{
                            width: "clamp(200px, 19vw, 300px)",
                            aspectRatio: "3 / 2",
                            filter: dimmed ? "grayscale(1) brightness(0.55)" : "none",
                            opacity: dimmed ? 0.7 : 1,
                        }}
                    >
                        <Image src={project.thumb} alt="" fill sizes="300px" className="object-cover" />
                    </a>
                );
            })}

            {/* Centre label: the section name at rest, the hovered project's name while previewing. */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={active?.name ?? "projects"}
                        initial={{ opacity: 0, y: 3 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col items-center gap-1"
                    >
                        <span className={`text-[15px] ${active ? "" : "lowercase opacity-60"}`}>
                            {active?.name ?? "projects"}
                        </span>
                        {active && <span className="text-[11px] opacity-40">{active.year}</span>}
                    </motion.div>
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {active && (
                    <motion.div
                        key={active.name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="pointer-events-none absolute bottom-8 right-8 max-w-[26rem] font-geistSans text-[16px] leading-[1.55] [text-wrap:pretty]"
                    >
                        <p className="opacity-80">{active.description}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}

function MobileLayout({ isLight, toggleTheme }: { isLight: boolean; toggleTheme: () => void }) {
    return (
        <div className="w-full h-full overflow-y-auto bg-background">
            <MobileNav isLight={isLight} toggleTheme={toggleTheme} />
            <Container as="main" className="flex flex-col pt-[20vw] pb-[12vh]">
                {projects.map((project, i) => (
                    <article key={project.index} className="flex flex-col pb-[16vw]">
                        {/* Image */}
                        <div className="relative w-full rounded-2xl overflow-hidden" style={{ height: "65vw" }}>
                            <Image
                                src={project.thumb}
                                alt={project.name}
                                fill
                                sizes="100vw"
                                className="object-cover"
                                priority={i === 0}
                            />
                        </div>

                        {/* Name */}
                        <h2 className="font-inter text-[21px] mt-[5vw] mb-2 text-foreground">{project.name}</h2>

                        {/* Description */}
                        <p className="font-inter text-[17px] text-foreground opacity-60">{project.description}</p>

                        {/* Year */}
                        <div className="mt-5">
                            <p className="font-inter text-[17px] text-foreground opacity-60 mb-1">Year</p>
                            <p className="font-inter text-[17px] text-foreground">{project.year}</p>
                        </div>

                        {projectHref(project) && (
                            <a
                                href={projectHref(project)}
                                {...(isExternal(projectHref(project) ?? "") && {
                                    target: "_blank",
                                    rel: "noopener noreferrer",
                                })}
                                className="mt-5 self-start inline-flex items-center justify-center gap-5 whitespace-nowrap font-small text-15 cursor-pointer ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-12/50 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-15 [&_svg]:shrink-0 dark:ring-offset-neutral-950 dark:focus-visible:ring-neutral-300 active:scale-95 transition-all text-foreground py-1 px-4 rounded-full"
                                style={{ background: "color-mix(in srgb, var(--foreground-color) 8%, transparent)" }}
                            >
                                View project
                            </a>
                        )}
                    </article>
                ))}
            </Container>
        </div>
    );
}
