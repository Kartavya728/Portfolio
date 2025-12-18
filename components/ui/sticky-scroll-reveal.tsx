"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMotionValueEvent, useScroll } from "motion/react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

export const StickyScroll = ({
  content,
  contentClassName,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode | any;
    iconLists?: string[];
    github?: string;
    live?: string;
  }[];
  contentClassName?: string;
}) => {
  const [activeCard, setActiveCard] = React.useState(0);
  const { theme } = useTheme();
  const ref = useRef<any>(null);
  const { scrollYProgress } = useScroll({
    // uncomment line 22 and comment line 23 if you DONT want the overflow container and want to have it change on the entire page scroll
    // target: ref
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  // Theme-aware background colors
  const backgroundColors =
    theme === "light"
      ? ["#f5f5f5", "#ffffff", "#f0f0f0"] // Light theme backgrounds
      : ["#0f172a", "#000000", "#171717"]; // Dark theme backgrounds

  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)", // cyan-500 to emerald-500
    "linear-gradient(to bottom right, #ec4899, #6366f1)", // pink-500 to indigo-500
    "linear-gradient(to bottom right, #f97316, #eab308)", // orange-500 to yellow-500
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
  }, [activeCard]);

  // Theme-aware text colors
  const textColor = theme === "light" ? "#000000" : "#e2e8f0";
  const mutedTextColor = theme === "light" ? "#666666" : "#cbd5e1";
  const iconBgColor = theme === "light" ? "#ffffff" : "#000000";
  const iconBorder = theme === "light" ? "#ddd" : "#ffffff";

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="relative flex h-screen w-screen justify-center space-x-10 overflow-y-auto p-10"
      ref={ref}
    >
      <div className="div relative flex items-start px-4">
        <div className="max-w-2xl">
          {content.map((item, index) => (
            <div key={item.title + index} className="my-20">
              <motion.h2
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                style={{ color: textColor }}
                className="text-2xl font-bold"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{
                  opacity: 0,
                }}
                animate={{
                  opacity: activeCard === index ? 1 : 0.3,
                }}
                style={{ color: mutedTextColor }}
                className="text-kg mt-10 max-w-sm"
              >
                {item.description}
              </motion.p>

              {item.iconLists && item.iconLists.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="flex items-center gap-3 mt-8"
                >
                  {item.iconLists.map((icon, idx) => (
                    <div
                      key={idx}
                      style={{
                        backgroundColor: iconBgColor,
                        borderColor: iconBorder,
                      }}
                      className="border rounded-full w-10 h-10 flex justify-center items-center hover:border-purple-500 transition-all"
                    >
                      <img src={icon} alt="tech" className="p-2" />
                    </div>
                  ))}
                </motion.div>
              )}

              {(item.github || item.live) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="flex gap-4 mt-6"
                >
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                        theme === "light"
                          ? "bg-purple-100 hover:bg-purple-200 text-purple-700 hover:text-purple-800 border-purple-300 hover:border-purple-400"
                          : "bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-purple-200 border-purple-500/30 hover:border-purple-500/60"
                      }`}
                    >
                      GitHub
                    </a>
                  )}
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all border ${
                        theme === "light"
                          ? "bg-blue-100 hover:bg-blue-200 text-blue-700 hover:text-blue-800 border-blue-300 hover:border-blue-400"
                          : "bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-blue-200 border-blue-500/30 hover:border-blue-500/60"
                      }`}
                    >
                      Deployed
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          ))}
          <div className="h-40" />
        </div>
      </div>
      <div
        style={{ background: backgroundGradient }}
        className={cn(
          "sticky top-1/2 -translate-y-1/2 hidden h-96 w-96 overflow-hidden rounded-md bg-white lg:block",
          contentClassName
        )}
      >
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};
