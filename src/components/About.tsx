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
import aboutData from "../../public/images/about/data.json";

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
          {aboutData.bodyParts[0]}
          <TooltipTerm id="iit-mandi">{aboutData.terms.iitMandi}</TooltipTerm>
          {aboutData.bodyParts[1]}
          <TooltipTerm id="deep-learning">{aboutData.terms.deepLearning}</TooltipTerm>
          {aboutData.bodyParts[2]}
          <TooltipTerm id="nasa-space-apps">{aboutData.terms.nasaSpaceApps}</TooltipTerm>
          {aboutData.bodyParts[3]}
          <TooltipTerm id="hack-60">{aboutData.terms.hack60}</TooltipTerm>
          {aboutData.bodyParts[4]}
          <TooltipTerm id="hcltech">{aboutData.terms.hcltech}</TooltipTerm>
          {aboutData.bodyParts[5]}
        </p>
      </div>
      <TooltipManager containerRef={containerRef} content={TOOLTIP_CONTENT} />
    </div>
  );
};

export default About;
