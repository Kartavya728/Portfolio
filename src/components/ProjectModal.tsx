import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { marked } from "marked";
import { MdClose } from "react-icons/md";
import { useOutsideClick } from "../hooks/use-outside-click";
import { smoother } from "./Navbar";
import "./styles/ProjectModal.css";

marked.setOptions({ breaks: true, gfm: true });

export interface ProjectData {
  name: string;
  category: string;
  description: string;
  tools: string;
  image: string;
  link: string;
}

interface ProjectModalProps {
  project: ProjectData | null;
  layoutId: string;
  onClose: () => void;
}

function parseGitHubRepo(url: string) {
  const match = url.match(/github\.com\/([^/]+)\/([^/]+)\/?$/);
  if (!match) return null;
  return { owner: match[1], repo: match[2] };
}

const ProjectModal = ({ project, layoutId, onClose }: ProjectModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);

  useOutsideClick(ref, onClose);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    // This site scrolls via GSAP ScrollSmoother (a transformed wrapper),
    // not native body scrolling, so `document.body.style.overflow` does
    // nothing useful here and can confuse ScrollSmoother's own height
    // bookkeeping. Pause/resume the smoother itself instead.
    if (project) {
      smoother?.paused(true);
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      smoother?.paused(false);
    };
  }, [project, onClose]);

  useEffect(() => {
    setReadme(null);
    if (!project) return;
    const repo = parseGitHubRepo(project.link);
    if (!repo) return;
    setReadmeLoading(true);
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
    })
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => setReadme(text))
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
  }, [project]);

  // Portaled to <body> because ScrollSmoother's `transform` on
  // `#smooth-content` would otherwise become the containing block for
  // this modal's `position: fixed` elements, rendering them off-screen
  // instead of pinned to the actual viewport (see PdfViewer.tsx for the
  // same fix).
  const modal = (
    <AnimatePresence>
      {project && (
        <>
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="project-modal-wrap" data-cursor="disable">
            <motion.div layoutId={layoutId} ref={ref} className="project-modal">
              <button
                type="button"
                className="project-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <MdClose />
              </button>
              <motion.div className="project-modal-image">
                <img src={project.image} alt={project.name} />
              </motion.div>
              <div className="project-modal-body">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {project.name}
                </motion.h3>
                <motion.p
                  className="project-modal-category"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  {project.category}
                </motion.p>
                <motion.p
                  className="project-modal-description"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.18 }}
                >
                  {project.description}
                </motion.p>
                <motion.div
                  className="project-modal-tools"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h4>Tools &amp; Features</h4>
                  <p>{project.tools}</p>
                </motion.div>
                {project.link && (
                  <motion.a
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="project-modal-github"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 }}
                  >
                    View on GitHub
                  </motion.a>
                )}
                <motion.div
                  className="project-modal-readme"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4>README</h4>
                  {readmeLoading && <p className="project-modal-muted">Loading README…</p>}
                  {!readmeLoading && readme && (
                    <div
                      className="project-modal-markdown"
                      dangerouslySetInnerHTML={{ __html: marked.parse(readme) as string }}
                    />
                  )}
                  {!readmeLoading && !readme && (
                    <p className="project-modal-muted">README not available.</p>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

export default ProjectModal;
