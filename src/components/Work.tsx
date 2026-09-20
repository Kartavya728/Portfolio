import { useMemo, useState } from "react";
import "./styles/Work.css";
import ProjectModal from "./ProjectModal";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { WorkTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import FannedProjectCards from "./FannedProjectCards";
import { projects } from "../data/projects";
import { CATEGORIES, CATEGORY_KEYS, CategoryKey } from "../data/categories";

const hiddenContributionNames = new Set([
  "SIH-180",
  "SIH165 — Chat Interface Website",
  "RoboCar Control Website",
]);

const Work = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState<CategoryKey | "all">("all");

  const contributionItems = useMemo(
    () =>
      projects
        .map((project, index) => ({ project, index }))
        .filter(({ project }) => !hiddenContributionNames.has(project.name)),
    []
  );

  const usedCategories = useMemo(
    () => CATEGORY_KEYS.filter((key) => contributionItems.some(({ project }) => project.categoryKey === key)),
    [contributionItems]
  );

  const visible = useMemo(
    () =>
      contributionItems.filter(({ project }) => filter === "all" || project.categoryKey === filter),
    [contributionItems, filter]
  );

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          <EncryptedText text="My" /> <span><EncryptedText text="Contributions" /></span>
          <SectionInfoTooltip>
            <WorkTooltip />
          </SectionInfoTooltip>
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

        <FannedProjectCards
          key={filter}
          items={visible}
          modalOpen={activeIndex !== null}
          onViewMore={(index) => setActiveIndex(index)}
          fullBleed
        />

        <a className="work-view-all" href="/projects" data-cursor="disable">
          View All Projects
        </a>
      </div>

      <ProjectModal
        project={activeIndex !== null ? projects[activeIndex] : null}
        onClose={() => setActiveIndex(null)}
      />
    </div>
  );
};

export default Work;
