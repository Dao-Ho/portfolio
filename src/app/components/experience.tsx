import Image from "next/image";

import { motion } from "framer-motion";
import { MutableRefObject, useRef } from "react";

import nusci from "../../../public/experience/nusci-current.png";
import paynalli from "../../../public/experience/paynalli-systems-current.png";
import neu from "../../../public/experience/NEU-current.png";
import generate from "../../../public/experience/generate-current.png";
import { useGlobal } from "../../context-providers/global-provider";
import { getEnabledExperimentalFeatures } from "next/dist/server/config";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

const ExperiencePage = () => {
  const scrollRef = useRef(null);
  const { isMobile } = useGlobal();

  return isMobile ? mobilePage(scrollRef) : desktopPage(scrollRef);
};

const desktopPage = (scrollRef: MutableRefObject<null>) => {
  const styles = {
    allExperiencesContainer: `flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]`,
    experienceContainer: `space-x-[12vw] flex-row flex items-center font-sourceSans3 `,
    parentContainer: `w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center`,
    companyName: `text-[2.75vw] leading-[3vw] font-bold font-oswald`,
    role: "font-semibold font-oswald text-[1.5vw] leading-[2.5vw]",
    summary: "font-med text-[1.3vw] leading-[1.3vw] mt-[2vh]",
    photoContainer: `w-[22vw] h-[25vw] relative `,
    textContainer: `w-[20vw] flex flex-col justify-center`,
  };

  const rightLogo = (
    companyName: string,
    role: string,
    summary: string,
    photo: string | StaticImport,
    link: string | undefined,
  ) => {
    return (
      <div className={styles.experienceContainer}>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.textContainer}
        >
          <h1 className={styles.companyName}>{companyName}</h1>
          <h1 className={styles.role}>{role}</h1>
          <h1 className={styles.summary}>{summary}</h1>
        </motion.div>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: 150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.photoContainer}
        >
          <a href={link}>
            <Image src={photo} layout="fill" sizes="" alt={companyName} />
          </a>
        </motion.div>
      </div>
    );
  };

  const leftLogo = (
    companyName: string,
    role: string,
    summary: string,
    photo: string | StaticImport,
    link: string | undefined,
  ) => {
    return (
      <div className={styles.experienceContainer}>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.photoContainer}
        >
          <a href={link}>
            <Image src={photo} alt={companyName} layout="fill" sizes="" />
          </a>
        </motion.div>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: 150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.textContainer}
        >
          <h1 className={styles.companyName}>{companyName}</h1>
          <h1 className={styles.role}>{role}</h1>
          <h1 className={styles.summary}>{summary}</h1>
        </motion.div>
      </div>
    );
  };

  return (
    <div className={styles.parentContainer}>
      <div className={styles.allExperiencesContainer} id="experience">
        {rightLogo(
          "Generate Product Development",
          "Software Engineer",
          "",
          generate,
          "https://generatenu.com/",
        )}

        {leftLogo(
          "Paynalli Systems",
          "Software Engineer Intern",
          ` Working with an incredible team under the SCRUM methodology, I
          played a key role in developing, revising, and shipping software
          to production. Beyond creating an intuitive and responsive
          frontend, I experimented with and Engineered the RAG architecture
          for various embedding models and vector databases to streamline
          the recruiter-candidate search experience.`,
          paynalli,
          "https://paynalli.com/",
        )}

        {rightLogo(
          "NUSci – Northeastern Science Magazine",
          "Junior Software Engineer",
          ` Working with an awesome team of developers, I help architect
          scalable and robust database schema, secure API endpoints,
          responsive frontend designs, and rigorous tests. Currently
          developing a revampled website to improve user experience.`,
          nusci,
          "https://nuscimagazine.com/",
        )}

        {leftLogo(
          "Northeastern University Khoury College of Computer Sciences",
          "Discrete Math Teaching Assistant",
          `Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, 
      and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.`,
          neu,
          "https://www.khoury.northeastern.edu/",
        )}
      </div>
    </div>
  );
};

const mobilePage = (scrollRef: MutableRefObject<null>) => {
  const styles = {
    allExperiencesContainer: `flex flex-col mt-[20vh] space-y-[25vh] mb-[25vh]`,
    experienceContainer: `flex-col flex items-center font-sourceSans3 `,
    parentContainer: `w-[100vw] y-overflow overflow-hidden bg-background text-foreground flex justify-center`,
    companyName: `text-[6vh] leading-[6vh] text-center font-bold font-oswald`,
    role: "font-semibold font-oswald text-[3.5vh] leading-[5.5vh] text-center",
    summary: "font-med text-[2vh] leading-[2vh] mt-[2vh]",
    photoContainer: `w-[30vh] h-[33vh] relative mt-[2vh]`,
    textContainer: `w-[85vw] flex flex-col items-center justify-center`,
  };

  const experience = (
    companyName: string,
    role: string,
    summary: string,
    photo: string | StaticImport,
    link: string | undefined,
  ) => {
    return (
      <div className={styles.experienceContainer}>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.textContainer}
        >
          <h1 className={styles.companyName}>{companyName}</h1>
          <h1 className={styles.role}>{role}</h1>
          <h1 className={styles.summary}>{summary}</h1>
        </motion.div>
        <motion.div
          viewport={{ root: scrollRef }}
          initial={{ x: -150, opacity: 0 }}
          whileInView={{ x: 0, opacity: 100 }}
          transition={{ duration: 0.5 }}
          className={styles.photoContainer}
        >
          <a href={link}>
            <Image src={photo} alt={companyName} layout="fill" sizes="" />
          </a>
        </motion.div>
      </div>
    );
  };
  return (
    <div className={styles.parentContainer}>
      <div className={styles.allExperiencesContainer} id="experience">
        {experience(
          "Generate Product Development",
          "Software Engineer",
          "",
          generate,
          "https://generatenu.com/",
        )}

        {experience(
          "Paynalli Systems",
          "Software Engineer Intern",
          ` Working with an incredible team under the SCRUM methodology, I
          played a key role in developing, revising, and shipping software
          to production. Beyond creating an intuitive and responsive
          frontend, I experimented with and Engineered the RAG architecture
          for various embedding models and vector databases to streamline
          the recruiter-candidate search experience.`,
          paynalli,
          "https://paynalli.com/",
        )}

        {experience(
          "NUSci – Northeastern Science Magazine",
          "Junior Software Engineer",
          ` Working with an awesome team of developers, I help architect
          scalable and robust database schema, secure API endpoints,
          responsive frontend designs, and rigorous tests. Currently
          developing a revampled website to improve user experience.`,
          nusci,
          "https://nuscimagazine.com/",
        )}

        {experience(
          "Northeastern University Khoury College of Computer Sciences",
          "Discrete Math Teaching Assistant",
          `Led weekly office hours and teaching sessions to reinforce student understanding of course concepts. I provided additional resources, 
      and comprehensive grading feedback to students on homeworks and exams to ensure success in the course.`,
          neu,
          "https://www.khoury.northeastern.edu/",
        )}
      </div>
    </div>
  );
};

export default ExperiencePage;
