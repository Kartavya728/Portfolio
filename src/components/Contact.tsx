import { MdCopyright } from "react-icons/md";
import { FaCode, FaBrain, FaUsers, FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import "./styles/Contact.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { ContactTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import contactText from "../../public/images/contact/text.json";
import contactLinks from "../../public/images/contact/links.json";

const STATS = contactText.stats;

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-hero">
        <div className="contact-hero-left">
          <h2 className="contact-heading">
            <EncryptedText text="Let's" /> <span><EncryptedText text="Connect" /></span>
            <SectionInfoTooltip>
              <ContactTooltip />
            </SectionInfoTooltip>
          </h2>

          <div className="contact-tags">
            <span>
              <FaCode /> Full-Stack Dev
            </span>
            <span className="contact-tag-dot">•</span>
            <span>
              <FaBrain /> Applied AI/ML
            </span>
            <span className="contact-tag-dot">•</span>
            <span>
              <FaUsers /> Team Leadership
            </span>
          </div>

          <p className="contact-tagline">{contactText.tagline}</p>

          <div className="contact-hero-actions">
            <a href={contactLinks.work} className="contact-btn-primary" data-cursor="disable">
              View My Work
            </a>
            <a
              href={contactLinks.email}
              className="contact-btn-secondary"
              data-cursor="disable"
            >
              Say Hello
            </a>
          </div>

          <div className="contact-stats">
            {STATS.map((s) => (
              <div className="contact-stat" key={s.label}>
                <h3>{s.value}</h3>
                <p>{s.label}</p>
              </div>
            ))}
          </div>

          <div className="contact-social-actions">
            <a
              href={contactLinks.github}
              target="_blank"
              rel="noreferrer"
              className="contact-btn-secondary"
              data-cursor="disable"
            >
              <FaGithub /> View GitHub
            </a>
            <a
              href={contactLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="contact-btn-secondary"
              data-cursor="disable"
            >
              <FaLinkedin /> View LinkedIn Profile
            </a>
          </div>
        </div>

        <div className="contact-hero-right">
          <div className="contact-photo-wrap">
            {/* Lit rings + orbiting particles (each ring spins its own
                particle around the circumference via a rotating wrapper). */}
            <div className="contact-rings" aria-hidden="true">
              <div className="contact-ring contact-ring-1">
                <span className="contact-ring-glow" />
              </div>
              <div className="contact-ring contact-ring-2">
                <span className="contact-ring-glow" />
              </div>
              <div className="contact-ring contact-ring-3">
                <span className="contact-ring-glow" />
              </div>

              <div className="contact-orbit-spin contact-orbit-spin-1">
                <span className="contact-particle" />
              </div>
              <div className="contact-orbit-spin contact-orbit-spin-2">
                <span className="contact-particle contact-particle-sm" />
              </div>
              <div className="contact-orbit-spin contact-orbit-spin-3">
                <span className="contact-particle contact-particle-lg" />
              </div>
              <div className="contact-orbit-spin contact-orbit-spin-4">
                <span className="contact-particle contact-particle-sm" />
              </div>
              <div className="contact-orbit-spin contact-orbit-spin-5">
                <span className="contact-particle" />
              </div>
            </div>
            <img
              src={contactText.avatar}
              alt={contactText.name}
              className="contact-photo"
            />
          </div>

          <div className="contact-card">
            <div className="contact-card-head">
              <h4>Contact Me</h4>
              <HiSparkles className="contact-card-sparkle" />
            </div>

            <div className="contact-card-row">
              <span className="contact-card-label">Name</span>
              <span className="contact-card-value">{contactText.name}</span>
            </div>
            <div className="contact-card-row">
              <span className="contact-card-label">Email</span>
              <a
                href={contactLinks.email}
                className="contact-card-value"
                data-cursor="disable"
              >{contactText.email}</a>
            </div>
            <div className="contact-card-row">
              <span className="contact-card-label">Phone</span>
              <a
                href={contactLinks.phone}
                className="contact-card-value"
                data-cursor="disable"
              >{contactText.phone}</a>
            </div>

            <div className="contact-card-socials">
              <a
                href={contactLinks.github}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                aria-label="Github"
              >
                <FaGithub />
              </a>
              <a
                href={contactLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                aria-label="Linkedin"
              >
                <FaLinkedin />
              </a>
            </div>

            <a
              href={contactLinks.email}
              className="contact-card-btn"
              data-cursor="disable"
            >
              Get In Touch
            </a>
          </div>
        </div>
      </div>

      <div className="contact-footer">
        <p>
          Designed and Developed by <span>Kartavya Suryawanshi</span>
        </p>
        <h5>
          <MdCopyright /> 2026
        </h5>
      </div>
    </div>
  );
};

export default Contact;
