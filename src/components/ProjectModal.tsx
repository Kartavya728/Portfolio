import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { marked } from "marked";
import { MdClose, MdPlayArrow } from "react-icons/md";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import { useOutsideClick } from "../hooks/use-outside-click";
import { smoother } from "./Navbar";
import ProjectObject3D from "./ProjectObject3D";
import { CATEGORIES } from "../data/categories";
import { DEFAULT_LINKEDIN_POST, DEFAULT_PROJECT_VIDEO, ProjectData } from "../data/projects";
import "./styles/ProjectModal.css";

marked.setOptions({ breaks: true, gfm: true });

export type { ProjectData };

interface ProjectModalProps {
  project: ProjectData | null;
  onClose: () => void;
}

const CLOSE_DURATION_MS = 200;

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

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [readmeLoading, setReadmeLoading] = useState(false);

  // Driving open/close with a plain CSS transition (toggled via this
  // `visible` class) rather than Framer's AnimatePresence: pairing
  // AnimatePresence with a shared `layoutId` grow-from-card effect took
  // 600-800ms to actually unmount regardless of the transition duration
  // passed to it - closing felt laggy. A manual timeout tied to the CSS
  // transition's own duration guarantees the DOM is gone in exactly
  // CLOSE_DURATION_MS, independent of Framer internals.
  const [renderedProject, setRenderedProject] = useState<ProjectData | null>(null);
  const [visible, setVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useOutsideClick(ref, onClose);

  useEffect(() => {
    if (project) {
      clearTimeout(closeTimeoutRef.current);
      setRenderedProject(project);
      // Two rAFs: the first commits the "hidden" starting styles, the
      // second flips to "visible" on the next frame so the browser
      // actually has a from-state to transition out of.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else if (renderedProject) {
      setVisible(false);
      closeTimeoutRef.current = setTimeout(() => {
        setRenderedProject(null);
      }, CLOSE_DURATION_MS);
    }
    return () => clearTimeout(closeTimeoutRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    // This site scrolls via GSAP ScrollSmoother (a transformed wrapper),
    // not native body scrolling, so `document.body.style.overflow` does
    // nothing useful here and can confuse ScrollSmoother's own height
    // bookkeeping. Pause/resume the smoother itself instead.
    if (renderedProject) {
      smoother?.paused(true);
      window.addEventListener("keydown", onKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      smoother?.paused(false);
    };
  }, [renderedProject, onClose]);

  const repo = renderedProject ? parseGitHubRepo(renderedProject.link) : null;

  useEffect(() => {
    // Read `project` (the prop) directly here rather than the `repo`
    // derived from `renderedProject` above: when a new project opens,
    // this effect fires on the same render where `project` changes, but
    // `renderedProject` (and anything derived from it) still holds the
    // *previous* project until its own state update commits a render
    // later. Depending on `repo` here made every fetch see a stale/null
    // repo and silently bail out, so the README stopped loading.
    setReadme(null);
    const targetRepo = project ? parseGitHubRepo(project.link) : null;
    if (!project || !targetRepo) return;
    setReadmeLoading(true);
    fetch(`https://api.github.com/repos/${targetRepo.owner}/${targetRepo.repo}/readme`, {
      headers: { Accept: "application/vnd.github.raw+json" },
    })
      .then((res) => (res.ok ? res.text() : null))
      .then((text) => setReadme(text))
      .catch(() => setReadme(null))
      .finally(() => setReadmeLoading(false));
  }, [project]);

  const theme = renderedProject ? CATEGORIES[renderedProject.categoryKey] : null;

  const repoRaw = repo
    ? `https://raw.githubusercontent.com/${repo.owner}/${repo.repo}/HEAD`
    : null;

  const galleryImage = useMemo(
    () => extractReadmeImage(readme, repoRaw) || renderedProject?.image || "",
    [readme, repoRaw, renderedProject]
  );

  const youtubeUrl = useMemo(() => extractYouTube(readme), [readme]);
  const youtubeThumb = youTubeThumb(youtubeUrl);

  const tools = renderedProject
    ? renderedProject.tools.split(",").map((t) => t.trim())
    : [];

  if (!renderedProject || !theme) return null;
  const project_ = renderedProject;

  const modal = (
    <>
      <div
        className={`project-modal-overlay ${visible ? "project-modal-overlay-visible" : ""}`}
        onClick={onClose}
      />
      <div className="project-modal-wrap" data-cursor="disable">
        <div
          ref={ref}
          className={`project-modal ${visible ? "project-modal-visible" : ""}`}
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
            {/* ---- box 1: title + tech stack + structured description ---- */}
            <div className="pm-card pm-card-description">
              {/* Decorative, still-interactive 3D object drifting behind the
                  text - kept from the earlier bento-card version but now as
                  background flavor instead of its own slot. */}
              <ProjectObject3D
                category={project_.categoryKey}
                color={theme.color}
                className="pm-3d-bg"
              />
              <span className="pm-cat-tag">{theme.label}</span>
              <h3 className="pm-title">{project_.name}</h3>
              <p className="pm-subtitle">{project_.category}</p>
              <div className="pm-tools">
                {tools.map((tool) => (
                  <span key={tool}>{tool}</span>
                ))}
              </div>

              <div className="pm-links">
                {project_.link && (
                  <a href={project_.link} target="_blank" rel="noreferrer" className="pm-github">
                    <FaGithub /> View on GitHub
                  </a>
                )}
                <a
                  href={project_.linkedinPost || DEFAULT_LINKEDIN_POST}
                  target="_blank"
                  rel="noreferrer"
                  className="pm-github pm-linkedin"
                >
                  <FaLinkedin /> View LinkedIn Post
                </a>
                {project_.deployedUrl ? (
                  <a
                    href={project_.deployedUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="pm-github pm-deployed"
                  >
                    View Deployed Site
                  </a>
                ) : (
                  <span className="pm-github pm-deployed pm-disabled" aria-disabled="true">
                    View Deployed Site
                  </span>
                )}
              </div>

              <div className="pm-readme-scroll pm-detail-scroll">
                <dl className="pm-detail-list">
                  <div className="pm-detail-row">
                    <dt>Problem</dt>
                    <dd>{project_.problem}</dd>
                  </div>
                  <div className="pm-detail-row">
                    <dt>Category</dt>
                    <dd>{theme.label}</dd>
                  </div>
                  <div className="pm-detail-row">
                    <dt>Solution</dt>
                    <dd>{project_.solution}</dd>
                  </div>
                  <div className="pm-detail-row">
                    <dt>USP</dt>
                    <dd>{project_.usp}</dd>
                  </div>
                  <div className="pm-detail-row">
                    <dt>Quantitative Results</dt>
                    <dd>{project_.results}</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* ---- box 2: image gallery (1 large + 4 small) ---- */}
            <div className="pm-card pm-card-gallery">
              <h4 className="pm-card-title">Snapshots</h4>
              <div className="pm-gallery">
                <motion.div
                  className="pm-gallery-item pm-gallery-item-large"
                  whileHover={{ scale: 1.05, zIndex: 20 }}
                  whileTap={{ scale: 1.05, zIndex: 20 }}
                >
                  <img src={galleryImage} alt={`${project_.name} large preview`} />
                </motion.div>
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="pm-gallery-item"
                    style={{ rotate: `${(i % 2 === 0 ? -1 : 1) * (4 + i * 2)}deg` }}
                    whileHover={{ scale: 1.12, rotate: 0, zIndex: 20 }}
                    whileTap={{ scale: 1.12, rotate: 0, zIndex: 20 }}
                  >
                    <img src={galleryImage} alt={`${project_.name} ${i + 1}`} />
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

            {/* ---- box 4: full README ---- */}
            <div className="pm-card pm-card-readme">
              <h4 className="pm-card-title">README</h4>
              <div className="pm-readme-scroll">
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
                  <p className="pm-muted">README not available for this project.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(modal, document.body);
};

export default ProjectModal;
