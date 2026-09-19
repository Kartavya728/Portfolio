import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import SectionInfoTooltip from "./SectionInfoTooltip";
import { LandingTooltip } from "./SectionTooltipContent";

const Landing = ({ children }: PropsWithChildren) => {
  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h2>Hello! I'm</h2>
            <h1>
              KARTAVYA
              <br />
              <span>SURYAWANSHI</span>
            </h1>
          </div>
          <div className="landing-info">
            <h3>
              A Creative
              <SectionInfoTooltip>
                <LandingTooltip />
              </SectionInfoTooltip>
            </h3>
            <h2 className="landing-info-h2">
              <div className="landing-h2-1">Engineer</div>
              <div className="landing-h2-2">Researcher</div>
            </h2>
            <h2>
              <div className="landing-h2-info">Researcher</div>
              <div className="landing-h2-info-1">Engineer</div>
            </h2>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
