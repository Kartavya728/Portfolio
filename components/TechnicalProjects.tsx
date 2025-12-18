"use client";

import React from "react";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";

const TechnicalProjects = () => {
  const technicalProjects = [
    {
      id: 1,
      title: "Real-time Chat Application",
      description:
        "A full-stack real-time messaging application with socket.io integration, user authentication, and message history.",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      id: 2,
      title: "E-Commerce Dashboard",
      description:
        "Analytics dashboard for e-commerce platform with real-time data visualization and admin controls.",
      technologies: ["Next.js", "TypeScript", "Recharts", "API Integration"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      id: 3,
      title: "Weather Forecast App",
      description:
        "Interactive weather application using OpenWeather API with location-based forecasting and beautiful UI.",
      technologies: ["React", "API", "Tailwind CSS", "Geolocation"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      id: 4,
      title: "Task Management System",
      description:
        "Collaborative task management tool with real-time updates, drag-and-drop functionality, and team features.",
      technologies: ["React", "Express", "MongoDB", "Redis"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      id: 5,
      title: "Image Processing Tool",
      description:
        "Web-based image processing application with filters, compression, and format conversion capabilities.",
      technologies: ["Python", "FastAPI", "OpenCV", "React"],
      github: "https://github.com",
      live: "https://example.com",
    },
    {
      id: 6,
      title: "Machine Learning Model Visualizer",
      description:
        "Interactive platform for training and visualizing ML models with real-time parameter adjustment.",
      technologies: ["TensorFlow", "Python", "React", "D3.js"],
      github: "https://github.com",
      live: "https://example.com",
    },
  ];

  return (
    <section id="technical-projects" className="py-20">
      <h1 className="heading">
        My <span className="text-purple">Technical Projects</span>
      </h1>

      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {technicalProjects.map((project) => (
          <div
            key={project.id}
            className="group relative rounded-xl bg-gradient-to-br from-slate-900 to-black-100 p-6 border border-purple-500/20 hover:border-purple-500/60 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 hover:-translate-y-1"
          >
            {/* Background accent */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/0 to-blue-600/0 group-hover:from-purple-600/5 group-hover:to-blue-600/5 rounded-xl transition-all" />

            <div className="relative z-10 h-full flex flex-col">
              {/* Project Title */}
              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-purple-300 transition-colors line-clamp-1">
                {project.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 mb-4 flex-grow leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {/* Technologies */}
              <div className="flex flex-wrap gap-2 mb-5">
                {project.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/30 hover:border-purple-500/60 transition-colors"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* Links */}
              <div className="flex gap-3 pt-4 border-t border-purple-500/10">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-purple-200 transition-all text-sm font-semibold border border-purple-500/30 hover:border-purple-500/60"
                >
                  <FaGithub className="w-4 h-4" />
                  GitHub
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-blue-200 transition-all text-sm font-semibold border border-blue-500/30 hover:border-blue-500/60"
                >
                  <FaExternalLinkAlt className="w-4 h-4" />
                  Live
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TechnicalProjects;
