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
      "A deep learning pipeline that models CT dose distributions as a continuous flow between low and target doses. Combines MedSAM segmentation with a ViT-Mamba backbone to keep predictions anatomically consistent.",
    tools: "PyTorch, MedSAM, ViT, Mamba",
    image: "/dose.png",
    link: "https://github.com/Kartavya728",
  },
  {
    name: "FLOW — Fraud & Loan Optimization Workbench",
    category: "Distributed ML Systems",
    categoryKey: "system-design",
    description:
      "A production-grade streaming platform for real-time fraud detection and intelligent loan targeting in banking. Built on an event-driven architecture with live model scoring and low-latency caching.",
    tools: "Pathway, NATS JetStream, Redis, FastAPI, React",
    image: "/flow.png",
    link: "https://github.com/Kartavya728/FLOW-InterIIT14-TechMeet",
  },
  {
    name: "LunaDEM",
    category: "Scientific Computing",
    categoryKey: "deep-learning",
    description:
      "A discrete element method simulator for lunar regolith, modeling grain-scale mechanics for rover-terrain interaction studies. Includes a custom physics core with 3D visualization for inspecting particle behavior.",
    tools: "Python, NumPy, SciPy, OpenCV, Open3D",
    image: "/luna.png",
    link: "https://github.com/Kartavya728/LunaDEM",
  },
  {
    name: "LokMitra AI",
    category: "Voice AI Platform",
    categoryKey: "gen-ai",
    description:
      "A voice-first AI assistant for vernacular users, pairing Gemini-powered RAG with a Django/Next.js stack. Lets users ask questions and get grounded answers entirely by voice in their own language.",
    tools: "Django, Next.js, Gemini API, RAG, PostgreSQL",
    image: "/lok.png",
    link: "https://github.com/Kartavya728/LokMitra-AI",
  },
  {
    name: "Smart-Scribes",
    category: "Multimodal Lecture Intelligence",
    categoryKey: "gen-ai",
    description:
      "A multimodal lecture assistant that transcribes, summarizes, and answers questions over recorded lectures. Won 1st place overall among 1,600+ teams at the iHub Multimodal AI Hackathon.",
    tools: "RAG, Whisper, Next.js",
    image: "/ss.png",
    link: "https://github.com/Kartavya728/Smart-Scribes",
  },
  {
    name: "AutoReach AI",
    category: "Agentic Workflow Automation",
    categoryKey: "agentic-ai",
    description:
      "An agentic workflow system that plans and executes multi-step outreach tasks using LLM agents. Built with LangGraph to coordinate tool use, retries, and human-in-the-loop checkpoints.",
    tools: "LLM Agents, LangGraph",
    image: "/auto.png",
    link: "https://github.com/Kartavya728/AutoReach-AI",
  },
  {
    name: "Dual-System Voice Cloning & Anti-Spoofing",
    category: "Audio Deep Learning / Security",
    categoryKey: "cyber-security",
    description:
      "A dual-system framework pairing neural voice cloning with real-time deepfake and audio anti-spoofing detection. Won the Deep Learning track at Hack 60 (HCLTech x IIT Mandi).",
    tools: "PyTorch, Speaker Verification",
    image: "/aud.png",
    link: "https://github.com/Kartavya728/Dual-System-Framework-for-Neural-Voice-Cloning-and-Anti-Spoofing-Detection",
  },
  {
    name: "Vision Drive",
    category: "Autonomous Driving Perception",
    categoryKey: "deep-learning",
    description:
      "A perception stack for autonomous driving built on YOLO and OpenCV, handling real-time object detection and lane/obstacle awareness from live video feeds.",
    tools: "YOLO, OpenCV",
    image: "/vd.png",
    link: "https://github.com/Kartavya728/Vision-Drive",
  },
];

/** Fallback used when a project's README has no video of its own. */
export const DEFAULT_PROJECT_VIDEO = "https://youtu.be/Vj7MniIUqZA";
