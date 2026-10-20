"use client";
import { motion } from "framer-motion";
import { useGlobal } from "../../context-providers/global-provider";
import Cited from "./citation";
import Container from "./container";
import type { PondStats } from "./koi-pond/koi-pond";
import { SOURCES } from "../data/sources";

const SOCIALS = [
    { label: "github", href: "https://github.com/Dao-Ho" },
    { label: "linkedin", href: "https://www.linkedin.com/in/dao-ho/" },
    { label: "x", href: "https://x.com/daoho04" },
];

const UNDERLINE =
    "underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] outline-none transition-opacity duration-150 hover:decoration-foreground focus-visible:decoration-foreground";

const QuoteLines = () => (
    <>
        Because if we don&apos;t,
        <br />
        who will?
        <span
            aria-hidden="true"
            className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
        />
    </>
);

const Socials = ({ className }: { className?: string }) => (
    <p className={className}>
        {SOCIALS.map(({ label, href }, i) => (
            <span key={label}>
                {i > 0 && <span className="opacity-40"> / </span>}
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${UNDERLINE} opacity-60 hover:opacity-100 focus-visible:opacity-100`}
                >
                    {label}
                </a>
            </span>
        ))}
    </p>
);

const FrontPage = ({ isLight, stats }: { isLight: boolean; stats: PondStats }) => {
    const { isMobile } = useGlobal();

    if (isMobile === null) return null;
    return isMobile ? mobilePage() : desktopPage({ isLight, stats });
};

const desktopPage = ({ isLight, stats }: { isLight: boolean; stats: PondStats }) => {
    return (
        <Container
            as="header"
            className="relative flex min-h-[100svh] flex-col justify-end gap-10 bg-transparent pb-32 pt-32 text-foreground"
        >
            {stats.koi > 0 && (
                <div
                    data-koi-avoid
                    aria-hidden="true"
                    className="absolute right-6 top-8 font-geistMono text-[11px] leading-relaxed tabular-nums opacity-[0.32] lg:right-[20vw]"
                >
                    <div>{stats.koi}</div>
                    <div>{stats.pellets}</div>
                </div>
            )}
            <motion.blockquote
                data-koi-avoid
                className="font-geistMono text-[14px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="cited-prose max-w-[54rem] font-geistMono text-[15px] leading-[max(22px,3vh)]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Xin chào, I'm Dao.</h1>
                <p>
                    Software Engineer @{" "}
                    <Cited source="googleIncoming" isLight={isLight}>
                        Google
                    </Cited>
                    , passionate about building the future.
                </p>
                <p>
                    Before that,{" "}
                    <Cited source="google" isLight={isLight}>
                        Google
                    </Cited>{" "}
                    (intern),{" "}
                    <Cited source="agency" isLight={isLight}>
                        Agency
                    </Cited>
                    , and a few{" "}
                    <Cited source="startups" isLight={isLight}>
                        early-stage startups
                    </Cited>
                    .
                </p>
                <p>
                    Currently, building @{" "}
                    <Cited source="generate" isLight={isLight}>
                        Generate
                    </Cited>
                    , researching @{" "}
                    <Cited source="parcs" isLight={isLight}>
                        PARCS Lab
                    </Cited>
                    .
                </p>
                <Socials className="mt-[1.5vh]" />
            </motion.div>
        </Container>
    );
};

// Hover cards need a pointer, so on touch the mentions link straight to each site.
const MobileLink = ({ source, children }: { source: string; children: React.ReactNode }) => (
    <a href={SOURCES[source].href} target="_blank" rel="noopener noreferrer" className={UNDERLINE}>
        {children}
    </a>
);

const mobilePage = () => {
    return (
        // Top padding clears the floating nav pill.
        <Container
            as="header"
            className="flex min-h-[100svh] flex-col justify-end gap-8 bg-transparent pb-12 pt-28 font-geistMono text-foreground"
        >
            <motion.blockquote
                data-koi-avoid
                className="text-[13px] lowercase leading-relaxed tracking-[0.02em]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.4 }}
            >
                <QuoteLines />
            </motion.blockquote>
            <motion.div
                data-koi-avoid
                className="flex flex-col gap-3 text-[14px] leading-[1.6]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
            >
                <h1>Xin chào, I&apos;m Dao.</h1>
                <p>
                    Software Engineer @ <MobileLink source="googleIncoming">Google</MobileLink>, passionate about
                    building the future.
                </p>
                <p>
                    Before that, <MobileLink source="google">Google</MobileLink> (intern),{" "}
                    <MobileLink source="agency">Agency</MobileLink>, and a few early-stage startups.
                </p>
                <p>
                    Currently, building @ <MobileLink source="generate">Generate</MobileLink>, researching @{" "}
                    <MobileLink source="parcs">PARCS Lab</MobileLink>.
                </p>
                <Socials className="mt-2" />
            </motion.div>
        </Container>
    );
};

export default FrontPage;
