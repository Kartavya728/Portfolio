import { useMemo, useState } from "react";
import { MdArrowBack } from "react-icons/md";
import { projects } from "../data/projects";
import { CATEGORIES, CATEGORY_KEYS, CategoryKey } from "../data/categories";
import ProjectModal from "./ProjectModal";
import FannedProjectCards from "./FannedProjectCards";
import "./styles/Work.css";
import "./styles/AllProjects.css";

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
          All <span>Projects</span>
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

        <FannedProjectCards items={visible} onViewMore={(index) => setActiveIndex(index)} />
      </div>

      <ProjectModal
        project={activeIndex !== null ? projects[activeIndex] : null}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
};

export default AllProjects;
