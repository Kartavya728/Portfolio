"use client";

import React from "react";
import { leadershipRoles } from "@/public/data/leadership_roles_data";

const Leadership = () => {
  return (
    <section id="leadership" className="py-20">
      <div>
        <h1 className="heading">
          <span className="text-purple">Campus Engagement & Leadership</span>
        </h1>
        <p className="text-center text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
          Leading initiatives • Mentoring & Community Building • Student
          Engagement
        </p>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leadershipRoles.map((role) => (
            <div
              key={role.id}
              className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 h-full flex flex-col"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

              <div className="relative z-10 p-6 flex flex-col h-full">
                {/* Icon and Duration */}
                <div className="flex items-start justify-between mb-4">
                  <div className="text-4xl p-3 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 text-white w-fit">
                    {role.icon}
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                    {role.duration}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {role.title}
                </h3>

                {/* Organization */}
                <p className="text-sm font-semibold text-purple-400 mb-3">
                  {role.organization}
                </p>

                {/* Description */}
                <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-grow">
                  {role.description}
                </p>

                {/* Decorative line */}
                <div className="h-1 w-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-transparent rounded-full group-hover:from-purple-500/60 group-hover:via-blue-500/60 transition-all" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;
