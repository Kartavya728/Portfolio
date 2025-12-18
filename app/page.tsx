"use client";

import { navItems } from "@/data";
export const runtime = "edge";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Skills from "@/components/Skills";
import CoreExpertise from "@/components/CoreExpertise";
import FeaturedProjects from "@/components/FeaturedProjects";
import TechnicalProjects from "@/components/TechnicalProjects";
import Achievements from "@/components/Achievements";
import Leadership from "@/components/Leadership";
import Certifications from "@/components/Certifications";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavbar";
import StarsCanvas from "@/components/StarBackground";
import { ThemeProvider } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";

const HomeContent = () => {
  const { theme, toggleTheme } = useTheme();
  const achievementsRef = useRef<HTMLDivElement>(null);
  const lastThemeRef = useRef<"dark" | "light">(theme);

  const bgColor = theme === "light" ? "#262F3CFF" : "#07001CFF";
  const textColor = theme === "light" ? "#000A4AFF" : "#FFFFFF";

  useEffect(() => {
    const handleScroll = () => {
      const achievementsElement = document.getElementById("achievements");

      if (achievementsElement) {
        const rect = achievementsElement.getBoundingClientRect();
        // When achievements section is in view and below viewport center, switch to light mode
        const shouldBeLightMode = rect.top < window.innerHeight * 0.5;

        if (shouldBeLightMode && lastThemeRef.current === "dark") {
          toggleTheme();
          lastThemeRef.current = "light";
        } else if (!shouldBeLightMode && lastThemeRef.current === "light") {
          toggleTheme();
          lastThemeRef.current = "dark";
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [toggleTheme]);

  // Update the ref when theme changes from external toggle
  useEffect(() => {
    lastThemeRef.current = theme;
  }, [theme]);

  return (
    <>
      <StarsCanvas />
      <main
        className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 transition-colors duration-500"
        style={{
          backgroundColor: bgColor,
          color: textColor,
        }}
      >
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={navItems} />
          <Hero />
          <AboutMe />
          <Skills />
          <CoreExpertise />
          <FeaturedProjects />
          <TechnicalProjects />
          <Achievements />
          <Certifications />
          <Leadership />
          <Contact />
          <Footer />
        </div>
      </main>
      <ThemeToggle />
    </>
  );
};

const Home = () => {
  return (
    <ThemeProvider>
      <HomeContent />
    </ThemeProvider>
  );
};

export default Home;
