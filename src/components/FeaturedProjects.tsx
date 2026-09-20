import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/FeaturedProjects.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { FeaturedProjectsTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import featuredData from "../../public/images/featured-projects/data.json";
import featuredLinks from "../../public/images/featured-projects/links.json";

gsap.registerPlugin(ScrollTrigger);

interface QuantResult {
  metric: string;
  value: string;
}

interface FeaturedProject {
  id: string;
  title: string;
  /* The write-up shown under "Project Description" - what it is and
     how it works, in one concise paragraph. */
  description: string;
  img: string;
  iconLists: string[];
  link: string;
  github?: string;
  linkedin?: string;
  deployed?: string;
  hackathon?: boolean;
  /* Short category shown as a chip in the card's top-left corner. */
  tag: string;
  /* Per-project accent used for the card border, tag, section titles and
     table values - gives each project its own visual identity instead
     of every card looking identical. */
  theme: string;
  problem: string;
  usp: string;
  results: QuantResult[];
}

const featuredLinksById = featuredLinks.projects as Record<
  string,
  { github?: string; linkedin?: string; deployed?: string }
>;

const featuredProjects: FeaturedProject[] = featuredData.projects.map((project) => {
  const links = featuredLinksById[project.id] || {};
  return {
    ...project,
    github: links.github || undefined,
    linkedin: links.linkedin || undefined,
    deployed: links.deployed || undefined,
  };
});

/* 5-slot fan of images, fanned out like a spread hand of cards with the
   centre one larger - adapted from aceternity's animated-modal image
   grid (plain CSS transforms here instead of Framer Motion, since this
   project doesn't otherwise depend on it). Rotation angles are fixed
   per slot rather than randomised on every render, so the fan doesn't
   reshuffle itself each time the section re-renders. */
const FAN_ROTATIONS = [-14, -7, 0, 7, 14];

const ImageFan = ({ src, alt }: { src: string; alt: string }) => (
  <div className="fp-fan">
    {FAN_ROTATIONS.map((deg, i) => (
      <div
        key={i}
        className={`fp-fan-item ${i === 2 ? "fp-fan-item-center" : ""}`}
        style={{ "--fp-rot": `${deg}deg` } as React.CSSProperties}
      >
        <img src={src} alt={`${alt} preview ${i + 1}`} />
      </div>
    ))}
  </div>
);

/* Animated "hackathon winner" badge for the two projects that actually
   won one - a sweeping gradient-text shimmer rather than a static label,
   so it reads as a highlight rather than another line of metadata. */
const HackathonBadge = () => (
  <div className="fp-hackathon-badge">
    <span className="fp-hackathon-badge-icon">🏆</span>
    <span className="fp-hackathon-badge-text">Hackathon Winning Project</span>
  </div>
);

const ResultsTable = ({ results }: { results: QuantResult[] }) => (
  <table className="fp-results-table">
    <tbody>
      {results.map((row) => (
        <tr key={row.metric}>
          <td className="fp-results-metric">{row.metric}</td>
          <td className="fp-results-value">{row.value}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

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
    // Below 1024px the section isn't pinned - cards lay out and stay
    // visible statically (see the CSS media query's `!important` reset).
    // The scroll-driven stack below has nothing to drive at that point,
    // so skip it rather than have it write inline styles every frame for
    // a layout that's ignoring them anyway.
    if (window.innerWidth <= 1024) return;
    const count = featuredProjects.length;

    // Pinned via ScrollTrigger rather than `position: sticky` - this site
    // scrolls through GSAP ScrollSmoother, which transforms the content
    // instead of scrolling it, so sticky never engages.
    const pin = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: stickyRef.current,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

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
          const settle = Math.min(depth, 2);

          // Older cards recede UP and shrink slightly as later ones
          // stack in front, peeking out above the active card's top
          // edge like a fanned stack of tabs - not drifting down below
          // it. Straight vertical offset only (no horizontal drift or
          // rotation) to match a clean tab-stack look, where each layer
          // behind is just a little higher and a little smaller/dimmer.
          const SETTLE_SPACING = 6;
          card.style.transform = `translate3d(0, ${
            enter * 105 - settle * SETTLE_SPACING
          }%, 0) scale(${1 - settle * 0.045})`;
          card.style.opacity = String(own === 0 ? 0 : 1);
          card.style.zIndex = String(10 + i);
          card.style.filter = settle > 0 ? `brightness(${1 - settle * 0.18})` : "none";
        });
      },
    });

    return () => {
      pin.kill();
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
            <EncryptedText text="Check out my" /> <span><EncryptedText text="Featured Projects" /></span>
            <SectionInfoTooltip>
              <FeaturedProjectsTooltip />
            </SectionInfoTooltip>
          </h1>
        </div>

        <div className="fp-stack">
          {featuredProjects.map((project, i) => (
            <div
              key={project.title}
              className="fp-card"
              style={{ "--fp-theme": project.theme } as React.CSSProperties}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
            >
              <span className="fp-tag">{project.tag}</span>
              <ImageFan src={project.img} alt={project.title} />

              <div className="fp-card-header">
                <p className="fp-card-link">{project.link}</p>
                <h2 className="fp-card-title">{project.title}</h2>
                <div className="fp-icons">
                  {project.iconLists.map((icon) => (
                    <span key={icon} className="fp-icon">
                      {icon}
                    </span>
                  ))}
                </div>
                {project.hackathon && <HackathonBadge />}
              </div>

              <div className="fp-card-body">
                <div className="fp-section">
                  <h3 className="fp-section-title">Problem</h3>
                  <p className="fp-section-body">{project.problem}</p>
                </div>
                <div className="fp-section">
                  <h3 className="fp-section-title">Project Description</h3>
                  <p className="fp-section-body">{project.description}</p>
                </div>
                <div className="fp-section">
                  <h3 className="fp-section-title">USP</h3>
                  <p className="fp-section-body">{project.usp}</p>
                </div>
                <div className="fp-section">
                  <h3 className="fp-section-title">Quantitative Results</h3>
                  <ResultsTable results={project.results} />
                </div>
              </div>

              <div className="fp-buttons">
                {project.github ? (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fp-btn fp-btn-github"
                    data-cursor="disable"
                  >
                    GitHub
                  </a>
                ) : (
                  <span className="fp-btn fp-btn-disabled" aria-disabled="true">
                    GitHub
                  </span>
                )}
                {project.linkedin ? (
                  <a
                    href={project.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fp-btn fp-btn-linkedin"
                    data-cursor="disable"
                  >
                    LinkedIn Post
                  </a>
                ) : (
                  <span className="fp-btn fp-btn-disabled" aria-disabled="true">
                    LinkedIn Post
                  </span>
                )}
                {/* Deployed links are intentionally disabled for now,
                    regardless of whether a URL is set. */}
                <span className="fp-btn fp-btn-disabled" aria-disabled="true">
                  Deployed
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProjects;
