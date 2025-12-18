"use client";

import React from "react";
import { certifications } from "@/public/data/certifications_data";
import { FaAward, FaDownload } from "react-icons/fa";
import { motion } from "framer-motion";

const Certifications = () => {
  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <motion.section
      id="certifications"
      className="py-20"
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <h1 className="heading">
        My <span className="text-purple">Certificates</span>
      </h1>

      <div className="mt-12 grid gap-8 md:grid-cols-2 max-w-5xl mx-auto">
        {certifications.map((cert, index) => (
          <motion.div
            key={cert.id}
            className="group relative rounded-xl overflow-hidden bg-gradient-to-br from-slate-900 via-black-100 to-black-200 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex flex-col h-full"
            initial={{
              opacity: 0,
              x: index % 2 === 0 ? -80 : 80,
              y: 30,
            }}
            whileInView={{ opacity: 1, x: 0, y: 0 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{
              duration: 0.6,
              delay: (index % 2) * 0.15,
              ease: [0.25, 0.4, 0.25, 1],
            }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/10 group-hover:to-blue-600/10 transition-all" />

            <div className="relative z-10 flex flex-col h-full">
              {/* Certificate Image */}
              <div className="h-64 w-full overflow-hidden bg-black/50">
                <img
                  src={cert.image}
                  alt={cert.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Certificate Details */}
              <div className="p-6 flex flex-col flex-grow">
                {/* Header with icon and date */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3 flex-grow">
                    <div className="mt-1 p-2 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                      <FaAward className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-purple-400 font-semibold mt-1">
                        {cert.issuer}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold whitespace-nowrap ml-2">
                    {cert.date}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-400 mb-6 leading-relaxed flex-grow">
                  {cert.description}
                </p>

                {/* Download Button */}
                {cert.downloadUrl && cert.downloadUrl !== "#" && (
                  <button
                    onClick={() => handleDownload(cert.downloadUrl, `${cert.title.replace(/\s+/g, '-')}.png`)}
                    className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white transition-all text-sm font-semibold border border-purple-500/30 hover:border-purple-500/60 group/btn cursor-pointer"
                  >
                    <FaDownload className="w-4 h-4 group-hover/btn:translate-y-1 transition-transform" />
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Certifications;
