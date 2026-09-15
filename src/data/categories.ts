export interface CategoryTheme {
  label: string;
  /** Main accent for tags, borders and highlights. */
  color: string;
  /** Soft translucent fill behind tags/cards. */
  soft: string;
  /** Gradient used for the project modal's themed surfaces. */
  gradient: string;
}

export const CATEGORIES = {
  "web-development": {
    label: "Web Development",
    color: "#4cc2ff",
    soft: "rgba(76, 194, 255, 0.14)",
    gradient: "linear-gradient(135deg, #4cc2ff, #1f6feb)",
  },
  "gen-ai": {
    label: "Gen AI",
    color: "#c2a4ff",
    soft: "rgba(194, 164, 255, 0.16)",
    gradient: "linear-gradient(135deg, #c2a4ff, #6a3bd6)",
  },
  "deep-learning": {
    label: "Deep Learning",
    color: "#ff7ac6",
    soft: "rgba(255, 122, 198, 0.14)",
    gradient: "linear-gradient(135deg, #ff7ac6, #a32e7c)",
  },
  "agentic-ai": {
    label: "Agentic AI",
    color: "#7ee787",
    soft: "rgba(126, 231, 135, 0.14)",
    gradient: "linear-gradient(135deg, #7ee787, #1f9c4d)",
  },
  "system-design": {
    label: "System Design",
    color: "#ffa657",
    soft: "rgba(255, 166, 87, 0.14)",
    gradient: "linear-gradient(135deg, #ffa657, #c2541b)",
  },
  "computer-networks": {
    label: "Computer Networks",
    color: "#79c0ff",
    soft: "rgba(121, 192, 255, 0.14)",
    gradient: "linear-gradient(135deg, #79c0ff, #2b5fb8)",
  },
  "cyber-security": {
    label: "Cyber Security",
    color: "#ff7b72",
    soft: "rgba(255, 123, 114, 0.14)",
    gradient: "linear-gradient(135deg, #ff7b72, #a52822)",
  },
} as const satisfies Record<string, CategoryTheme>;

export type CategoryKey = keyof typeof CATEGORIES;

export const CATEGORY_KEYS = Object.keys(CATEGORIES) as CategoryKey[];
