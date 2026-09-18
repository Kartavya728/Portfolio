import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./styles/Achievements.css";

gsap.registerPlugin(ScrollTrigger);

/* Images live in /public/achievements_data - swap the files there
   (keeping the names) to change what each entry shows. */
const achievements = [
  {
    title: "NASA Space Apps Challenge — 1st Place",
    meta: "Chandigarh · 2025",
    description:
      "Won among 100+ teams with Astrogenesis, a RAG-powered bioscience research engine built end to end during the challenge weekend.",
    image: "/achievements_data/nasa-1.png",
  },
  {
    title: "iHub Multimodal AI Hackathon — 1st Overall",
    meta: "IIT Mandi iHub · 2025",
    description:
      "Led a 5-member team to first place among 1,600+ teams with Smart-Scribes, a multimodal AI lecture assistant covering video, audio and slides.",
    image: "/achievements_data/ihub.png",
  },
  {
    title: "Hack 60 — HCLTech × IIT Mandi",
    meta: "Deep Learning Track Winner · 2026",
    description:
      "Won the Deep Learning track with a dual-system framework pairing neural voice cloning against a real-time deepfake and audio anti-spoofing detector.",
    image: "/achievements_data/achive-1.png",
  },
  {
    title: "InxiteOut Hackathon — 1st Runner-Up",
    meta: "XPECTO '26 · IIT Mandi",
    description:
      "Runner-up at IIT Mandi's flagship tech fest, competing against the strongest teams on campus.",
    image: "/achievements_data/achive-2.png",
  },
  {
    title: "Agentic AI Track — Podium Finish",
    meta: "National Hackathon Circuit",
    description:
      "Podium run building autonomous multi-step agent workflows with tool use, retries and human-in-the-loop checkpoints.",
    image: "/achievements_data/achive-3.png",
  },
];

/**
 * Sticky scroll reveal (aceternity's pattern) rebuilt on the page's own
 * scroll rather than a nested overflow container - the source demo uses
 * `container: ref` + `overflow-y-auto`, which would put a second
 * scrollbar inside the page. Driven by GSAP ScrollTrigger rather than
 * Framer's useScroll because this site scrolls through GSAP
 * ScrollSmoother, which Framer's scroll hooks don't track.
 */
const Achievements = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!sectionRef.current || !stickyRef.current) return;
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
        const index = Math.min(
          achievements.length - 1,
          Math.floor(self.progress * achievements.length)
        );
        setActive((prev) => (prev === index ? prev : index));
      },
    });
    return () => {
      pin?.kill();
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
              My <span>Achievements</span>
            </h2>
            <div className="ach-list">
              {achievements.map((item, i) => (
                <div
                  key={item.title}
                  className={`ach-entry ${i === active ? "ach-entry-active" : ""}`}
                >
                  <p className="ach-meta">{item.meta}</p>
                  <h3 className="ach-title">{item.title}</h3>
                  <p className="ach-description">{item.description}</p>
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
                className={`ach-image ${i === active ? "ach-image-active" : ""}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Achievements;
