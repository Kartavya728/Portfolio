"use client";

import React from "react";
import { StickyScroll } from "./ui/sticky-scroll-reveal";
import { projects } from "@/data";
import Image from "next/image";

const FeaturedProjects = () => {
  const content = projects.map((project) => ({
    title: project.title,
    description: project.des,
    iconLists: project.iconLists,
    github: "https://github.com/Kartavya728",
    live: "https://example.com",
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
        <Image
          src={project.img}
          alt={project.title}
          fill
          className="object-cover z-10"
        />
      </div>
    ),
  }));

  return (
    <div id="projects">
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
    </div>
  );
};

export default FeaturedProjects;
