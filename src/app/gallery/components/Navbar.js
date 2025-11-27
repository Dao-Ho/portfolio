import Image from "next/image";
import iglogo from '../../../../public/Images/black ig logo.png'
import { useState, useEffect } from 'react'
import { Link } from 'react-scroll';




const Navbar = () => {

  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= window.innerHeight);
    };

  handleResize();

  window.addEventListener('resize', handleResize);
  
    // Remove event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const ig = () => {
    return (
      <a href="https://www.instagram.com/artdaoho/" target="_blank" rel="noopener noreferrer">
      <Image
        src={ iglogo }
        quality={100}
        alt=""
        className={isMobile? 'transition ease-in-out delay-50 hover:scale-110 fill w-[4vw] h-[4vw]'
        : 'transition ease-in-out delay-50 hover:scale-110 fill w-[2vw] h-[2vw]'}
      />
      </a>
    )
  }

    return (
      <nav className="z-50 backdrop-blur bg-white/50 fixed w-full h-[10vh] shadow-xl flex justify-between">
        <div className={isMobile? 'inline-flex h-full w-1/2 px-5 items-center'
          : 'inline-flex h-full w-1/3 px-5 items-center'}>
        <a href="#" className={isMobile? 'flex h-full items-center text-[#212121] text-[4vw] font-bold font-bebas scroll-smooth focus:scroll-smooth active:scroll-smooth'
        : 'flex h-full items-center text-[#212121] text-[2.5vw] font-bold font-bebas scroll-smooth focus:scroll-smooth active:scroll-smooth'}>
          Beauty in the Mundane.
        </a>
        </div>
        

        {/* <div className="flex justify-center w-full h-full items-center">
          <h1 className="text-[3vw] font-inter font-bold italic text-[#212121]">Dao Ho</h1>
        </div> */}
        <div className="flex pr-[3vw]">

        <div className="flex pr-[3vw] items-center h-full items-center">
          
          <a
          href="/"
          className={isMobile? 'font-roboto text-[3vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'
            : 'font-roboto text-[1.5vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'}>
            Engineer
          </a>
        </div>

        <div className="flex pr-[3vw] items-center h-full items-center">
          
          <Link
          to="artworks"
          spy={true}
          smooth={true}
          duration={0} className={isMobile? 'font-roboto text-[3vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'
            : 'font-roboto text-[1.5vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'}>
            Works
          </Link>
        </div> 

        <div className="flex pr-[3vw] items-center h-full items-center">
          
          <Link
          to="about"
          spy={true}
          smooth={true}
          duration={0} className={isMobile? 'font-roboto text-[3vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'
            : 'font-roboto text-[1.5vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'}>
            About
          </Link>
        </div>
        <div className="flex pr-[3vw] items-center h-full items-center">
          <a 
          href="mailto:daohoart@gmail.com"
          duration={0} className={isMobile? 'font-roboto text-[3vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer' 
          : 'font-roboto text-[1.5vw] font-bold transition ease-in-out delay-50 hover:scale-110 cursor-pointer'}>
            Contact
          </a>
        </div>
        <div className={isMobile? 'flex items-center h-full w-[5vw]'
          : 'flex items-center h-full w-[3vw]'}>
        { ig() } 
        </div>
        </div>
      </nav>
    );
  };
  
  export default Navbar;