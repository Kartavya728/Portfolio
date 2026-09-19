import { useEffect, useRef, useState } from "react";
import "./styles/EncryptedText.css";

/* Text-scramble / "encrypted text" reveal: while the real text is still
   hidden, each not-yet-revealed character cycles through random glyphs
   (colored white/purple) and characters lock in left-to-right until the
   whole string reads correctly. Kicked off by IntersectionObserver (same
   pattern TechStack.tsx uses via document.getElementById + new
   IntersectionObserver) rather than anything scroll-linked, so it's fully
   isolated from GSAP ScrollTrigger/ScrollSmoother. */

const SCRAMBLE_CHARS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*<>/\\[]{}=+-_";

const randomChar = () =>
  SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];

// Alternates between white and the site's purple accent for the transient
// scrambled glyphs - settled characters intentionally get no inline color
// so they fall back to whatever color the surrounding markup already
// applies (e.g. a parent <span> accent wrapper).
const randomScrambleColor = () =>
  Math.random() > 0.5 ? "#ffffff" : "var(--accentColor)";

interface EncryptedTextProps {
  text: string;
  className?: string;
  /** Total scramble duration in ms before the text is fully settled. */
  duration?: number;
}

const SCRAMBLE_INTERVAL = 80; // ms between glyph re-rolls - slower flicker reads as calmer, less "busy"

const EncryptedText = ({ text, className, duration = 420 }: EncryptedTextProps) => {
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const startedRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const lastScrambleRef = useRef(0);
  const [chars, setChars] = useState<{ char: string; color?: string }[]>(() =>
    text.split("").map((c) => ({ char: c }))
  );
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !startedRef.current) {
          startedRef.current = true;
          runScramble();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  const runScramble = () => {
    const length = text.length;
    const startTime = performance.now();
    let current: { char: string; color?: string }[] = text.split("").map((c) => ({ char: c }));

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const revealCount = Math.floor(progress * length);
      const reroll = now - lastScrambleRef.current >= SCRAMBLE_INTERVAL;
      if (reroll) lastScrambleRef.current = now;

      current = text.split("").map((char, i) => {
        if (char === " " || i < revealCount) return { char };
        if (reroll) return { char: randomChar(), color: randomScrambleColor() };
        return current[i]?.color ? current[i] : { char: randomChar(), color: randomScrambleColor() };
      });
      setChars(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        setChars(text.split("").map((char) => ({ char })));
        setSettled(true);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
  };

  return (
    <span ref={spanRef} className={className ? `encrypted-text ${className}` : "encrypted-text"}>
      {settled
        ? text
        : chars.map((c, i) => (
            <span
              key={i}
              className="encrypted-text-char"
              style={c.color ? { color: c.color } : undefined}
            >
              {c.char}
            </span>
          ))}
    </span>
  );
};

export default EncryptedText;
