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
  SiPython,
  SiPostgresql,
  SiRedis,
  SiDocker,
  SiAmazonwebservices,
  SiGit,
  SiPytorch,
  SiTensorflow,
} from "react-icons/si";
import "./styles/TechStack.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { TechStackTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";

const TECHS = [
  { name: "React", Icon: SiReact, color: "#61DAFB", r: 66 },
  { name: "Next.js", Icon: SiNextdotjs, color: "#FFFFFF", r: 58 },
  { name: "Node.js", Icon: SiNodedotjs, color: "#8CC84B", r: 62 },
  { name: "Express", Icon: SiExpress, color: "#FFFFFF", r: 54 },
  { name: "MongoDB", Icon: SiMongodb, color: "#47A248", r: 60 },
  { name: "MySQL", Icon: SiMysql, color: "#4479A1", r: 56 },
  { name: "TypeScript", Icon: SiTypescript, color: "#3178C6", r: 64 },
  { name: "JavaScript", Icon: SiJavascript, color: "#F7DF1E", r: 58 },
  { name: "Python", Icon: SiPython, color: "#3776AB", r: 64 },
  { name: "PostgreSQL", Icon: SiPostgresql, color: "#4169E1", r: 58 },
  { name: "Redis", Icon: SiRedis, color: "#DC382D", r: 54 },
  { name: "Docker", Icon: SiDocker, color: "#2496ED", r: 60 },
  { name: "AWS", Icon: SiAmazonwebservices, color: "#FF9900", r: 56 },
  { name: "Git", Icon: SiGit, color: "#F05032", r: 54 },
  { name: "PyTorch", Icon: SiPytorch, color: "#EE4C2C", r: 60 },
  { name: "TensorFlow", Icon: SiTensorflow, color: "#FF6F00", r: 58 },
];

const PADDING = 10; // minimum gap kept between ball edges, so they never touch/overlap
const POINTER_RADIUS = 300; // how close the cursor has to be to push a ball away
const POINTER_STRENGTH = 34000; // strong scatter - sends balls flying clear of the cursor
const TOP_MARGIN = 200; // keeps balls from ever sitting above/on the "My Techstack" title
// Balls are pulled toward one shared cluster point (like the old 3D
// version's inward "gravity"), so at rest they sit aligned together; the
// pointer scatters them apart, and afterwards this (deliberately gentle)
// pull gradually gathers them back into the cluster. Collision resolution
// runs many iterations per frame so the cluster stays tightly packed
// without overlapping, even while under this continuous inward pull.
const CLUSTER_STIFFNESS = 10;
const CLUSTER_DAMPING = 6;
const COLLISION_ITERATIONS = 8;

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

  // Activation gating - only animate once the tech stack section is
  // actually in view. The previous 3D version (and my first pass at this)
  // used a `window.addEventListener("scroll", ...)` + `window.scrollY`
  // check, but this site's GSAP ScrollSmoother drives scrolling through a
  // transformed wrapper rather than native document scrolling, so native
  // `scroll` events on `window` don't reliably fire and `window.scrollY`
  // can stay stuck at 0. An IntersectionObserver watches actual visibility
  // directly and works regardless of how scrolling is implemented.
  useEffect(() => {
    const sectionEl = document.getElementById("techstack");
    if (!sectionEl) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(sectionEl);
    return () => observer.disconnect();
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
        const yTop = tech.r + TOP_MARGIN;
        do {
          x = tech.r + Math.random() * Math.max(1, width - tech.r * 2);
          y = yTop + Math.random() * Math.max(1, height - yTop - tech.r);
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

    // Purely visual glow strength, written as a CSS var each frame - based
    // on proximity to the cursor and current speed, without touching any of
    // the position/velocity physics above.
    function writeGlow() {
      const list = balls.current;
      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        const inner = ballRefs.current[i]?.firstElementChild as HTMLElement | undefined;
        if (!inner) continue;
        let glow = 0;
        if (pointer.current.active) {
          const dx = b.x - pointer.current.x;
          const dy = b.y - pointer.current.y;
          const dist = Math.hypot(dx, dy);
          glow = Math.max(glow, Math.max(0, 1 - dist / POINTER_RADIUS));
        }
        const speed = Math.hypot(b.vx, b.vy);
        glow = Math.max(glow, Math.min(1, speed / 260));
        inner.style.setProperty("--tech-glow", glow.toFixed(3));
      }
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
        const list = balls.current;
        const clusterX = width / 2;
        const clusterY = TOP_MARGIN + (height - TOP_MARGIN) / 2;

        for (let i = 0; i < list.length; i++) {
          const b = list[i];

          // Pull toward the shared cluster point (damped, so it gathers
          // smoothly instead of oscillating or snapping instantly).
          b.vx += ((clusterX - b.x) * CLUSTER_STIFFNESS - b.vx * CLUSTER_DAMPING) * dt;
          b.vy += ((clusterY - b.y) * CLUSTER_STIFFNESS - b.vy * CLUSTER_DAMPING) * dt;

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

        // Pairwise repulsion so balls never overlap. Run several passes per
        // frame so a busy cluster (e.g. many balls pushed together) fully
        // separates instead of leaving a residual overlap behind.
        for (let iter = 0; iter < COLLISION_ITERATIONS; iter++) {
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
        }

        for (const b of list) {
          b.x += b.vx * dt;
          b.y += b.vy * dt;

          if (b.x < b.r) {
            b.x = b.r;
            b.vx = Math.abs(b.vx) * 0.4;
          } else if (b.x > width - b.r) {
            b.x = width - b.r;
            b.vx = -Math.abs(b.vx) * 0.4;
          }
          const yTop = b.r + TOP_MARGIN;
          if (b.y < yTop) {
            b.y = yTop;
            b.vy = Math.abs(b.vy) * 0.4;
          } else if (b.y > height - b.r) {
            b.y = height - b.r;
            b.vy = -Math.abs(b.vy) * 0.4;
          }
        }

        writeTransforms();
        writeGlow();
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
    <div className="techstack" id="techstack">
      <h2>
        <EncryptedText text="My Techstack" />
        <SectionInfoTooltip>
          <TechStackTooltip />
        </SectionInfoTooltip>
      </h2>
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
