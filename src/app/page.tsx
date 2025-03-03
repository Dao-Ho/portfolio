"use client";
import { useEffect, useState } from "react";
import ParticleEffect from "./components/particles";
import React from "react";
import {
  GlobalProvider,
  useGlobal,
} from "../context-providers/global-provider";

import { motion } from "framer-motion";

import NavBar from "./components/navBar";
// import FrontPage from "./components/front-page";
import FrontPage from "./components/HomePage2";
import ExperiencePage from "./components/experience";
import Footer from "./components/footer";

const Contents = () => {
  let oldScrollY = 0;

  //determines if the navbar should be shown
  const [isVisible, setIsVisible] = useState(true);

  const { isMobile, setIsMobile, isLight, setIsLight } = useGlobal();

  //determines if the navbar should be shown based on direction of the mouse scroll
  const determineNavbarVisibility = () => {
    if (window.scrollY > oldScrollY) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
    oldScrollY = window.scrollY;
  };

  useEffect(() => {
    window.addEventListener("scroll", determineNavbarVisibility);
    return () => {
      window.removeEventListener("scroll", determineNavbarVisibility);

      //determines if the screen is mobile on load
      if (window.innerWidth < window.innerHeight) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
  }, []);

  useEffect(() => {});

  return (
    <div
      id="mainPage"
      className={`w-[100vw] min-h-[100vh] overflow-y-scroll transition-colors duration-300 bg-background ${
        isLight ? "light" : "dark"
      }`}
    >
      <div className={`flex flex-col absolute z-20 w-[100vw] items-center`}>
        <div className={`fixed z-20`}>
          <NavBar />
        </div>

        <FrontPage />
        {/* <ExperiencePage />
          <Footer /> */}
      </div>
    </div>
  );
};

export default function Home() {
  return (
    <GlobalProvider>
      <Contents />
    </GlobalProvider>
  );
}
