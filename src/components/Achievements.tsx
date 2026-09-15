import { motion } from "motion/react";
import {
  MdOutlineContentCopy,
  MdOutlineBrokenImage,
  MdOutlineDraw,
  MdOutlineTableChart,
  MdOutlineViewSidebar,
} from "react-icons/md";
import "./styles/Achievements.css";

/* Images live in /public/achievements_data — swap the files there (keeping
   the names) to change what each card shows. */
const IMAGES = {
  nasa: "/achievements_data/nasa-1.png",
  ihub: "/achievements_data/ihub.png",
  hack60: "/achievements_data/achive-1.png",
  frost: "/achievements_data/achive-2.png",
  inxite: "/achievements_data/achive-3.png",
  spare: "/achievements_data/achive-4.png",
};

/* ---------------- animated headers (bento "skeletons") ---------------- */

const SkeletonOne = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div initial="initial" whileHover="animate" className="bento-skeleton">
      <motion.div variants={variants} className="bento-row">
        <div className="bento-dot" />
        <div className="bento-bar" />
      </motion.div>
      <motion.div variants={variantsSecond} className="bento-row bento-row-narrow">
        <div className="bento-bar" />
        <div className="bento-dot" />
      </motion.div>
      <motion.div variants={variants} className="bento-row">
        <div className="bento-dot" />
        <div className="bento-bar" />
      </motion.div>
    </motion.div>
  );
};

const SkeletonTwo = () => {
  const variants = {
    initial: { width: 0 },
    animate: { width: "100%", transition: { duration: 0.2 } },
    hover: { width: ["0%", "100%"], transition: { duration: 2 } },
  };
  const arr = new Array(6).fill(0);
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bento-skeleton"
    >
      {arr.map((_, i) => (
        <motion.div
          key={`bento-two-${i}`}
          variants={variants}
          style={{ maxWidth: `${Math.random() * (100 - 40) + 40}%` }}
          className="bento-line"
        />
      ))}
    </motion.div>
  );
};

const SkeletonThree = () => {
  const variants = {
    initial: { backgroundPosition: "0 50%" },
    animate: { backgroundPosition: ["0, 50%", "100% 50%", "0 50%"] },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={variants}
      transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      className="bento-skeleton bento-gradient"
    />
  );
};

const SkeletonFour = () => {
  const first = {
    initial: { x: 20, rotate: -5 },
    hover: { x: 0, rotate: 0 },
  };
  const second = {
    initial: { x: -20, rotate: 5 },
    hover: { x: 0, rotate: 0 },
  };
  return (
    <motion.div
      initial="initial"
      animate="animate"
      whileHover="hover"
      className="bento-skeleton bento-skeleton-row"
    >
      <motion.div variants={first} className="bento-mini-card">
        <img src={IMAGES.hack60} alt="Hack 60" />
        <p>Deep Learning track win</p>
        <span className="bento-pill bento-pill-green">1st Place</span>
      </motion.div>
      <motion.div className="bento-mini-card bento-mini-card-front">
        <img src={IMAGES.ihub} alt="iHub" />
        <p>1,600+ teams beaten</p>
        <span className="bento-pill bento-pill-purple">Overall Win</span>
      </motion.div>
      <motion.div variants={second} className="bento-mini-card">
        <img src={IMAGES.frost} alt="FrostHack" />
        <p>Agentic AI track</p>
        <span className="bento-pill bento-pill-orange">Runner-Up</span>
      </motion.div>
    </motion.div>
  );
};

const SkeletonFive = () => {
  const variants = {
    initial: { x: 0 },
    animate: { x: 10, rotate: 5, transition: { duration: 0.2 } },
  };
  const variantsSecond = {
    initial: { x: 0 },
    animate: { x: -10, rotate: -5, transition: { duration: 0.2 } },
  };

  return (
    <motion.div initial="initial" whileHover="animate" className="bento-skeleton">
      <motion.div variants={variants} className="bento-chat">
        <img src={IMAGES.inxite} alt="InxiteOut" />
        <p>
          Runner-up at IIT Mandi&apos;s flagship tech fest XPECTO &apos;26, against
          the best teams on campus…
        </p>
      </motion.div>
      <motion.div variants={variantsSecond} className="bento-chat bento-chat-reply">
        <p>1st Runner-Up</p>
        <div className="bento-dot" />
      </motion.div>
    </motion.div>
  );
};

/* ---------------- grid ---------------- */

const items = [
  {
    title: "NASA Space Apps Challenge — 1st Place",
    description:
      "Won among 100+ teams with Astrogenesis, a RAG-powered bioscience research engine. Chandigarh, 2025.",
    header: <SkeletonOne />,
    className: "bento-span-1",
    icon: <MdOutlineContentCopy />,
  },
  {
    title: "iHub Multimodal AI Hackathon — 1st Overall",
    description:
      "Led a 5-member team to win among 1,600+ teams with Smart-Scribes, an AI lecture assistant. 2025.",
    header: <SkeletonTwo />,
    className: "bento-span-1",
    icon: <MdOutlineBrokenImage />,
  },
  {
    title: "Hack 60 — HCLTech × IIT Mandi",
    description:
      "Won the Deep Learning track with a real-time deepfake & audio anti-spoofing system. 2026.",
    header: <SkeletonThree />,
    className: "bento-span-1",
    icon: <MdOutlineDraw />,
  },
  {
    title: "Hackathon Wins at a Glance",
    description:
      "First-place finishes across national AI hackathons, plus podium runs in agentic AI and campus flagship events.",
    header: <SkeletonFour />,
    className: "bento-span-2",
    icon: <MdOutlineTableChart />,
  },
  {
    title: "InxiteOut Hackathon — 1st Runner-Up",
    description:
      "Secured the runner-up position at IIT Mandi's flagship tech fest XPECTO '26.",
    header: <SkeletonFive />,
    className: "bento-span-1",
    icon: <MdOutlineViewSidebar />,
  },
];

const Achievements = () => {
  return (
    <div className="achievements-section section-container" id="achievements">
      <h2>
        My <span>Achievements</span>
      </h2>
      <div className="bento-grid">
        {items.map((item, i) => (
          <div key={i} className={`bento-item ${item.className}`}>
            {item.header}
            <div className="bento-content">
              <div className="bento-icon">{item.icon}</div>
              <div className="bento-title">{item.title}</div>
              <div className="bento-description">{item.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
