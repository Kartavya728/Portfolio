"use client";

import React from "react";
import { workExperience } from "@/data";
import { Button } from "./ui/MovingBorders";
import { FaBriefcase, FaUsers, FaStar } from "react-icons/fa";

const ExperienceAndLeadership = () => {
  const leadershipRoles = [
    {
      id: 1,
      title: "Web Dev Team Lead",
      organization: "Exodia'25 - IIT Mandi",
      role: "Team Lead",
      duration: "2024 - Present",
      description: "Leading the web development team for annual tech fest",
      icon: "👥",
    },
    {
      id: 2,
      title: "Coding Club Mentor",
      organization: "IIT Mandi",
      role: "Mentor",
      duration: "2024 - Present",
      description: "Mentoring junior students in competitive programming",
      icon: "📚",
    },
    {
      id: 3,
      title: "Project Coordinator",
      organization: "Research Society",
      role: "Coordinator",
      duration: "2023 - 2024",
      description: "Coordinated and developed the society website",
      icon: "🎯",
    },
  ];

  return (
    <section id="experience" className="py-20">
      {/* Main Experience Section */}
      <div className="mb-20">
        <h1 className="heading">
          My <span className="text-purple">Technical Experience</span>
        </h1>

        <div className="w-full mt-12 grid lg:grid-cols-4 grid-cols-1 gap-10">
          {workExperience.map((card) => (
            <Button
              key={card.id}
              duration={Math.floor(Math.random() * 10000) + 10000}
              borderRadius="1.75rem"
              style={{
                background: "rgb(4,7,29)",
                backgroundColor:
                  "linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)",
                borderRadius: `calc(1.75rem* 0.96)`,
              }}
              className="flex-1 text-black dark:text-white border-neutral-200 dark:border-slate-800"
            >
              <div className="flex lg:flex-row flex-col lg:items-center p-3 py-6 md:p-5 lg:p-10 gap-2">
                <img
                  src={card.thumbnail}
                  alt={card.thumbnail}
                  className="lg:w-32 md:w-20 w-16"
                />
                <div className="lg:ms-5">
                  <h1 className="text-start text-xl md:text-2xl font-bold">
                    {card.title}
                  </h1>
                  <p className="text-start text-white-100 mt-3 font-semibold">
                    {card.desc}
                  </p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Leadership Roles Section */}
      <div className="border-t border-purple-500/20 pt-20">
        <h2 className="heading">
          <span className="text-purple">Leadership</span> & Roles
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {leadershipRoles.map((role) => (
            <div
              key={role.id}
              className="group relative rounded-xl bg-gradient-to-br from-slate-900 to-black-100 p-6 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
            >
              {/* Background accent */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-xl transition-all" />

              <div className="relative z-10">
                {/* Icon and role */}
                <div className="flex items-start justify-between mb-3">
                  <div className="text-3xl">{role.icon}</div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold whitespace-nowrap">
                    {role.role}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {role.title}
                </h3>

                {/* Organization */}
                <p className="text-sm text-purple-400 font-semibold mb-1">
                  {role.organization}
                </p>

                {/* Duration */}
                <p className="text-xs text-gray-400 mb-4">{role.duration}</p>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed">
                  {role.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ExperienceAndLeadership;
