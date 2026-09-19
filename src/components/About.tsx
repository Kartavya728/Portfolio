import { useRef } from "react";
import "./styles/About.css";
import FlowingText from "./FlowingText";
import TooltipTerm from "./TooltipTerm";
import TooltipManager from "./TooltipManager";
import {
  DeepLearningCard,
  Hack60Card,
  HCLTechCard,
  IITMandiCard,
  NasaSpaceAppsCard,
} from "./AboutTooltipCards";

const TOOLTIP_CONTENT = {
  "iit-mandi": <IITMandiCard />,
  "deep-learning": <DeepLearningCard />,
  "nasa-space-apps": <NasaSpaceAppsCard />,
  "hack-60": <Hack60Card />,
  hcltech: <HCLTechCard />,
};

const About = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="about-section" id="about">
      <FlowingText />
      <div className="about-me" ref={containerRef}>
        <h3 className="title">About Me</h3>
        <p className="para">
          I&apos;m a Data Science undergrad at{" "}
          <TooltipTerm id="iit-mandi">IIT Mandi</TooltipTerm>, building at
          the intersection of full-stack engineering and applied AI.
          I&apos;ve shipped production systems ranging from event-driven
          fraud detection pipelines to{" "}
          <TooltipTerm id="deep-learning">deep learning</TooltipTerm> models
          for medical imaging, and led teams to first-place finishes at
          national hackathons like{" "}
          <TooltipTerm id="nasa-space-apps">NASA Space Apps</TooltipTerm> and{" "}
          <TooltipTerm id="hack-60">Hack 60</TooltipTerm> by{" "}
          <TooltipTerm id="hcltech">HCLTech</TooltipTerm>.
        </p>
      </div>
      <TooltipManager containerRef={containerRef} content={TOOLTIP_CONTENT} />
    </div>
  );
};

export default About;
