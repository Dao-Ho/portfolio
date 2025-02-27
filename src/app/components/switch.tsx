"use client";

import React from "react";
import { useGlobal } from "../../context-providers/global-provider";

export default function Switch({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: () => void;
}) {
  const { isMobile } = useGlobal();
  return (
    <div
      className={` ${isMobile ? "w-[2vw] h-[2.5vh] " : ""} inline-flex flex min-w-[5vh] items-center cursor-pointer w-[3vw] h-[3vh] border-[0.15vw] rounded-full ${isChecked ? "bg-dark-background" : "bg-light-background"} border ${isChecked ? "border-light-background" : "border-light-foreground"} transition-colors duration-300`}
      onClick={onChange}
    >
      <span
        className={` ${isMobile ? "w-[2vh] h-[2vh] min-w-[1vh] min-h-[1vh] " : ""}
           w-[0.95vw] min-w-[2vh] min-h-[2vh] h-[0.95vw] ml-[0.25vw] rounded-full transition-transform duration-300 border ${isChecked ? "transform translate-x-full bg-light-background border-light-background" : "transform translate-x-0 bg-dark-background border-dark-background"}`}
      />
    </div>
  );
}
