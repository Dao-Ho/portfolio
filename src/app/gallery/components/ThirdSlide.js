import Image from "next/image";
import transaction from "../../../../public/Images/transaction final.png";
import haku from "../../../../public/Images/haku final refined.png";
import fishmarket from "../../../../public/Images/Fish Market refined.png";
import holdingon from "../../../../public/Images/holding on.png";
import duality from "../../../../public/Images/FINAL selected 2.png";
import held from "../../../../public/Images/Held final refined.png";
import engulfed from "../../../../public/Images/engulfed final refined.png";
import { useState } from "react";
import { Container } from "postcss";
import {
  motion,
  controls,
  inView,
  useAnimation,
  useInView,
} from "framer-motion";

import { useRef, useEffect } from "react";

import { createPortal } from "react-dom";

export const Artworks = () => {
  const scrollRef = useRef(null);

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

  function Modal({ src, alt, onClose }) {
    const modalRef = useRef(null);

    const handleOverlayClick = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    useEffect(() => {
      document.addEventListener("mousedown", handleOverlayClick);

      return () => {
        document.removeEventListener("mousedown", handleOverlayClick);
      };
    }, []);

    return createPortal(
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center z-50">
        <div ref={modalRef} className="relative modal-content">
          <Image
            src={src}
            quality={15}
            alt={alt}
            priority={true}
            placeholder="blur"
            className={
              isMobile
                ? "w-auto h-auto max-w-[85vw] max-h-[80vh] max-w-[90vw]"
                : "w-auto h-auto max-w-full max-h-[90vh] max-w-[90vw]"
            }
          />
        </div>
      </div>,
      document.body,
    );
  }

  function ImageCaption({ src, alt, title, caption, award, award2, award3 }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleImageClick = () => {
      setIsModalOpen(true);
    };

    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    return (
      <motion.div
        className="cursor-pointer inline-flex flex flex-col"
        onClick={handleImageClick}
      >
        <Image
          src={src}
          quality={1}
          alt={alt}
          priority={false}
          placeholder="blur"
          className="fill w-auto h-auto max-h-full transition ease-in-out delay-50 hover:scale-105"
        />
        <h1
          className={
            isMobile
              ? "font-libre pt-[2.5vh] font-bold text-[3.5vw]"
              : "font-libre pt-[2.5vh] text-[2.5vh]"
          }
        >
          {title} <br />
          {caption} <br />
          {award} <br />
          {award2} <br />
          {award3} <br />
        </h1>

        {isModalOpen && (
          <Modal src={src} alt={alt} onClose={handleCloseModal} />
        )}
      </motion.div>
    );
  }

  return (
    <>
      {isMobile ? (
        <div className="box-border w-screen overflow-y">
          {" "}
          <>
            <div className="w-full translate-y-24">
              <div className="inline-flex w-screen">
                <div className="inline-flex span translate-x-[8.5vw]">
                  <h1 className="font-roboto font-bold text-[6vw]">Works</h1>
                </div>
              </div>
              <div className="flex-row w-screen justify-center space-y-[5vh] pt-[5vw]">
                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <div>
                        <ImageCaption
                          src={transaction}
                          alt=""
                          title="The Transaction"
                          caption="11x14, 2023"
                          award="Best in Show: James Laubheimer's Award"
                          award2="Baltimore Watercolor Society Award for Excellence in Water-Media"
                          award3="Schwab Lipowitz & Solter 1st Place award"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={haku}
                        alt=""
                        title="Haku"
                        caption="8.5x11, 2023"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[80vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={fishmarket}
                        alt=""
                        title="Fish Market"
                        caption="10x12, 2023"
                        award="Featured at the Baltimore Museum of Art"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={holdingon}
                        alt=""
                        title="Holding On"
                        caption="10x8, 2022"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={duality}
                        alt=""
                        title="Duality"
                        caption="22x17, 2022"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={held}
                        alt=""
                        title="Held"
                        caption="2022"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex h-[100vh]">
                  <div className="flex w-screen justify-center h-[80vh]">
                    <div className="flex w-[85vw] ">
                      <ImageCaption
                        src={engulfed}
                        alt=""
                        title="Engulfed"
                        caption="2022"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        </div>
      ) : (
        <div className="box-border w-screen overflow-y">
          <div className="w-full translate-y-24">
            <div className="inline-flex w-screen">
              <div className="inline-flex span translate-x-[8.5vw]">
                <h1 className="font-roboto font-bold text-[6vw]">Works</h1>
              </div>
            </div>
            <div className="flex w-screen h-[80vh] justify-center">
              <div className="flex w-[85vw] pt-[3vh] h-[80vh] justify-center justify-between space-x-[3vw]">
                <ImageCaption
                  src={transaction}
                  alt=""
                  title="The Transaction"
                  caption="11x14, 2023"
                  award="Best in Show: James Laubheimer's Award"
                  award2="Baltimore Watercolor Society Award for Excellence in Water-Media"
                  award3="Schwab Lipowitz & Solter 1st Place award"
                />
                <ImageCaption
                  src={haku}
                  alt=""
                  title="Haku"
                  caption="8.5x11, 2023"
                />
              </div>
            </div>
            <div className="pt-[25vh]">
              <div className="flex w-screen h-[50vh] justify-center">
                <div className="flex w-[85vw] pt-[3vh] h-[50vh] justify-center justify-between space-x-[3vw]">
                  <ImageCaption
                    src={fishmarket}
                    alt=""
                    title="Fish Market"
                    caption="10x12, 2023"
                    award="Featured at the Baltimore Museum of Art"
                  />
                  <ImageCaption
                    src={holdingon}
                    alt=""
                    title="Holding On"
                    caption="10x8, 2022"
                  />
                  <ImageCaption
                    src={duality}
                    alt=""
                    title="Duality"
                    caption="22x17, 2022"
                  />
                </div>
              </div>
              <div className="pt-[17vh] pb-[40vh]">
                <div className="flex w-screen h-[75vh] justify-center">
                  <div className="flex w-[85vw] pt-[3vh] h-full justify-center justify-between space-x-[3vw]">
                    <ImageCaption
                      src={held}
                      alt=""
                      title="Held"
                      caption="2022"
                    />
                    <ImageCaption
                      src={engulfed}
                      alt=""
                      title="Engulfed"
                      caption="2022"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
