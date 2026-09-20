import { useEffect, useMemo, useRef, useState } from "react";
import { MdArrowOutward } from "react-icons/md";
import { ProjectData } from "../data/projects";
import { CATEGORIES } from "../data/categories";
import "./styles/FannedProjectCards.css";

interface FannedProjectCardsProps {
  items: { project: ProjectData; index: number }[];
  modalOpen: boolean;
  onViewMore: (index: number) => void;
  fullBleed?: boolean;
}

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

type Phase = "idle" | "open" | "collapsing";

/**
 * Two endlessly auto-scrolling, fanned project rows moving in opposite
 * directions (card visual language adapted from aceternity's
 * interface-crafts-cards demo, ported off Tailwind; the movement
 * mechanism reuses this project's own Work.tsx auto-scroll technique -
 * a doubled item list with its scrollLeft nudged forward/back every
 * frame so each row can wrap seamlessly). Scrolling never pauses on
 * hover - only while the modal is open or the cards are returning.
 *
 * Clicking a card freezes both rows, pushes every other card down/away,
 * and opens the site's existing ProjectModal immediately so the modal
 * fade and card movement run at the same time. When that modal is closed
 * (`modalOpen` flips back to false), the card rows return at the same
 * time as the modal fades out.
 */
const FannedProjectCards = ({
  items,
  modalOpen,
  onViewMore,
  fullBleed = false,
}: FannedProjectCardsProps) => {
  const trackRefs = useRef<(HTMLDivElement | null)[]>([null, null]);
  const pausedRef = useRef(false);
  const hoveredRowRef = useRef<number | null>(null);
  // The authoritative scroll position per row, tracked ourselves rather
  // than read back from `scrollLeft` each frame - reading it back hit a
  // browser rounding trap (an exact `x.5px` step consistently rounds back
  // up to the same integer), which froze the reverse-direction row dead
  // in place instead of ever decrementing.
  const positionsRef = useRef<number[]>([0, 0]);
  const [phase, setPhase] = useState<Phase>("idle");
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const prevModalOpenRef = useRef(modalOpen);

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

  const syncTrackPosition = (track: HTMLDivElement, rowIndex: number) => {
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth <= 0) return;
    let next = track.scrollLeft;
    if (next >= halfWidth) {
      next -= halfWidth;
      track.scrollLeft = next;
    }
    positionsRef.current[rowIndex] = next;
  };

  const handleTrackScroll = (track: HTMLDivElement, rowIndex: number) => {
    syncTrackPosition(track, rowIndex);
  };

  const handleTrackWheel = (e: React.WheelEvent<HTMLDivElement>, rowIndex: number) => {
    const track = trackRefs.current[rowIndex];
    if (!track || phase !== "idle") return;
    const intendedHorizontal = Math.abs(e.deltaX) > Math.abs(e.deltaY) || e.shiftKey;
    if (!intendedHorizontal) return;

    e.preventDefault();
    track.scrollLeft += e.deltaX || e.deltaY;
    syncTrackPosition(track, rowIndex);
  };

  // The modal closing (parent hands us `modalOpen: false`) starts the card
  // rows returning immediately, in parallel with ProjectModal's fade-out.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    if (prevModalOpenRef.current && !modalOpen) {
      setPhase((p) => {
        if (p !== "open") return p;
        timeoutId = setTimeout(() => setPhase("idle"), 400);
        return "collapsing";
      });
    }
    prevModalOpenRef.current = modalOpen;
    return () => clearTimeout(timeoutId);
  }, [modalOpen]);

  const handleCardClick = (
    e: React.MouseEvent<HTMLElement>,
    index: number
  ) => {
    if (phase !== "idle") return;
    e.stopPropagation();
    setPhase("open");
    onViewMore(index);
  };

  return (
    <div className={`fanned-projects ${fullBleed ? "fanned-projects-full-bleed" : ""}`}>
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
          onScroll={(e) => handleTrackScroll(e.currentTarget, rowIndex)}
          onWheel={(e) => handleTrackWheel(e, rowIndex)}
        >
          {row.map((item, i) => {
            const key = `${item.project.name}-${rowIndex}-${i}`;
            const theme = CATEGORIES[item.project.categoryKey];
            const pattern = IDLE_PATTERN[i % IDLE_PATTERN.length];
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
                    phase === "open"
                      ? "translateY(300px) scale(0.72)"
                      : isStraightened
                        ? "translateY(0) rotate(0deg)"
                        : `translateY(${pattern.y}px) rotate(${pattern.rotate}deg)`,
                  opacity: phase === "open" ? 0.35 : 1,
                }}
                onClick={(e) => handleCardClick(e, item.index)}
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
                    onClick={(e) => handleCardClick(e, item.index)}
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
    </div>
  );
};

export default FannedProjectCards;
