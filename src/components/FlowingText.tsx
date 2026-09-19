import "./styles/FlowingText.css";

const WORDS = [
  "BUILD",
  "DESIGN",
  "SHIP",
  "LEARN",
  "CODE",
  "CREATE",
  "EXPLORE",
  "ITERATE",
];

/**
 * Large, faint, endlessly scrolling word ribbon kept in the page
 * background (ported off aceternity's wispr-flow-text-animation demo,
 * onto plain CSS since this project has no Tailwind/framer-motion-demo
 * dependency for it). Fixed + pointer-events:none, same layer as
 * StarBackground, so it never takes layout space or interferes with the
 * GSAP-driven scroll/pin sections.
 */
const FlowingText = () => {
  const line = WORDS.join("  •  ");
  return (
    <div className="flowing-text" aria-hidden="true">
      <div className="flowing-text-track">
        <span>{line}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
        <span>{line}&nbsp;&nbsp;•&nbsp;&nbsp;</span>
      </div>
    </div>
  );
};

export default FlowingText;
