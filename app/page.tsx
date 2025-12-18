"use client";

import { navItems } from "@/data";
export const runtime = "edge";
import Hero from "@/components/Hero";
import AboutMe from "@/components/AboutMe";
import Skills from "@/components/Skills";
import CoreExpertise from "@/components/CoreExpertise";
import FeaturedProjects from "@/components/FeaturedProjects";
import TechnicalProjects from "@/components/TechnicalProjects";
import LeadershipAndEngagements from "@/components/LeadershipAndEngagements";
import Achievements from "@/components/Achievements";
import Certifications from "@/components/Certifications";
import ExperienceAndLeadership from "@/components/ExperienceAndLeadership";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import { FloatingNav } from "@/components/ui/FloatingNavbar";

const Home = () => {
  return (
    <main className="relative bg-black-100 flex justify-center items-center flex-col overflow-hidden mx-auto sm:px-10 px-5">
      <div className="max-w-7xl w-full">
        <FloatingNav navItems={navItems} />
        <Hero />
        <AboutMe />
        <Skills />
        <CoreExpertise />
        <FeaturedProjects />
        <TechnicalProjects />
        <LeadershipAndEngagements />
        <Achievements />
        <Certifications />
        <ExperienceAndLeadership />
        <Contact />
        <Footer />
      </div>
    </main>
  );
};

export default Home;
