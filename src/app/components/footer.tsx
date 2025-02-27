import { motion } from "framer-motion";
import { useGlobal } from "../../context-providers/global-provider";

const Footer = () => {
  const { isMobile } = useGlobal();

  return isMobile ? mobileNavBar() : desktopNavBar();
};

const desktopNavBar = () => {
  return (
    <motion.div initial={{ y: "7vh" }} animate={{ y: "0vh" }}>
      <div
        className={`flex w-[100vw] h-[7.65vh] font-bebas items-center bg-background flex-row`}
      >
        <div className="flex-1 ml-[1.5vw] flex items-center">
          <a href="/" className={`text-[3vh] text-foreground font-bold`}>
            Building With Love Est. 2004
          </a>
        </div>
        <div className="flex-2 flex flex-row mr-[1.5vw] items-center space-x-[4vw]">
          <div className="font-bebas flex items-center translate-y-[0.60vh] space-x-[2vw]">
            <a
              href="./Dao-Ho-resume.pdf"
              className="group h-[5vh] text-foreground transition text-[3vh] duration-250"
            >
              Resume
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>

            <a
              href="https://www.linkedin.com/in/dao-ho/"
              className="group h-[5vh] text-foreground transition text-[3vh] duration-250"
            >
              LinkedIn
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>

            <a
              href="/gallery"
              className="group h-[5vh] text-foreground transition text-[3vh] duration-250"
            >
              Art Gallery
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const mobileNavBar = () => {
  return (
    <motion.div initial={{ y: "7vh" }} animate={{ y: "0vh" }}>
      <div
        className={`flex w-[100vw] h-[9vh] font-bebas items-center bg-background flex-row `}
      >
        <div className="flex-1 ml-[2vw] flex items-center">
          <a href="/" className={`text-[2vh] text-foreground font-med`}>
            Building With Love Est. 2004
          </a>
        </div>
        <div className="flex-2 flex flex-row mr-[2vw] items-center space-x-[4vw]">
          <div className="font-bebas flex items-center justify-center translate-y-[0.60vh] space-x-[2vw]">
            <a href="./Dao-Ho-resume.pdf" className={styles.mobileText}>
              Resume
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>

            <a
              href="https://www.linkedin.com/in/dao-ho/"
              className={styles.mobileText}
            >
              LinkedIn
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>

            <a href="/gallery" className={styles.mobileText}>
              Art Gallery
              <span className="block max-w-0 group-hover:max-w-full transition-all duration-500 h-[0.3vh] bg-foreground"></span>
            </a>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const styles = {
  mobileText:
    "group h-[5vh] text-foreground transition text-[4.5vw] duration-250",
};

export default Footer;
