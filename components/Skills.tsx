"use client";

import React from "react";

const Skills = () => {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: [
        { name: "Python", level: "Advanced" },
        { name: "JavaScript", level: "Advanced" },
        { name: "C++", level: "Intermediate" },
        { name: "HTML/CSS", level: "Advanced" },
        { name: "Dart", level: "Intermediate" },
        { name: "Solidity", level: "Intermediate" },
      ],
    },
    {
      category: "Frameworks & Tools",
      skills: [
        { name: "Next.js", level: "Advanced" },
        { name: "React", level: "Advanced" },
        { name: "Flutter", level: "Intermediate" },
        { name: "Flask", level: "Intermediate" },
        { name: "Firebase", level: "Intermediate" },
        { name: "LaTeX", level: "Intermediate" },
      ],
    },
    {
      category: "AI & Automation",
      skills: [
        { name: "Machine Learning", level: "Intermediate" },
        { name: "Generative AI", level: "Intermediate" },
        { name: "AI Agents", level: "Intermediate" },
        { name: "YOLO", level: "Intermediate" },
        { name: "Chatbots", level: "Intermediate" },
        { name: "Python Automation", level: "Advanced" },
      ],
    },
    {
      category: "Platforms & Systems",
      skills: [
        { name: "Windows", level: "Advanced" },
        { name: "Linux", level: "Intermediate" },
        { name: "Visual Studio Code", level: "Advanced" },
        { name: "Android Studio", level: "Intermediate" },
        { name: "Raspberry Pi", level: "Intermediate" },
        { name: "IoT Systems", level: "Intermediate" },
      ],
    },
    {
      category: "Cloud & Database",
      skills: [
        { name: "Cloud Services", level: "Intermediate" },
        { name: "MongoDB", level: "Intermediate" },
        { name: "Node.js", level: "Advanced" },
        { name: "Express.js", level: "Advanced" },
        { name: "RESTful APIs", level: "Advanced" },
        { name: "TypeScript", level: "Advanced" },
      ],
    },
  ];

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Advanced":
        return "from-blue-800 to-blue-950";
      case "Intermediate":
        return "from-blue-600 to-blue-800";
      default:
        return "from-blue-300 to-blue-600";
    }
  };

  return (
    <section id="skills" className="py-20">
      <h1 className="heading">
        My Technical <span className="text-purple">Skills</span>
      </h1>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {skillCategories.map((category, idx) => (
          <div
            key={idx}
            className="rounded-xl bg-gradient-to-br from-slate-900 to-black-100 p-6 border border-purple-500/20 hover:border-purple-500/50 transition-colors"
          >
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-gradient-to-r from-purple-400 to-purple-600" />
              {category.category}
            </h3>

            <div className="space-y-4">
              {category.skills.map((skill, skillIdx) => (
                <div key={skillIdx} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">{skill.name}</span>
                    <span
                      className={`text-xs px-2 py-1 rounded bg-gradient-to-r ${getLevelColor(
                        skill.level
                      )} text-white font-semibold`}
                    >
                      {skill.level}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-gradient-to-r ${getLevelColor(
                        skill.level
                      )}`}
                      style={{
                        width:
                          skill.level === "Advanced"
                            ? "90%"
                            : skill.level === "Intermediate"
                            ? "70%"
                            : "50%",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;
