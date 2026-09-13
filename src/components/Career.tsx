import "./styles/Career.css";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <h2>
          My career <span>&</span>
          <br /> experience
        </h2>
        <div className="career-info">
          <div className="career-timeline">
            <div className="career-dot"></div>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Full-Stack Developer</h4>
                <h5>IIT Mandi Finance Department</h5>
              </div>
              <h3>2025</h3>
            </div>
            <p>
              Owned the SDLC for a secure, role-based finance platform built
              with Next.js, TypeScript, Supabase and NextAuth.js with RBAC.
              Shipped reliable approval workflows for billing, auditing and
              procurement, serving 50+ staff and ₹10+ lakh in transactions.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>Data Analytics Intern</h4>
                <h5>Nomura Real Estate Holdings, Inc. — Tokyo, Japan</h5>
              </div>
              <h3>2026</h3>
            </div>
            <p>
              Engineered scalable analytics dashboards over 10,000+ Microsoft
              Viva Insights and GitHub Copilot logs for AI adoption.
              Conducted statistical analysis and hypothesis testing on work
              patterns, delivering 3 company-wide AI adoption strategies.
            </p>
          </div>
          <div className="career-info-box">
            <div className="career-info-in">
              <div className="career-role">
                <h4>B.Tech in Data Science</h4>
                <h5>Indian Institute of Technology, Mandi</h5>
              </div>
              <h3>NOW</h3>
            </div>
            <p>
              Pursuing a B.Tech in Data Science (CGPA 9.27/10.0), with
              coursework spanning Design of Algorithms, Machine Learning,
              Deep Learning, Computer Organization and Matrix Computation
              for DS.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
