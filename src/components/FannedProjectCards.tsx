import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ProjectData } from "../data/projects";
import { CATEGORIES } from "../data/categories";
import "./styles/FannedProjectCards.css";

interface FannedProjectCardsProps {
  items: { project: ProjectData; index: number }[];
  onViewMore: (index: number) => void;
}

const cardSpring = { type: "spring" as const, visualDuration: 0.55, bounce: 0.22 };

/**
 * Fanned two-row project layout (adapted from aceternity's
 * interface-crafts-cards demo, ported off Tailwind onto this project's
 * plain-CSS convention): the top row's cards enter scrolling in from
 * the right, the bottom row's from the left, each fanned out with
 * alternating tilt/offset rather than sitting in a straight line.
 * Clicking a card pushes every other card down and out of the way and
 * brings the clicked one to the front-centre - once that settles, it
 * hands off to the existing ProjectModal via `onViewMore` rather than
 * expanding its own inline detail panel.
 */
const FannedProjectCards = ({ items, onViewMore }: FannedProjectCardsProps) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [spacing, setSpacing] = useState(170);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 901px)");
    const update = () => setSpacing(mq.matches ? 170 : 95);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Interleaved rather than split into contiguous halves, so a filtered
  // view with only a few projects still fills both rows instead of
  // leaving one empty.
  const rows: { project: ProjectData; index: number }[][] = [[], []];
  items.forEach((item, i) => rows[i % 2].push(item));

  const handleCardClick = (key: string, index: number) => {
    if (activeKey) return;
    setActiveKey(key);
    window.setTimeout(() => {
      onViewMore(index);
      setActiveKey(null);
    }, 480);
  };

  return (
    <div className="fanned-projects">
      {rows.map((row, rowIndex) => {
        const middle = (row.length - 1) / 2;
        const enterX = rowIndex === 0 ? 1 : -1;
        return (
          <div className="fan-row" key={rowIndex}>
            {row.map(({ project, index }, posInRow) => {
              const key = project.name;
              const theme = CATEGORIES[project.categoryKey];
              const sign = posInRow % 2 === 0 ? -1 : 1;
              const offsetX = (posInRow - middle) * spacing;
              const restY = sign * 18;
              const restRotate = sign * -9;

              const isActive = activeKey === key;
              const anyActive = activeKey !== null;

              return (
                <motion.button
                  key={key}
                  type="button"
                  className="fan-card"
                  data-cursor="disable"
                  style={{ background: theme.gradient }}
                  initial={{ x: enterX * 700, y: restY, rotate: restRotate, opacity: 0 }}
                  whileInView={{ x: offsetX, y: restY, rotate: restRotate, opacity: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  animate={
                    isActive
                      ? { x: 0, y: 0, rotate: 0, scale: 1.18, zIndex: 50 }
                      : anyActive
                        ? { x: offsetX * 0.4, y: 260, rotate: 0, scale: 0.7, zIndex: 1 }
                        : { x: offsetX, y: restY, rotate: restRotate, scale: 1, zIndex: 10 + posInRow }
                  }
                  whileHover={anyActive ? undefined : { scale: 1.06, y: restY - 6 }}
                  transition={cardSpring}
                  onClick={() => handleCardClick(key, index)}
                >
                  <div className="fan-card-tag" style={{ color: theme.color }}>
                    {theme.label}
                  </div>
                  <img src={project.image} alt={project.name} className="fan-card-img" />
                  <div className="fan-card-title">{project.name}</div>
                </motion.button>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default FannedProjectCards;
