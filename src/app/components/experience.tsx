"use client";

import { MutableRefObject, useRef } from "react";
import agencyLogoMap from "../../../public/Images/agency-logo-map.json";
import nuscimagazineLogoMap from "../../../public/Images/nusci-logo-map.json";
import neuLogoMap from "../../../public/Images/neu-logo-map.json";
import paynalliSystemsLogoMap from "../../../public/Images/paynalli-systems-map.json";
import designAiLogoMap from "../../../public/Images/design-ai-logo-map.json";
import ScrollReveal from "./scroll-reveal";
import InteractiveLogoDots, { LogoMapConfig } from "./interactive-logo";
import { useGlobal } from "../../lib/utils";
import GoogleLogoMap from "../../../public/Images/google-logo-map.json";

const experiences = [
    {
        companyName: "Google",
        role: "Software Engineer Intern",
        duration: "Summer 2026",
        yearRange: "Summer 2026",
        summary: `Incoming summer 2026. AI/ML in Shopping Search.`,
        link: "https://www.google.com/",
        logoMap: GoogleLogoMap,
    },
    {
        companyName: "Agency",
        role: "Member of Technical Staff Co-op",
        duration: "May 2025 - Dec 2025",
        yearRange: "May → Dec 2025",
        summary: "Learned the meaning of tracer bullets, velocity, and what it takes to scale them.",
        link: "https://www.agency.inc/",
        logoMap: agencyLogoMap,
    },
    {
        companyName: "DesignAI",
        role: "Software Engineer Intern",
        duration: "Sept 2024 - Jan 2025",
        yearRange: "Sept 2024 → Jan 2025",
        summary:
            "Led the development of an image management platform that streamlined how interior designers search, organize, and work with furniture design collections. Architected the search system for fast, intuitive performance and created a secure infrastructure for managing design assets.",
        link: "https://www.designai.co/",
        logoMap: designAiLogoMap,
    },
    {
        companyName: "Paynalli Systems",
        role: "Software Engineer Intern",
        duration: "July 2024 - Sept 2024",
        yearRange: "Jul → Sept 2024",
        summary:
            "Worked with an incredible team under the SCRUM methodology, I played a key role in developing, revising, and shipping software to production. Beyond creating an intuitive and responsive frontend, I experimented with and engineered the RAG architecture for various embedding models and vector databases to streamline the recruiter-candidate search experience.",
        link: "https://paynalli.com/",
        logoMap: paynalliSystemsLogoMap,
    },
    {
        companyName: "NUSci Magazine",
        role: "Junior Software Engineer",
        duration: "Jan 2024 - Sept 2024",
        yearRange: "Jan → Sept 2024",
        summary:
            "Worked with an awesome team of developers, helped architect scalable and robust database schema, secure API endpoints, responsive frontend designs, and rigorous tests. Developed a revamped website to improve user experience.",
        link: "https://nuscimagazine.com/",
        logoMap: nuscimagazineLogoMap,
    },
    {
        companyName: "Northeastern University",
        role: "Discrete Math Teaching Assistant",
        duration: "Sept 2023 - May 2024",
        yearRange: "Sept 2023 → May 2024",
        summary:
            "Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. Provided additional resources and comprehensive grading feedback to students on homeworks and exams.",
        link: "https://www.khoury.northeastern.edu/",
        logoMap: neuLogoMap,
    },
];

const ExperiencePage = ({ isLight }: { isLight: boolean }) => {
    const scrollRef = useRef(null);
    const { isMobile } = useGlobal();

    return isMobile ? <MobilePage scrollRef={scrollRef} /> : <DesktopPage scrollRef={scrollRef} isLight={isLight} />;
};

const DesktopPage = ({ scrollRef, isLight }: { scrollRef: MutableRefObject<null>; isLight: boolean }) => {
    const styles = {
        parentContainer:
            "w-[100vw] y-overflow overflow-hidden bg-background text-foreground transition-colors duration-300 flex justify-center",
        allExperiencesContainer: "flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]",
        experienceContainer: "space-x-[12vw] flex-row flex items-center font-sourceSans3",
        textContainer: "w-[20vw] flex flex-col justify-center",
        companyName: "text-[2.75vw] leading-[3vw] font-bold font-playfairDisplay",
        duration: "font-semibold font-oswald text-[1vw] leading-[1.25vw]",
        role: "font-semibold font-oswald text-[1.5vw] mt-[0.5vh]",
        summary: "font-med text-[1.10vw] leading-[1.75vw] mt-[2vh] whitespace-pre-line",
    };

    const ExperienceItem = ({
        companyName,
        role,
        summary,
        link,
        duration,
        isReversed,
        isLight,
        logoMap,
    }: {
        companyName: string;
        role: string;
        summary: string;
        link: string;
        duration: string;
        isReversed: boolean;
        isLight: boolean;
        logoMap: LogoMapConfig;
    }) => {
        const textContent = (
            <div className={styles.textContainer}>
                <a href={link} className="hover:opacity-80 transition-opacity font-playfairDisplay">
                    <ScrollReveal
                        scrollContainerRef={scrollRef}
                        baseOpacity={0.1}
                        baseRotation={2}
                        blurStrength={5}
                        enableBlur={true}
                        className={styles.companyName}
                    >
                        {companyName}
                    </ScrollReveal>

                    <ScrollReveal
                        scrollContainerRef={scrollRef}
                        baseOpacity={0.1}
                        baseRotation={1}
                        blurStrength={5}
                        enableBlur={true}
                        className={styles.role}
                    >
                        {role}
                    </ScrollReveal>
                    <ScrollReveal
                        scrollContainerRef={scrollRef}
                        baseOpacity={0.1}
                        baseRotation={2}
                        blurStrength={5}
                        enableBlur={true}
                        className={styles.duration}
                    >
                        {duration}
                    </ScrollReveal>

                    <ScrollReveal
                        scrollContainerRef={scrollRef}
                        baseOpacity={0.1}
                        baseRotation={1}
                        blurStrength={5}
                        enableBlur={true}
                        className={styles.summary}
                    >
                        {summary}
                    </ScrollReveal>
                </a>
            </div>
        );

        const logoContainer = (
            <div className="w-[22vw] h-[25vw] flex items-center justify-center">
                <InteractiveLogoDots logoMap={logoMap} isLight={isLight} />
            </div>
        );

        return (
            <div className={styles.experienceContainer}>
                {isReversed ? (
                    <>
                        {logoContainer}
                        {textContent}
                    </>
                ) : (
                    <>
                        {textContent}
                        {logoContainer}
                    </>
                )}
            </div>
        );
    };

    return (
        <div className={styles.parentContainer}>
            <div className={styles.allExperiencesContainer} id="experience">
                {experiences.map((exp, index) => (
                    <ExperienceItem
                        key={index}
                        {...exp}
                        isReversed={index % 2 === 1}
                        isLight={isLight}
                        logoMap={exp.logoMap}
                    />
                ))}
            </div>
        </div>
    );
};

const MobilePage = ({ scrollRef }: { scrollRef: MutableRefObject<null> }) => {
    const MobileExperienceItem = ({
        companyName,
        role,
        summary,
        yearRange,
        link,
    }: {
        companyName: string;
        role: string;
        summary: string;
        yearRange: string;
        link: string;
    }) => {
        return (
            <div className="mb-10">
                <div className="mb-1">
                    <span className="font-inter text-[13px] text-foreground opacity-50">{yearRange}</span>
                </div>
                <div className="mb-3">
                    <span className="font-inter text-[15px] text-foreground opacity-70">
                        <a href={link} className="underline hover:opacity-70 transition-opacity">
                            {companyName}
                        </a>
                        {" · "}
                        <span className="font-bold">{role}</span>
                    </span>
                </div>
                <p className="font-inter text-[15px] leading-relaxed text-foreground opacity-60">{summary}</p>
            </div>
        );
    };

    return (
        <div
            className="w-[100vw] bg-background text-foreground transition-colors duration-300 px-6 pb-16"
            id="experience"
        >
            <div className="flex items-center gap-4 mb-8">
                <span className="font-inter text-[15px] text-foreground opacity-40 shrink-0">Experience</span>
                <div className="flex-1 h-px bg-foreground opacity-20" />
            </div>
            {experiences.map((exp, index) => (
                <MobileExperienceItem key={index} {...exp} />
            ))}
        </div>
    );
};

export default ExperiencePage;
