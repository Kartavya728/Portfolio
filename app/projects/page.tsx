"use client";

import dynamic from "next/dynamic";

const AllProjects = dynamic(() => import("../../src/components/AllProjects"), {
  ssr: false,
});

export default function ProjectsPage() {
  return <AllProjects />;
}
