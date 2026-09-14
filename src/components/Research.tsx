import "./styles/Research.css";

const Research = () => {
  return (
    <div className="research-section section-container" id="research">
      <h2>
        My <span>Research</span>
      </h2>
      <p className="research-intro">
        Applied research at the intersection of deep learning and medical
        imaging, with a broader interest in generative models and diffusion
        / flow-based methods for scientific data.
      </p>
      <div className="research-card">
        <div className="research-image">
          <img src="/dose.png" alt="Anatomy-Aware DoseFlow" />
        </div>
        <div className="research-content">
          <span className="research-tag">Feb 2026</span>
          <h3>Anatomy-Aware DoseFlow</h3>
          <p className="research-subtitle">
            Dose-Conditioned Flow Matching for Low-Dose CT Reconstruction
          </p>
          <p>
            A three-stage deep learning pipeline that reconstructs CT images
            from arbitrary dose levels (5%–100%), built around a
            dose-conditioned flow-trajectory model integrating MedSAM and
            ViT encoders with Mamba blocks, trained with four complementary
            loss terms.
          </p>
          <ul className="research-results">
            <li>
              <strong>48.15 dB</strong> PSNR &middot; <strong>0.9991</strong>{" "}
              SSIM on held-out CT slices
            </li>
            <li>Zero-shot generalization across three unseen anatomical regions</li>
            <li>Evaluated on 10,000+ CT slices</li>
          </ul>
          <div className="research-stack">
            {["PyTorch", "MedSAM", "ViT", "Mamba"].map((t) => (
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
