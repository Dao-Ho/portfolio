"use client";
import { useEffect, useState } from "react";
import ParticleEffect from "./components/particles";
import React from "react";
import {
  GlobalProvider,
  useGlobal,
} from "../context-providers/global-provider";
import Image from "next/image";

import { motion } from "framer-motion";

import NavBar from "./components/navBar";
import FrontPage from "./components/front-page";
import ExperiencePage from "./components/experience";
import Footer from "./components/footer";

export default function Home() {
  const [isLight, setIsLight] = useState(true);

  const toggleTheme = () => {
    setIsLight(!isLight);
  };

  let oldScrollY = 0;

  //determines if the navbar should be shown
  const [isVisible, setIsVisible] = useState(true);
  const [isMobile, setIsMobile] = useState(true);

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
    <GlobalProvider>
      <div
        id="mainPage"
        className={`w-[100vw] min-h-[100vh] overflow-y-scroll transition-colors duration-300 bg-transparent ${
          isLight ? "light" : "dark"
        }`}
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Image
            src="/textures/overlay.jpg"
            alt="Texture Overlay"
            fill
            className="object-cover"
            priority
          />
        </div>
        <div className={`flex flex-col absolute z-20 w-[100vw] items-center`}>
          {isMobile ? (
            <div className={`fixed z-20`}>
              <NavBar toggleTheme={toggleTheme} isLight={isLight} />
            </div>
          ) : (
            isVisible && (
              <div className={`fixed z-20`}>
                <NavBar toggleTheme={toggleTheme} isLight={isLight} />
              </div>
            )
          )}

          <FrontPage />
          {/* <ExperiencePage />
          <Footer /> */}
        </div>
        {/* <div className="relative z-10 ">
          <ParticleEffect isLight={isLight} />
        </div> */}
      </div>
    </GlobalProvider>
  );
}
