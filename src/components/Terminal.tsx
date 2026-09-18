import { useEffect, useMemo, useRef, useState } from "react";
import "./styles/Terminal.css";

/**
 * A typewriter-driven fake terminal, adapted from aceternity's terminal
 * demo but rebuilt on plain CSS (this project has no Tailwind) and with
 * the keystroke-sound layer dropped entirely - there's no audio asset in
 * this project and it wasn't worth adding one just for this.
 */
type TokenType = "command" | "flag" | "string" | "path" | "default";

function tokenizeLine(text: string): { type: TokenType; value: string }[] {
  const words = text.split(/(\s+)/);
  const tokens: { type: TokenType; value: string }[] = [];
  let isFirstWord = true;
  for (const word of words) {
    if (/^\s+$/.test(word)) {
      tokens.push({ type: "default", value: word });
      continue;
    }
    if (word.startsWith("-")) {
      tokens.push({ type: "flag", value: word });
      isFirstWord = false;
    } else if (/^["'].*["']$/.test(word)) {
      tokens.push({ type: "string", value: word });
      isFirstWord = false;
    } else if (word.includes("/") || word.startsWith(".")) {
      tokens.push({ type: "path", value: word });
      isFirstWord = false;
    } else if (isFirstWord) {
      tokens.push({ type: "command", value: word });
      isFirstWord = false;
    } else {
      tokens.push({ type: "default", value: word });
    }
  }
  return tokens;
}

const SyntaxLine = ({ text }: { text: string }) => (
  <>
    {tokenizeLine(text).map((t, i) => (
      <span key={i} className={`term-tok-${t.type}`}>
        {t.value}
      </span>
    ))}
  </>
);

function useInView(ref: React.RefObject<HTMLElement | null>) {
  const [inView, setInView] = useState(false);
  const triggered = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || triggered.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !triggered.current) {
          triggered.current = true;
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

interface TerminalLine {
  type: "command" | "output";
  content: string;
}

export interface TerminalProps {
  commands: string[];
  outputs?: Record<number, string[]>;
  username?: string;
  className?: string;
  typingSpeed?: number;
  delayBetweenCommands?: number;
  /** Pause after scrolling into view before the first keystroke - lets a
   *  desktop/window-open reveal play first so the terminal doesn't start
   *  typing before its own window has finished appearing. */
  startDelay?: number;
}

const Terminal = ({
  commands,
  outputs = {},
  username = "kartavya",
  className,
  typingSpeed = 35,
  delayBetweenCommands = 500,
  startDelay = 400,
}: TerminalProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef);

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [currentText, setCurrentText] = useState("");
  const [commandIdx, setCommandIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [outputIdx, setOutputIdx] = useState(-1);
  const [phase, setPhase] = useState<
    "idle" | "typing" | "executing" | "outputting" | "pausing" | "done"
  >("idle");
  const [cursorVisible, setCursorVisible] = useState(true);

  const currentCommand = commands[commandIdx] || "";
  const currentOutputs = useMemo(() => outputs[commandIdx] || [], [outputs, commandIdx]);
  const isLastCommand = commandIdx === commands.length - 1;

  useEffect(() => {
    if (!inView || phase !== "idle") return;
    const t = setTimeout(() => setPhase("typing"), startDelay);
    return () => clearTimeout(t);
  }, [inView, phase, startDelay]);

  useEffect(() => {
    if (phase !== "typing") return;
    if (charIdx < currentCommand.length) {
      const t = setTimeout(() => {
        setCurrentText(currentCommand.slice(0, charIdx + 1));
        setCharIdx((c) => c + 1);
      }, typingSpeed + Math.random() * 30);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase("executing"), 120);
    return () => clearTimeout(t);
  }, [phase, charIdx, currentCommand, typingSpeed]);

  useEffect(() => {
    if (phase !== "executing") return;
    setLines((prev) => [...prev, { type: "command", content: currentCommand }]);
    setCurrentText("");
    if (currentOutputs.length > 0) {
      setOutputIdx(0);
      setPhase("outputting");
    } else if (isLastCommand) {
      setPhase("done");
    } else {
      setPhase("pausing");
    }
  }, [phase, currentCommand, currentOutputs.length, isLastCommand]);

  useEffect(() => {
    if (phase !== "outputting") return;
    if (outputIdx >= 0 && outputIdx < currentOutputs.length) {
      const t = setTimeout(() => {
        setLines((prev) => [...prev, { type: "output", content: currentOutputs[outputIdx] }]);
        setOutputIdx((i) => i + 1);
      }, 110);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setPhase(isLastCommand ? "done" : "pausing"), 250);
    return () => clearTimeout(t);
  }, [phase, outputIdx, currentOutputs, isLastCommand]);

  useEffect(() => {
    if (phase !== "pausing") return;
    const t = setTimeout(() => {
      setCharIdx(0);
      setOutputIdx(-1);
      setCommandIdx((c) => c + 1);
      setPhase("typing");
    }, delayBetweenCommands);
    return () => clearTimeout(t);
  }, [phase, delayBetweenCommands]);

  useEffect(() => {
    const interval = setInterval(() => setCursorVisible((v) => !v), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (contentRef.current) contentRef.current.scrollTop = contentRef.current.scrollHeight;
  }, [lines, phase]);

  const prompt = (
    <span className="term-prompt">
      <span className="term-user">{username}</span>
      <span className="term-sep">:</span>
      <span className="term-path">~</span>
      <span className="term-dollar">$</span>{" "}
    </span>
  );

  return (
    <div ref={containerRef} className={`terminal-shell ${className || ""}`}>
      <div className="terminal-titlebar">
        <div className="terminal-dots">
          <span className="term-dot term-dot-red" />
          <span className="term-dot term-dot-yellow" />
          <span className="term-dot term-dot-green" />
        </div>
        <span className="terminal-titlebar-label">{username} — bash</span>
      </div>
      <div ref={contentRef} className="terminal-body">
        {lines.map((line, i) => (
          <div key={i} className="terminal-line">
            {line.type === "command" ? (
              <span>
                {prompt}
                <SyntaxLine text={line.content} />
              </span>
            ) : (
              <span className="terminal-output">{line.content}</span>
            )}
          </div>
        ))}
        {phase === "typing" && (
          <div className="terminal-line">
            {prompt}
            <SyntaxLine text={currentText} />
            <span className={`terminal-cursor ${cursorVisible ? "" : "terminal-cursor-hidden"}`} />
          </div>
        )}
        {(phase === "done" || phase === "pausing" || phase === "outputting") && (
          <div className="terminal-line">
            {prompt}
            <span className={`terminal-cursor ${cursorVisible ? "" : "terminal-cursor-hidden"}`} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Terminal;
