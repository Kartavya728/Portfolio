import { MdCopyright } from "react-icons/md";
import { FaCode, FaBrain, FaUsers, FaGithub, FaLinkedin } from "react-icons/fa6";
import { HiSparkles } from "react-icons/hi2";
import "./styles/Contact.css";

const STATS = [
  { value: "8+", label: "Projects Built" },
  { value: "5", label: "Hackathons Won" },
  { value: "8+", label: "Certifications" },
];

const Contact = () => {
  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-hero">
        <div className="contact-hero-left">
          <h2 className="contact-heading">
            Let's <span>Connect</span>
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

          <p className="contact-tagline">
            I'm a Data Science undergrad at IIT Mandi building production-grade
            full-stack and ML systems. Open to full-time SDE/ML roles and
            interesting collaborations — reach out and let's talk.
          </p>

          <div className="contact-hero-actions">
            <a href="#work" className="contact-btn-primary" data-cursor="disable">
              View My Work
            </a>
            <a
              href="mailto:kartavya.suryawanshi7@gmail.com"
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
        </div>

        <div className="contact-hero-right">
          <div className="contact-photo-wrap">
            <div className="contact-orbit contact-orbit-1" />
            <div className="contact-orbit contact-orbit-2" />
            <span className="contact-deco contact-deco-1" />
            <span className="contact-deco contact-deco-2" />
            <span className="contact-deco contact-deco-3" />
            <span className="contact-deco contact-deco-4" />
            <div className="contact-photo">
              <img src="/git-prf.png" alt="Kartavya Suryawanshi" />
            </div>
          </div>

          <div className="contact-card">
            <div className="contact-card-head">
              <h4>Contact Me</h4>
              <HiSparkles className="contact-card-sparkle" />
            </div>

            <div className="contact-card-row">
              <span className="contact-card-label">Name</span>
              <span className="contact-card-value">Kartavya Suryawanshi</span>
            </div>
            <div className="contact-card-row">
              <span className="contact-card-label">Email</span>
              <a
                href="mailto:kartavya.suryawanshi7@gmail.com"
                className="contact-card-value"
                data-cursor="disable"
              >
                kartavya.suryawanshi7@gmail.com
              </a>
            </div>
            <div className="contact-card-row">
              <span className="contact-card-label">Phone</span>
              <a
                href="tel:+918668944955"
                className="contact-card-value"
                data-cursor="disable"
              >
                +91 86689 44955
              </a>
            </div>

            <div className="contact-card-socials">
              <a
                href="https://github.com/Kartavya728"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                aria-label="Github"
              >
                <FaGithub />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                data-cursor="disable"
                aria-label="Linkedin"
              >
                <FaLinkedin />
              </a>
            </div>

            <a
              href="mailto:kartavya.suryawanshi7@gmail.com"
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
