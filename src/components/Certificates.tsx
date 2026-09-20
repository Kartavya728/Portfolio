import { useState } from "react";
import { motion } from "motion/react";
import PdfViewer from "./PdfViewer";
import "./styles/Certificates.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { CertificatesTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import certificatesData from "../../public/images/certificates/data.json";

const CERTIFICATES = certificatesData.certificates;


const Certificates = () => {
  const [active, setActive] = useState<number | null>(null);

  // Mouse-follow glow, written straight to the hovered card's own CSS
  // variables rather than React state - this fires on every pointer
  // move, so going through setState/re-render would be needlessly
  // expensive for something that's purely a visual background effect.
  const handleGlowMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div className="certificates-section section-container" id="certificates">
      <h2>
        <EncryptedText text="My" /> <span><EncryptedText text="Certificates" /></span>
        <SectionInfoTooltip>
          <CertificatesTooltip />
        </SectionInfoTooltip>
      </h2>
      <div className="certificates-grid">
        {CERTIFICATES.map((cert, index) => {
          const fileUrl = `${encodeURI(cert.file)}#toolbar=0&navpanes=0&view=FitH`;
          return (
            <button
              key={index}
              type="button"
              className="certificate-card"
              onClick={() => setActive(index)}
              onMouseMove={handleGlowMove}
              data-cursor="disable"
            >
              <span className="certificate-glow" aria-hidden="true" />
              <motion.div
                className="certificate-preview"
                layoutId={active === index ? undefined : `cert-preview-${index}`}
              >
                <iframe src={fileUrl} title={cert.title} tabIndex={-1} />
              </motion.div>
              <div className="certificate-info">
                <h4>{cert.title}</h4>
                <p>{cert.issuer}</p>
                <span className="certificate-year">{cert.year}</span>
              </div>
            </button>
          );
        })}
      </div>
      {active !== null && (
        <PdfViewer
          src={CERTIFICATES[active].file}
          title={CERTIFICATES[active].title}
          layoutId={`cert-preview-${active}`}
          onClose={() => setActive(null)}
        />
      )}
    </div>
  );
};

export default Certificates;
