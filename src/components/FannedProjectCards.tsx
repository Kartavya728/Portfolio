import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { ProjectData } from "../data/projects";
import { CATEGORIES } from "../data/categories";
import "./styles/FannedProjectCards.css";

interface FannedProjectCardsProps {
  items: { project: ProjectData; index: number }[];
  modalOpen: boolean;
  onViewMore: (index: number) => void;
}

const cardSpring = { type: "spring" as const, visualDuration: 0.55, bounce: 0.22 };
const AUTO_SCROLL_SPEED = 0.5; // px per frame

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Cyclic y/rotate offsets (adapted from aceternity's interface-crafts-cards
// demo's per-card config) applied by position-in-row rather than baked into
// each card individually, so the fan pattern repeats endlessly as the row
// loops.
const IDLE_PATTERN = [
  { y: -14, rotate: -10 },
  { y: 16, rotate: 6 },
  { y: -34, rotate: -4 },
  { y: 14, rotate: 9 },
  { y: -6, rotate: -7 },
];

type Phase = "idle" | "expanding" | "open" | "collapsing";

type OverlayState = {
  key: string;
  index: number;
  project: ProjectData;
  rect: { left: number; top: number; width: number; height: number };
};

/**
 * Endlessly auto-scrolling, fanned project row (card visual language
 * adapted from aceternity's interface-crafts-cards demo, ported off
 * Tailwind; the movement mechanism reuses this project's own
 * Work.tsx auto-scroll technique - a doubled item list with its
 * scrollLeft nudged forward every frame so it can wrap seamlessly).
 *
 * Clicking a card freezes the row, pushes every other card down/away,
 * and grows a FLIP-style overlay clone from the clicked card's exact
 * screen rect up to a large centred size; once that settles it hands
 * off to the site's existing ProjectModal via `onViewMore`. When that
 * modal is closed (`modalOpen` flips back to false), the overlay
 * reverses the same animation back down into the row before the row
 * resumes scrolling.
 */
const FannedProjectCards = ({ items, modalOpen, onViewMore }: FannedProjectCardsProps) => {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const [isDesktop, setIsDesktop] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const prevModalOpenRef = useRef(modalOpen);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const loopItems = useMemo(() => [...items, ...items], [items]);

  useEffect(() => {
    pausedRef.current = phase !== "idle";
  }, [phase]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId: number;
    const tick = () => {
      if (!pausedRef.current) {
        const halfWidth = track.scrollWidth / 2;
        track.scrollLeft += AUTO_SCROLL_SPEED;
        if (halfWidth > 0 && track.scrollLeft >= halfWidth) {
          track.scrollLeft -= halfWidth;
        }
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [loopItems.length]);

  // The modal closing (parent hands us `modalOpen: false`) is the signal
  // to reverse the expand animation back into the row.
  useEffect(() => {
    if (prevModalOpenRef.current && !modalOpen) {
      setPhase((p) => (p === "open" ? "collapsing" : p));
    }
    prevModalOpenRef.current = modalOpen;
  }, [modalOpen]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLButtonElement>,
    project: ProjectData,
    index: number,
    key: string
  ) => {
    if (phase !== "idle") return;
    const r = e.currentTarget.getBoundingClientRect();
    setOverlay({
      key,
      index,
      project,
      rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    });
    setPhase("expanding");
  };

  const enlargedW = isDesktop ? 440 : Math.min(320, window.innerWidth * 0.86);
  const enlargedH = Math.min(isDesktop ? 560 : enlargedW * 1.27, window.innerHeight - 160);

  // Clamped so the enlarged preview never rides up under the page header/
  // filter row on shorter viewports - it can sit lower than dead-centre,
  // just never higher than this.
  const targetY = Math.max(100, (window.innerHeight - enlargedH) / 2);

  const overlayTarget = overlay
    ? phase === "collapsing"
      ? { x: overlay.rect.left, y: overlay.rect.top, width: overlay.rect.width, height: overlay.rect.height }
      : {
          x: (window.innerWidth - enlargedW) / 2,
          y: targetY,
          width: enlargedW,
          height: enlargedH,
        }
    : undefined;

  return (
    <div
      className="fanned-projects"
      onMouseEnter={() => {
        if (phase === "idle") pausedRef.current = true;
      }}
      onMouseLeave={() => {
        if (phase === "idle") pausedRef.current = false;
      }}
    >
      <div
        ref={trackRef}
        className={`fan-track ${phase !== "idle" ? "fan-track-active" : ""}`}
      >
        {loopItems.map((item, i) => {
          const key = `${item.project.name}-${i}`;
          const theme = CATEGORIES[item.project.categoryKey];
          const pattern = IDLE_PATTERN[i % IDLE_PATTERN.length];
          const isSource = overlay?.key === key && phase !== "idle";

          return (
            <button
              key={key}
              type="button"
              className="fan-card"
              data-cursor="disable"
              style={{
                background: hexToRgba(theme.color, 0.06),
                borderColor: hexToRgba(theme.color, 0.4),
                transform:
                  phase !== "idle"
                    ? "translateY(300px) scale(0.72)"
                    : `translateY(${pattern.y}px) rotate(${pattern.rotate}deg)`,
                opacity: phase !== "idle" ? 0.35 : 1,
                visibility: isSource ? "hidden" : "visible",
              }}
              onClick={(e) => handleCardClick(e, item.project, item.index, key)}
            >
              <div className="fan-card-tag" style={{ color: theme.color }}>
                {theme.label}
              </div>
              <img src={item.project.image} alt={item.project.name} className="fan-card-img" />
              <div className="fan-card-title">{item.project.name}</div>
              <div className="fan-card-veil">
                <span>View More</span>
              </div>
            </button>
          );
        })}
      </div>

      {overlay && (
        <motion.div
          className="fan-card-overlay"
          style={{
            background: hexToRgba(CATEGORIES[overlay.project.categoryKey].color, 0.07),
            borderColor: hexToRgba(CATEGORIES[overlay.project.categoryKey].color, 0.4),
          }}
          initial={{
            x: overlay.rect.left,
            y: overlay.rect.top,
            width: overlay.rect.width,
            height: overlay.rect.height,
          }}
          animate={overlayTarget}
          transition={cardSpring}
          onAnimationComplete={() => {
            if (phase === "expanding") {
              onViewMore(overlay.index);
              setPhase("open");
            } else if (phase === "collapsing") {
              setPhase("idle");
              setOverlay(null);
            }
          }}
        >
          <div
            className="fan-card-tag"
            style={{ color: CATEGORIES[overlay.project.categoryKey].color }}
          >
            {CATEGORIES[overlay.project.categoryKey].label}
          </div>
          <img
            src={overlay.project.image}
            alt={overlay.project.name}
            className="fan-card-img"
          />
          <div className="fan-card-title">{overlay.project.name}</div>
          <div className="fan-card-description">{overlay.project.description}</div>
        </motion.div>
      )}
    </div>
  );
};

export default FannedProjectCards;
