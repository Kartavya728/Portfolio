import { useState } from "react";
import Marquee from "react-fast-marquee";
import { motion } from "motion/react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";
import { ChromaticImage } from "./ui/chromatic-image";
import ProjectModal, { ProjectData } from "./ProjectModal";

const projects: ProjectData[] = [
  {
    name: "Anatomy-Aware DoseFlow",
    category: "Medical Imaging / Deep Learning",
    tools: "PyTorch, MedSAM, ViT, Mamba",
    image: "/dose.png",
    link: "https://github.com/Kartavya728",
  },
  {
    name: "FLOW — Fraud & Loan Optimization Workbench",
    category: "Distributed ML Systems",
    tools: "Pathway, NATS JetStream, Redis, FastAPI, React",
    image: "/flow.png",
    link: "https://github.com/Kartavya728/FLOW-InterIIT14-TechMeet",
  },
  {
    name: "LunaDEM",
    category: "Scientific Computing",
    tools: "Python, NumPy, SciPy, OpenCV, Open3D",
    image: "/luna.png",
    link: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    name: "LokMitra AI",
    category: "Voice AI Platform",
    tools: "Django, Next.js, Gemini API, RAG, PostgreSQL",
    image: "/lok.png",
    link: "https://github.com/Kartavya728/LokMitra-AI",
  },
  {
    name: "Smart-Scribes",
    category: "Multimodal Lecture Intelligence",
    tools: "RAG, Whisper, Next.js",
    image: "/ss.png",
    link: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    name: "AutoReach AI",
    category: "Agentic Workflow Automation",
    tools: "LLM Agents, LangGraph",
    image: "/auto.png",
    link: "https://github.com/Kartavya728/AutoReach-AI",
  },
  {
    name: "Dual-System Voice Cloning & Anti-Spoofing",
    category: "Audio Deep Learning / Security",
    tools: "PyTorch, Speaker Verification",
    image: "/aud.png",
    link: "https://github.com/Kartavya728/Dual-System-Framework-for-Neural-Voice-Cloning-and-Anti-Spoofing-Detection",
  },
  {
    name: "Vision Drive",
    category: "Autonomous Driving Perception",
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
        <h4>Tools and features</h4>
        <p>{project.tools}</p>
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
        <ChromaticImage src={project.image} alt={project.name} />
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
