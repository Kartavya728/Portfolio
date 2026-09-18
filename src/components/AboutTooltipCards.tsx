/**
 * Content shown inside the InfoTooltip cards for the highlighted terms in
 * the About Me section. Facts (rankings, founding years, etc.) and images
 * are sourced from Wikipedia/Wikimedia Commons.
 */

export const IITMandiCard = () => (
  <div>
    <div className="info-tooltip-image-wrap">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2b/Top_View_Panorama_North_Campus_IIT_Mandi.jpg/500px-Top_View_Panorama_North_Campus_IIT_Mandi.jpg"
        alt="IIT Mandi campus"
      />
    </div>
    <p className="info-tooltip-title">IIT Mandi</p>
    <p className="info-tooltip-subtitle">Indian Institute of Technology, Mandi</p>
    <p className="info-tooltip-desc">
      A federally-run technical institute in the Kamand Valley, Himachal
      Pradesh, known for its research in AI, data science and human-centric
      computing.
    </p>
    <div className="info-tooltip-facts">
      <div className="info-tooltip-fact">
        <span>Founded</span>
        <span>2009</span>
      </div>
      <div className="info-tooltip-fact">
        <span>NIRF Engineering Rank</span>
        <span>#31 (2024)</span>
      </div>
      <div className="info-tooltip-fact">
        <span>Campus</span>
        <span>538 acres</span>
      </div>
    </div>
  </div>
);

export const DeepLearningCard = () => (
  <div>
    <p className="info-tooltip-title">Deep Learning</p>
    <p className="info-tooltip-subtitle">Subfield of Machine Learning</p>
    <p className="info-tooltip-desc">
      Uses multi-layered neural networks to learn representations directly
      from raw data, powering modern computer vision, NLP and generative
      AI systems.
    </p>
  </div>
);

export const NasaSpaceAppsCard = () => (
  <div>
    <div className="info-tooltip-image-wrap">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/a/a0/Space_Apps_Logo_White.png"
        alt="NASA Space Apps Challenge logo"
        style={{ objectFit: "contain", background: "#0f0c12" }}
      />
    </div>
    <p className="info-tooltip-title">NASA Space Apps Challenge</p>
    <p className="info-tooltip-subtitle">Global Hackathon, since 2012</p>
    <p className="info-tooltip-desc">
      The world's largest annual space hackathon, where teams use NASA's
      open data to build solutions for challenges on Earth and in space.
    </p>
    <div className="info-tooltip-facts">
      <div className="info-tooltip-fact">
        <span>Countries</span>
        <span>185+</span>
      </div>
      <div className="info-tooltip-fact">
        <span>Registrants</span>
        <span>370,000+</span>
      </div>
    </div>
  </div>
);

export const HCLTechCard = () => (
  <div>
    <div className="info-tooltip-image-wrap info-tooltip-logo-chip">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/e/e5/HCLTech-new-logo.svg"
        alt="HCLTech logo"
      />
    </div>
    <p className="info-tooltip-title">HCLTech</p>
    <p className="info-tooltip-subtitle">IT Services & Consulting, since 1991</p>
    <p className="info-tooltip-desc">
      An Indian multinational IT services and consulting company,
      headquartered in Noida, with 220,000+ employees worldwide.
    </p>
  </div>
);

export const Hack60Card = () => (
  <div>
    <p className="info-tooltip-title">Hack 60</p>
    <p className="info-tooltip-subtitle">HCLTech × IIT Mandi</p>
    <p className="info-tooltip-desc">
      A 60-hour hackathon jointly hosted by HCLTech and IIT Mandi,
      challenging teams to design and ship real-world AI systems against
      the clock.
    </p>
  </div>
);
