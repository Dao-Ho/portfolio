"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { finishTransition, isTransitioning, pushWithTransition } from "../../lib/view-transition";
import MobileNav from "../components/mobile-nav";
import TopNav from "../components/top-nav";
import Container from "../components/container";
import { isExternal, LAST_PROJECT_KEY, projectHref, projects, projectsByDate, type Project } from "../data/projects";

const GLIDE = 0.18; // share of the remaining distance the strip covers each frame when scrolled with a wheel
const DESKTOP_QUERY = "(min-width: 1024px)"; // Tailwind's `lg`, where the strip replaces the mobile list

export default function ProjectsRoute() {
    // Coming back from a project, the slide plays once the page has rendered (and the strip has restored its place,
    // since a child's effects run before this one).
    useEffect(() => {
        finishTransition();
    }, []);

    return (
        <div className="h-screen w-full overflow-hidden bg-background text-foreground">
            <MobileLayout />
            <TopNav />
            <DesktopStrip />
        </div>
    );
}

/**
 * Projects side by side in one strip that starts on the page's left column and runs off the right edge. Scrolling
 * anywhere on the page moves it sideways; trackpads can also swipe it directly.
 */
function DesktopStrip() {
    const stripRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const strip = stripRef.current;
        if (!strip) return;
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const desktop = window.matchMedia(DESKTOP_QUERY);
        // Back from a project, the strip opens on the last one viewed (lined up with the column's left edge), so the
        // slide lands on it even after stepping through others with previous and next.
        const last =
            isTransitioning() && strip.querySelector(`[data-slug="${sessionStorage.getItem(LAST_PROJECT_KEY)}"]`);
        if (last) {
            const inset = parseFloat(getComputedStyle(strip).paddingLeft);
            strip.scrollLeft += last.getBoundingClientRect().left - strip.getBoundingClientRect().left - inset;
        }
        let target = strip.scrollLeft;
        let raf = 0;

        const glide = () => {
            const gap = target - strip.scrollLeft;
            if (Math.abs(gap) < 0.5) {
                strip.scrollLeft = target;
                raf = 0;
                return;
            }
            strip.scrollLeft += gap * GLIDE;
            raf = requestAnimationFrame(glide);
        };

        // Scrolling anywhere on the page moves the strip: a vertical wheel turns into a sideways glide. A sideways
        // swipe over the strip is left to the browser; anywhere else it glides the strip too.
        const onWheel = (e: WheelEvent) => {
            // The strip is only shown on desktop; below that the mobile list scrolls normally.
            if (!desktop.matches) return;
            const sideways = Math.abs(e.deltaX) > Math.abs(e.deltaY);
            if (sideways && strip.contains(e.target as Node)) return;
            e.preventDefault();
            const delta = sideways ? e.deltaX : e.deltaY;
            const max = strip.scrollWidth - strip.clientWidth;
            if (!raf) target = strip.scrollLeft;
            target = Math.max(0, Math.min(max, target + (e.deltaMode === 1 ? delta * 16 : delta)));
            if (still) strip.scrollLeft = target;
            else if (!raf) raf = requestAnimationFrame(glide);
        };

        window.addEventListener("wheel", onWheel, { passive: false });
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener("wheel", onWheel);
        };
    }, []);

    return (
        <main className="flex h-full flex-col justify-center pt-12 max-lg:hidden">
            {/* The padding lines the first and last tiles up with the 56rem column the project pages use. */}
            <div
                ref={stripRef}
                className="flex gap-3 overflow-x-auto px-[max(1.5rem,calc((100vw-56rem)/2))] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
                {projectsByDate.map((project, i) => (
                    <StripTile key={project.slug} project={project} priority={i < 2} />
                ))}
            </div>
        </main>
    );
}

/** One project: its thumbnail, large, with the name, year and tagline under it. Hovering zooms in and says where it goes. */
function StripTile({ project, priority }: { project: Project; priority: boolean }) {
    const router = useRouter();
    const href = projectHref(project);
    const external = href !== undefined && isExternal(href);
    const body = (
        <>
            <div
                data-slug={project.slug}
                className="relative aspect-[3/2] h-[min(62vh,42rem)] overflow-hidden bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)]"
            >
                <Image
                    src={project.thumb}
                    alt=""
                    fill
                    // fetchPriority, not preload: a preload would also download it on phones, where the strip is hidden.
                    fetchPriority={priority ? "high" : undefined}
                    sizes="(min-height: 1100px) 63rem, 93vh"
                    quality={90}
                    className={`object-cover transition-transform duration-700 ease-out ${href ? "group-hover:scale-[1.03] group-focus-visible:scale-[1.03]" : ""}`}
                />
                {href && (
                    <span className="pointer-events-none absolute bottom-4 left-4 translate-y-1 rounded-full bg-[rgb(0_0_0/0.55)] px-3 py-1.5 font-geistMono text-[12px] text-dark-foreground opacity-0 backdrop-blur-md transition-[opacity,transform] duration-300 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100">
                        {external ? "visit site ↗" : "view project"}
                    </span>
                )}
            </div>
            <div className="mt-3 flex items-baseline gap-3">
                <span className="whitespace-nowrap text-[15px]">{project.name}</span>
                <span className="whitespace-nowrap font-geistMono text-[12px] text-[var(--muted-color)]">
                    {project.year}
                </span>
            </div>
            {project.page?.tagline && (
                <p className="mt-1 text-[14px] leading-[1.5] text-[var(--muted-color)]">{project.page.tagline}</p>
            )}
        </>
    );
    // As wide as the thumbnail, so a long tagline wraps instead of pushing the next tile along.
    const className = "group block w-min shrink-0 outline-none focus-visible:underline";

    if (!href) return <div className={className}>{body}</div>;
    if (external) {
        return (
            <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${project.name}, opens in a new tab`}
                className={className}
            >
                {body}
            </a>
        );
    }
    return (
        <Link
            href={href}
            aria-label={project.name}
            className={className}
            onClick={(e) => {
                // Let modified clicks open a new tab as usual.
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                // The strip slides off to the left and the project page slides in after it (see globals.css).
                pushWithTransition(router, href);
            }}
        >
            {body}
        </Link>
    );
}

function MobileLayout() {
    return (
        <div className="w-full h-full overflow-y-auto bg-background lg:hidden">
            <MobileNav />
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
                                fetchPriority={i === 0 ? "high" : undefined}
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
                                className="mt-5 self-start inline-flex items-center justify-center whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground active:scale-95 transition-all text-foreground py-1 px-4 rounded-full"
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
