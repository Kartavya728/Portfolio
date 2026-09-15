import React, { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import "./styles/FeaturedProjects.css";

// A faithful port of the old-ui `StickyScroll` (sticky-scroll-reveal) +
// `FeaturedProjects` pair: same internal scroll container driving the
// active card, same sticky media panel dimensions (400x610), same
// gradients/opacities. Tailwind classes are translated 1:1 into
// FeaturedProjects.css since this project doesn't use Tailwind.

interface FeaturedProject {
  title: string;
  des: string;
  img: string;
  video?: string;
  iconLists: string[];
  link: string;
  github?: string;
  website?: string;
}

const featuredProjects: FeaturedProject[] = [
  {
    title: "Anatomy-Aware DoseFlow",
    des: "A three-stage deep learning pipeline for reconstructing CT images from arbitrary dose levels (5%-100%). A dose-conditioned flow trajectory model integrating MedSAM, ViT encoders and four loss functions achieved 48.15 dB PSNR and 0.9991 SSIM with zero-shot generalization across three unseen anatomical regions.",
    img: "/dose.png",
    iconLists: ["PyTorch", "MedSAM", "ViT", "Mamba"],
    link: "Deep Learning Research - Feb 2026",
    github: "https://github.com/Kartavya728",
  },
  {
    title: "Multimodal Lecture Understanding System (Smart Scribe)",
    des: "Advanced learning platform with multimodal understanding (video, audio, PDFs). Features lecture summarization, Q&A generation, slides management, student & professor dashboards, and structured planning mode. Built with Next.js, Supabase, and Python pipelines for embedding extraction.",
    img: "/ss.png",
    video: "/featured/smart-scribes.mp4",
    iconLists: ["Next.js", "TypeScript", "Whisper", "RAG"],
    link: "Educational AI Platform - 2025",
    github: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    title: "Lunar DEM Generation using Photoclinometry",
    des: "Developed a system to generate high-resolution Digital Elevation Models (DEM) of the lunar surface using photoclinometry. Processed NASA lunar datasets with ML, computer vision, and GIS tools to create accurate 3D topographic maps.",
    img: "/luna.png",
    video: "/featured/lunadem.mp4",
    iconLists: ["Python", "NumPy", "SciPy", "Open3D"],
    link: "ISRO Hackathon - Jul 2025",
    github: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    title: "Integrated Finance Management Portal - IIT Mandi",
    des: "Digital finance workflow portal that replaces paper-based PDA claims, reimbursements, and bill approvals with role-based dashboards for faculty, staff, finance, and audit officers. Features auto-routing, QR-enabled asset tracking, real-time PDA balance visibility, and LDAP authentication.",
    img: "/flow.png",
    video: "/featured/finance-portal.mp4",
    iconLists: ["Next.js", "TypeScript", "Supabase", "NextAuth.js"],
    link: "IIT Mandi - 2025",
  },
];

const VideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.load();
      video.play().catch(() => {
        /* autoplay may be blocked until interaction */
      });
    }
  }, [src]);

  return (
    <div className="fp-video-layer">
      <video ref={videoRef} key={src} autoPlay loop muted playsInline preload="auto">
        <source src={src} type="video/mp4" />
      </video>
    </div>
  );
};

const StickyScroll = ({
  content,
}: {
  content: {
    title: string;
    description: string;
    content?: React.ReactNode;
    iconLists?: string[];
    github?: string;
    live?: string;
  }[];
}) => {
  const [activeCard, setActiveCard] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    container: ref,
    offset: ["start start", "end start"],
  });
  const cardLength = content.length;

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const cardsBreakpoints = content.map((_, index) => index / cardLength);
    const closestBreakpointIndex = cardsBreakpoints.reduce(
      (acc, breakpoint, index) => {
        const distance = Math.abs(latest - breakpoint);
        if (distance < Math.abs(latest - cardsBreakpoints[acc])) {
          return index;
        }
        return acc;
      },
      0
    );
    setActiveCard(closestBreakpointIndex);
  });

  const backgroundColors = ["#0f172a", "#000000", "#171717"];
  const linearGradients = [
    "linear-gradient(to bottom right, #06b6d4, #10b981)",
    "linear-gradient(to bottom right, #ec4899, #6366f1)",
    "linear-gradient(to bottom right, #f97316, #eab308)",
  ];

  const [backgroundGradient, setBackgroundGradient] = useState(
    linearGradients[0]
  );

  useEffect(() => {
    setBackgroundGradient(linearGradients[activeCard % linearGradients.length]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCard]);

  return (
    <motion.div
      animate={{
        backgroundColor: backgroundColors[activeCard % backgroundColors.length],
      }}
      className="fp-sticky-scroll"
      ref={ref}
    >
      <div className="fp-left">
        <div className="fp-left-inner">
          {content.map((item, index) => (
            <div key={item.title + index} className="fp-item">
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="fp-item-title"
              >
                {item.title}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                className="fp-item-desc"
              >
                {item.description}
              </motion.p>

              {item.iconLists && item.iconLists.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="fp-icons"
                >
                  {item.iconLists.map((icon, idx) => (
                    <div key={idx} className="fp-icon">
                      {icon}
                    </div>
                  ))}
                </motion.div>
              )}

              {(item.github || item.live) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: activeCard === index ? 1 : 0.3 }}
                  className="fp-buttons"
                >
                  {item.github && (
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fp-btn fp-btn-github"
                      data-cursor="disable"
                    >
                      GitHub
                    </a>
                  )}
                  {item.live && (
                    <a
                      href={item.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fp-btn fp-btn-live"
                      data-cursor="disable"
                    >
                      Deployed
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          ))}
          <div className="fp-spacer" />
        </div>
      </div>
      <div style={{ background: backgroundGradient }} className="fp-media">
        {content[activeCard].content ?? null}
      </div>
    </motion.div>
  );
};

const FeaturedProjects = () => {
  const content = featuredProjects.map((project) => ({
    title: project.title,
    description: project.des,
    iconLists: project.iconLists,
    github: project.github,
    live: project.website,
    content: (
      <div className="fp-media-inner">
        <div className="fp-media-bg" />
        {project.video ? (
          <VideoPlayer src={project.video} />
        ) : (
          <img src={project.img} alt={project.title} className="fp-media-img" />
        )}
      </div>
    ),
  }));

  return (
    <motion.div
      id="featured"
      className="featured-projects-section"
      initial={{ opacity: 0, x: 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: false, amount: 0.2 }}
      transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
    >
      <div className="fp-header">
        <p className="fp-eyebrow">Featured / Live Projects</p>
        <h1 className="fp-heading">
          Check out my <span>Featured Projects</span>
        </h1>
      </div>
      <div className="fp-frame">
        <StickyScroll content={content} />
      </div>
    </motion.div>
  );
};

export default FeaturedProjects;
