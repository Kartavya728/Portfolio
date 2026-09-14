import { useState } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";
import ProjectModal, { ProjectData } from "./ProjectModal";

const projects: ProjectData[] = [
  {
    name: "Anatomy-Aware DoseFlow",
    category: "Medical Imaging / Deep Learning",
    description:
      "A deep learning pipeline that models CT dose distributions as a continuous flow between low and target doses. Combines MedSAM segmentation with a ViT-Mamba backbone to keep predictions anatomically consistent.",
    tools: "PyTorch, MedSAM, ViT, Mamba",
    image: "/dose.png",
    link: "https://github.com/Kartavya728",
  },
  {
    name: "FLOW — Fraud & Loan Optimization Workbench",
    category: "Distributed ML Systems",
    description:
      "A production-grade streaming platform for real-time fraud detection and intelligent loan targeting in banking. Built on an event-driven architecture with live model scoring and low-latency caching.",
    tools: "Pathway, NATS JetStream, Redis, FastAPI, React",
    image: "/flow.png",
    link: "https://github.com/Kartavya728/FLOW-InterIIT14-TechMeet",
  },
  {
    name: "LunaDEM",
    category: "Scientific Computing",
    description:
      "A discrete element method simulator for lunar regolith, modeling grain-scale mechanics for rover-terrain interaction studies. Includes a custom physics core with 3D visualization for inspecting particle behavior.",
    tools: "Python, NumPy, SciPy, OpenCV, Open3D",
    image: "/luna.png",
    link: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    name: "LokMitra AI",
    category: "Voice AI Platform",
    description:
      "A voice-first AI assistant for vernacular users, pairing Gemini-powered RAG with a Django/Next.js stack. Lets users ask questions and get grounded answers entirely by voice in their own language.",
    tools: "Django, Next.js, Gemini API, RAG, PostgreSQL",
    image: "/lok.png",
    link: "https://github.com/Kartavya728/LokMitra-AI",
  },
  {
    name: "Smart-Scribes",
    category: "Multimodal Lecture Intelligence",
    description:
      "A multimodal lecture assistant that transcribes, summarizes, and answers questions over recorded lectures. Won 1st place overall among 1,600+ teams at the iHub Multimodal AI Hackathon.",
    tools: "RAG, Whisper, Next.js",
    image: "/ss.png",
    link: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    name: "AutoReach AI",
    category: "Agentic Workflow Automation",
    description:
      "An agentic workflow system that plans and executes multi-step outreach tasks using LLM agents. Built with LangGraph to coordinate tool use, retries, and human-in-the-loop checkpoints.",
    tools: "LLM Agents, LangGraph",
    image: "/auto.png",
    link: "https://github.com/Kartavya728/AutoReach-AI",
  },
  {
    name: "Dual-System Voice Cloning & Anti-Spoofing",
    category: "Audio Deep Learning / Security",
    description:
      "A dual-system framework pairing neural voice cloning with real-time deepfake and audio anti-spoofing detection. Won the Deep Learning track at Hack 60 (HCLTech x IIT Mandi).",
    tools: "PyTorch, Speaker Verification",
    image: "/aud.png",
    link: "https://github.com/Kartavya728/Dual-System-Framework-for-Neural-Voice-Cloning-and-Anti-Spoofing-Detection",
  },
  {
    name: "Vision Drive",
    category: "Autonomous Driving Perception",
    description:
      "A perception stack for autonomous driving built on YOLO and OpenCV, handling real-time object detection and lane/obstacle awareness from live video feeds.",
    tools: "YOLO, OpenCV",
    image: "/vd.png",
    link: "https://github.com/Kartavya728/Vision-Drive",
  },
];

function ProjectCard({
  project,
  index,
  onViewMore,
}: {
  project: ProjectData;
  index: number;
  onViewMore: () => void;
}) {
  return (
    <div className="work-box">
      <div className="work-info">
        <div className="work-title">
          <h3>0{index + 1}</h3>
          <div>
            <h4>{project.name}</h4>
            <p>{project.category}</p>
          </div>
        </div>
        <h4>Description</h4>
        <p>{project.description}</p>
        <div className="work-actions">
          <button type="button" className="work-view-more" onClick={onViewMore}>
            View More
          </button>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="work-github-link"
            data-cursor="disable"
          >
            <MdArrowOutward />
          </a>
        </div>
      </div>
      <motion.div className="work-image" layoutId={`project-image-${index}`}>
        <img src={project.image} alt={project.name} className="work-image-zoom" />
      </motion.div>
    </div>
  );
}

const Work = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Work</span>
        </h2>
        <Marquee pauseOnHover speed={45} gradient={false} className="work-marquee">
          {projects.map((project, index) => (
            <ProjectCard
              key={project.name}
              project={project}
              index={index}
              onViewMore={() => setActiveIndex(index)}
            />
          ))}
        </Marquee>

        <button
          type="button"
          className="work-view-all"
          onClick={() => setShowAll((prev) => !prev)}
        >
          {showAll ? "Hide Projects" : "View All Projects"}
        </button>

        {showAll && (
          <div className="work-all-list">
            {projects.map((project, index) => (
              <ProjectCard
                key={`all-${project.name}`}
                project={project}
                index={index}
                onViewMore={() => setActiveIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      <ProjectModal
        project={activeIndex !== null ? projects[activeIndex] : null}
        layoutId={`project-image-${activeIndex}`}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
};

export default Work;
