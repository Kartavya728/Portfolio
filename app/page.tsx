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
import { useTheme, SectionId } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";

const HomeContent = () => {
  const { currentTheme, setCurrentSection } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      // Define section IDs in order of appearance
      const sectionIds: SectionId[] = [
        "hero",
        "about",
        "skills",
        "expertise",
        "projects",
        "achievements",
        "certifications",
        "leadership",
        "contact",
      ];

      // Find which section is currently most visible in viewport
      let maxVisibility = 0;
      let mostVisibleSection: SectionId = "hero";

      sectionIds.forEach((sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          const viewportHeight = window.innerHeight;

          // Calculate visibility ratio
          const visibleTop = Math.max(0, rect.top);
          const visibleBottom = Math.min(viewportHeight, rect.bottom);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          const visibility = visibleHeight / viewportHeight;

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleSection = sectionId;
          }
        }
      });

      // Update theme based on most visible section
      setCurrentSection(mostVisibleSection);
    };

    // Run on mount and scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setCurrentSection]);

  return (
    <>
      <StarsCanvas />
      <main
        className="relative flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5 transition-colors duration-700"
        style={{
          backgroundColor: currentTheme.backgroundColor,
          color: currentTheme.textColor,
        }}
      >
        <div className="max-w-7xl w-full">
          <FloatingNav navItems={navItems} />
          <div id="hero">
            <Hero />
          </div>
          <AboutMe />
          <Skills />
          <CoreExpertise />
          <div id="projects">
            <FeaturedProjects />
            <TechnicalProjects />
          </div>
          <Achievements />
          <Certifications />
          <Leadership />
          <Contact />
          <Footer />
        </div>
      </main>
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
