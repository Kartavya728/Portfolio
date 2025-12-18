// src/components/main/StarBackground.tsx (or wherever your StarsCanvas is)
"use client";

import React, { useState, useRef, Suspense, useEffect } from "react"; // Added useEffect
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial, Preload } from "@react-three/drei";
import { useTheme } from "@/context/ThemeContext";
// @ts-ignore
import * as random from "maath/random/dist/maath-random.esm";

const StarBackground = (props: any) => {
  const ref: any = useRef();
  const { theme } = useTheme();

  // Ensure sphere is only generated once
  const [sphere] = useState(() => {
    console.log("Generating sphere for stars"); // For debugging generation
    return random.inSphere(new Float32Array(5000), { radius: 1.2 });
  });

  // Determine color based on theme
  const particleColor = theme === "light" ? "#a855f7" : "#FFFFFF"; // Purple for light, white for dark

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  // Log if the component renders, to check for issues
  useEffect(() => {
    console.log("StarBackground component rendered/updated.");
  }, []);

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled {...props}>
        <PointMaterial
          transparent
          color={particleColor}
          size={0.002}
          sizeAttenuation={true}
          depthWrite={false} // Corrected typo: depthWrite
        />
      </Points>
    </group>
  );
};

const StarsCanvas = () => {
  useEffect(() => {
    console.log("StarsCanvas component rendered."); // For debugging
  }, []);

  return (
    // This outermost div will cover the screen and be visually on top.
    // CRITICAL: pointer-events: none allows clicks to pass through.
    <div
      className="w-full h-full fixed inset-0 z-[999]" // High z-index, full coverage
      style={{ pointerEvents: "none" }} // Apply pointer-events:none via inline style for high specificity
      aria-hidden="true" // Decorative element
    >
      <Canvas
        camera={{ position: [0, 0, 1] }}
        // The style prop on R3F <Canvas> applies to the div it creates.
        // We also want this internal div to ignore pointer events.
        style={{ pointerEvents: "none" }}
      >
        <Suspense fallback={null}>
          <StarBackground />
        </Suspense>
        <Preload all />
      </Canvas>
    </div>
  );
};

export default StarsCanvas;
