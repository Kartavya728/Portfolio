"use client";

import React from "react";
import { socialEngagements } from "@/public/data/social_engagements_data";
import { FaHeart, FaCode, FaUsers, FaTrophy } from "react-icons/fa";

const SocialEngagements = () => {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Club":
        return <FaUsers className="w-5 h-5" />;
      case "Society":
        return <FaCode className="w-5 h-5" />;
      case "Project":
        return <FaTrophy className="w-5 h-5" />;
      default:
        return <FaHeart className="w-5 h-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Club":
        return "from-blue-500 to-blue-600";
      case "Society":
        return "from-purple-500 to-purple-600";
      case "Project":
        return "from-yellow-500 to-yellow-600";
      default:
        return "from-pink-500 to-pink-600";
    }
  };

  return (
    <section id="social-engagements" className="py-20">
      <h1 className="heading">
        My <span className="text-purple">Social Engagements</span>
      </h1>
      <p className="text-center text-gray-400 mt-4 text-lg max-w-3xl mx-auto">
        Clubs • Interests • Volunteering & Leadership
      </p>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {socialEngagements.map((engagement) => (
          <div
            key={engagement.id}
            className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

            <div className="relative z-10 p-6">
              {/* Header with type badge and duration */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`p-3 rounded-lg bg-gradient-to-br ${getTypeColor(
                      engagement.type
                    )} text-white`}
                  >
                    {getTypeIcon(engagement.type)}
                  </div>
                  <div>
                    <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-semibold">
                      {engagement.type}
                    </span>
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-semibold">
                  {engagement.duration}
                </span>
              </div>

              {/* Title and Role */}
              <h3 className="text-lg font-bold text-white mb-1 group-hover:text-purple-300 transition-colors">
                {engagement.title}
              </h3>
              <p className="text-sm font-semibold text-purple-400 mb-2">
                {engagement.role}
              </p>

              {/* Organization */}
              <p className="text-sm text-gray-400 mb-3 font-medium">
                {engagement.organization}
              </p>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed">
                {engagement.description}
              </p>

              {/* Decorative line */}
              <div className="mt-4 h-1 w-full bg-gradient-to-r from-purple-500/30 via-blue-500/30 to-transparent rounded-full group-hover:from-purple-500/60 group-hover:via-blue-500/60 transition-all" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SocialEngagements;
