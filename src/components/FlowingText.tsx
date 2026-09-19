import { useMemo } from "react";
import "./styles/FlowingText.css";

const MESSAGE =
  "If you are trying to read this, thank you! I am still figuring out what should i add here, but thanks for reading. If you have any suggestions or improvements for this component or website, please reach me out! Thanks for viewing.  •  ";

const VIEW_W = 1048;
const VIEW_H = 594;

type Point = { x: number; y: number };
type Cubic = { p0: Point; p1: Point; p2: Point; p3: Point };
type Segment = { c1: Point; c2: Point; end: Point };

const round = (n: number) => Math.round(n * 1000) / 1000;
const lerp = (a: Point, b: Point, t: number): Point => ({
  x: a.x + (b.x - a.x) * t,
  y: a.y + (b.y - a.y) * t,
});

// Same hand-drawn curve as aceternity's wispr-flow-text-animation demo -
// four cubic bezier segments sweeping across the viewBox.
const ORIGINAL_SEGMENTS: Cubic[] = [
  {
    p0: { x: 0.597656, y: 50.924805 },
    p1: { x: 17.4612, y: 143.2965 },
    p2: { x: 97.8522, y: 293.141 },
    p3: { x: 284.508, y: 353.548 },
  },
  {
    p0: { x: 284.508, y: 353.548 },
    p1: { x: 440.828, y: 399.056 },
    p2: { x: 583.839, y: 294.067 },
    p3: { x: 500.618, y: 184.7492 },
  },
  {
    p0: { x: 500.618, y: 184.7492 },
    p1: { x: 417.397, y: 75.4309 },
    p2: { x: 238.217, y: 282.098 },
    p3: { x: 499.258, y: 441.668 },
  },
  {
    p0: { x: 499.258, y: 441.668 },
    p1: { x: 551.913, y: 477.802 },
    p2: { x: 817.468, y: 561.26 },
    p3: { x: 1046.43, y: 565.235 },
  },
];

function splitCubic(b: Cubic, t: number): { left: Cubic; right: Cubic } {
  const a1 = lerp(b.p0, b.p1, t);
  const a2 = lerp(b.p1, b.p2, t);
  const a3 = lerp(b.p2, b.p3, t);
  const b1 = lerp(a1, a2, t);
  const b2 = lerp(a2, a3, t);
  const mid = lerp(b1, b2, t);
  return {
    left: { p0: b.p0, p1: a1, p2: b1, p3: mid },
    right: { p0: mid, p1: b2, p2: a3, p3: b.p3 },
  };
}

function toPathD(segments: Cubic[]): string {
  let d = `M${round(segments[0].p0.x)} ${round(segments[0].p0.y)}`;
  for (const s of segments) {
    d += `C${round(s.p1.x)} ${round(s.p1.y)} ${round(s.p2.x)} ${round(s.p2.y)} ${round(s.p3.x)} ${round(s.p3.y)}`;
  }
  return d;
}

/**
 * Decorative text-along-a-curve animation (ported off aceternity's
 * wispr-flow-text-animation demo, dropped down to plain SVG/CSS since
 * this project has no Tailwind - the demo's drag-to-edit tooling for
 * authoring the curve was stripped, keeping just the resulting path and
 * the looping <textPath> animation).
 *
 * Deliberately NOT fixed/sticky like StarBackground: it's laid out as an
 * ordinary absolutely-positioned background layer inside one section
 * (About), so it scrolls away with that section instead of hanging
 * around on screen for the rest of the page.
 */
const FlowingText = () => {
  const d = useMemo(() => toPathD(ORIGINAL_SEGMENTS), []);

  return (
    <div className="flowing-text" aria-hidden="true">
      <svg
        className="flowing-text-svg"
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path id="flowing-text-curve" fill="transparent" stroke="none" d={d} />
        <text x="0" className="flowing-text-text">
          <textPath className="flowing-text-path" href="#flowing-text-curve">
            {MESSAGE.repeat(3)}
          </textPath>
          <animate
            attributeName="x"
            dur="40s"
            values="-2000;0"
            repeatCount="indefinite"
          />
        </text>
      </svg>
    </div>
  );
};

export default FlowingText;
