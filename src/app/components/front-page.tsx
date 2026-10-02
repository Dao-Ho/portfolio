"use client";
import { motion } from "framer-motion";
import { useGlobal } from "../../context-providers/global-provider";
import GitHubContributions from "./contribution-graph";
import Cited from "./citation";
import Container from "./container";

const FrontPage = ({ isLight }: { isLight: boolean }) => {
    const { isMobile } = useGlobal();

    if (isMobile === null) return null;
    return isMobile ? mobilePage() : desktopPage({ isLight: isLight });
};

const desktopPage = ({ isLight }: { isLight: boolean }) => {
    return (
        <Container as="header" className="flex min-h-[85vh] flex-col bg-transparent pt-40 text-foreground">
            <motion.div
                className="cited-prose leading-[3vh]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h1 className="font-roboto text-[18px]">Xin chào, I'm Dao.</h1>
                <p className="font-roboto text-[18px]">I'm a Software Engineer passionate about building the future.</p>
                <p className="font-roboto text-[18px]">
                    Previously @{" "}
                    <Cited source="google" isLight={isLight}>
                        Google
                    </Cited>
                    ,{" "}
                    <Cited source="agency" isLight={isLight}>
                        Agency
                    </Cited>
                    ,{" "}
                    <Cited source="designai" isLight={isLight}>
                        DesignAI
                    </Cited>
                    ,{" "}
                    <Cited source="paynalli" isLight={isLight}>
                        Paynalli
                    </Cited>
                    , and{" "}
                    <Cited source="khoury" isLight={isLight}>
                        Khoury
                    </Cited>
                    .
                </p>
                <p className="font-roboto text-[18px]">Northeastern '27, Computer Science and Finance.</p>
                <p className="font-roboto text-[18px]">
                    Currently, building @{" "}
                    <Cited source="generate" isLight={isLight}>
                        Generate
                    </Cited>
                    , researching @{" "}
                    <Cited source="parcs" isLight={isLight}>
                        PARCS Lab
                    </Cited>
                    , incoming @{" "}
                    <Cited source="googleIncoming" isLight={isLight}>
                        Google
                    </Cited>
                    .
                </p>
            </motion.div>
            <motion.div
                className="mt-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.25 }}
            >
                <GitHubContributions userName="Dao-Ho" isLight={isLight} />
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
            <h1 className="font-inter text-[15px] leading-relaxed mb-3">
                <span className="opacity-60">Xin chào, I&apos;m </span>
                <strong className="opacity-70">Dao</strong>
                <span className="opacity-60">.</span>
            </h1>
            <p className="font-inter text-[15px] leading-relaxed mb-3">
                <span className="opacity-60">I&apos;m a </span>
                <strong className="opacity-70">Software Engineer</strong>
                <span className="opacity-60"> passionate about building the future.</span>
            </p>
            <p className="font-inter text-[15px] leading-relaxed mb-3">
                <strong className="opacity-70">Northeastern &apos;27</strong>
                <span className="opacity-60">, Computer Science and Finance.</span>
            </p>
            <p className="font-inter text-[15px] leading-relaxed">
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
