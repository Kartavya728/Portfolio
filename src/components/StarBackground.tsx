import { useEffect, useRef } from "react";
import * as THREE from "three";
import "./styles/StarBackground.css";

// Uniformly distributes `count` points inside a sphere of the given radius
// (rejection sampling), replacing the `maath/random` helper the old-ui
// version used via @react-three/drei - avoided here since this project
// drives its three.js scenes directly rather than through
// @react-three/fiber/drei (see src/components/Character/Scene.tsx).
function randomPointsInSphere(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    let lenSq = 0;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
      lenSq = x * x + y * y + z * z;
    } while (lenSq > 1 || lenSq === 0);
    positions[i * 3] = x * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = z * radius;
  }
  return positions;
}

const StarBackground = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 1;

    // WebGL context creation can fail for reasons outside this component's
    // control (hardware acceleration disabled, too many contexts already
    // open elsewhere on the page, a flaky GPU driver) - since this is a
    // purely decorative background layer, that failure should just mean
    // "no star field" rather than an unhandled exception that takes down
    // the whole app.
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch (err) {
      console.warn("StarBackground: WebGL unavailable, skipping star field.", err);
      return;
    }
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(randomPointsInSphere(5000, 1.2), 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xc2a4ff,
      size: 0.0006,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
    });

    const points = new THREE.Points(geometry, material);
    const group = new THREE.Group();
    group.rotation.z = Math.PI / 4;
    group.add(points);
    scene.add(group);

    const clock = new THREE.Clock();
    let rafId: number;
    const animate = () => {
      const delta = clock.getDelta();
      points.rotation.x -= delta / 10;
      points.rotation.y -= delta / 15;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="star-background" aria-hidden="true" />;
};

export default StarBackground;
