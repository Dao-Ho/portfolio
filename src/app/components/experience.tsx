import { MutableRefObject, useRef } from "react";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import agencyLogoMap from "../../../public/Images/agency-logo-map.json";
import nuscimagazineLogoMap from "../../../public/Images/nusci-logo-map.json";
import neuLogoMap from "../../../public/Images/neu-logo-map.json";
import paynalliSystemsLogoMap from "../../../public/Images/paynalli-systems-map.json";
import generateLogoMap from "../../../public/Images/generate-logo-map.json";
import designAiLogoMap from "../../../public/Images/design-ai-logo-map.json";
import vetrulyLogoMap from "../../../public/Images/vetruly-logo-map.json";


if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const useGlobal = () => ({ isMobile: window.innerWidth < 768 });

import ScrollReveal from "./scroll-reveal";
import InteractiveLogoDots, { LogoMapConfig } from "./interactive-logo";

const experiences = [
  {
    companyName: "Agency",
    role: "Member of Technical Staff Co-op",
    summary:
      "Learning the meaning of tracer bullets, velocity, and what it takes to scale them.",
    link: "https://paynalli.com/",
    logoMap: agencyLogoMap,
  },
  {
    companyName: "Vetruly",
    role: "Technical Lead",
    summary:
      "Led a team of 5 engineers in building and shipping Vetted, a web application currently in use connecting pet owners with care providers. Collaborated with clients to define the product vision and delivered a full-stack platform with robust deployment infrastructure.",
    link: "https://www.vetruly.com/",
    logoMap: vetrulyLogoMap,

  },
  {
    companyName: "DesignAI",
    role: "Software Engineer Intern",
    summary:
      "Designed and built an image management platform that streamlined how interior designers search, organize, and work with furniture design collections. Architected the search system for fast, intuitive performance and created a secure infrastructure for managing design assets.",
    link: "https://paynalli.com/",
    logoMap: designAiLogoMap,
  },
  {
    companyName: "Generate Product Development",
    role: "Software Engineer",
    summary:
      "Contributed as an engineer to build Three Stones, a mobile application allowing retail investors to crowdfund real estate projects. Designed and implemented authentication and core user flows across the entire stack.",
    link: "https://generatenu.com/",
    logoMap: generateLogoMap,
  },
  {
    companyName: "Paynalli Systems",
    role: "Software Engineer Intern",
    summary:
      "Working with an incredible team under the SCRUM methodology, I played a key role in developing, revising, and shipping software to production. Beyond creating an intuitive and responsive frontend, I experimented with and Engineered the RAG architecture for various embedding models and vector databases to streamline the recruiter-candidate search experience.",
    link: "https://paynalli.com/",
    logoMap: paynalliSystemsLogoMap,
  },
  {
    companyName: "NUSci – Northeastern Science Magazine",
    role: "Junior Software Engineer",
    summary:
      "Working with an awesome team of developers, I help architect scalable and robust database schema, secure API endpoints, responsive frontend designs, and rigorous tests. Currently developing a revampled website to improve user experience.",
    link: "https://nuscimagazine.com/",
    logoMap: nuscimagazineLogoMap,
  },
  {
    companyName: "Northeastern University Khoury College of Computer Sciences",
    role: "Discrete Math Teaching Assistant",
    summary:
      "Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.",
    link: "https://www.khoury.northeastern.edu/",
    logoMap: neuLogoMap,
  },
];

const ExperiencePage = ({ isLight }: { isLight: boolean }) => {
  const scrollRef = useRef(null);
  const { isMobile } = useGlobal();

  return isMobile ? (
    <MobilePage scrollRef={scrollRef} />
  ) : (
    <DesktopPage scrollRef={scrollRef} isLight={isLight} />
  );
};

const DesktopPage = ({
  scrollRef,
  isLight,
}: {
  scrollRef: MutableRefObject<null>;
  isLight: boolean;
}) => {
  const styles = {
    parentContainer:
      "w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center",
    allExperiencesContainer: "flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]",
    experienceContainer:
      "space-x-[12vw] flex-row flex items-center font-sourceSans3",
    textContainer: "w-[20vw] flex flex-col justify-center",
    companyName: "text-[2.75vw] leading-[3vw] font-bold font-oswald",
    role: "font-semibold font-oswald text-[1.5vw] leading-[2.5vw]",
    summary: "font-med text-[1.3vw] leading-[1.3vw] mt-[2vh]",
  };

  const ExperienceItem = ({
    companyName,
    role,
    summary,
    link,
    isReversed,
    isLight,
    logoMap,
  }: {
    companyName: string;
    role: string;
    summary: string;
    link: string;
    isReversed: boolean;
    isLight: boolean;
    logoMap: LogoMapConfig;
  }) => {
    const textContent = (
      <div className={styles.textContainer}>
        <a href={link} className="hover:opacity-80 transition-opacity">
          <ScrollReveal
            scrollContainerRef={scrollRef}
            baseOpacity={0.1}
            baseRotation={2}
            blurStrength={4}
            enableBlur={true}
            className={styles.companyName}
          >
            {companyName}
          </ScrollReveal>
          <ScrollReveal
            scrollContainerRef={scrollRef}
            baseOpacity={0.1}
            baseRotation={1}
            blurStrength={3}
            enableBlur={true}
            className={styles.role}
          >
            {role}
          </ScrollReveal>
          <ScrollReveal
            scrollContainerRef={scrollRef}
            baseOpacity={0.1}
            baseRotation={1}
            blurStrength={3}
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
  const styles = {
    parentContainer:
      "w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center",
    allExperiencesContainer: "flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]",
    experienceContainer: "flex justify-center font-sourceSans3 mb-[10vh]",
    textContainer:
      "w-[85vw] flex flex-col items-center justify-center text-center",
    companyName: "text-[6vh] leading-[6vh] text-center font-bold font-oswald",
    role: "font-semibold font-oswald text-[3.5vh] leading-[5.5vh] text-center",
    summary: "font-med text-[2vh] leading-[2vh] mt-[2vh]",
  };

  const MobileExperienceItem = ({
    companyName,
    role,
    summary,
    link,
  }: {
    companyName: string;
    role: string;
    summary: string;
    link: string;
  }) => {
    return (
      <div className={styles.experienceContainer}>
        <div className={styles.textContainer}>
          <a href={link} className="hover:opacity-80 transition-opacity">
            <ScrollReveal
              scrollContainerRef={scrollRef}
              baseOpacity={0.1}
              baseRotation={2}
              blurStrength={4}
              enableBlur={true}
              className={styles.companyName}
            >
              {companyName}
            </ScrollReveal>
            <ScrollReveal
              scrollContainerRef={scrollRef}
              baseOpacity={0.1}
              baseRotation={1}
              blurStrength={3}
              enableBlur={true}
              className={styles.role}
            >
              {role}
            </ScrollReveal>
            <ScrollReveal
              scrollContainerRef={scrollRef}
              baseOpacity={0.1}
              baseRotation={1}
              blurStrength={3}
              enableBlur={true}
              className={styles.summary}
            >
              {summary}
            </ScrollReveal>
          </a>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.allExperiencesContainer} id="experience">
        {experiences.map((exp, index) => (
          <MobileExperienceItem key={index} {...exp} />
        ))}
      </div>
    </div>
  );
};

export default ExperiencePage;
