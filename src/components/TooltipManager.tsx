import { ReactNode, RefObject, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import "./styles/InfoTooltip.css";

interface TooltipManagerProps {
  /** A stable ancestor to delegate mouse events from - must not be an
   *  element GSAP's SplitText rewrites the innerHTML of. */
  containerRef: RefObject<HTMLElement>;
  content: Record<string, ReactNode>;
}

/**
 * Single delegated hover-tooltip controller for a block of text. Rendered
 * once per section; individual highlighted words are plain
 * `data-tooltip-id` spans (see TooltipTerm). Delegating from a stable
 * ancestor - rather than attaching a handler straight to each span -
 * keeps this working even after GSAP's SplitText rebuilds the spans
 * inside the paragraph for its reveal animation.
 *
 * The card itself is portaled to `document.body` and positioned with
 * `position: fixed` from the trigger's live `getBoundingClientRect()`,
 * the same approach used for the project modal, since this site scrolls
 * via a transformed GSAP ScrollSmoother wrapper that traps ordinary
 * `position: fixed` descendants otherwise.
 */
const TooltipManager = ({ containerRef, content }: TooltipManagerProps) => {
  const [active, setActive] = useState<{ id: string; rect: DOMRect } | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-tooltip-id]");
      if (!target) return;
      const id = target.dataset.tooltipId;
      if (!id || !content[id]) return;
      setActive({ id, rect: target.getBoundingClientRect() });
    };

    const handleOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-tooltip-id]");
      if (!target) return;
      const related = e.relatedTarget as HTMLElement | null;
      if (related && target.contains(related)) return;
      setActive(null);
    };

    container.addEventListener("mouseover", handleOver);
    container.addEventListener("mouseout", handleOut);
    return () => {
      container.removeEventListener("mouseover", handleOver);
      container.removeEventListener("mouseout", handleOut);
    };
  }, [containerRef, content]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {active && (
        // Positioning lives on this plain wrapper (via a CSS transform)
        // so it doesn't fight with Framer Motion, which drives the inner
        // element's own `transform` directly for its enter/exit animation.
        <div
          className="info-tooltip-anchor"
          style={{ top: active.rect.top, left: active.rect.left + active.rect.width / 2 }}
          onMouseEnter={() => setActive(active)}
          onMouseLeave={() => setActive(null)}
        >
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 10, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="info-tooltip-card"
          >
            {content[active.id]}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default TooltipManager;
