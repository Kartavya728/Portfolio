import { useState } from "react";
import { motion } from "motion/react";
import PdfViewer from "./PdfViewer";
import "./styles/Certificates.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { CertificatesTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";

const CERTIFICATES = [
  {
    title: "Certificate of Student's Practical Training",
    issuer: "Nomura Real Estate Holdings, Inc. — Tokyo, Japan",
    year: "2026",
    file: "/Certificates/2026_Internship Completion Certificate_Kartavya Mahesh Suryawanshi (1).pdf",
  },
  {
    title: "Letter of Recommendation",
    issuer: "Prof. Aditya Nigam — IIT Mandi",
    year: "2026",
    file: "/Certificates/Aditya_Nigam_Sir_LoR (2).pdf",
  },
  {
    title: "Letter of Recommendation",
    issuer: "Prof. Satvasheel Rawal — IIT Mandi",
    year: "2026",
    file: "/Certificates/satvasheel_sir_LOR_B24199 (1).pdf",
  },
  {
    title: "Letter of Recommendation",
    issuer: "Finance Department — IIT Mandi",
    year: "2025",
    file: "/Certificates/Letter-of-Recomnedation-IIT-Md-Kartavya (1).pdf",
  },
  {
    title: "1st Runner-Up — InxiteOut Hackathon",
    issuer: "XPECTO '26 — IIT Mandi",
    year: "2026",
    file: "/Certificates/inxiteout-runnerup-certificate.pdf",
  },
  {
    title: "Core Team Member — KamandPrompt",
    issuer: "Programming Club, SNTC — IIT Mandi",
    year: "2025 – 26",
    file: "/Certificates/kp-certificate-visa (1).pdf",
  },
  {
    title: "Core Member — STAC",
    issuer: "Space Technology & Astronomy Cell, SNTC — IIT Mandi",
    year: "2025 – 26",
    file: "/Certificates/stac-kartavya-official (1).pdf",
  },
  {
    title: "Japanese Language Certificate",
    issuer: "SAKURA — Experience Japan Language School",
    year: "2026",
    file: "/Certificates/sakura-japanese-language-certificate.pdf",
  },
];

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
