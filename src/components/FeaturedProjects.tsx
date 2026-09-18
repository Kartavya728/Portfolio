import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/FeaturedProjects.css";

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProject {
  title: string;
  des: string;
  img: string;
  iconLists: string[];
  link: string;
  github?: string;
  website?: string;
}

/* The four featured projects from the resume. Images only - the earlier
   version played .mp4 clips here; these are stills instead. */
const featuredProjects: FeaturedProject[] = [
  {
    title: "Anatomy-Aware DoseFlow",
    des: "A three-stage deep learning pipeline reconstructing CT images across arbitrary dose levels (5%-100%). A dose-conditioned flow trajectory model integrating MedSAM and ViT encoders reached 48.15 dB PSNR and 0.9991 SSIM, generalizing zero-shot across three unseen anatomical regions.",
    img: "/dose.png",
    iconLists: ["PyTorch", "MedSAM", "ViT", "Mamba"],
    link: "Deep Learning Research — Feb 2026",
    github: "https://github.com/Kartavya728",
  },
  {
    title: "Smart-Scribes — Multimodal Lecture Intelligence",
    des: "Learning platform with multimodal understanding across video, audio and slides. Lecture summarization, Q&A generation, slide management and professor/student dashboards, built on Next.js, Supabase and Python embedding pipelines. 1st overall among 1,600+ teams.",
    img: "/ss.png",
    iconLists: ["Next.js", "TypeScript", "Whisper", "RAG"],
    link: "iHub Multimodal AI Hackathon — 2025",
    github: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    title: "Lunar DEM Generation using Photoclinometry",
    des: "Generates high-resolution Digital Elevation Models of the lunar surface from photoclinometry, processing NASA lunar datasets with ML, computer vision and GIS tooling to build accurate 3D topographic maps for rover-terrain studies.",
    img: "/luna.png",
    iconLists: ["Python", "NumPy", "SciPy", "Open3D"],
    link: "ISRO Hackathon — Jul 2025",
    github: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    title: "Integrated Finance Management Portal — IIT Mandi",
    des: "Digital finance workflow portal replacing paper-based PDA claims, reimbursements and bill approvals with role-based dashboards for faculty, staff, finance and audit officers. Auto-routing, QR-enabled asset tracking, live PDA balances and LDAP auth.",
    img: "/flow.png",
    iconLists: ["Next.js", "TypeScript", "Supabase", "NextAuth.js"],
    link: "IIT Mandi — 2025",
  },
];

/**
 * Scroll-stacked project cards: instead of clicking through tabs
 * (aceternity's Tabs pattern), each project rises from below on scroll
 * and stacks onto the pile, with the ones already shown receding behind
 * it. GSAP ScrollTrigger rather than Framer's scroll hooks, since the
 * page scrolls through GSAP ScrollSmoother.
 */
const FeaturedProjects = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
    const count = featuredProjects.length;

    // Pinned via ScrollTrigger rather than `position: sticky` - this site
    // scrolls through GSAP ScrollSmoother, which transforms the content
    // instead of scrolling it, so sticky never engages.
    const pin =
      window.innerWidth > 1024
        ? ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom bottom",
            pin: stickyRef.current,
            pinSpacing: false,
            invalidateOnRefresh: true,
          })
        : null;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // Spread the section's progress across the cards so each one gets
        // its own slice to rise through, then sits in the stack while the
        // later ones come up over it.
        const spread = self.progress * count;
        cardRefs.current.forEach((card, i) => {
          if (!card) return;
          const own = Math.max(0, Math.min(1, spread - i));
          const depth = Math.max(0, spread - i - 1);
          const enter = 1 - own; // 1 = fully below, 0 = seated
          const settle = Math.min(depth, 3);

          card.style.transform = `translate3d(0, ${enter * 105 - settle * 3.2}%, 0) scale(${
            1 - settle * 0.045
          })`;
          card.style.opacity = String(own === 0 ? 0 : 1);
          card.style.zIndex = String(10 + i);
          card.style.filter = settle > 0 ? `brightness(${1 - settle * 0.18})` : "none";
        });
      },
    });

    return () => {
      pin?.kill();
      trigger.kill();
    };
  }, []);

  return (
    <div
      id="featured"
      className="featured-projects-section"
      ref={sectionRef}
      style={{ height: `${(featuredProjects.length + 1) * 100}vh` }}
    >
      <div className="fp-sticky" ref={stickyRef}>
        <div className="fp-header">
          <p className="fp-eyebrow">Featured / Live Projects</p>
          <h1 className="fp-heading">
            Check out my <span>Featured Projects</span>
          </h1>
        </div>

        <div className="fp-stack">
          {featuredProjects.map((project, i) => (
            <div
              key={project.title}
              className="fp-card"
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <div className="fp-card-media">
                <img src={project.img} alt={project.title} />
              </div>
              <div className="fp-card-body">
                <p className="fp-card-link">{project.link}</p>
                <h2 className="fp-card-title">{project.title}</h2>
                <p className="fp-card-desc">{project.des}</p>
                <div className="fp-icons">
                  {project.iconLists.map((icon) => (
                    <span key={icon} className="fp-icon">
                      {icon}
                    </span>
                  ))}
                </div>
                <div className="fp-buttons">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fp-btn fp-btn-github"
                      data-cursor="disable"
                    >
                      GitHub
                    </a>
                  )}
                  {project.website && (
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fp-btn fp-btn-live"
                      data-cursor="disable"
                    >
                      Deployed
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
