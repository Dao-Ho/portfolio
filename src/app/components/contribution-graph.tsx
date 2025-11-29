"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { ChevronRight, ArrowRight, IterationCw } from "lucide-react";
import ElasticSlider from "./elastic-slider";

interface ContributionDay {
    contributionCount: number;
    date: string;
}

interface Week {
    contributionDays: ContributionDay[];
}

interface ContributionCalendar {
    totalContributions: number;
    weeks: Week[];
}

interface GitHubResponse {
    data: {
        user: {
            contributionsCollection: {
                contributionCalendar: ContributionCalendar;
            };
        };
    };
    error?: string;
}

interface GitHubContributionGridProps {
    userName: string;
    isLight: boolean;
}

interface CellState {
    x: number;
    y: number;
    vx: number;
    vy: number;
    touched: boolean;
}

const GitHubContributionGrid: React.FC<GitHubContributionGridProps> = ({ userName, isLight }) => {
    const [contributions, setContributions] = useState<ContributionCalendar | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [cellStates, setCellStates] = useState<Map<string, CellState>>(new Map());
    const DEFAULT_MOUSE_RADIUS = 50;
    const [isHovering, setIsHovering] = useState(false);
    const [isResetHovering, setIsResetHovering] = useState(false);
    const [mouseRadius, setMouseRadius] = useState<number>(DEFAULT_MOUSE_RADIUS);
    const mouseRef = useRef({ x: 0, y: 0 });
    const animationRef = useRef<number>();
    const containerRef = useRef<HTMLDivElement>(null);

    // Fetch GitHub data
    useEffect(() => {
        fetch(`/api/github-contributions?userName=${userName}`)
            .then((res) => res.json())
            .then((data: GitHubResponse | { error: string }) => {
                if ("error" in data) {
                    console.error(data.error);
                } else {
                    setContributions(data.data.user.contributionsCollection.contributionCalendar);
                }
            })
            .catch((err: Error) => console.error(err))
            .finally(() => setLoading(false));
    }, [userName]);

    // Initialize cell states
    useEffect(() => {
        if (!contributions) return;

        const initialStates = new Map<string, CellState>();
        contributions.weeks.forEach((week, weekIndex) => {
            week.contributionDays.forEach((day, dayIndex) => {
                const key = `${weekIndex}-${dayIndex}`;
                initialStates.set(key, { x: 0, y: 0, vx: 0, vy: 0, touched: false });
            });
        });
        setCellStates(initialStates);
    }, [contributions]);

    // Mouse tracking
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };

        const handleTouchMove = (e: TouchEvent) => {
            if (e.touches.length > 0) {
                mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleTouchMove);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleTouchMove);
        };
    }, []);

    // Physics animation
    useEffect(() => {
        if (!contributions || cellStates.size === 0) return;

        const animate = () => {
            const newStates = new Map(cellStates);
            const mouse = mouseRef.current;

            newStates.forEach((state, key) => {
                const cellElement = document.getElementById(`cell-${key}`);
                if (!cellElement) return;

                const rect = cellElement.getBoundingClientRect();
                const cellCenterX = rect.left + rect.width / 2;
                const cellCenterY = rect.top + rect.height / 2;

                const dx = mouse.x - cellCenterX;
                const dy = mouse.y - cellCenterY;
                const distanceSquared = dx * dx + dy * dy;
                const radiusSquared = mouseRadius * mouseRadius;

                if (distanceSquared < radiusSquared && distanceSquared > 0) {
                    const distance = Math.sqrt(distanceSquared);
                    const force = (mouseRadius - distance) / mouseRadius;
                    const angle = Math.atan2(dy, dx);

                    const pushStrength = force * force * 2.5;
                    state.vx -= pushStrength * Math.cos(angle);
                    state.vy -= pushStrength * Math.sin(angle);

                    // Mark as touched when in radius
                    if (!state.touched) {
                        state.touched = true;
                    }
                }

                // Apply friction
                state.vx *= 0.92;
                state.vy *= 0.92;

                // Spring back to origin
                state.x += state.vx + (0 - state.x) * 0.15;
                state.y += state.vy + (0 - state.y) * 0.15;
            });

            setCellStates(newStates);
            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [contributions, cellStates.size, mouseRadius]);

    const getColor = (count: number, touched: boolean) => {
        // GitHub green colors when touched (adjusted for light/dark mode)
        if (touched) {
            if (isLight) {
                // Light mode GitHub greens
                if (count === 0) return "#ebedf0";
                if (count < 2) return "#9be9a8";
                if (count < 5) return "#40c463";
                if (count < 10) return "#30a14e";
                return "#216e39";
            } else {
                // Dark mode GitHub greens
                if (count === 0) return "#1c1f26";
                if (count < 2) return "#0e4429";
                if (count < 5) return "#006d32";
                if (count < 10) return "#26a641";
                return "#39d353";
            }
        }

        // Original colors when not touched
        if (count === 0) return isLight ? "#ebe6dd" : "#2d2c29";
        if (count < 2) return isLight ? "#cbbfaf" : "#3f3d3a";
        if (count < 5) return isLight ? "#a89582" : "#565350";
        if (count < 10) return isLight ? "#80705f" : "#6e6860";
        return isLight ? "#5a4d3f" : "#938d82";
    };

    const router = useRouter();
    const navigateToGitHub = () => {
        router.push("https://github.com/Dao-Ho");
    };

    const resetGraph = () => {
        const resetStates = new Map(cellStates);
        resetStates.forEach((state) => {
            state.touched = false;
        });
        setCellStates(resetStates);
    };

    if (loading) {
        return (
            <div ref={containerRef} className="flex flex-col gap-2">
                <div>
                    <span
                        className=" text-md font-light opacity-70 cursor-pointer transition-colors duration-300"
                        onClick={navigateToGitHub}
                        onMouseEnter={(e) => {
                            setIsHovering(true);
                            e.currentTarget.style.color = "#3c7cff";
                        }}
                        onMouseLeave={(e) => {
                            setIsHovering(false);
                            e.currentTarget.style.color = isLight ? "#262523" : "#cbd0d2";
                        }}
                    >
                        See what I've been up to
                        <ArrowRight
                            className="inline-block transition-all duration-300"
                            size={16}
                            style={{
                                transform: isHovering ? "rotate(90deg)" : "rotate(0deg)",
                            }}
                        />
                    </span>
                </div>
                <div className="flex gap-1 opacity-50 animate-pulse">
                    {Array.from({ length: 52 }).map((_, weekIndex) => (
                        <div key={weekIndex} className="flex flex-col gap-2">
                            {Array.from({ length: 7 }).map((_, dayIndex) => (
                                <div
                                    key={dayIndex}
                                    className="w-[0.85vw] h-[0.85vw] rounded-full"
                                    style={{
                                        backgroundColor: isLight ? "#ebe6dd" : "#2d2c29",
                                    }}
                                />
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!contributions) {
        return (
            <div className="w-full h-full flex items-center justify-center">
                <p className={isLight ? "text-gray-800" : "text-gray-200"}>Failed to load contributions</p>
            </div>
        );
    }

    return (
        <div ref={containerRef} className="flex flex-col gap-2">
            <div>
                <span
                    className=" text-md font-light opacity-70 cursor-pointer transition-colors duration-300"
                    onClick={navigateToGitHub}
                    onMouseEnter={(e) => {
                        setIsHovering(true);
                        e.currentTarget.style.color = "#3c7cff";
                    }}
                    onMouseLeave={(e) => {
                        setIsHovering(false);
                        e.currentTarget.style.color = isLight ? "#262523" : "#cbd0d2";
                    }}
                >
                    See what I've been up to
                    {isHovering ? (
                        <ArrowRight className="inline-block transition-all duration-300 ml-1" size={16} />
                    ) : (
                        <ChevronRight className="inline-block transition-all duration-300 ml-1" size={16} />
                    )}
                </span>
            </div>
            <div className="flex gap-1 w-full">
                {contributions.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="flex flex-col gap-2">
                        {week.contributionDays.map((day, dayIndex) => {
                            const key = `${weekIndex}-${dayIndex}`;
                            const state = cellStates.get(key) || {
                                x: 0,
                                y: 0,
                                vx: 0,
                                vy: 0,
                                touched: false,
                            };

                            return (
                                <div
                                    key={key}
                                    id={`cell-${key}`}
                                    className="w-[0.85vw] h-[0.85vw] rounded-full transition-colors duration-300"
                                    style={{
                                        backgroundColor: getColor(day.contributionCount, state.touched),
                                        transform: `translate(${state.x}px, ${state.y}px)`,
                                        willChange: "transform",
                                    }}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>
            <div className="flex items-end justify-end mt-12 gap-8">
                <ElasticSlider
                    startingValue={0}
                    defaultValue={DEFAULT_MOUSE_RADIUS}
                    maxValue={200}
                    isStepped
                    stepSize={10}
                    isLight={isLight}
                    onChange={setMouseRadius}
                />
                <span
                    className=" text-md font-light opacity-70 cursor-pointer transition-colors duration-300"
                    onClick={resetGraph}
                    onMouseEnter={(e) => {
                        setIsResetHovering(true);
                        e.currentTarget.style.color = "#3c7cff";
                    }}
                    onMouseLeave={(e) => {
                        setIsResetHovering(false);
                        e.currentTarget.style.color = isLight ? "#262523" : "#cbd0d2";
                    }}
                >
                    Reset
                    <IterationCw
                        className="inline-block transition-all duration-300 ml-1"
                        size={16}
                        style={{
                            transform: isResetHovering ? "rotate(90deg)" : "rotate(0deg)",
                        }}
                    />
                </span>
            </div>
        </div>
    );
};

export default GitHubContributionGrid;
