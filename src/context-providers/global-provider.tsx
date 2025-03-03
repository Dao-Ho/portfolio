import React, { createContext, useContext, useState, useEffect } from "react";

interface GlobalContextType {
  isMobile: boolean;
  isLight: boolean;
  setIsLight: React.Dispatch<React.SetStateAction<boolean>>;
  setIsMobile: React.Dispatch<React.SetStateAction<boolean>>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLight, setIsLight] = useState<boolean>(true);

  //debounce to prevent the resize event from firing too often
  const debounce = (
    func: { (): void; (): void },
    delay: number | undefined,
  ) => {
    let timeoutId: NodeJS.Timeout;
    return () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func();
      }, delay);
    };
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < window.innerHeight) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };

    const debouncedResize = debounce(handleResize, 200);

    handleResize();
    window.addEventListener("resize", debouncedResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <GlobalContext.Provider
      value={{ isMobile, isLight, setIsLight, setIsMobile }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobal = () => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error("useGlobal must be used within an GlobalProvider");
  }
  return context;
};
