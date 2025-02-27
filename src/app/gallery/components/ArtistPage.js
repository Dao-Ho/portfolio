"use client";
import Navbar from "./components/Navbar";
import { FirstSlide } from "./components/FirstSlide";
import { SecondSlide } from "./components/SecondSlide";
import { Artworks } from "./components/ThirdSlide";
import { Element } from "react-scroll";

export default function Home() {
  return (
    <div className="overflow-hidden cursor-crosshair">
      <Navbar />
      <FirstSlide />
      <Element name="about">
        <SecondSlide />
      </Element>
      <Element name="artworks">
        <Artworks />
      </Element>
    </div>
  );
}
