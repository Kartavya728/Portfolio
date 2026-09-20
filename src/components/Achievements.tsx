import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Achievements.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { AchievementsTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import achievementsData from "../../public/images/achievements/data.json";
import achievementLinks from "../../public/images/achievements/links.json";

const smoothstep = (t: number) => {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
};

gsap.registerPlugin(ScrollTrigger);

/* Images live in /public/achievements_data - swap the files there
   (keeping the names) to change what each entry shows. */
const achievementLinksById = achievementLinks.achievements as Record<string, { github?: string }>;

const achievements = achievementsData.achievements.map((item) => ({
  ...item,
  github: achievementLinksById[item.id]?.github || "",
}));


/**
 * Sticky scroll reveal (aceternity's pattern) rebuilt on the page's own
 * scroll rather than a nested overflow container - the source demo uses
 * `container: ref` + `overflow-y-auto`, which would put a second
 * scrollbar inside the page. Driven by GSAP ScrollTrigger rather than
 * Framer's useScroll because this site scrolls through GSAP
 * ScrollSmoother, which Framer's scroll hooks don't track.
 *
 * Each entry's opacity/position is written directly from scroll progress
 * every frame (the same technique FeaturedProjects uses), rather than
 * picking a discrete "active" index and letting a fixed-duration CSS
 * transition animate the cross-fade. The CSS-transition version played
 * out on its own clock once triggered, so a fast scroll (or scrolling
 * back up) could outrun it - the transition was still mid-flight while
 * the scroll position said something else, producing a visible overlap
 * between entries. Deriving the look from progress directly means
 * scrolling up is just progress decreasing - there's no separate
 * "reverse" case to get wrong, and it can never fall behind the scroll
 * position in either direction.
 */
const Achievements = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
    // Below 1024px the section isn't pinned at all - every entry is laid
    // out statically and shown at once (see the CSS media query), so the
    // scroll-driven reveal below has nothing to drive and would only
    // fight that layout: it writes opacity/transform as inline styles,
    // which beat the mobile CSS reset since inline always outranks a
    // stylesheet rule regardless of specificity.
    if (window.innerWidth <= 1024) return;
    const count = achievements.length;
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
        // Spread the section's progress across the entries so each one
        // gets its own slice - the same technique FeaturedProjects uses
        // for its stack.
        const spread = self.progress * count;
        entryRefs.current.forEach((entry, i) => {
          if (!entry) return;
          const local = spread - i;
          // Overlapping fade windows (in by [-0.3, 0], out by [0.7, 1])
          // so one entry's fade-out and the next one's fade-in share the
          // same span of scroll - a real cross-dissolve rather than both
          // entries passing through zero opacity one after the other.
          const fadeIn = smoothstep((local + 0.3) / 0.3);
          const fadeOut = 1 - smoothstep((local - 0.7) / 0.3);
          const opacity = fadeIn * fadeOut;
          const y = (1 - fadeIn) * 24 - (1 - fadeOut) * 10;
          entry.style.opacity = String(opacity);
          entry.style.transform = `translateY(${y}px)`;
          entry.style.pointerEvents = opacity > 0.5 ? "auto" : "none";

          const image = imageRefs.current[i];
          if (image) {
            image.style.opacity = String(opacity);
            image.style.transform = `scale(${1 + (1 - opacity) * 0.06})`;
          }
        });

        const index = Math.min(count - 1, Math.floor(spread));
        setActive((prev) => (prev === index ? prev : index));
      },
    });
    return () => {
      pin.kill();
      trigger.kill();
    };
  }, []);

  return (
    <div
      className="achievements-section"
      id="achievements"
      ref={sectionRef}
      style={{ height: `${achievements.length * 85}vh` }}
    >
      <div className="ach-sticky" ref={stickyRef}>
        <div className="ach-inner">
          <div className="ach-copy">
            <h2>
              <EncryptedText text="My" /> <span><EncryptedText text="Achievements" /></span>
              <SectionInfoTooltip>
                <AchievementsTooltip />
              </SectionInfoTooltip>
            </h2>
            <div className="ach-list">
              {achievements.map((item, i) => (
                <div
                  key={item.title}
                  className="ach-entry"
                  ref={(el) => {
                    entryRefs.current[i] = el;
                  }}
                >
                  <p className="ach-meta">{item.meta}</p>
                  <h3 className="ach-title">{item.title}</h3>
                  <p className="ach-description">{item.description}</p>
                  <div className="ach-stats">
                    <div className="ach-stat">
                      <span className="ach-stat-label">Teams</span>
                      <span className="ach-stat-value">{item.teams}</span>
                    </div>
                    <div className="ach-stat">
                      <span className="ach-stat-label">Position</span>
                      <span className="ach-stat-value">{item.position}</span>
                    </div>
                    <a
                      href={item.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ach-stat-link"
                      data-cursor="disable"
                    >
                      GitHub ↗
                    </a>
                  </div>
                </div>
              ))}
            </div>
            <div className="ach-progress">
              {achievements.map((item, i) => (
                <span
                  key={item.title}
                  className={`ach-pip ${i === active ? "ach-pip-active" : ""}`}
                />
              ))}
            </div>
          </div>

          <div className="ach-media">
            {achievements.map((item, i) => (
              <img
                key={item.image}
                src={item.image}
                alt={item.title}
                className="ach-image"
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
