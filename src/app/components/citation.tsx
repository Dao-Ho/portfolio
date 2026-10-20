"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { SOURCES, type Source } from "../data/sources";

const OPEN_DELAY = 55;
const CLOSE_DELAY = 30;
const CARD_W = 340; // wide enough that the longest source name clears the date
const MARK_PX = 16;

/** The source's favicon, or its initial when there isn't one to vendor. */
const Mark = ({
    icon,
    name,
    size,
    scale = 1,
    inline = false,
}: {
    icon?: string;
    name: string;
    size: number;
    scale?: number;
    inline?: boolean;
}) => (
    <span
        className={`${inline ? "inline-flex" : "flex"} shrink-0 items-center justify-center`}
        style={{
            width: size,
            height: size,
            // keeps the same corner language as the chip that holds it
            borderRadius: size >= 24 ? 8 : 4,
            // nudge onto the text's optical centre without disturbing the baseline
            verticalAlign: inline ? -2 : undefined,
            marginRight: inline ? 4 : undefined,
            background: icon ? undefined : "color-mix(in srgb, var(--foreground-color) 12%, transparent)",
            // the box is fixed either way, so an over-scaled mark spills into the
            // chip's padding instead of changing the layout
            overflow: icon ? "visible" : "hidden",
        }}
    >
        {icon ? (
            <Image src={icon} alt="" width={Math.round(size * scale)} height={Math.round(size * scale)} unoptimized />
        ) : (
            <span className="opacity-60" style={{ fontSize: Math.round(size * 0.64), lineHeight: 1 }}>
                {name.charAt(0)}
            </span>
        )}
    </span>
);

/** An underlined @-mention whose hover card reads source / role / one line; clicking opens the source. */
const Cited = ({ source, children, isLight }: { source: string; children: React.ReactNode; isLight: boolean }) => {
    const src = SOURCES[source];
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const openTimer = useRef<ReturnType<typeof setTimeout>>();
    const closeTimer = useRef<ReturnType<typeof setTimeout>>();

    const show = useCallback(() => {
        clearTimeout(closeTimer.current);
        openTimer.current = setTimeout(() => setOpen(true), OPEN_DELAY);
    }, []);

    const hide = useCallback(() => {
        clearTimeout(openTimer.current);
        closeTimer.current = setTimeout(() => setOpen(false), CLOSE_DELAY);
    }, []);

    useEffect(
        () => () => {
            clearTimeout(openTimer.current);
            clearTimeout(closeTimer.current);
        },
        []
    );

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    if (!src) return <>{children}</>;

    const members = src.group?.map((key) => SOURCES[key]).filter(Boolean);

    const go = (target: Source) => {
        setOpen(false);
        if (!target.href) return;
        if (target.href.startsWith("/")) router.push(target.href);
        else window.open(target.href, "_blank", "noopener");
    };

    // A group's mention lands on its first member; its card lets you pick one.
    const activate = () => go(members?.[0] ?? src);

    return (
        <span
            className="relative inline-block"
            // Drives the prose dim in globals.css. Needed because :hover alone is
            // lost the moment the cursor moves onto the open card, which is a
            // descendant — the pill would stay lit while the prose snapped back.
            data-cited-open={open ? "true" : undefined}
            onMouseEnter={show}
            onMouseLeave={hide}
        >
            <button
                type="button"
                onClick={activate}
                onFocus={show}
                onBlur={hide}
                aria-label={`${src.name}, ${src.role}`}
                // A plain underline marks the mention; it darkens on hover, focus, or while the card is open.
                className={`cursor-pointer inline align-baseline underline decoration-1 underline-offset-[5px] transition-[text-decoration-color] duration-150 outline-none focus-visible:decoration-2 ${
                    open
                        ? "decoration-foreground text-foreground"
                        : "decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] hover:decoration-foreground hover:text-foreground focus-visible:decoration-foreground focus-visible:text-foreground"
                }`}
            >
                {children}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.span
                        initial={{ opacity: 0, y: 4, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 2, scale: 0.99, transition: { duration: 0.08, ease: "easeIn" } }}
                        transition={{ duration: 0.12, ease: "easeOut" }}
                        onClick={members ? undefined : activate}
                        data-koi-ignore
                        className="absolute bottom-full left-0 z-50 mb-[10px] flex origin-bottom-left flex-col overflow-hidden rounded-[8px] cursor-pointer font-geistMono text-foreground"
                        style={{
                            width: CARD_W,
                            // Linear-style elevated surface: a solid step up from the page, a hairline border,
                            // a faint top highlight, and a layered shadow instead of glass.
                            background: isLight
                                ? "color-mix(in srgb, var(--background-color) 45%, #ffffff)"
                                : "color-mix(in srgb, var(--background-color) 93%, var(--foreground-color))",
                            border: `1px solid color-mix(in srgb, var(--foreground-color) ${isLight ? 11 : 9}%, transparent)`,
                            boxShadow: isLight
                                ? "inset 0 1px 0 rgba(255, 255, 255, 0.8), 0 1px 2px rgba(38, 37, 35, 0.06), 0 12px 32px -12px rgba(38, 37, 35, 0.18)"
                                : "inset 0 1px 0 color-mix(in srgb, var(--foreground-color) 6%, transparent), 0 1px 2px rgba(0, 0, 0, 0.3), 0 16px 40px -12px rgba(0, 0, 0, 0.6)",
                        }}
                    >
                        {members ? (
                            <span className="flex flex-col px-[6px] py-[6px]">
                                {members.map((m) => (
                                    <span
                                        key={m.key}
                                        role="button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            go(m);
                                        }}
                                        className="flex flex-col gap-[6px] rounded-[6px] px-[8px] py-[8px] transition-colors duration-100 hover:bg-[color-mix(in_srgb,var(--foreground-color)_6%,transparent)]"
                                    >
                                        <span className="flex items-center gap-[8px] text-[12px] leading-none">
                                            <Mark icon={m.icon} name={m.name} size={MARK_PX} scale={m.iconScale} />
                                            <span className="truncate opacity-60">{m.name}</span>
                                            <span className="ml-auto shrink-0 pl-2 tabular-nums opacity-40">
                                                {m.dates}
                                            </span>
                                        </span>
                                        <span className="text-[12px] leading-[18px] opacity-60">{m.summary}</span>
                                    </span>
                                ))}
                            </span>
                        ) : (
                            <span className="flex flex-col gap-[6px] px-[14px] pb-[12px] pt-[12px]">
                                {/* source, with the date as right-aligned metadata */}
                                <span className="flex items-center gap-[8px] text-[12px] leading-none">
                                    <Mark icon={src.icon} name={src.name} size={MARK_PX} scale={src.iconScale} />
                                    <span className="truncate opacity-60">{src.name}</span>
                                    <span className="ml-auto shrink-0 pl-2 tabular-nums opacity-40">{src.dates}</span>
                                </span>

                                <span className="mt-[4px] text-[13px] leading-[18px]">{src.role}</span>

                                <span
                                    className="text-[12px] leading-[18px] overflow-hidden opacity-60"
                                    style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}
                                >
                                    {src.summary}
                                </span>
                            </span>
                        )}

                        {/* what a click does, set apart like a command hint */}
                        <span
                            className="flex items-center justify-between px-[14px] py-[8px] text-[11px] leading-none opacity-40"
                            style={{
                                borderTop: `1px solid color-mix(in srgb, var(--foreground-color) ${isLight ? 8 : 7}%, transparent)`,
                            }}
                        >
                            <span>
                                {members ? "open a site" : src.href?.startsWith("/") ? "open page" : "open site"}
                            </span>
                            <span aria-hidden="true">{src.href?.startsWith("/") ? "→" : "↗"}</span>
                        </span>
                    </motion.span>
                )}
            </AnimatePresence>
        </span>
    );
};

export default Cited;
