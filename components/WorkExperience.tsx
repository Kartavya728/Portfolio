"use client";

import React from "react";
import { workExperienceTimeline } from "@/public/data/work_experience_data";
import { motion } from "framer-motion";

const WorkExperience = () => {
  return (
    <motion.section
      id="experience"
      className="py-20"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <h1 className="heading">
        Work <span className="text-purple">Experience</span>
      </h1>
      <p className="text-center text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
        Internships & Professional Roles
      </p>

      <div className="mt-12 max-w-4xl mx-auto flex flex-col gap-6">
        {workExperienceTimeline.map((exp, index) => (
          <motion.div
            key={exp.id}
            className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
            initial={{ opacity: 0, x: index % 2 === 0 ? -60 : 60 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: index * 0.12,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

            <div className="relative z-10 p-6 md:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{exp.icon}</div>
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-white group-hover:text-purple-300 transition-colors">
                      {exp.role}
                    </h3>
                    <p className="text-sm md:text-base font-semibold text-purple-400">
                      {exp.company}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full font-semibold border whitespace-nowrap ${
                      exp.status === "Upcoming"
                        ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                        : "bg-purple-500/20 text-purple-300 border-purple-500/30"
                    }`}
                  >
                    {exp.duration}
                  </span>
                  <span className="text-xs text-gray-400">{exp.location}</span>
                </div>
              </div>

              <ul className="mt-4 space-y-2 list-disc list-inside">
                {exp.bullets.map((bullet, i) => (
                  <li key={i} className="text-sm text-gray-400 leading-relaxed">
                    {bullet}
                  </li>
                ))}
              </ul>

              <div className="mt-5 flex items-center gap-2">
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 border border-purple-500/30">
                  {exp.tag}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default WorkExperience;
