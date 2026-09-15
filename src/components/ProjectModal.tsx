import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { marked } from "marked";
import { MdClose, MdPlayArrow } from "react-icons/md";
import { FaGithub } from "react-icons/fa6";
import { useOutsideClick } from "../hooks/use-outside-click";
import { smoother } from "./Navbar";
import ProjectObject3D from "./ProjectObject3D";
import { CATEGORIES } from "../data/categories";
import { DEFAULT_PROJECT_VIDEO, ProjectData } from "../data/projects";
import "./styles/ProjectModal.css";

marked.setOptions({ breaks: true, gfm: true });

export type { ProjectData };

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

/** Pulls the first renderable image out of a README, if there is one. */
function extractReadmeImage(readme: string | null, repoRaw: string | null) {
  if (!readme) return null;
  const mdImage = readme.match(/!\[[^\]]*\]\(([^)\s]+)/);
  const htmlImage = readme.match(/<img[^>]+src=["']([^"']+)["']/i);
  const raw = mdImage?.[1] || htmlImage?.[1];
  if (!raw) return null;
  if (/^https?:\/\//i.test(raw)) return raw;
  if (!repoRaw) return null;
  return `${repoRaw}/${raw.replace(/^\.?\//, "")}`;
}

/** Finds a YouTube link in the README, falling back to the shared default. */
function extractYouTube(readme: string | null) {
  if (!readme) return DEFAULT_PROJECT_VIDEO;
  const match = readme.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=[\w-]+|youtu\.be\/[\w-]+)/i
  );
  return match?.[0] || DEFAULT_PROJECT_VIDEO;
}

function youTubeThumb(url: string) {
  const id =
    url.match(/youtu\.be\/([\w-]+)/)?.[1] ||
    url.match(/[?&]v=([\w-]+)/)?.[1] ||
    null;
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : null;
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

  const repo = project ? parseGitHubRepo(project.link) : null;

  useEffect(() => {
    setReadme(null);
    if (!project || !repo) return;
    setReadmeLoading(true);
    fetch(`https://api.github.com/repos/${repo.owner}/${repo.repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
    })
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => setReadme(text))
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const theme = project ? CATEGORIES[project.categoryKey] : null;

  const repoRaw = repo
    ? `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/HEAD`
    : null;

  const galleryImage = useMemo(
    () => extractReadmeImage(readme, repoRaw) || project?.image || "",
    [readme, repoRaw, project]
  );

  const youtubeUrl = useMemo(() => extractYouTube(readme), [readme]);
  const youtubeThumb = youTubeThumb(youtubeUrl);

  const tools = project ? project.tools.split(",").map((t) => t.trim()) : [];

  const modal = (
    <AnimatePresence>
      {project && theme && (
        <>
          <motion.div
            className="project-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <div className="project-modal-wrap" data-cursor="disable">
            <motion.div
              layoutId={layoutId}
              ref={ref}
              className="project-modal"
              style={
                {
                  "--cat-color": theme.color,
                  "--cat-soft": theme.soft,
                  "--cat-gradient": theme.gradient,
                } as React.CSSProperties
              }
            >
              <button
                type="button"
                className="project-modal-close"
                onClick={onClose}
                aria-label="Close"
              >
                <MdClose />
              </button>

              <div className="pm-bento">
                {/* ---- box 1: title + tech stack + scrollable README ---- */}
                <div className="pm-card pm-card-readme">
                  <span className="pm-cat-tag">{theme.label}</span>
                  <h3 className="pm-title">{project.name}</h3>
                  <p className="pm-subtitle">{project.category}</p>
                  <div className="pm-tools">
                    {tools.map((tool) => (
                      <span key={tool}>{tool}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="pm-github"
                    >
                      <FaGithub /> View on GitHub
                    </a>
                  )}
                  <div className="pm-readme-scroll">
                    <h4>README</h4>
                    {readmeLoading && <p className="pm-muted">Loading README…</p>}
                    {!readmeLoading && readme && (
                      <div
                        className="project-modal-markdown"
                        dangerouslySetInnerHTML={{
                          __html: marked.parse(readme) as string,
                        }}
                      />
                    )}
                    {!readmeLoading && !readme && (
                      <p className="pm-muted">{project.description}</p>
                    )}
                  </div>
                </div>

                {/* ---- box 2: image gallery ---- */}
                <div className="pm-card pm-card-gallery">
                  <h4 className="pm-card-title">Snapshots</h4>
                  <div className="pm-gallery">
                    {[0, 1, 2, 3].map((i) => (
                      <motion.div
                        key={i}
                        className="pm-gallery-item"
                        style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * (4 + i * 2)}deg` }}
                        whileHover={{ scale: 1.12, rotate: 0, zIndex: 20 }}
                        whileTap={{ scale: 1.12, rotate: 0, zIndex: 20 }}
                      >
                        <img src={galleryImage} alt={`${project.name} ${i + 1}`} />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* ---- box 3: video ---- */}
                <a
                  className="pm-card pm-card-video"
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <h4 className="pm-card-title">Watch the demo</h4>
                  <div className="pm-video-thumb">
                    <MdPlayArrow className="pm-play" />
                    {youtubeThumb && <img src={youtubeThumb} alt="Video preview" />}
                  </div>
                </a>

                {/* ---- box 4: interactive 3D object ---- */}
                <div className="pm-card pm-card-3d">
                  <h4 className="pm-card-title">{theme.label} in 3D</h4>
                  <p className="pm-muted pm-3d-hint">Hover to interact</p>
                  <ProjectObject3D
                    category={project.categoryKey}
                    color={theme.color}
                  />
                </div>
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
