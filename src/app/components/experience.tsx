import { motion } from "framer-motion";
import { MutableRefObject, useRef } from "react";

// Mock context for demo - replace with your actual context
const useGlobal = () => ({ isMobile: window.innerWidth < 768 });

const ExperiencePage = () => {
  const scrollRef = useRef(null);
  const { isMobile } = useGlobal();

  return isMobile ? <MobilePage scrollRef={scrollRef} /> : <DesktopPage scrollRef={scrollRef} />;
};

// Experience data structure
const experiences = [
  {
    companyName: "Agency",
    role: "Member of Technical Staff Co-op",
    summary: "Learning the meaning of tracer bullets, velocity, and what it takes to scale them.",
    link: "https://paynalli.com/"
  },
  {
    companyName: "Generate Product Development",
    role: "Technical Lead",
    summary: "Led a team of 5 engineers in building and shipping Vetted, a web application currently in use connecting pet owners with care providers. Collaborated with clients to define the product vision and delivered a full-stack platform with robust deployment infrastructure.",
    link: "https://generatenu.com/"
  },
  {
    companyName: "DesignAI",
    role: "Software Engineer Intern",
    summary: "Designed and built an image management platform that streamlined how interior designers search, organize, and work with furniture design collections. Architected the search system for fast, intuitive performance and created a secure infrastructure for managing design assets.",
    link: "https://paynalli.com/"
  },
  {
    companyName: "Generate Product Development",
    role: "Software Engineer",
    summary: "Contributed as an engineer to build Three Stones, a mobile application allowing retail investors to crowdfund real estate projects. Designed and implemented authentication and core user flows across the entire stack.",
    link: "https://generatenu.com/"
  },
  {
    companyName: "Paynalli Systems",
    role: "Software Engineer Intern",
    summary: "Working with an incredible team under the SCRUM methodology, I played a key role in developing, revising, and shipping software to production. Beyond creating an intuitive and responsive frontend, I experimented with and Engineered the RAG architecture for various embedding models and vector databases to streamline the recruiter-candidate search experience.",
    link: "https://paynalli.com/"
  },
  {
    companyName: "NUSci – Northeastern Science Magazine",
    role: "Junior Software Engineer",
    summary: "Working with an awesome team of developers, I help architect scalable and robust database schema, secure API endpoints, responsive frontend designs, and rigorous tests. Currently developing a revampled website to improve user experience.",
    link: "https://nuscimagazine.com/"
  },
  {
    companyName: "Northeastern University Khoury College of Computer Sciences",
    role: "Discrete Math Teaching Assistant",
    summary: "Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.",
    link: "https://www.khoury.northeastern.edu/"
  }
];

const DesktopPage = ({ scrollRef }: { scrollRef: MutableRefObject<null> }) => {
  const styles = {
    parentContainer: "w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center",
    allExperiencesContainer: "flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]",
    experienceContainer: "space-x-[12vw] flex-row flex items-center font-sourceSans3",
    textContainer: "w-[20vw] flex flex-col justify-center",
    companyName: "text-[2.75vw] leading-[3vw] font-bold font-oswald",
    role: "font-semibold font-oswald text-[1.5vw] leading-[2.5vw]",
    summary: "font-med text-[1.3vw] leading-[1.3vw] mt-[2vh]"
  };

  const ExperienceItem = ({ 
    companyName, 
    role, 
    summary, 
    link, 
    isReversed 
  }: { 
    companyName: string;
    role: string;
    summary: string;
    link: string;
    isReversed: boolean;
  }) => {
    const textContent = (
      <motion.div
        viewport={{ root: scrollRef }}
        initial={{ x: isReversed ? 150 : -150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 100 }}
        transition={{ duration: 0.5 }}
        className={styles.textContainer}
      >
        <a href={link} className="hover:opacity-80 transition-opacity">
          <h1 className={styles.companyName}>{companyName}</h1>
          <h1 className={styles.role}>{role}</h1>
          <h1 className={styles.summary}>{summary}</h1>
        </a>
      </motion.div>
    );

    const logoPlaceholder = (
      <motion.div
        viewport={{ root: scrollRef }}
        initial={{ x: isReversed ? -150 : 150, opacity: 0 }}
        whileInView={{ x: 0, opacity: 100 }}
        transition={{ duration: 0.5 }}
        className="w-[22vw] h-[25vw] bg-gray-200 rounded-lg flex items-center justify-center"
      >
        <span className="text-gray-500 text-sm">Logo</span>
      </motion.div>
    );

    return (
      <div className={styles.experienceContainer}>
        {isReversed ? (
          <>
            {logoPlaceholder}
            {textContent}
          </>
        ) : (
          <>
            {textContent}
            {logoPlaceholder}
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
          />
        ))}
      </div>
    </div>
  );
};

const MobilePage = ({ scrollRef }: { scrollRef: MutableRefObject<null> }) => {
  const styles = {
    parentContainer: "w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center",
    allExperiencesContainer: "flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]",
    experienceContainer: "flex justify-center font-sourceSans3 mb-[10vh]",
    textContainer: "w-[85vw] flex flex-col items-center justify-center text-center",
    companyName: "text-[6vh] leading-[6vh] text-center font-bold font-oswald",
    role: "font-semibold font-oswald text-[3.5vh] leading-[5.5vh] text-center",
    summary: "font-med text-[2vh] leading-[2vh] mt-[2vh]"
  };

  const MobileExperienceItem = ({ 
    companyName, 
    role, 
    summary, 
    link 
  }: { 
    companyName: string;
    role: string;
    summary: string;
    link: string;
  }) => {
    return (
      <div className={styles.experienceContainer}>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.textContainer}
        >
          <a href={link} className="hover:opacity-80 transition-opacity">
            <h1 className={styles.companyName}>{companyName}</h1>
            <h1 className={styles.role}>{role}</h1>
            <h1 className={styles.summary}>{summary}</h1>
          </a>
        </motion.div>
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