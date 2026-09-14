import { FaGithub, FaLinkedinIn } from "react-icons/fa6";
import "./styles/SocialIcons.css";
import { TbNotes } from "react-icons/tb";
import { useEffect, useState } from "react";
import HoverLinks from "./HoverLinks";
import PdfViewer from "./PdfViewer";

const SocialIcons = () => {
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  useEffect(() => {
    const social = document.getElementById("social") as HTMLElement;

    social.querySelectorAll("span").forEach((item) => {
      const elem = item as HTMLElement;
      const link = elem.querySelector("a") as HTMLElement;

      const rect = elem.getBoundingClientRect();
      let mouseX = rect.width / 2;
      let mouseY = rect.height / 2;
      let currentX = 0;
      let currentY = 0;

      const updatePosition = () => {
        currentX += (mouseX - currentX) * 0.1;
        currentY += (mouseY - currentY) * 0.1;

        link.style.setProperty("--siLeft", `${currentX}px`);
        link.style.setProperty("--siTop", `${currentY}px`);

        requestAnimationFrame(updatePosition);
      };

      const onMouseMove = (e: MouseEvent) => {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (x < 40 && x > 10 && y < 40 && y > 5) {
          mouseX = x;
          mouseY = y;
        } else {
          mouseX = rect.width / 2;
          mouseY = rect.height / 2;
        }
      };

      document.addEventListener("mousemove", onMouseMove);

      updatePosition();

      return () => {
        elem.removeEventListener("mousemove", onMouseMove);
      };
    });
  }, []);

  return (
    <div className="icons-section">
      <div className="social-icons" data-cursor="icons" id="social">
        <span>
          <a href="https://github.com/Kartavya728" target="_blank">
            <FaGithub />
          </a>
        </span>
        <span>
          <a href="https://linkedin.com" target="_blank">
            <FaLinkedinIn />
          </a>
        </span>
      </div>
      <button
        type="button"
        className="resume-button"
        onClick={() => setIsResumeOpen(true)}
      >
        <HoverLinks text="RESUME" />
        <span>
          <TbNotes />
        </span>
      </button>
      {isResumeOpen && (
        <PdfViewer
          src="/Kartavya_Suryawanshi_Resume.pdf"
          title="Resume — Kartavya Suryawanshi"
          contactEmail="b24199@students.iitmandi.ac.in"
          onClose={() => setIsResumeOpen(false)}
        />
      )}
    </div>
  );
};

export default SocialIcons;
