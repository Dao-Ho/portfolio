import { motion } from "framer-motion";
import { MutableRefObject, useRef, useEffect, useMemo, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
    children: ReactNode;
    scrollContainerRef?: MutableRefObject<HTMLElement | null>;
    enableBlur?: boolean;
    baseOpacity?: number;
    baseRotation?: number;
    blurStrength?: number;
    className?: string;
}

export default function ScrollReveal({
    children,
    scrollContainerRef,
    enableBlur = true,
    baseOpacity = 0.1,
    baseRotation = 3,
    blurStrength = 4,
    className = "",
}: ScrollRevealProps): JSX.Element {
    const containerRef = useRef<HTMLDivElement>(null);

    const splitText = useMemo(() => {
        const text = typeof children === "string" ? children : "";
        return text.split(/(\s+)/).map((word, index) => {
            if (word.match(/^\s+$/)) return word;
            return (
                <span className="inline-block word" key={index}>
                    {word}
                </span>
            );
        });
    }, [children]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const scroller = scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

        gsap.fromTo(
            el,
            { transformOrigin: "0% 50%", rotate: baseRotation },
            {
                ease: "none",
                rotate: 0,
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: "top bottom",
                    end: "bottom bottom",
                    scrub: true,
                },
            }
        );

        const wordElements = el.querySelectorAll<HTMLElement>(".word");

        wordElements.forEach((word, i) => {
            const wordStart = i / wordElements.length;
            const wordEnd = (i + 1) / wordElements.length;

            gsap.fromTo(
                word,
                { opacity: baseOpacity },
                {
                    opacity: 1,
                    ease: "none",
                    scrollTrigger: {
                        trigger: el,
                        scroller,
                        start: `top+=${wordStart * 100}% bottom-=20%`,
                        end: `top+=${wordEnd * 100}% bottom-=20%`,
                        scrub: true,
                    },
                }
            );

            if (enableBlur) {
                gsap.fromTo(
                    word,
                    { filter: `blur(${blurStrength}px)` },
                    {
                        filter: "blur(0px)",
                        ease: "none",
                        scrollTrigger: {
                            trigger: el,
                            scroller,
                            start: `top+=${wordStart * 100}% bottom-=20%`,
                            end: `top+=${wordEnd * 100}% bottom-=20%`,
                            scrub: true,
                        },
                    }
                );
            }
        });

        gsap.fromTo(
            el,
            { opacity: 0 },
            {
                opacity: 1,
                ease: "none",
                scrollTrigger: {
                    trigger: el,
                    scroller,
                    start: "top bottom",
                    end: "top bottom-=20%",
                    scrub: true,
                },
            }
        );

        return () => {
            ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
        };
    }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, blurStrength]);

    return (
        <div ref={containerRef} className={className}>
            {splitText}
        </div>
    );
}
