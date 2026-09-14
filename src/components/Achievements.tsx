import { FaTrophy, FaMedal } from "react-icons/fa6";
import "./styles/Achievements.css";

const ACHIEVEMENTS = [
  {
    place: "1st Place",
    event: "NASA Space Apps Challenge — Chandigarh",
    detail:
      "Won among 100+ teams with Astrogenesis, a RAG-powered bioscience research engine.",
    year: "2025",
    top: true,
  },
  {
    place: "1st Place Overall",
    event: "iHub Multimodal AI Hackathon",
    detail:
      "Led a 5-member team to win among 1,600+ teams with Smart-Scribes, an AI lecture assistant.",
    year: "2025",
    top: true,
  },
  {
    place: "1st Place",
    event: "Hack 60 — HCLTech × IIT Mandi",
    detail:
      "Won the Deep Learning track with a real-time deepfake & audio anti-spoofing system.",
    year: "2026",
    top: true,
  },
  {
    place: "1st Runner-Up",
    event: "FrostHack — IIT Mandi",
    detail:
      "Runner-up in the Agentic AI track (50+ teams) for autonomous multi-agent task orchestration.",
    year: "2026",
    top: false,
  },
  {
    place: "1st Runner-Up",
    event: "InxiteOut Hackathon — XPECTO '26, IIT Mandi",
    detail: "Secured the runner-up position at IIT Mandi's flagship tech fest.",
    year: "2026",
    top: false,
  },
];

const Achievements = () => {
  return (
    <div className="achievements-section section-container" id="achievements">
      <h2>
        My <span>Achievements</span>
      </h2>
      <div className="achievements-grid">
        {ACHIEVEMENTS.map((a, index) => (
          <div className="achievement-card" key={index}>
            <div className="achievement-icon">
              {a.top ? <FaTrophy /> : <FaMedal />}
            </div>
            <div className="achievement-body">
              <div className="achievement-head">
                <h4>{a.place}</h4>
                <span className="achievement-year">{a.year}</span>
              </div>
              <h5>{a.event}</h5>
              <p>{a.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Achievements;
