import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import { smoother } from "./Navbar";
import "./styles/PdfViewer.css";

interface PdfViewerProps {
  src: string;
  title: string;
  onClose: () => void;
  layoutId?: string;
  contactEmail?: string;
}

const PdfViewer = ({ src, title, onClose, layoutId, contactEmail }: PdfViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.fullscreenElement) onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    // Pause the GSAP ScrollSmoother instance instead of toggling
    // `document.body.style.overflow` - this site doesn't scroll the body
    // natively, so that had no real effect and could upset ScrollSmoother's
    // own height bookkeeping, breaking scroll after the modal closed.
    smoother?.paused(true);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      smoother?.paused(false);
    };
  }, [onClose]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await containerRef.current?.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  };

  // #toolbar=0&navpanes=0 hides the browser PDF viewer's own toolbar
  // (which otherwise exposes a download button) in Chromium-based browsers.
  const fileUrl = `${encodeURI(src)}#toolbar=0&navpanes=0&statusbar=0`;

  // GSAP ScrollSmoother applies a CSS `transform` to `#smooth-content` to
  // drive the smooth-scroll effect. A `transform` on any ancestor makes
  // that ancestor the containing block for `position: fixed` descendants
  // (per the CSS spec), so if this modal rendered in place inside that
  // tree, it would be positioned relative to the (very tall, scrolled)
  // content box instead of the real viewport - shoving it far off-screen.
  // Portaling straight to <body> (which is never transformed) keeps it
  // correctly fixed to the viewport regardless of scroll position.
  const modal = (
    <AnimatePresence>
      <motion.div
        className="pdf-viewer-overlay"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          layoutId={layoutId}
          className="pdf-viewer-modal"
          ref={containerRef}
          onClick={(e) => e.stopPropagation()}
          data-cursor="disable"
        >
          <div className="pdf-viewer-toolbar">
            <span className="pdf-viewer-title">{title}</span>
            <div className="pdf-viewer-actions">
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="pdf-viewer-contact"
                  data-cursor="disable"
                >
                  Contact
                </a>
              )}
              <button
                type="button"
                className="pdf-viewer-btn"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? "Exit fullscreen" : "View fullscreen"}
              >
                {isFullscreen ? <MdFullscreenExit /> : <MdFullscreen />}
              </button>
              <button
                type="button"
                className="pdf-viewer-btn"
                onClick={onClose}
                aria-label="Close"
              >
                <MdClose />
              </button>
            </div>
          </div>
          <div className="pdf-viewer-frame-wrap">
            <iframe src={fileUrl} title={title} className="pdf-viewer-frame" />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
};

export default PdfViewer;
