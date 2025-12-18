"use client";

import React from "react";
import { socialEngagements } from "@/public/data/social_engagements_data";
import { awards } from "@/public/data/awards_data";
import { HeroParallax } from "./ui/hero-parallax";
import { InfiniteMovingCards } from "./ui/InfiniteCards";
import { motion } from "framer-motion";

const Achievements = () => {
  // Transform awards data to HeroParallax format
  const awardProducts = awards.map((award) => ({
    title: award.title,
    link: award.link,
    thumbnail: award.logo,
    description: award.description,
  }));

  return (
    <section id="achievements" className="py-20">
      {/* Awards Section with HeroParallax - Slide from Left */}
      <motion.div
        className="mb-24"
        initial={{ opacity: 0, x: -100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <h1 className="heading">
          <span className="text-purple">Awards & Recognition</span>
        </h1>
        <HeroParallax products={awardProducts} />
      </motion.div>

      {/* Participations Section with InfiniteCards - Slide from Right */}
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
      >
        <h1 className="heading">
          <span className="text-purple">
            Participations & Social Engagements
          </span>
        </h1>
        <p className="text-center text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
          Clubs • Societies • Projects & Volunteering
        </p>

        <div className="mt-12">
          <InfiniteMovingCards
            items={socialEngagements}
            direction="left"
            speed="normal"
            pauseOnHover={true}
          />
        </div>
      </motion.div>
    </section>
  );
};

export default Achievements;
