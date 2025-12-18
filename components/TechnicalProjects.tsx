"use client";

import { FaLocationArrow } from "react-icons/fa6";
import { projects } from "@/data";
import { PinContainer } from "./ui/Pin";
import Image from "next/image";
import ThreeBackground from "./ThreeBackground";
import { motion } from "framer-motion";

const TechnicalProjects = () => {
  return (
    <section id="technical-projects" className="py-20 relative overflow-hidden">
      <ThreeBackground />
      <div className="text-center mb-2">
        <p className="text-sm text-blue-400 font-semibold uppercase tracking-wide">
          Technical / AI-ML Projects
        </p>
      </div>
      <h1 className="heading">
        My <span className="text-white">Github Projects</span>
      </h1>

      <div className="flex flex-wrap items-center justify-center p-4 gap-16 mt-10">
        {projects.map((item, index) => (
          <motion.div
            className="lg:min-h-[32.5rem] h-[25rem] flex items-center justify-center sm:w-96 w-[80vw] bg-color-blue-900"
            key={item.id}
            initial={{ 
              opacity: 0, 
              x: index % 2 === 0 ? -100 : 100  // Even cards from left, odd from right
            }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ 
              duration: 0.7, 
              delay: (index % 4) * 0.1, // Stagger animation
              ease: [0.25, 0.4, 0.25, 1] 
            }}
          >
            <PinContainer
              title={item.link}
              href="https://github.com/Kartavya728"
            >
              <div className="relative flex items-center bg-color-blue-900 justify-center sm:w-96 w-[80vw] overflow-hidden h-[20vh] lg:h-[30vh] mb-10">
                <div
                  className="relative w-full h-full overflow-hidden lg:rounded-3xl"
                  style={{ backgroundColor: "#13162dff" }}
                >
                  <img src="/bg.png" alt="bgimg" />
                </div>
                <Image
                  src={item.img}
                  alt="cover"
                  height="200"
                  width="300"
                  className="z-10 absolute bottom-0"
                />
              </div>

              <h1 className="font-bold lg:text-2xl md:text-xl text-base text-white line-clamp-1">
                {item.title}
              </h1>

              <p
                className="lg:text-xl lg:font-normal font-light text-sm text-white line-clamp-2"
                style={{
                  color: "#d2daffff",
                  margin: "1vh 0",
                }}
              >
                {item.des}
              </p>

              <div className="flex items-center justify-between mt-7 mb-3">
                <div className="flex items-center">
                  {item.iconLists.map((icon, index) => (
                    <div
                      key={index}
                      className="border border-white/[.2] rounded-full bg-black lg:w-10 lg:h-10 w-8 h-8 flex justify-center items-center"
                      style={{
                        transform: `translateX(-${5 * index + 2}px)`,
                      }}
                    >
                      <img src={icon} alt="icon5" className="p-2" />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center items-center">
                  <a
                    href={item.github || "https://github.com/Kartavya728"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex lg:text-xl md:text-xs text-sm text-black"
                  >
                    View in GitHub
                  </a>

                  <FaLocationArrow className="ms-3" color="#000000ff" />
                </div>
              </div>
            </PinContainer>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalProjects;
