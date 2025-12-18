"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

// Define section IDs that correspond to DOM element IDs
export type SectionId = 
  | "hero"
  | "about"
  | "skills"
  | "expertise"
  | "projects"
  | "achievements"
  | "certifications"
  | "leadership"
  | "contact";

// Define theme configuration for each section
export interface SectionTheme {
  id: SectionId;
  backgroundColor: string;
  textColor: string;
  accentColor: string;
}

// Define themes for each section with vibrant, distinct colors
export const SECTION_THEMES: Record<SectionId, SectionTheme> = {
  hero: {
    id: "hero",
    backgroundColor: "#07001C", // Deep purple-black
    textColor: "#FFFFFF",
    accentColor: "#8B5CF6",
  },
  about: {
    id: "about",
    backgroundColor: "#00094cff", // Dark navy
    textColor: "#FFFFFF",
    accentColor: "#6366F1",
  },
  skills: {
    id: "skills",
    backgroundColor: "#000000ff", // Slate dark
    textColor: "#E2E8F0",
    accentColor: "#3B82F6",
  },
  expertise: {
    id: "expertise",
    backgroundColor: "#000000ff", // Indigo dark
    textColor: "#E0E7FF",
    accentColor: "#818CF8",
  },
  projects: {
    id: "projects",
    backgroundColor: "#08246fff", // Gray dark
    textColor: "#5400c3ff",
    accentColor: "#3400a4ff",
  },
  achievements: {
    id: "achievements",
    backgroundColor: "#000000ff", // Purple-gray
    textColor: "#F5F3FF",
    accentColor: "#A78BFA",
  },
  certifications: {
    id: "certifications",
    backgroundColor: "#07172cff", // Deep blue
    textColor: "#DBEAFE",
    accentColor: "#60A5FA",
  },
  leadership: {
    id: "leadership",
    backgroundColor: "#051125ff", // Cool gray
    textColor: "#F9FAFB",
    accentColor: "#2a00a9ff",
  },
  contact: {
    id: "contact",
    backgroundColor: "#000000ff", // Dark gray
    textColor: "#F3F4F6",
    accentColor: "#8B5CF6",
  },
};

interface ThemeContextType {
  currentSection: SectionId;
  currentTheme: SectionTheme;
  setCurrentSection: (section: SectionId) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentSection, setCurrentSection] = useState<SectionId>("hero");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = SECTION_THEMES[currentSection];

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{ currentSection, currentTheme, setCurrentSection }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    // Return default theme during SSR/hydration
    return {
      currentSection: "hero" as const,
      currentTheme: SECTION_THEMES.hero,
      setCurrentSection: () => {},
    };
  }
  return context;
};
