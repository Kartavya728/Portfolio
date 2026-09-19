import { ScrollTrigger } from "gsap/ScrollTrigger";
import gsap from "gsap";
import { smoother } from "../Navbar";

const SECTION_IDS = [
  "about",
  "whatido",
  "career",
  "techstack",
  "featured",
  "work",
  "achievements",
  "certificates",
  "research",
  "contact",
];

const BASE_SMOOTH = 1.7;
const PAUSE_SMOOTH = 5.5;
const PAUSE_MS = 550;

/**
 * Gives the user a brief "settle" as each section comes into view, by
 * temporarily raising ScrollSmoother's own `smooth` (inertia/lag) value
 * for a moment rather than fully pausing or calling ScrollTrigger.refresh().
 * A blanket refresh() was proven earlier to desync the pinned camera
 * timelines (see GsapScroll.ts's tl1/tl2, both invalidateOnRefresh:true),
 * so this deliberately never touches refresh() or the pin/scrub triggers
 * themselves - it only nudges the smoother's damping, which is safe to
 * change at runtime and self-corrects back to normal a moment later.
 */
export function setupSectionPause() {
  let settleTween: gsap.core.Tween | null = null;

  const settle = () => {
    settleTween?.kill();
    smoother.smooth(PAUSE_SMOOTH);
    settleTween = gsap.to(
      { v: PAUSE_SMOOTH },
      {
        v: BASE_SMOOTH,
        duration: PAUSE_MS / 1000,
        ease: "power1.out",
        onUpdate: function () {
          smoother.smooth(this.targets()[0].v);
        },
      }
    );
  };

  const triggers = SECTION_IDS.map((id) => {
    const el = document.getElementById(id);
    if (!el) return null;
    return ScrollTrigger.create({
      trigger: el,
      start: "top center",
      onEnter: settle,
      onEnterBack: settle,
    });
  }).filter(Boolean) as ScrollTrigger[];

  return () => {
    settleTween?.kill();
    triggers.forEach((t) => t.kill());
    smoother.smooth(BASE_SMOOTH);
  };
}
