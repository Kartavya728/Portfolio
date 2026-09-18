import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Terminal from "./Terminal";
import "./styles/ScreenDive.css";

gsap.registerPlugin(ScrollTrigger);

const CORE_INTERESTS = [
  "Deep Learning & Applied AI",
  "Agentic AI Systems",
  "Full-Stack & Distributed Systems",
  "Cyber Security & Computer Networks",
];

const TECHNICAL_SKILLS = [
  "Core CS Fundamentals: Data Structures & Algorithms (DSA), OOP, System Design, Distributed Systems, Problem Solving",
  "Languages: C/C++, Python, Java, JavaScript, TypeScript, SQL, Bash",
  "Frameworks, APIs & Cloud: React, Next.js, FastAPI, Django, REST APIs, PyTorch, TensorFlow, Docker, Kubernetes, AWS, PostgreSQL, Redis",
  "Tools, Practices & Applied AI: Git, Linux, CI/CD, Agile/Scrum, GitHub Copilot, LaTeX, Prompt Engineering, RAG",
];

const COMMANDS = [
  "whoami",
  "cat core_interests.txt",
  "cat technical_skills.txt",
  "cat spoken_languages.txt",
];

const OUTPUTS = {
  0: ["Kartavya Suryawanshi — B.Tech Data Science, IIT Mandi"],
  1: CORE_INTERESTS.map((s) => `> ${s}`),
  2: TECHNICAL_SKILLS,
  3: ["English (C1) · Hindi · Marathi"],
};

/**
 * The scroll beat between WhatIDo and Career. The actual 3D character is
 * the visual here - setScreenDiveTimeline (GsapScroll.ts) orbits the
 * camera from the front of his face around behind his head and pushes
 * into the monitor he's typing on, then fades the canvas out and this
 * stage in, so the terminal reads as the contents of that monitor.
 *
 * This component only owns the markup plus the small laptop-deck finish
 * at the end; the camera choreography lives with the rest of the 3D
 * scroll work in GsapScroll.ts.
 */
const ScreenDive = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current || !deckRef.current || !stickyRef.current) return;
    if (window.innerWidth <= 1024) return;

    // Pinned via ScrollTrigger rather than `position: sticky`: this site
    // scrolls through GSAP ScrollSmoother, which moves the content with a
    // transform instead of actually scrolling it, so sticky has nothing
    // to stick to and just scrolls away with the section.
    const pin = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: stickyRef.current,
      pinSpacing: false,
      invalidateOnRefresh: true,
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "75% bottom",
        end: "bottom bottom",
        scrub: true,
        invalidateOnRefresh: true,
      },
    });
    tl.fromTo(
      deckRef.current,
      { opacity: 0, y: 40, scaleY: 0.9 },
      { opacity: 1, y: 0, scaleY: 1, duration: 1, ease: "none", immediateRender: false },
      0
    );

    return () => {
      pin.kill();
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div className="screen-dive" id="screen-dive" ref={sectionRef}>
      <div className="screen-dive-sticky" ref={stickyRef}>
        <div className="screen-dive-stage">
          <div className="screen-dive-frame">
            <div className="screen-dive-webcam" />
            <div className="screen-dive-screen">
              <Terminal commands={COMMANDS} outputs={OUTPUTS} />
            </div>
          </div>
          <div className="screen-dive-deck" ref={deckRef}>
            <div className="screen-dive-keyboard" />
            <div className="screen-dive-trackpad" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDive;
