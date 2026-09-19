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

// Small decorative planets kept to the left/right edges of the viewport
// (never centre-stage, so they never compete with page content) plus one
// larger wireframe "globe" recoloured to the site's purple accent. All of
// them live in this same fixed, pointer-events:none canvas as the star
// field, so they never take up their own layout space and never touch the
// GSAP ScrollSmoother/ScrollTrigger pinned-section code at all.
const PLANETS = [
  { x: -3.4, y: 0.6, z: -2.4, radius: 0.34, color: 0xc2a4ff, detail: 1 },
  { x: 3.6, y: -0.8, z: -3, radius: 0.26, color: 0x8a6fd8, detail: 0 },
  { x: -2.8, y: -1.6, z: -3.6, radius: 0.2, color: 0xffffff, detail: 0 },
  { x: 3.1, y: 1.4, z: -2.8, radius: 0.18, color: 0xc2a4ff, detail: 1 },
];

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

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
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

    // Decorative low-poly planets, hugging the left/right edges.
    const planetMeshes = PLANETS.map((p) => {
      const geo = new THREE.IcosahedronGeometry(p.radius, p.detail);
      const mat = new THREE.MeshBasicMaterial({
        color: p.color,
        wireframe: true,
        transparent: true,
        opacity: 0.55,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(p.x, p.y, p.z);
      scene.add(mesh);
      return { mesh, geo, mat, spin: 0.05 + Math.random() * 0.08 };
    });

    // One larger recoloured "globe" - latitude/longitude wireframe sphere
    // (the aceternity globe-demo technique, ported to a plain three.js
    // sphere rather than the Tailwind/cobe-based original), tinted to the
    // site's purple accent and tucked into a back corner.
    const globeGeo = new THREE.SphereGeometry(0.6, 24, 18);
    const globeMat = new THREE.MeshBasicMaterial({
      color: 0xc2a4ff,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(-3.6, 1.4, -4.2);
    scene.add(globe);

    // Cursor tracked in normalised device coords purely to drive a gentle
    // parallax/glow reaction - StarBackground stays pointer-events:none so
    // this never intercepts clicks meant for the page underneath.
    const pointerNdc = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      pointerNdc.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointerNdc.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const globeScreenPos = new THREE.Vector3();
    const globeTargetScale = new THREE.Vector3(1, 1, 1);

    const clock = new THREE.Clock();
    let rafId: number;
    const animate = () => {
      const delta = clock.getDelta();
      points.rotation.x -= delta / 10;
      points.rotation.y -= delta / 15;

      for (const p of planetMeshes) {
        p.mesh.rotation.x += delta * p.spin;
        p.mesh.rotation.y += delta * p.spin * 1.4;
      }

      globe.rotation.y += delta * 0.12;
      globeScreenPos.copy(globe.position).project(camera);
      const distToPointer = Math.hypot(
        globeScreenPos.x - pointerNdc.x,
        globeScreenPos.y - pointerNdc.y
      );
      const proximity = Math.max(0, 1 - distToPointer / 0.6);
      globeMat.opacity = 0.35 + proximity * 0.35;
      const targetScale = 1 + proximity * 0.08;
      globeTargetScale.set(targetScale, targetScale, targetScale);
      globe.scale.lerp(globeTargetScale, 0.08);

      // Whole scene drifts a couple of px toward the cursor - subtle
      // background parallax, well within the group's own rotation so it
      // never reads as scroll-jacking.
      group.rotation.z += (Math.PI / 4 + pointerNdc.x * 0.05 - group.rotation.z) * 0.02;

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
      window.removeEventListener("pointermove", handlePointerMove);
      geometry.dispose();
      material.dispose();
      globeGeo.dispose();
      globeMat.dispose();
      planetMeshes.forEach((p) => {
        p.geo.dispose();
        p.mat.dispose();
      });
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="star-background" aria-hidden="true" />;
};

export default StarBackground;
