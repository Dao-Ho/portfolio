"use client";
import { delay, motion } from "framer-motion";
import Image from "next/image";

import headshot from "../../../public/portfolio-photo.png";
import { useGlobal } from "../../context-providers/global-provider";
import GitHubContributions from "./contribution-graph";

const FrontPage = ({ isLight }: { isLight: boolean }) => {
    const { isMobile } = useGlobal();

    return isMobile ? mobilePage() : desktopPage({ isLight: isLight });
};

const desktopPage = ({ isLight }: { isLight: boolean }) => {
    return (
        <div className="flex flex-col h-[85vh] bg-transparent w-[100vw] px-[20vw] text-foreground">
            <div className="h-full w-full mt-40 flex flex-col">
                <motion.div
                    className="leading-[3vh]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="font-playfairDisplay text-[18px] ">Xin chào, I'm Dao.</h1>
                    <h1 className="font-playfairDisplay text-[18px] ">
                        I'm a Software Engineer passionate about building the future.
                    </h1>
                    <h1 className="font-playfairDisplay text-[18px] ">
                        Northeastern '27, Computer Science and Finance.
                    </h1>
                    <h1 className="font-playfairDisplay text-[18px] ">Currently, building at Agency.</h1>
                </motion.div>
                <motion.div
                    className="mt-20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.25 }}
                >
                    <GitHubContributions userName="Dao-Ho" isLight={isLight} />
                </motion.div>
            </div>
        </div>
    );
};

const mobilePage = () => (
    <div className="flex flex-col h-[85vh] bg-transparent w-[100vw] text-foreground justify-center items-center ">
        <div className="flex-1 flex flex-row items-center h-full w-full justify-center items-center">
            <div className="flex-1 w-[55vw] flex flex-col font-roboto mx-[1.75vw] mt-[15vh] items-center">
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h1 className="font-semibold text-[7vw] leading-[5vh]">Xin Chào,</h1>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                >
                    <h1 className="font-black text-[17vw] leading-[15vh]">I'm Dao Ho</h1>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.2 }}
                >
                    <h1 className="font-semibold text-[4.75vw] leading-[6vw]">
                        Software Engineer, Developer, and Artist.
                    </h1>
                </motion.div>
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 }}
                >
                    <h1 className="font-semibold text-[4vw] leading-[6vh]">Northeastern '27, BS CS and Finance</h1>
                </motion.div>
            </div>
        </div>
        <div className="flex flex-2 w-[20vw] h-[20vh]">
            <motion.button
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                onClick={() => {
                    const anchor = document.querySelector("#experience");
                    anchor?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="text-[4vw] font-roboto font-bold animate-bounce h-[2vh] "
            >
                {" "}
                see more
            </motion.button>
        </div>
    </div>
);

export default FrontPage;
