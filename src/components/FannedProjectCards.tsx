import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { MdArrowOutward } from "react-icons/md";
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
const ROW_DIRECTIONS = [1, -1] as const; // second row scrolls the opposite way

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
 * Two endlessly auto-scrolling, fanned project rows moving in opposite
 * directions (card visual language adapted from aceternity's
 * interface-crafts-cards demo, ported off Tailwind; the movement
 * mechanism reuses this project's own Work.tsx auto-scroll technique -
 * a doubled item list with its scrollLeft nudged forward/back every
 * frame so each row can wrap seamlessly). Scrolling never pauses on
 * hover - only while a card is expanding/open/collapsing.
 *
 * Clicking a card freezes both rows, pushes every other card down/away,
 * and grows a FLIP-style overlay clone from the clicked card's exact
 * screen rect up to a large centred size; once that settles it hands
 * off to the site's existing ProjectModal via `onViewMore`. When that
 * modal is closed (`modalOpen` flips back to false), the overlay
 * reverses the same animation back down into the row before scrolling
 * resumes.
 */
const FannedProjectCards = ({ items, modalOpen, onViewMore }: FannedProjectCardsProps) => {
  const trackRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const pausedRef = useRef(false);
  const hoveredRowRef = useRef<number | null>(null);
  // The authoritative scroll position per row, tracked ourselves rather
  // than read back from `scrollLeft` each frame - reading it back hit a
  // browser rounding trap (an exact `x.5px` step consistently rounds back
  // up to the same integer), which froze the reverse-direction row dead
  // in place instead of ever decrementing.
  const positionsRef = useRef<number[]>([0, 0]);
  const [isDesktop, setIsDesktop] = useState(true);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [overlay, setOverlay] = useState<OverlayState | null>(null);
  const prevModalOpenRef = useRef(modalOpen);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Interleaved rather than split into contiguous halves, so a filtered
  // view with only a few projects still fills both rows.
  const rows = useMemo(() => {
    const split: { project: ProjectData; index: number }[][] = [[], []];
    items.forEach((item, i) => split[i % 2].push(item));
    return split.map((row) => [...row, ...row]);
  }, [items]);

  useEffect(() => {
    pausedRef.current = phase !== "idle";
  }, [phase]);

  useEffect(() => {
    let rafId: number;
    const tick = () => {
      if (!pausedRef.current) {
        trackRefs.current.forEach((track, rowIndex) => {
          if (!track) return;
          const halfWidth = track.scrollWidth / 2;
          if (halfWidth <= 0) return;
          const dir = ROW_DIRECTIONS[rowIndex];
          // Slow down (not stop) the row currently under the cursor.
          const speed =
            hoveredRowRef.current === rowIndex ? AUTO_SCROLL_SPEED * 0.4 : AUTO_SCROLL_SPEED;
          let next = positionsRef.current[rowIndex] + dir * speed;
          next = ((next % halfWidth) + halfWidth) % halfWidth;
          positionsRef.current[rowIndex] = next;
          track.scrollLeft = next;
        });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [rows]);

  // The modal closing (parent hands us `modalOpen: false`) is the signal
  // to reverse the expand animation back into the row.
  useEffect(() => {
    if (prevModalOpenRef.current && !modalOpen) {
      setPhase((p) => (p === "open" ? "collapsing" : p));
    }
    prevModalOpenRef.current = modalOpen;
  }, [modalOpen]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLElement>,
    project: ProjectData,
    index: number,
    key: string
  ) => {
    if (phase !== "idle") return;
    const card = (e.currentTarget.closest(".fan-card") as HTMLElement) ?? e.currentTarget;
    const r = card.getBoundingClientRect();
    setOverlay({
      key,
      index,
      project,
      rect: { left: r.left, top: r.top, width: r.width, height: r.height },
    });
    setPhase("expanding");
  };

  // Matches ProjectModal's own sizing (68vw, capped 1100px, max 88vh /
  // 94vw under 1100px) as closely as possible, so the blank box this
  // grows into lands almost exactly where the real modal will render -
  // the handoff reads as one continuous zoom rather than a jump.
  const enlargedW = isDesktop
    ? Math.min(window.innerWidth * 0.68, 1100)
    : window.innerWidth * 0.94;
  const enlargedH = window.innerHeight * 0.88;
  const targetY = (window.innerHeight - enlargedH) / 2;

  const enlargedRect = {
    x: (window.innerWidth - enlargedW) / 2,
    y: targetY,
    width: enlargedW,
    height: enlargedH,
  };
  const originalRect = overlay
    ? { x: overlay.rect.left, y: overlay.rect.top, width: overlay.rect.width, height: overlay.rect.height }
    : undefined;

  // The overlay unmounts entirely while the real modal is open (see
  // below), so on remounting for the collapse it needs to START from the
  // enlarged position rather than replaying the expand from scratch.
  const overlayInitial = phase === "collapsing" ? enlargedRect : originalRect;
  const overlayTarget = phase === "collapsing" ? originalRect : enlargedRect;

  return (
    <div className="fanned-projects">
      {rows.map((row, rowIndex) => (
        <div
          key={rowIndex}
          ref={(el) => {
            trackRefs.current[rowIndex] = el;
          }}
          className={`fan-track ${phase !== "idle" ? "fan-track-active" : ""}`}
          onMouseEnter={() => {
            hoveredRowRef.current = rowIndex;
            setHoveredRow(rowIndex);
          }}
          onMouseLeave={() => {
            hoveredRowRef.current = null;
            setHoveredRow(null);
          }}
        >
          {row.map((item, i) => {
            const key = `${item.project.name}-${rowIndex}-${i}`;
            const theme = CATEGORIES[item.project.categoryKey];
            const pattern = IDLE_PATTERN[i % IDLE_PATTERN.length];
            const isSource = overlay?.key === key && phase !== "idle";
            const isStraightened = phase === "idle" && hoveredRow === rowIndex;

            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                className="fan-card"
                data-cursor="disable"
                style={{
                  background: hexToRgba(theme.color, 0.06),
                  borderColor: hexToRgba(theme.color, 0.4),
                  transform:
                    phase !== "idle"
                      ? "translateY(300px) scale(0.72)"
                      : isStraightened
                        ? "translateY(0) rotate(0deg)"
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
                <div className="fan-card-header">
                  <span className="fan-card-index">0{item.index + 1}</span>
                  <div>
                    <div className="fan-card-title">{item.project.name}</div>
                    <div className="fan-card-category">{item.project.category}</div>
                  </div>
                </div>
                <div className="fan-card-desc-label">Description</div>
                <div className="fan-card-description">{item.project.description}</div>
                <div className="fan-card-actions">
                  <button
                    type="button"
                    className="fan-card-view-more"
                    onClick={(e) => handleCardClick(e, item.project, item.index, key)}
                  >
                    View More
                  </button>
                  <a
                    href={item.project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="fan-card-link"
                    data-cursor="disable"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MdArrowOutward />
                  </a>
                </div>
                <div className="fan-card-veil">
                  <span>View More</span>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {overlay && (phase === "expanding" || phase === "collapsing") && (
        // Deliberately blank - a plain colour/blur growing or shrinking
        // box, not a preview of the card's own content. It only carries
        // the motion; ProjectModal (opened once this finishes expanding)
        // supplies all the actual detail, so nothing here has to be kept
        // visually in sync with the modal's real layout.
        <motion.div
          className="fan-card-overlay"
          style={{
            background: hexToRgba(CATEGORIES[overlay.project.categoryKey].color, 0.1),
            borderColor: hexToRgba(CATEGORIES[overlay.project.categoryKey].color, 0.4),
          }}
          initial={overlayInitial}
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
        />
      )}
    </div>
  );
};

export default FannedProjectCards;
