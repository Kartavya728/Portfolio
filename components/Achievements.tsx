"use client";

import React from "react";
import { socialEngagements } from "@/public/data/social_engagements_data";
import { awards } from "@/public/data/awards_data";
import { HeroParallax } from "./ui/hero-parallax";
import { InfiniteMovingCards } from "./ui/InfiniteCards";

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
      {/* Awards Section with HeroParallax */}
      <div className="mb-24">
        <h1 className="heading">
          <span className="text-purple">Awards & Recognition</span>
        </h1>
        <HeroParallax products={awardProducts} />
      </div>

      {/* Participations Section with InfiniteCards */}
      <div>
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
      </div>
    </section>
  );
};

export default Achievements;
