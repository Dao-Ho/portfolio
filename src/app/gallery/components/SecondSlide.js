
import Image from "next/image";
import { React, useEffect, useState, useRef } from "react";
import sideprofile from "../../../../public/Images/website pfp.png";
import { motion, scrollRef} from "framer-motion";

export const SecondSlide = () => {
  const scrollRef = useRef(null)
  

  const pfp = () => {
    return (
      <Image
        src={sideprofile}
        quality={50}
        alt=""
        className={
          isMobile
            ? "w-full h-auto max-h-[70vh] max-w-[95vw]"
            : " w-auto h-full max-h-[60vh] max-w-[40vw]"
        }
      />
    );
  };

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= window.innerHeight);
    };

    // Set initial screen size
    handleResize();

    // Attach event listener for window resize
    window.addEventListener("resize", handleResize);

    // Remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);



  return (
    
    <motion.div className="box-border h-screen w-screen">
      <div className="flex justify-center items-center w-full h-full">
        <div
          className={
            isMobile
              ? "box-border w-[95vw] h-[80vh] bg-gradient-to-r from-[#050505]  to-[#383e43] via-[#161a1c] rounded-[5vw]"
              : "box-border w-[95vw] h-[85vh] bg-gradient-to-r from-[#050505]  to-[#383e43] via-[#161a1c] rounded-[5vw]"
          }
        >
          <div
            className={
              isMobile
                ? " absolute flex w-auto h-[80vh] pr-[11vw] items-end translate-x-[5vw] "
                : "absolute flex h-[85vh] translate-x-[5vw] items-end w-[45vw]"
            }
          >
            {pfp()}
          </div>

          <div className={isMobile ? "" : "float-right pr-[43vw]"}>
            <div
              className={
                isMobile
                  ? "absolute w-full pt-[4vh] pr-[10vw] pl-[5vw]"
                  : "absolute w-[40vw] float-right translate-y-[5vh]"
              }
            >
              <motion.h1
               initial={{ opacity: 0, y: 60 }}
               whileInView={{ opacity: 1, y: 0}}
               transition={{duration: 0.5, delay: 0}}
               viewport={{ root: scrollRef }}
                className={
                  isMobile
                    ? "font-libre font-bold text-[2vh] text-background "
                    : "pt-24 font-libre font-bold text-[2vw] text-background"
                }
              >
                Dao Ho is an 21-year-old self-taught artist studying at
                Northeastern University. With a focus on ink, he combines
                various mark-making techniques to emphasize values hidden in
                ordinary everyday life.
              </motion.h1>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
