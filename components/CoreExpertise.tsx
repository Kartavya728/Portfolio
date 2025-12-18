"use client";

import React from "react";
import { coreExpertise } from "@/public/data/core_expertise_data";
import { motion } from "framer-motion";

const CoreExpertise = () => {
  return (
    <motion.section
      id="expertise"
      className="py-20"
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <h1 className="heading">
        My <span className="text-purple">Core Expertise</span>
      </h1>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {coreExpertise.map((expertise, index) => (
          <motion.div
            key={expertise.id}
            className="group relative rounded-2xl bg-gradient-to-br from-slate-900 via-black-100 to-black-200 p-8 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/20"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.5,
              delay: index * 0.1,
              ease: [0.34, 1.56, 0.64, 1], // Spring-like easing for pop effect
            }}
          >
            {/* Gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-2xl transition-all duration-300" />

            <div className="relative z-10">
              {/* Icon */}
              {expertise.icon && (
                <div className="mb-4 inline-flex rounded-lg bg-purple-500/10 p-3 group-hover:bg-purple-500/20 transition-colors">
                  <img
                    src={expertise.icon}
                    alt={expertise.title}
                    className="h-6 w-6"
                  />
                </div>
              )}

              {/* Title and Level */}
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-xl font-bold text-white">
                  {expertise.title}
                </h3>
                <span className="text-xs px-3 py-1 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 text-purple-300 font-semibold border border-purple-500/30">
                  {expertise.level}
                </span>
              </div>

              {/* Description */}
              <p className="mb-6 text-sm text-gray-400 leading-relaxed">
                {expertise.description}
              </p>

              {/* Skills Tags */}
              <div className="flex flex-wrap gap-2">
                {expertise.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/20 transition-all"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default CoreExpertise;
