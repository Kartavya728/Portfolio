import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdClose } from "react-icons/md";
import { useOutsideClick } from "../hooks/use-outside-click";
import "./styles/ProjectModal.css";

export interface ProjectData {
  name: string;
  category: string;
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
    document.body.style.overflow = project ? "hidden" : "";
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
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

  return (
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
                  className="project-modal-tools"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {project.tools}
                </motion.p>
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
                  {!readmeLoading && readme && <pre>{readme}</pre>}
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
};

export default ProjectModal;
