import { ReactNode, useRef } from "react";
import TooltipTerm from "./TooltipTerm";
import TooltipManager from "./TooltipManager";

/**
 * Small reusable "info badge" for section headings - reuses the same
 * TooltipTerm/TooltipManager pair About.tsx uses for its inline
 * highlighted terms, just anchored to a single self-contained trigger
 * instead of several terms spread through a paragraph. Keeps every
 * tooltip on the site running through one hover/positioning system
 * rather than introducing a second one.
 */
const SectionInfoTooltip = ({ children }: { children: ReactNode }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  return (
    <span className="section-info-badge" ref={containerRef}>
      <TooltipTerm id="info">ⓘ</TooltipTerm>
      <TooltipManager containerRef={containerRef} content={{ info: children }} />
    </span>
  );
};

export default SectionInfoTooltip;
