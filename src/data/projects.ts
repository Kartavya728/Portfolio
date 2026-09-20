import { CategoryKey } from "./categories";
import contributionData from "../../public/images/my-contributions/data.json";
import contributionLinks from "../../public/images/my-contributions/links.json";

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

const projectLinksById = contributionLinks.projects as Record<
  string,
  { github?: string; youtube?: string; linkedInPost?: string; deployed?: string }
>;

export const projects: ProjectData[] = contributionData.projects.map((project) => {
  const links = projectLinksById[project.id] || {};
  return {
    ...project,
    categoryKey: project.categoryKey as CategoryKey,
    link: links.github || "",
    youtube: links.youtube || undefined,
    linkedinPost: links.linkedInPost || undefined,
    deployedUrl: links.deployed || undefined,
  };
});

/** Fallback used when a project's README has no video of its own. */
export const DEFAULT_PROJECT_VIDEO = contributionLinks.defaults.projectVideo;

/** Default LinkedIn post link, used when a project has none of its own. */
export const DEFAULT_LINKEDIN_POST = contributionLinks.defaults.linkedInPost;
