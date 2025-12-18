"use client";

import { FaLocationArrow } from "react-icons/fa6";
import img from "../data/profile.jpg";
import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import Image from "next/image";
import { useEffect } from "react";

const Hero = () => {
  const handleClick = () => {
    const link = document.createElement("a");
    link.href = "/Kartavya_Suryawanshi_Resume.pdf"; // Relative to the `public` folder
    link.download = "Kartavya_Suryawanshi_Resume.pdf"; // Name of the downloaded file
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash) {
        setTimeout(() => {
          const element = document.querySelector(hash);
          if (element) {
            const offsetTop =
              element.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: offsetTop - 80, behavior: "smooth" });
          }
        }, 0);
      }
    };

    // Handle initial hash on page load
    if (window.location.hash) {
      handleHashChange();
    }

    window.addEventListener("hashchange", handleHashChange);

    // Add scroll event listener to remove hash when at top
    const handleScroll = () => {
      if (window.scrollY < 100 && window.location.hash) {
        // Remove hash when scrolled to top
        window.history.replaceState(null, "", window.location.pathname);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="relative w-full pt-36 pb-20 min-h-screen">
      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div className="absolute inset-0 top-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]">
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100 bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        </div>
        <Spotlight
          className="-top-40 -left-10 md:-left-32 md:-top-20 h-screen"
          fill="white"
        />
        <Spotlight
          className="h-[80vh] w-[50vw] top-10 left-full"
          fill="purple"
        />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>

      <div className="relative z-10 flex justify-center items-center">
        <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md">
          <Image
            src={img} // Replace with your image path
            alt="Centered Circle Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="relative flex justify-center mb-10 mt-2 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <p className="uppercase tracking-widest text-xs text-center text-blue-100 max-w-80"></p>

          {/**
           *  Link: https://ui.aceternity.com/components/text-generate-effect
           *
           *  change md:text-6xl, add more responsive code
           */}
          <TextGenerateEffect
            words="Hi, I'm Kartavya Suryawanshi - student at IIT Mandi"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />

          <p className="text-center md:tracking-wider mb-4 text-sm md:text-lg lg:text-2xl">
            A Data Science Engineering student at IIT Mandi, passionate about
            turning data into impactful solutions.
          </p>
          <div className="flex justify-center items-center gap-4">
            <a href="https://github.com/Kartavya728" className="flex-1">
              <MagicButton
                title="My GitHub"
                icon={<FaLocationArrow />}
                position="right"
              />
            </a>
            <div onClick={handleClick} className="flex-1">
              <MagicButton
                title="My Resume"
                icon={<FaLocationArrow />}
                position="right"
                // Add the onClick event
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
