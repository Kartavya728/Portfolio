import { useMemo, useState } from "react";
import { MdArrowBack, MdArrowOutward } from "react-icons/md";
import { projects } from "../data/projects";
import { CATEGORIES, CATEGORY_KEYS, CategoryKey } from "../data/categories";
import ProjectModal from "./ProjectModal";
import "./styles/Work.css";
import "./styles/FannedProjectCards.css";
import "./styles/AllProjects.css";
import EncryptedText from "./EncryptedText";

function hexToRgba(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

const SCATTER_SHAPES = [
  "18px 34px 20px 42px",
  "34px 18px 38px 22px",
  "26px 46px 24px 18px",
  "42px 22px 30px 18px",
  "18px 22px 44px 30px",
];

const getScatterStyle = (position: number, count: number, color: string) => {
  const x = (position * 37 + 9) % 100;
  const y = (position * 53 + 13) % 100;
  const width = 205 + ((position * 29) % 54);
  const height = 242 + ((position * 17) % 42);
  const rotate = ((position * 19) % 31) - 15;
  const topLimit = count > 18 ? 92 : 88;
  const leftLimit = count > 18 ? 88 : 84;

  return {
    "--scatter-x": `${Math.min(leftLimit, Math.max(12, x))}%`,
    "--scatter-y": `${Math.min(topLimit, Math.max(6, y))}%`,
    "--scatter-rotate": `${rotate}deg`,
    "--scatter-width": `${width}px`,
    "--scatter-height": `${height}px`,
    "--scatter-radius": SCATTER_SHAPES[position % SCATTER_SHAPES.length],
    background: hexToRgba(color, 0.06),
    borderColor: hexToRgba(color, 0.42),
  } as React.CSSProperties;
};

const AllProjects = () => {
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
    <div className="all-projects-page">
      <div className="all-projects-inner">
        <a href="/" className="all-projects-back" data-cursor="disable">
          <MdArrowBack /> Back to portfolio
        </a>

        <h1>
          <EncryptedText text="All" /> <span><EncryptedText text="Projects" /></span>
        </h1>
        <p className="all-projects-sub">
          Every project in one place — filter by the area you care about.
        </p>

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

        <div
          className="all-projects-scatter"
          style={{ "--project-count": visible.length } as React.CSSProperties}
        >
          {visible.map(({ project, index }, position) => {
            const theme = CATEGORIES[project.categoryKey];
            return (
              <article
                key={project.name}
                className="all-projects-card fan-card"
                data-cursor="disable"
                style={getScatterStyle(position, visible.length, theme.color)}
                onClick={() => setActiveIndex(index)}
              >
                <div className="fan-card-tag" style={{ color: theme.color }}>
                  {theme.label}
                </div>
                <img src={project.image} alt={project.name} className="fan-card-img" />
                <div className="fan-card-header">
                  <span className="fan-card-index">0{index + 1}</span>
                  <div>
                    <div className="fan-card-title">{project.name}</div>
                    <div className="fan-card-category">{project.category}</div>
                  </div>
                </div>
                <div className="fan-card-desc-label">Description</div>
                <div className="fan-card-description">{project.description}</div>
                <div className="fan-card-actions">
                  <button
                    type="button"
                    className="fan-card-view-more"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(index);
                    }}
                  >
                    View More
                  </button>
                  <a
                    href={project.link}
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
              </article>
            );
          })}
        </div>
      </div>

      <ProjectModal
        project={activeIndex !== null ? projects[activeIndex] : null}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
};

export default AllProjects;
