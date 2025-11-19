import { motion } from "framer-motion";
import { MutableRefObject, useRef } from "react";

import { useGlobal } from "../../context-providers/global-provider";

const ExperiencePage = () => {
  const scrollRef = useRef(null);
  const { isMobile } = useGlobal();

  return isMobile ? mobilePage(scrollRef) : desktopPage(scrollRef);
};

const desktopPage = (scrollRef: MutableRefObject<null>) => {
  const styles = {
    allExperiencesContainer: `flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]`,
    experienceContainer: `flex justify-center font-sourceSans3 mb-[15vh]`,
    parentContainer: `w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center`,
    companyName: `text-[2.75vw] leading-[3vw] font-bold font-oswald`,
    role: "font-semibold font-oswald text-[1.5vw] leading-[2.5vw]",
    summary: "font-med text-[1.3vw] leading-[1.3vw] mt-[2vh]",
    textContainer: `w-[60vw] flex flex-col justify-center text-center`,
  };

  const experience = (
    companyName: string,
    role: string,
    summary: string,
    link: string | undefined
  ) => {
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
        {experience(
          "Agency",
          "Member of Technical Staff Co-op",
          "Learning the meaning of tracer bullets, velocity, and what it takes to scale them.",
          "https://paynalli.com/"
        )}
        {experience(
          "Generate Product Development",
          "Technical Lead",
          "Led a team of 5 engineers in building and shipping Vetted, a web application currently in use connecting pet owners with care providers. Collaborated with clients to define the product vision and delivered a full-stack platform with robust deployment infrastructure.",
          "https://generatenu.com/"
        )}
        {experience(
          "DesignAI",
          "Software Engineer Intern",
          "Designed and built an image management platform that streamlined how interior designers search, organize, and work with furniture design collections. Architected the search system for fast, intuitive performance and created a secure infrastructure for managing design assets.",
          "https://paynalli.com/"
        )}
        {experience(
          "Generate Product Development",
          "Software Engineer",
          "Contributed as an engineer to build Three Stones, a mobile application allowing retail investors to crowdfund real estate projects. Designed and implemented authentication and core user flows across the entire stack.",
          "https://generatenu.com/"
        )}
        {experience(
          "Paynalli Systems",
          "Software Engineer Intern",
          "Working with an incredible team under the SCRUM methodology, I played a key role in developing, revising, and shipping software to production. Beyond creating an intuitive and responsive frontend, I experimented with and Engineered the RAG architecture for various embedding models and vector databases to streamline the recruiter-candidate search experience.",
          "https://paynalli.com/"
        )}
        {experience(
          "NUSci – Northeastern Science Magazine",
          "Junior Software Engineer",
          "Working with an awesome team of developers, I help architect scalable and robust database schema, secure API endpoints, responsive frontend designs, and rigorous tests. Currently developing a revampled website to improve user experience.",
          "https://nuscimagazine.com/"
        )}
        {experience(
          "Northeastern University Khoury College of Computer Sciences",
          "Discrete Math Teaching Assistant",
          "Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.",
          "https://www.khoury.northeastern.edu/"
        )}
      </div>
    </div>
  );
};

const mobilePage = (scrollRef: MutableRefObject<null>) => {
  const styles = {
    allExperiencesContainer: `flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]`,
    experienceContainer: `flex justify-center font-sourceSans3 mb-[10vh]`,
    parentContainer: `w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center`,
    companyName: `text-[6vh] leading-[6vh] text-center font-bold font-oswald`,
    role: "font-semibold font-oswald text-[3.5vh] leading-[5.5vh] text-center",
    summary: "font-med text-[2vh] leading-[2vh] mt-[2vh]",
    textContainer: `w-[85vw] flex flex-col items-center justify-center text-center`,
  };

  const mobileExperience = (
    companyName: string,
    role: string,
    summary: string,
    link: string | undefined
  ) => {
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
        {mobileExperience(
          "Agency",
          "Member of Technical Staff Co-op",
          "Learning the meaning of tracer bullets, velocity, and what it takes to scale them.",
          "https://paynalli.com/"
        )}
        {mobileExperience(
          "Generate Product Development",
          "Technical Lead",
          "Led a team of 5 engineers in building and shipping Vetted, a web application currently in use connecting pet owners with care providers. Collaborated with clients to define the product vision and delivered a full-stack platform with robust deployment infrastructure.",
          "https://generatenu.com/"
        )}
        {mobileExperience(
          "DesignAI",
          "Software Engineer Intern",
          "Designed and built an image management platform that streamlined how interior designers search, organize, and work with furniture design collections. Architected the search system for fast, intuitive performance and created a secure infrastructure for managing design assets.",
          "https://paynalli.com/"
        )}
        {mobileExperience(
          "Generate Product Development",
          "Software Engineer",
          "Contributed as an engineer to build Three Stones, a mobile application allowing retail investors to crowdfund real estate projects. Designed and implemented authentication and core user flows across the entire stack.",
          "https://generatenu.com/"
        )}
        {mobileExperience(
          "Paynalli Systems",
          "Software Engineer Intern",
          "Working with an incredible team under the SCRUM methodology, I played a key role in developing, revising, and shipping software to production. Beyond creating an intuitive and responsive frontend, I experimented with and Engineered the RAG architecture for various embedding models and vector databases to streamline the recruiter-candidate search experience.",
          "https://paynalli.com/"
        )}
        {mobileExperience(
          "NUSci – Northeastern Science Magazine",
          "Junior Software Engineer",
          "Working with an awesome team of developers, I help architect scalable and robust database schema, secure API endpoints, responsive frontend designs, and rigorous tests. Currently developing a revampled website to improve user experience.",
          "https://nuscimagazine.com/"
        )}
        {mobileExperience(
          "Northeastern University Khoury College of Computer Sciences",
          "Discrete Math Teaching Assistant",
          "Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.",
          "https://www.khoury.northeastern.edu/"
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
