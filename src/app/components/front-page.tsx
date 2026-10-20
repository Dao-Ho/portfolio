"use client";
import { motion } from "framer-motion";
import { useGlobal } from "../../context-providers/global-provider";
import Cited from "./citation";
import Container from "./container";
import type { PondStats } from "./koi-pond/koi-pond";

const SOCIALS = [
    { label: "github", href: "https://github.com/Dao-Ho" },
    { label: "linkedin", href: "https://www.linkedin.com/in/dao-ho/" },
    { label: "x", href: "https://x.com/daoho04" },
];

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
                Because if we don't,
                <br />
                who will?
                <span
                    aria-hidden="true"
                    className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-blink bg-foreground motion-reduce:animate-none"
                />
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
                <p className="mt-[1.5vh]">
                    {SOCIALS.map(({ label, href }, i) => (
                        <span key={label}>
                            {i > 0 && <span className="opacity-40"> / </span>}
                            <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-[color-mix(in_srgb,var(--foreground-color)_35%,transparent)] decoration-1 underline-offset-[5px] opacity-60 outline-none transition-opacity duration-150 hover:decoration-foreground hover:opacity-100 focus-visible:decoration-foreground focus-visible:opacity-100"
                            >
                                {label}
                            </a>
                        </span>
                    ))}
                </p>
            </motion.div>
        </Container>
    );
};

const mobilePage = () => {
    const MENTIONS = [
        { verb: "building", name: "Generate", href: "https://generatenu.com/" },
        { verb: "researching", name: "PARCS Lab", href: "https://parcslab.fyi/" },
        { verb: "incoming", name: "Google", href: "https://gemini.google.com/" },
    ];
    return (
        <Container as="header" className="flex flex-col bg-transparent pb-8 pt-[15vh] text-foreground">
            <h1 data-koi-avoid className="font-inter text-[15px] leading-relaxed mb-3">
                <span className="opacity-60">Xin chào, I&apos;m </span>
                <strong className="opacity-70">Dao</strong>
                <span className="opacity-60">.</span>
            </h1>
            <p data-koi-avoid className="font-inter text-[15px] leading-relaxed mb-3">
                <span className="opacity-60">I&apos;m a </span>
                <strong className="opacity-70">Software Engineer</strong>
                <span className="opacity-60"> passionate about building the future.</span>
            </p>
            <p data-koi-avoid className="font-inter text-[15px] leading-relaxed mb-3">
                <strong className="opacity-70">Northeastern &apos;26</strong>
                <span className="opacity-60">, Computer Science and Finance.</span>
            </p>
            <p data-koi-avoid className="font-inter text-[15px] leading-relaxed">
                <span className="opacity-60">Currently, </span>
                {MENTIONS.map(({ verb, name, href }, i) => (
                    <span key={name}>
                        <span className="opacity-60">{verb} </span>
                        <a href={href} target="_blank" rel="noopener noreferrer">
                            <strong className="opacity-70 underline cursor-pointer hover:text-[#3c7cff] transition-colors">
                                @{name}
                            </strong>
                        </a>
                        <span className="opacity-60">{i < MENTIONS.length - 1 ? ", " : "."}</span>
                    </span>
                ))}
            </p>
        </Container>
    );
};

export default FrontPage;
