import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FaGithub } from "react-icons/fa6";
import "./styles/FeaturedProjects.css";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProject {
  title: string;
  tag: string;
  description: string;
  tools: string[];
  github?: string;
  video?: string;
  image: string;
}

const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    title: "Anatomy-Aware DoseFlow",
    tag: "Deep Learning Research — Feb 2026",
    description:
      "A three-stage deep learning pipeline reconstructing CT images from arbitrary dose levels (5%-100%). A dose-conditioned flow trajectory model integrating MedSAM, ViT encoders and four loss functions achieved 48.15 dB PSNR and 0.9991 SSIM with zero-shot generalization across three unseen anatomical regions.",
    tools: ["PyTorch", "MedSAM", "ViT", "Mamba"],
    github: "https://github.com/Kartavya728",
    image: "/dose.png",
  },
  {
    title: "Smart-Scribes — Multimodal Lecture Understanding",
    tag: "Educational AI Platform — 2025",
    description:
      "A multimodal lecture intelligence platform (video, audio, PDFs) with lecture summarization, Q&A generation, slide management, and student & professor dashboards. Won 1st place overall among 1,600+ teams at the iHub Multimodal AI Hackathon.",
    tools: ["Next.js", "TypeScript", "Whisper", "RAG"],
    github: "https://github.com/Kartavya728/Smart-Scribes",
    video: "/featured/smart-scribes.mp4",
    image: "/ss.png",
  },
  {
    title: "LunaDEM — Lunar Terrain Analysis",
    tag: "Scientific Computing — Oct 2025",
    description:
      "A lightweight Python library for 3D lunar terrain analysis, reconstructing Digital Elevation Models from 2D orbital imagery. Formulated rover-aware landing site evaluation using terrain slope, roughness, and curvature for 9+ real-world rovers.",
    tools: ["Python", "NumPy", "SciPy", "Open3D"],
    github: "https://github.com/Kartavya728/LunaDEM",
    video: "/featured/lunadem.mp4",
    image: "/luna.png",
  },
  {
    title: "Integrated Finance Management Portal",
    tag: "IIT Mandi Finance Department — 2025",
    description:
      "A role-based finance platform replacing paper-based PDA claims, reimbursements, and bill approvals with dashboards for faculty, staff, finance, and audit officers. Shipped reliable approval workflows serving 50+ staff and ₹10+ lakh in transactions.",
    tools: ["Next.js", "TypeScript", "Supabase", "NextAuth.js"],
    video: "/featured/finance-portal.mp4",
    image: "/flow.png",
  },
];

const FeaturedProjects = () => {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const pinRef = useRef<HTMLDivElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const wrap = wrapRef.current;
    const pin = pinRef.current;
    if (!wrap || !pin) return;

    const trigger = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: "bottom bottom",
      pin,
      pinSpacing: false,
      scrub: 0.5,
      onUpdate: (self) => {
        const idx = Math.min(
          FEATURED_PROJECTS.length - 1,
          Math.floor(self.progress * FEATURED_PROJECTS.length)
        );
        setActiveIndex(idx);
      },
    });

    return () => trigger.kill();
  }, []);

  const active = FEATURED_PROJECTS[activeIndex];

  return (
    <div className="featured-projects-section section-container" id="featured">
      <h2>
        Featured <span>Projects</span>
      </h2>
      <div className="featured-wrap" ref={wrapRef}>
        <div className="featured-pin" ref={pinRef}>
          <div className="featured-left">
            {FEATURED_PROJECTS.map((project, index) => (
              <div
                key={project.title}
                className={`featured-item ${
                  index === activeIndex ? "featured-item-active" : ""
                }`}
              >
                <span className="featured-tag">{project.tag}</span>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="featured-tools">
                  {project.tools.map((tool) => (
                    <span key={tool}>{tool}</span>
                  ))}
                </div>
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="featured-github"
                    data-cursor="disable"
                  >
                    <FaGithub /> View on GitHub
                  </a>
                )}
              </div>
            ))}
          </div>

          <div className="featured-right">
            <AnimatePresence mode="wait">
              <motion.div
                key={active.title}
                className="featured-media"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
              >
                {active.video ? (
                  <video
                    key={active.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={active.image}
                    className="featured-media-el"
                  >
                    <source src={active.video} type="video/mp4" />
                  </video>
                ) : (
                  <img
                    src={active.image}
                    alt={active.title}
                    className="featured-media-el"
                  />
                )}
              </motion.div>
            </AnimatePresence>
            <div className="featured-dots">
              {FEATURED_PROJECTS.map((project, index) => (
                <span
                  key={project.title}
                  className={index === activeIndex ? "featured-dot-active" : ""}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
