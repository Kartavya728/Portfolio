import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MdClose, MdFullscreen, MdFullscreenExit } from "react-icons/md";
import "./styles/PdfViewer.css";

interface PdfViewerProps {
  src: string;
  title: string;
  onClose: () => void;
  layoutId?: string;
}

const PdfViewer = ({ src, title, onClose, layoutId }: PdfViewerProps) => {
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
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
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

  return (
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
};

export default PdfViewer;
