"use client";
import { useEffect, useState, useRef } from "react";
import ParticleEffect from "./components/particles";
import React from "react";
import { GlobalProvider, useGlobal } from '../context-providers/global-provider'

import { motion } from "framer-motion";

import NavBar from "./components/navBar";
import FrontPage from "./components/front-page";
import ExperiencePage from "./components/experience";
import Footer from "./components/footer";
import { House } from "lucide-react";
import Dock from "./components/dock";

export default function Home() {
  const [isLight, setIsLight] = useState(true);


  const toggleTheme = () => {
    setIsLight(!isLight);
  };

  const oldScrollY = useRef(0);

  //determines if the navbar should be shown
  const [isMobile, setIsMobile] = useState(true);





  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // set initial values
    oldScrollY.current = window.scrollY;
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const ITEMSTYLING = "text-white/90 hover:text-white flex flex-col items-center justify-center";

  const items = [
    { icon: <House size={18} />, label: 'Home', onClick: () => alert('Home!'), iconClassName: ITEMSTYLING },
    { icon: <House size={18} />, label: 'Archive', onClick: () => alert('Archive!'), iconClassName: ITEMSTYLING },
    { icon: <House size={18} />, label: 'Profile', onClick: () => alert('Profile!'), iconClassName: ITEMSTYLING },
    { icon: <House size={18} />, label: 'Settings', onClick: () => alert('Settings!'), iconClassName: ITEMSTYLING },
  ];

  return (
    <GlobalProvider>
      <div
        id="mainPage"
        className={`w-[100vw] min-h-[100vh] overflow-y-scroll transition-colors duration-300 bg-background ${isLight ? "light" : "dark"
          }`}
      >
        <div className={`flex flex-col absolute z-20 w-[100vw] items-center`}>
          {isMobile && (
            <div className={`fixed z-20`}>
              <NavBar toggleTheme={toggleTheme} isLight={isLight} />
            </div>
          )}


          <FrontPage />

          <ExperiencePage />
          <Footer />

        </div>
        <div className="relative z-10 ">
          <ParticleEffect isLight={isLight} />
        </div>
        {/* Dock positioned fixed at bottom center of the viewport */}
        {!isMobile && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-30">
            <Dock
              items={items}
              panelHeight={68}
              baseItemSize={50}
              magnification={70}
              dockHeight={60}
              distance={200}
              isLight={isLight}
            />
          </div>
        )}
      </div>
    </GlobalProvider>
  );
}
