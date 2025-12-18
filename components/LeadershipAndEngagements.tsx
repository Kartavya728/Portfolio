"use client";

import React from "react";
import { achievements } from "@/public/data/achievements_data";
import { FaTrophy, FaAward, FaStar, FaMedal } from "react-icons/fa";

const LeadershipAndEngagements = () => {
  const getAchievementIcon = (index: number) => {
    const icons = [
      <FaTrophy className="w-5 h-5" />,
      <FaAward className="w-5 h-5" />,
      <FaStar className="w-5 h-5" />,
      <FaMedal className="w-5 h-5" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <section id="achievements" className="py-20">
      <h1 className="heading">
        My Journey Through
        <span className="text-purple"> Achievements & Competitions</span>
      </h1>
      <p className="text-center text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
        Competitions • Hackathons • Projects & Milestones
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {achievements.map((achievement, index) => (
          <div
            key={index}
            className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

            <div className="relative z-10 p-6">
              {/* Header with icon */}
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-600 text-white">
                  {getAchievementIcon(index)}
                </div>
              </div>

              {/* Achievement Title */}
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {achievement.name}
              </h3>

              {/* Achievement Title Subtitle */}
              <p className="text-sm font-semibold text-purple-400 mb-3">
                {achievement.title}
              </p>

              {/* Achievement Description Quote */}
              <p className="text-sm text-gray-400 leading-relaxed italic">
                "{achievement.quote}"
              </p>

              {/* Decorative line */}
              <div className="mt-4 h-1 w-full bg-gradient-to-r from-yellow-500/30 via-orange-500/30 to-transparent rounded-full group-hover:from-yellow-500/60 group-hover:via-orange-500/60 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LeadershipAndEngagements;
