import { FaLocationArrow } from "react-icons/fa6";
import img from "../data/profile.jpg";
import MagicButton from "./MagicButton";
import { Spotlight } from "./ui/Spotlight";
import { TextGenerateEffect } from "./ui/TextGenerateEffect";
import Image from "next/image";

const Hero = () => {
  const handleClick = () => {
    alert("Resume not uploaded yet");
  };
  return (
    <div className="pb-20 pt-36">
      {/**
       *  UI: Spotlights
       *  Link: https://ui.aceternity.com/components/spotlight
       */}
      <div>
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

      {/**
       *  UI: grid
       *  change bg color to bg-black-100 and reduce grid color from
       *  0.2 to 0.03
       */}
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        {/* Radial gradient for the container to give a faded look */}
        <div
          // chnage the bg to bg-black-100, so it matches the bg color and will blend in
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>
      <div className="flex justify-center items-center z-10000">
        <div className="relative w-24 h-24 rounded-full border-4 border-white overflow-hidden shadow-md z-10000">
          <Image
            src={img} // Replace with your image path
            alt="Centered Circle Image"
            layout="fill"
            objectFit="cover"
          />
        </div>
      </div>
      <div className="flex justify-center relative mb-10 mt-2 z-10">
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
