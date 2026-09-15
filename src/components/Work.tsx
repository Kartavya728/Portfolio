import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import { MdArrowOutward } from "react-icons/md";
import "./styles/Work.css";
import ProjectModal from "./ProjectModal";
import { projects, ProjectData } from "../data/projects";
import { CATEGORIES, CATEGORY_KEYS, CategoryKey } from "../data/categories";

export function ProjectCard({
  project,
  index,
  onViewMore,
}: {
  project: ProjectData;
  index: number;
  onViewMore: () => void;
}) {
  const theme = CATEGORIES[project.categoryKey];
  return (
    <div className="work-box">
      <div className="work-info">
        <div className="work-title">
          <h3>0{index + 1}</h3>
          <div>
            <h4>{project.name}</h4>
            <p>{project.category}</p>
          </div>
        </div>
        <span
          className="work-tag"
          style={{
            color: theme.color,
            background: theme.soft,
            borderColor: theme.color,
          }}
        >
          {theme.label}
        </span>
        <h4>Description</h4>
        <p>{project.description}</p>
        <div className="work-actions">
          <button type="button" className="work-view-more" onClick={onViewMore}>
            View More
          </button>
          <a
            href={project.link}
            target="_blank"
            rel="noreferrer"
            className="work-github-link"
            data-cursor="disable"
          >
            <MdArrowOutward />
          </a>
        </div>
      </div>
      <motion.div className="work-image" layoutId={`project-image-${index}`}>
        <img src={project.image} alt={project.name} className="work-image-zoom" />
      </motion.div>
    </div>
  );
}

const AUTO_SCROLL_SPEED = 0.6; // px per frame

function ProjectGallery({
  items,
  onViewMore,
}: {
  items: { project: ProjectData; index: number }[];
  onViewMore: (index: number) => void;
}) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const thumbRef = useRef<HTMLDivElement | null>(null);
  const pausedRef = useRef(false);
  const drag = useRef({ active: false, startX: 0, startScroll: 0, moved: false });
  const scrollbarDrag = useRef({ active: false, startX: 0, startScroll: 0 });
  const [thumb, setThumb] = useState({ width: 20, left: 0 });

  // Rendering the list twice lets the auto-scroll wrap back to the start
  // without a visible jump once the first copy has scrolled past.
  const loopItems = useMemo(() => [...items, ...items], [items]);

  const syncThumb = () => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2 || 1;
    const ratio = Math.min(1, track.clientWidth / halfWidth);
    const progress = Math.min(1, (track.scrollLeft % halfWidth) / halfWidth);
    setThumb({ width: Math.max(8, ratio * 100), left: progress * 100 });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    let rafId: number;

    const tick = () => {
      if (!pausedRef.current && !drag.current.active && !scrollbarDrag.current.active) {
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

  // --- card drag-to-scroll (plain window listeners so clicks still land) ---
  const onMouseDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    if (!track) return;
    drag.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
      moved: false,
    };

    const onMove = (ev: MouseEvent) => {
      if (!drag.current.active) return;
      const dx = ev.clientX - drag.current.startX;
      if (Math.abs(dx) > 4) drag.current.moved = true;
      track.scrollLeft = drag.current.startScroll - dx;
    };
    const onUp = () => {
      drag.current.active = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // --- custom scrollbar ---
  const onScrollbarDown = (e: React.MouseEvent) => {
    const track = trackRef.current;
    const bar = e.currentTarget as HTMLElement;
    if (!track) return;
    const barRect = bar.getBoundingClientRect();
    const halfWidth = track.scrollWidth / 2;

    const jumpTo = (clientX: number) => {
      const pct = Math.min(1, Math.max(0, (clientX - barRect.left) / barRect.width));
      track.scrollLeft = pct * halfWidth;
    };

    // Clicking anywhere on the bar jumps there, then keeps tracking.
    if (!(e.target as HTMLElement).classList.contains("work-scrollbar-thumb")) {
      jumpTo(e.clientX);
    }
    scrollbarDrag.current = {
      active: true,
      startX: e.clientX,
      startScroll: track.scrollLeft,
    };

    const onMove = (ev: MouseEvent) => {
      if (!scrollbarDrag.current.active) return;
      jumpTo(ev.clientX);
    };
    const onUp = () => {
      scrollbarDrag.current.active = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      className="project-gallery"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="work-scrollbar" onMouseDown={onScrollbarDown}>
        <div
          className="work-scrollbar-thumb"
          ref={thumbRef}
          style={{ width: `${thumb.width}%`, left: `${thumb.left}%` }}
        />
      </div>

      <div
        className="project-gallery-track"
        ref={trackRef}
        onScroll={syncThumb}
        onMouseDown={onMouseDown}
      >
        {loopItems.map((item, i) => (
          <div className="project-gallery-slide" key={`${item.project.name}-${i}`}>
            <ProjectCard
              project={item.project}
              index={item.index}
              onViewMore={() => {
                if (!drag.current.moved) onViewMore(item.index);
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const Work = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<CategoryKey | "all">("all");

  const usedCategories = useMemo(
    () => CATEGORY_KEYS.filter((key) => projects.some((p) => p.categoryKey === key)),
    []
  );

  const visible = useMemo(
    () =>
      projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => filter === "all" || project.categoryKey === filter),
    [filter]
  );

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          Project <span>Gallery</span>
        </h2>

        <div className="work-filters">
          <button
            type="button"
            className={`work-filter ${filter === "all" ? "work-filter-active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All
          </button>
          {usedCategories.map((key) => {
            const theme = CATEGORIES[key];
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                className={`work-filter ${isActive ? "work-filter-active" : ""}`}
                onClick={() => setFilter(key)}
                style={
                  isActive
                    ? {
                        color: theme.color,
                        borderColor: theme.color,
                        background: theme.soft,
                      }
                    : undefined
                }
              >
                {theme.label}
              </button>
            );
          })}
        </div>

        <ProjectGallery
          key={filter}
          items={visible}
          onViewMore={(index) => setActiveIndex(index)}
        />

        <a className="work-view-all" href="/projects" data-cursor="disable">
          View All Projects
        </a>
      </div>

      <ProjectModal
        project={activeIndex !== null ? projects[activeIndex] : null}
        layoutId={`project-image-${activeIndex}`}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
};

export default Work;
