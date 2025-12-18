"use client";

import React, { useEffect, useRef } from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { featuredProjects } from "@/public/data/featured_projects_data";
import Image from "next/image";
import { motion } from "framer-motion";

// VideoPlayer component to handle video playback
const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Add error event listener
      const handleError = (e: Event) => {
        console.error("Video loading error:", e);
        console.error("Video source:", src);
      };
      
      video.addEventListener('error', handleError);
      
      video.load();
      video.play().catch((error) => {
        console.log("Autoplay prevented, will play on interaction:", error);
      });

      return () => {
        video.removeEventListener('error', handleError);
      };
    }
  }, [src]);

  return (
    <div className="absolute inset-0 z-10 rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        key={src} // Force re-render when src changes
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

const FeaturedProjects = () => {
  const content = featuredProjects.map((project) => ({
    title: project.title,
    description: project.des,
    iconLists: project.iconLists,
    github: project.github || "https://github.com/Kartavya728",
    live: project.website || "https://example.com",
    content: (
      <div className="h-full w-full relative overflow-hidden rounded-lg">
        <div
          className="absolute inset-0 overflow-hidden lg:rounded-lg"
          style={{ backgroundColor: "#13162D" }}
        >
          <img
            src="/bg.png"
            alt="bgimg"
            className="w-full h-full object-cover"
          />
        </div>
        {project.video ? (
          <VideoPlayer src={project.video} />
        ) : (
          <Image
            src={project.img}
            alt={project.title}
            fill
            className="object-cover z-10"
          />
        )}
      </div>
    ),
  }));

  return (
    <motion.div
      id="projects"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="text-center mb-4 py-10">
        <p className="text-sm text-white font-semibold uppercase tracking-wide">
          Featured / Live Projects
        </p>
        <h1 className="heading mt-2">
          Check out my <span className="text-white">Featured Projects</span>
        </h1>
      </div>
      <div
        className="
  border-t-[20px]
  border-b-[20px]
  border-l-[20px]
  border-r-[4000px]
  border-white
  rounded-[10px]
"
      >
        <StickyScroll content={content} contentClassName="rounded-lg" />
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
