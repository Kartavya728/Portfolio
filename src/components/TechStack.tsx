import { useEffect, useRef, useState } from "react";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiMysql,
  SiTypescript,
  SiJavascript,
} from "react-icons/si";
import "./styles/TechStack.css";

const TECHS = [
  { name: "React", Icon: SiReact, color: "#61DAFB", r: 68 },
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF", r: 60 },
  { name: "Node.js", Icon: SiNodedotjs, color: "#8CC84B", r: 64 },
  { name: "Express", Icon: SiExpress, color: "#FFFFFF", r: 56 },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248", r: 62 },
  { name: "MySQL", Icon: SiMysql, color: "#4479A1", r: 58 },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", r: 66 },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", r: 60 },
];

const PADDING = 10; // minimum gap kept between ball edges, so they never touch/overlap
const CENTER_PULL = 18; // gentle pull toward the section's center, keeps balls drifting inward
const POINTER_RADIUS = 140; // how close the cursor has to be to push a ball away
const POINTER_STRENGTH = 2600;
const DAMPING = 0.9;

type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
};

const TechStack = () => {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const ballRefs = useRef<(HTMLDivElement | null)[]>([]);
  const balls = useRef<Ball[]>([]);
  const pointer = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const isActiveRef = useRef(false);

  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  // Scroll-based activation - identical gating to the previous 3D version,
  // so the balls only start moving once the tech stack section is in view.
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const workEl = document.getElementById("work");
      if (!workEl) return;
      const threshold = workEl.getBoundingClientRect().top;
      setIsActive(scrollY > threshold);
    };
    document.querySelectorAll(".header a").forEach((elem) => {
      const element = elem as HTMLAnchorElement;
      element.addEventListener("click", () => {
        const interval = setInterval(() => {
          handleScroll();
        }, 10);
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      });
    });
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Lay the balls out with no initial overlap, then run a lightweight
  // repulsion/attraction simulation each frame (position/velocity kept in
  // refs and written straight to the DOM, no React re-renders per frame).
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    function placeBalls() {
      const { width, height } = container!.getBoundingClientRect();
      const placed: Ball[] = [];
      for (const tech of TECHS) {
        let x = 0;
        let y = 0;
        let attempts = 0;
        do {
          x = tech.r + Math.random() * Math.max(1, width - tech.r * 2);
          y = tech.r + Math.random() * Math.max(1, height - tech.r * 2);
          attempts++;
        } while (
          attempts < 200 &&
          placed.some(
            (b) =>
              Math.hypot(b.x - x, b.y - y) < b.r + tech.r + PADDING
          )
        );
        placed.push({ x, y, vx: 0, vy: 0, r: tech.r });
      }
      balls.current = placed;
      writeTransforms();
    }

    function writeTransforms() {
      balls.current.forEach((b, i) => {
        const el = ballRefs.current[i];
        if (el) {
          el.style.transform = `translate(${b.x - b.r}px, ${b.y - b.r}px)`;
        }
      });
    }

    placeBalls();

    const resizeObserver = new ResizeObserver(() => {
      placeBalls();
    });
    resizeObserver.observe(container);

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container!.getBoundingClientRect();
      pointer.current.x = e.clientX - rect.left;
      pointer.current.y = e.clientY - rect.top;
      pointer.current.active = true;
    };
    const handlePointerLeave = () => {
      pointer.current.active = false;
    };
    container.addEventListener("mousemove", handlePointerMove);
    container.addEventListener("mouseleave", handlePointerLeave);

    let rafId: number;
    let lastTime = performance.now();

    function tick(now: number) {
      const dt = Math.min(0.032, (now - lastTime) / 1000);
      lastTime = now;

      if (isActiveRef.current) {
        const { width, height } = container!.getBoundingClientRect();
        const cx = width / 2;
        const cy = height / 2;
        const list = balls.current;

        for (let i = 0; i < list.length; i++) {
          const b = list[i];

          // Gentle pull toward the section center - keeps the balls
          // drifting/orbiting instead of drifting away permanently.
          b.vx += (cx - b.x) * CENTER_PULL * dt * 0.01;
          b.vy += (cy - b.y) * CENTER_PULL * dt * 0.01;

          // Pointer repulsion - balls get pushed away as the cursor nears,
          // same interaction the 3D version had with its physics pointer.
          if (pointer.current.active) {
            const dx = b.x - pointer.current.x;
            const dy = b.y - pointer.current.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            if (dist < POINTER_RADIUS) {
              const force =
                ((POINTER_RADIUS - dist) / POINTER_RADIUS) *
                POINTER_STRENGTH *
                dt;
              b.vx += (dx / dist) * force;
              b.vy += (dy / dist) * force;
            }
          }
        }

        // Pairwise repulsion so balls never overlap.
        for (let i = 0; i < list.length; i++) {
          for (let j = i + 1; j < list.length; j++) {
            const a = list[i];
            const b = list[j];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const dist = Math.hypot(dx, dy) || 0.001;
            const minDist = a.r + b.r + PADDING;
            if (dist < minDist) {
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;
              const push = overlap * 0.5;
              a.x -= nx * push;
              a.y -= ny * push;
              b.x += nx * push;
              b.y += ny * push;
              a.vx -= nx * overlap * 4;
              a.vy -= ny * overlap * 4;
              b.vx += nx * overlap * 4;
              b.vy += ny * overlap * 4;
            }
          }
        }

        for (const b of list) {
          b.vx *= DAMPING;
          b.vy *= DAMPING;
          b.x += b.vx * dt;
          b.y += b.vy * dt;

          if (b.x < b.r) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * 0.4;
          } else if (b.x > width - b.r) {
            b.x = width - b.r;
            b.vx = -Math.abs(b.vx) * 0.4;
          }
          if (b.y < b.r) {
            b.y = b.r;
            b.vy = Math.abs(b.vy) * 0.4;
          } else if (b.y > height - b.r) {
            b.y = height - b.r;
            b.vy = -Math.abs(b.vy) * 0.4;
          }
        }

        writeTransforms();
      }

      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener("mousemove", handlePointerMove);
      container.removeEventListener("mouseleave", handlePointerLeave);
    };
  }, []);

  return (
    <div className="techstack">
      <h2>My Techstack</h2>
      <div className="tech-canvas-2d" ref={containerRef}>
        {TECHS.map((tech, i) => (
          <div
            key={tech.name}
            className="tech-ball"
            style={{ width: tech.r * 2, height: tech.r * 2 }}
            ref={(el) => {
              ballRefs.current[i] = el;
            }}
          >
            <div className="tech-ball-inner">
              <tech.Icon className="tech-ball-icon" color={tech.color} />
              <span className="tech-ball-name">{tech.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TechStack;
