import { CategoryKey } from "./categories";

export interface ProjectData {
  name: string;
  category: string;
  categoryKey: CategoryKey;
  description: string;
  tools: string;
  image: string;
  link: string;
  /** Optional demo video shown in the project modal. */
  youtube?: string;
}

export const projects: ProjectData[] = [
  {
    name: "Anatomy-Aware DoseFlow",
    category: "Medical Imaging / Deep Learning",
    categoryKey: "deep-learning",
    description:
      "A deep learning pipeline modeling CT dose distributions as a continuous flow, combining MedSAM segmentation with a ViT-Mamba backbone.",
    tools: "PyTorch, MedSAM, ViT, Mamba",
    image: "/dose.png",
    link: "https://github.com/Kartavya728",
  },
  {
    name: "FLOW — Fraud & Loan Optimization Workbench",
    category: "Distributed ML Systems",
    categoryKey: "system-design",
    description:
      "A production-grade streaming platform for real-time fraud detection and loan targeting, built on an event-driven architecture.",
    tools: "Pathway, NATS JetStream, Redis, FastAPI, React",
    image: "/flow.png",
    link: "https://github.com/Kartavya728/FLOW-InterIIT14-TechMeet",
  },
  {
    name: "LunaDEM",
    category: "Scientific Computing",
    categoryKey: "deep-learning",
    description:
      "A discrete element method simulator for lunar regolith, modeling grain-scale mechanics for rover-terrain interaction studies.",
    tools: "Python, NumPy, SciPy, OpenCV, Open3D",
    image: "/luna.png",
    link: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    name: "LokMitra AI",
    category: "Voice AI Platform",
    categoryKey: "gen-ai",
    description:
      "A voice-first AI assistant for vernacular users, pairing Gemini-powered RAG with a Django/Next.js stack.",
    tools: "Django, Next.js, Gemini API, RAG, PostgreSQL",
    image: "/lok.png",
    link: "https://github.com/Kartavya728/LokMitra-AI",
  },
  {
    name: "Smart-Scribes",
    category: "Multimodal Lecture Intelligence",
    categoryKey: "gen-ai",
    description:
      "A multimodal lecture assistant that transcribes, summarizes, and answers questions over recorded lectures — won 1st overall at iHub.",
    tools: "RAG, Whisper, Next.js",
    image: "/ss.png",
    link: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    name: "AutoReach AI",
    category: "Agentic Workflow Automation",
    categoryKey: "agentic-ai",
    description:
      "An agentic workflow system that plans and executes multi-step outreach tasks, built with LangGraph for tool use and retries.",
    tools: "LLM Agents, LangGraph",
    image: "/auto.png",
    link: "https://github.com/Kartavya728/AutoReach-AI",
  },
  {
    name: "Dual-System Voice Cloning & Anti-Spoofing",
    category: "Audio Deep Learning / Security",
    categoryKey: "cyber-security",
    description:
      "A dual-system framework pairing neural voice cloning with real-time deepfake and anti-spoofing detection — won Hack 60's DL track.",
    tools: "PyTorch, Speaker Verification",
    image: "/aud.png",
    link: "https://github.com/Kartavya728/Dual-System-Framework-for-Neural-Voice-Cloning-and-Anti-Spoofing-Detection",
  },
  {
    name: "Vision Drive",
    category: "Autonomous Driving Perception",
    categoryKey: "deep-learning",
    description:
      "A perception stack for autonomous driving built on YOLO and OpenCV, handling real-time object and lane detection.",
    tools: "YOLO, OpenCV",
    image: "/vd.png",
    link: "https://github.com/Kartavya728/Vision-Drive",
  },
];

/** Fallback used when a project's README has no video of its own. */
export const DEFAULT_PROJECT_VIDEO = "https://youtu.be/Vj7MniIUqZA";
