const AWARD_SET = [
  {
    title: "1st Place (Deepfake Track) – Hack 60 by HCLTech",
    description: "Designed VoiceGuard, an anti-spoofing AI model.",
    category: "National Hackathon",
    icon: "🎙️",
    logo: "/data/achievements_data/achive-3.png",
    link: "#",
    color: "from-red-500 to-orange-600",
  },
  {
    title: "1st Place – NASA Space Apps Challenge (Chandigarh)",
    description: "Authored Astrogenesis, an LLM research copilot.",
    category: "International Competition",
    icon: "🚀",
    logo: "/data/achievements_data/achive-1.png",
    link: "https://www.spaceappschallenge.org/",
    color: "from-blue-500 to-cyan-600",
  },
  {
    title: "1st Place Overall (1,600+ teams) – iHub Multimodal Hackathon '25",
    description: "Led the 5-member Smarts Scribe team to the top spot.",
    category: "College Hackathon",
    icon: "🏆",
    logo: "/data/achievements_data/achive-2.png",
    link: "#",
    color: "from-purple-500 to-pink-600",
  },
  {
    title: "Runner-Up (Autonomous Agents) – FrostHack IIT Mandi",
    description: "Spearheaded AutoReach, an automated workflow agent.",
    category: "Intra-IIT Hackathon",
    icon: "🤖",
    logo: "/data/achievements_data/achive-4.png",
    link: "#",
    color: "from-yellow-500 to-orange-600",
  },
];

export const awards = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  ...AWARD_SET[i % AWARD_SET.length],
  year: 2025,
}));
