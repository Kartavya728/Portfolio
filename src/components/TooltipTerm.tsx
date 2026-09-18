import { ReactNode } from "react";

/**
 * Plain highlighted span - intentionally has no hover logic of its own.
 * GSAP's SplitText (see utils/splitText.ts) rebuilds the DOM inside any
 * `.para` element it animates, which silently detaches React's own
 * event listeners from nodes rendered inside it. TooltipManager instead
 * listens on a stable ancestor outside SplitText's reach and finds these
 * spans by `data-tooltip-id`, which survives that DOM rebuild.
 */
const TooltipTerm = ({ id, children }: { id: string; children: ReactNode }) => (
  <span className="info-tooltip-trigger" data-tooltip-id={id}>
    {children}
  </span>
);

export default TooltipTerm;
