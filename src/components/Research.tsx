import "./styles/Research.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { ResearchTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import researchData from "../../public/images/research/data.json";

const Research = () => {
  return (
    <div className="research-section section-container" id="research">
      <h2>
        <EncryptedText text="My" /> <span><EncryptedText text="Research" /></span>
        <SectionInfoTooltip>
          <ResearchTooltip />
        </SectionInfoTooltip>
      </h2>
      <p className="research-intro">{researchData.intro}</p>
      <div className="research-card">
        <div className="research-image">
          <img src={researchData.project.image} alt={researchData.project.imageAlt} />
        </div>
        <div className="research-content">
          <span className="research-tag">{researchData.project.tag}</span>
          <h3>{researchData.project.title}</h3>
          <p className="research-subtitle">{researchData.project.subtitle}</p>
          <p>{researchData.project.description}</p>
          <ul className="research-results">
            {researchData.project.results.map((result) => (
              <li key={result}>{result}</li>
            ))}
          </ul>
          <div className="research-stack">
            {researchData.project.stack.map((t) => (
              <span key={t} className="research-chip">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Research;
