import "./styles/About.css";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-me">
        <h3 className="title">About Me</h3>
        <p className="para">
          I'm a Data Science undergrad at IIT Mandi, building
          at the intersection of full-stack engineering and applied AI. I've
          shipped production systems ranging from event-driven fraud
          detection pipelines to deep learning models for medical imaging,
          and led teams to first-place finishes at national hackathons like
          NASA Space Apps and Hack 60 by HCLTech.
        </p>
      </div>
    </div>
  );
};

export default About;
