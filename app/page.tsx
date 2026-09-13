"use client";

import dynamic from "next/dynamic";

// The entire app is a client-only, canvas/GSAP-driven single page experience
// (same as it was under Vite, where everything rendered purely client-side).
// Loading it via a client-only dynamic import keeps that behavior identical
// under Next.js and avoids any server-render pass touching window/document.
const App = dynamic(() => import("../src/App"), { ssr: false });

export default function Page() {
  return <App />;
}
