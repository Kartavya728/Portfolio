import { CategoryKey } from "./categories";

export interface ProjectData {
  name: string;
  category: string;
  categoryKey: CategoryKey;
  description: string;
  /** What the project sets out to solve. */
  problem: string;
  /** How it solves that problem. */
  solution: string;
  /** What makes this approach distinct. */
  usp: string;
  /** Measured / quantitative outcomes. */
  results: string;
  tools: string;
  image: string;
  link: string;
  /** Optional demo video shown in the project modal. */
  youtube?: string;
  /** Optional LinkedIn post about the project. */
  linkedinPost?: string;
  /** Optional live deployment link. */
  deployedUrl?: string;
}

export const projects: ProjectData[] = [
  {
    name: "Anatomy-Aware DoseFlow",
    category: "Medical Imaging / Deep Learning",
    categoryKey: "deep-learning",
    description:
      "A deep learning pipeline modeling CT dose distributions as a continuous flow, combining MedSAM segmentation with a ViT-Mamba backbone.",
    problem:
      "Reconstructing a full-dose CT scan from a low-dose acquisition without losing anatomical detail, across arbitrary dose levels (5%-100%), not just one fixed reduction ratio.",
    solution:
      "A three-stage pipeline that segments anatomy with MedSAM, then learns a dose-conditioned flow trajectory (ViT + Mamba encoders) between the low- and target-dose image manifolds.",
    usp:
      "Modeling dose reduction as a continuous flow field rather than a fixed input→output mapping lets one model generalize across dose levels and unseen anatomical regions.",
    results: "48.15 dB PSNR and 0.9991 SSIM, with zero-shot generalization across three unseen anatomical regions.",
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
    problem:
      "Banking fraud detection and loan targeting both need model decisions on live transaction streams, but most pipelines are batch-oriented and too slow to act before a transaction settles.",
    solution:
      "An event-driven architecture on Pathway and NATS JetStream, streaming transactions through online-learning models (Hoeffding Trees, Online GMM) with Redis-backed low-latency caching.",
    usp:
      "Online learning models update continuously from live feedback instead of periodic retraining, so the system adapts to new fraud patterns as they emerge.",
    results: "Sub-5ms scoring latency and an 88% F1-score, with Prometheus/Grafana observability built in from day one.",
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
    problem:
      "Predicting how a rover's wheels will interact with lunar regolith requires grain-scale physics simulation, which most terrain models skip in favor of coarse friction approximations.",
    solution:
      "A custom discrete element method (DEM) physics core simulating individual regolith grains, paired with a 3D visualizer for inspecting particle behavior under rover loads.",
    usp:
      "Simulating at the grain level (not a bulk-friction approximation) captures compaction and slippage effects that matter for real rover mobility planning.",
    results: "A working lightweight simulator with 3D visualization for inspecting particle-level terrain response.",
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
    problem:
      "Most AI assistants assume text input and English fluency, locking out vernacular-speaking users who'd rather just ask a question out loud in their own language.",
    solution:
      "A voice-first assistant built on Django and Next.js, using Gemini-powered RAG to ground spoken questions in retrieved context and reply back entirely by voice.",
    usp:
      "The entire interaction loop stays voice-to-voice in the user's own language, removing the literacy and language barriers text-first assistants impose.",
    results: "A working end-to-end voice Q&A pipeline from spoken query to grounded, spoken answer.",
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
    problem:
      "Recorded lectures are hard to search or revise from — students want summaries and answers, not a two-hour video they have to scrub through.",
    solution:
      "A multimodal pipeline (video + audio + slides) using Whisper transcription and RAG to power lecture summarization and Q&A, wrapped in a Next.js dashboard.",
    usp:
      "Combining video, audio and slide content in one retrieval index gives more grounded answers than transcript-only lecture tools.",
    results: "1st place overall among 1,600+ teams at the iHub Multimodal AI Hackathon, leading a 5-member team.",
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
    problem:
      "Multi-step outreach workflows (research a lead, draft a message, follow up) usually need a human stitching tools together at every step.",
    solution:
      "An agentic system built on LangGraph that plans a task graph, calls tools autonomously, retries on failure, and hands off to a human only at defined checkpoints.",
    usp:
      "Explicit human-in-the-loop checkpoints keep the automation trustworthy for outreach, instead of a fully autonomous agent making irreversible calls.",
    results: "A working agent pipeline coordinating multi-step outreach tasks end-to-end with tool retries.",
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
    problem:
      "Voice cloning tech is advancing fast, but the anti-spoofing systems meant to catch cloned/deepfake audio are usually built and evaluated separately from the cloning models they're meant to defend against.",
    solution:
      "A dual-system framework that pairs a neural voice cloning model with a real-time speaker-verification-based anti-spoofing detector, evaluated against each other directly.",
    usp:
      "Building and testing the attacker (cloning) and defender (anti-spoofing) systems together surfaces weaknesses that isolated evaluation would miss.",
    results: "Won the Deep Learning track at Hack 60 (HCLTech x IIT Mandi) with a real-time detection system.",
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
    problem:
      "Autonomous driving perception needs to detect objects, lanes and obstacles in real time from a live video feed, with no room for frame-by-frame latency.",
    solution:
      "A YOLO-based perception stack combined with OpenCV lane-detection heuristics, processing live video feeds frame-by-frame for object and lane awareness.",
    usp:
      "Pairing a learned object detector with classical CV lane heuristics keeps the stack fast enough for real-time inference without sacrificing lane accuracy.",
    results: "A working real-time perception stack detecting objects and lane boundaries from live video.",
    tools: "YOLO, OpenCV",
    image: "/vd.png",
    link: "https://github.com/Kartavya728/Vision-Drive",
  },
];

/** Fallback used when a project's README has no video of its own. */
export const DEFAULT_PROJECT_VIDEO = "https://youtu.be/Vj7MniIUqZA";

/** Default LinkedIn post link, used when a project has none of its own. */
export const DEFAULT_LINKEDIN_POST = "https://www.linkedin.com/in/kartavya28/";
