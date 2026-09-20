import "./styles/Career.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { CareerTooltip } from "./SectionTooltipContent";
import EncryptedText from "./EncryptedText";
import careerData from "../../public/images/career/text.json";

const Career = () => {
  return (
    <div className="career-section section-container" id="career">
      <div className="career-container">
        <h2>
          <EncryptedText text={careerData.heading[0]} />{" "}
          <span><EncryptedText text={careerData.heading[1]} /></span>
          <br /> <EncryptedText text={careerData.heading[2]} />
          <SectionInfoTooltip>
            <CareerTooltip />
          </SectionInfoTooltip>
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          {careerData.entries.map((entry) => (
            <div className="career-info-box" key={`${entry.role}-${entry.year}`}>
              <div className="career-info-in">
                <div className="career-role">
                  <h4>{entry.role}</h4>
                  <h5>{entry.org}</h5>
                </div>
                <h3>{entry.year}</h3>
              </div>
              <p>{entry.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Career;
