import aboutData from "../../public/images/about/data.json";

type TooltipFact = {
  label: string;
  value: string;
};

type TooltipCardData = {
  title: string;
  subtitle: string;
  description: string;
  image?: string;
  imageAlt?: string;
  imageContain?: boolean;
  logoChip?: boolean;
  facts?: TooltipFact[];
};

const tooltipData = aboutData.tooltips as Record<string, TooltipCardData>;

const TooltipCard = ({ id }: { id: string }) => {
  const item = tooltipData[id];
  return (
    <div>
      {item.image && (
        <div className={`info-tooltip-image-wrap ${item.logoChip ? "info-tooltip-logo-chip" : ""}`}>
          <img
            src={item.image}
            alt={item.imageAlt || item.title}
            style={item.imageContain ? { objectFit: "contain", background: "#0f0c12" } : undefined}
          />
        </div>
      )}
      <p className="info-tooltip-title">{item.title}</p>
      <p className="info-tooltip-subtitle">{item.subtitle}</p>
      <p className="info-tooltip-desc">{item.description}</p>
      {item.facts && (
        <div className="info-tooltip-facts">
          {item.facts.map((fact) => (
            <div className="info-tooltip-fact" key={fact.label}>
              <span>{fact.label}</span>
              <span>{fact.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const IITMandiCard = () => <TooltipCard id="iit-mandi" />;
export const DeepLearningCard = () => <TooltipCard id="deep-learning" />;
export const NasaSpaceAppsCard = () => <TooltipCard id="nasa-space-apps" />;
export const Hack60Card = () => <TooltipCard id="hack-60" />;
export const HCLTechCard = () => <TooltipCard id="hcltech" />;
