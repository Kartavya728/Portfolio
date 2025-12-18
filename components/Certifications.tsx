"use client";

import React from "react";
import { certifications } from "@/public/data/certifications_data";
import { FaAward, FaExternalLinkAlt } from "react-icons/fa";

const Certifications = () => {
  return (
    <section id="certifications" className="py-20">
      <h1 className="heading">
        My <span className="text-purple">Certifications</span>
      </h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {certifications.map((cert, idx) => (
          <div
            key={cert.id}
            className="group relative rounded-xl bg-gradient-to-br from-slate-900 via-black-100 to-black-200 p-6 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 rounded-xl transition-all" />

            <div className="relative z-10">
              {/* Header with icon and date */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                    <FaAward className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                      {cert.title}
                    </h3>
                    <p className="text-sm text-purple-400 font-semibold mt-1">
                      {cert.issuer}
                    </p>
                  </div>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold whitespace-nowrap">
                  {cert.date}
                </span>
              </div>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-5 leading-relaxed">
                {cert.description}
              </p>

              {/* Credential Link */}
              {cert.credentialUrl && cert.credentialUrl !== "#" && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600/20 to-blue-600/20 hover:from-purple-600/40 hover:to-blue-600/40 text-purple-300 hover:text-purple-200 transition-all text-sm font-semibold border border-purple-500/30 hover:border-purple-500/60"
                >
                  View Credential
                  <FaExternalLinkAlt className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Certifications;
