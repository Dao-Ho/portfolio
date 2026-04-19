"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { GlobalProvider } from "../../context-providers/global-provider";
import { AnimatedItem } from "../components/animated-list";

type Project = {
    index: string;
    name: string;
    description: string;
    tech: string[];
    link: string;
    background?: string;
};

const projects: Project[] = [
    {
        index: "01",
        name: "Selfserve",
        description:
            "Jira for hotel operations. Designed and shipped an internal platform that gives hotel staff a self-serve dashboard to manage tasks, track requests, and streamline day-to-day operations.",
        tech: ["Next.js", "TypeScript", "Go"],
        link: "https://github.com/GenerateNU/selfserve",
        background: "/projects/selfserve/selfserve-background.svg",
    },
    {
        index: "02",
        name: "Dynami",
        description:
            "GitHub notifications, in your notch. Native GitHub notifications living seamlessly in your Mac's Dynamic Island. Never lose track of a review again.",
        tech: ["Swift", "GitHub API"],
        link: "https://github.com/dao-ho/dynami",
        background: "/projects/dynami/dynami-background.svg",
    },
    {
        index: "03",
        name: "Vetruly",
        description:
            "Full-stack platform connecting pet owners with vetted care providers. Led a team of 5 engineers from concept to production.",
        tech: ["Next.js", "TypeScript", "PostgreSQL"],
        link: "https://www.vetruly.com/",
        background: "/projects/vetruly/vetruly-background.svg",
    },
    {
        index: "04",
        name: "Three Stones",
        description:
            "Mobile application allowing retail investors to crowdfund real estate projects. Built authentication and core user flows end-to-end.",
        tech: ["React Native", "Go", "AWS"],
        link: "https://generatenu.com/",
        background: "/projects/3-stones/3-stones-background.svg",
    },
];

// Layout constants (all in viewport units, converted to px at runtime)
const CONTENT_X_VW = 5;      // left offset of active content from edge
const ACTIVE_HALF_H_VH = 14; // half-height of expanded active card
const PILL_H_VH = 5;         // pill height
const PILL_GAP_VH = 2;       // gap between active card edge and first pill, and between pills

function getItemPos(dist: number, vw: number, vh: number) {
    const absDist = Math.abs(dist);
    const isActive = dist === 0;
    const contentX = CONTENT_X_VW * vw;

    if (isActive) {
        return {
            x: contentX,
            y: -ACTIVE_HALF_H_VH * vh,
            opacity: 1,
            scale: 1,
        };
    }

    const sign = dist > 0 ? 1 : -1;
    const pillHalf = (PILL_H_VH / 2) * vh;
    // first pill center is just outside the active card, subsequent ones stack with gap
    const pillCenterY = sign * (ACTIVE_HALF_H_VH + PILL_GAP_VH + PILL_H_VH / 2 + (absDist - 1) * (PILL_H_VH + PILL_GAP_VH)) * vh;

    return {
        x: contentX - (absDist - 1) * 2.5 * vw,
        y: pillCenterY - pillHalf,
        opacity: absDist === 1 ? 0.6 : absDist === 2 ? 0.3 : 0,
        scale: absDist === 1 ? 0.97 : 0.92,
    };
}

export default function ProjectsRoute() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(false);
    const [dims, setDims] = useState({ vw: 0, vh: 0 });
    const router = useRouter();

    useEffect(() => {
        const update = () => {
            setIsMobile(window.innerWidth < 768);
            setDims({ vw: window.innerWidth / 100, vh: window.innerHeight / 100 });
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "ArrowDown") {
                e.preventDefault();
                setActiveIndex((i) => Math.min(i + 1, projects.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setActiveIndex((i) => Math.max(i - 1, 0));
            }
        };
        let accumulated = 0;
        let cooldown = false;
        const handleWheel = (e: WheelEvent) => {
            if (isMobile) return;
            e.preventDefault();
            if (cooldown) return;
            accumulated += e.deltaY;
            if (Math.abs(accumulated) >= 80) {
                if (accumulated > 0) setActiveIndex((i) => Math.min(i + 1, projects.length - 1));
                else setActiveIndex((i) => Math.max(i - 1, 0));
                accumulated = 0;
                cooldown = true;
                setTimeout(() => { cooldown = false; accumulated = 0; }, 600);
            }
        };
        window.addEventListener("keydown", handleKey);
        window.addEventListener("wheel", handleWheel, { passive: false });
        return () => {
            window.removeEventListener("keydown", handleKey);
            window.removeEventListener("wheel", handleWheel);
        };
    }, [isMobile]);

    return (
        <GlobalProvider>
            <div
                className="w-[100vw] h-[100vh] overflow-hidden bg-background text-foreground dark"
            >
                <div className="fixed top-0 left-0 right-0 z-20 flex items-center px-[4vw] py-[3vh]">
                    <button
                        onClick={() => router.push("/")}
                        className="flex items-center gap-2 font-oswald text-[0.85vw] text-foreground/50 hover:text-foreground transition-colors duration-200 max-md:text-[3.5vw]"
                    >
                        <ArrowLeft size={14} />
                        Back
                    </button>
                </div>

                {isMobile ? (
                    <MobileLayout />
                ) : (
                    <DesktopLayout
                        activeIndex={activeIndex}
                        setActiveIndex={setActiveIndex}
                        dims={dims}
                    />
                )}
            </div>
        </GlobalProvider>
    );
}

function DesktopLayout({
    activeIndex,
    setActiveIndex,
    dims,
}: {
    activeIndex: number;
    setActiveIndex: (i: number) => void;
    dims: { vw: number; vh: number };
}) {
    const active = projects[activeIndex];
    const dragStartY = useRef<number | null>(null);
    const [grabbing, setGrabbing] = useState(false);
    const ready = dims.vw > 0;

    const onMouseDown = (e: React.MouseEvent) => {
        dragStartY.current = e.clientY;
        setGrabbing(true);
    };
    const onMouseMove = (e: React.MouseEvent) => {
        if (dragStartY.current === null) return;
        const delta = e.clientY - dragStartY.current;
        if (Math.abs(delta) > 50) {
            dragStartY.current = e.clientY;
            if (delta > 0) setActiveIndex(Math.min(activeIndex + 1, projects.length - 1));
            else setActiveIndex(Math.max(activeIndex - 1, 0));
        }
    };
    const onMouseUp = () => {
        dragStartY.current = null;
        setGrabbing(false);
    };

    return (
        <div
            className="relative h-full overflow-hidden select-none"
            style={{ cursor: grabbing ? "grabbing" : "grab" }}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {/* Full-screen background */}
            <AnimatePresence>
                {active.background && (
                    <motion.div
                        key={active.background}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="absolute inset-0 z-0 pointer-events-none"
                    >
                        <Image
                            src={active.background}
                            alt=""
                            fill
                            className="object-cover"
                            quality={100}
                            priority={true}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Origin: left edge, vertical center */}
            <div className="absolute left-0 top-1/2 z-10">
                {ready && projects.map((project, i) => {
                    const dist = i - activeIndex;
                    const pos = getItemPos(dist, dims.vw, dims.vh);
                    const isActive = dist === 0;

                    return (
                        <motion.div
                            key={i}
                            className="absolute"
                            style={{ left: 0, top: 0, cursor: isActive ? "default" : "pointer" }}
                            animate={{ x: pos.x, y: pos.y, opacity: pos.opacity, scale: pos.scale }}
                            transition={{ type: "spring", stiffness: 240, damping: 28 }}
                            onClick={() => !isActive && setActiveIndex(i)}
                        >
                            {isActive ? (
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeIndex}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="flex flex-col"
                                        style={{ gap: "1.2vh", width: "28vw" }}
                                    >
                                        <span className="font-oswald text-[0.85vw] text-foreground/30">{project.index}</span>
                                        <h2 className="font-playfairDisplay font-bold text-[3.5vw] leading-[4vw]">{project.name}</h2>
                                        <p className="font-sourceSans3 text-[1.05vw] leading-[1.7vw] text-foreground/60 w-full">
                                            {project.description}
                                        </p>
                                    </motion.div>
                                </AnimatePresence>
                            ) : (
                                <div
                                    className="rounded-xl backdrop-blur-md border border-foreground/10 flex items-center px-[1.2vw]"
                                    style={{
                                        width: "22vw",
                                        height: "5vh",
                                        background: "color-mix(in srgb, var(--foreground-color) 5%, transparent)",
                                    }}
                                >
                                    <span className="font-playfairDisplay font-bold text-[1vw] leading-none text-foreground whitespace-nowrap">
                                        {project.name}
                                    </span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

function MobileLayout() {
    return (
        <div className="pt-[12vh] pb-[8vh] px-[8vw] overflow-y-auto h-full">
            <h1 className="font-playfairDisplay font-bold text-[8vw] leading-[9vw] mb-[5vh]">
                Projects
            </h1>
            <div className="flex flex-col">
                {projects.map((project, index) => (
                    <AnimatedItem key={index} index={index} delay={index * 0.05}>
                        <a
                            href={project.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col py-[2.5vh] border-t border-foreground/10"
                        >
                            <span className="font-oswald text-[3vw] text-foreground/30">{project.index}</span>
                            <span className="font-playfairDisplay font-bold text-[5.5vw] leading-[7vw] mt-[0.5vh]">{project.name}</span>
                            <span className="font-sourceSans3 text-[3.5vw] leading-[5.5vw] text-foreground/60 mt-[1vh]">{project.description}</span>
                            <div className="flex flex-wrap gap-[2vw] mt-[1.5vh]">
                                {project.tech.map((t, i) => (
                                    <span key={i} className="font-oswald text-[2.75vw] text-foreground/40 border border-foreground/15 px-[2.5vw] py-[0.25vh] rounded-sm">{t}</span>
                                ))}
                            </div>
                        </a>
                    </AnimatedItem>
                ))}
                <div className="border-t border-foreground/10" />
            </div>
        </div>
    );
}
