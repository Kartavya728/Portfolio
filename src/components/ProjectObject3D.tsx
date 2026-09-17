import { useEffect, useRef } from "react";
import * as THREE from "three";
import { CategoryKey } from "../data/categories";

/**
 * A small, interactive three.js object whose shape is chosen per project
 * category. It drifts on its own, tilts toward the pointer, and pulses /
 * speeds up on hover. Built directly on three.js (like the rest of this
 * project) rather than @react-three/fiber.
 */
function buildGeometry(category: CategoryKey): THREE.BufferGeometry {
  switch (category) {
    case "deep-learning":
      return new THREE.TorusKnotGeometry(0.75, 0.24, 140, 20);
    case "gen-ai":
      return new THREE.IcosahedronGeometry(1.05, 1);
    case "agentic-ai":
      return new THREE.OctahedronGeometry(1.15, 0);
    case "system-design":
      return new THREE.BoxGeometry(1.25, 1.25, 1.25, 3, 3, 3);
    case "computer-networks":
      return new THREE.SphereGeometry(1.05, 18, 12);
    case "cyber-security":
      return new THREE.DodecahedronGeometry(1.1, 0);
    case "web-development":
    default:
      return new THREE.TorusGeometry(0.85, 0.3, 20, 60);
  }
}

const ProjectObject3D = ({
  category,
  color,
  className,
}: {
  category: CategoryKey;
  color: string;
  className?: string;
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const rect = mount.getBoundingClientRect();
    const width = rect.width || 320;
    const height = rect.height || 220;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const themeColor = new THREE.Color(color);
    const geometry = buildGeometry(category);

    const solid = new THREE.Mesh(
      geometry,
      new THREE.MeshStandardMaterial({
        color: themeColor,
        roughness: 0.35,
        metalness: 0.5,
        transparent: true,
        opacity: 0.85,
      })
    );
    const wire = new THREE.LineSegments(
      new THREE.WireframeGeometry(geometry),
      new THREE.LineBasicMaterial({
        color: themeColor.clone().offsetHSL(0, 0, 0.25),
        transparent: true,
        opacity: 0.35,
      })
    );

    const group = new THREE.Group();
    group.add(solid);
    group.add(wire);
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xffffff, 0.75));
    const key = new THREE.PointLight(themeColor, 18, 20);
    key.position.set(2.2, 2.2, 3);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 6, 20);
    rim.position.set(-2.5, -1.5, 2);
    scene.add(rim);

    const pointer = { x: 0, y: 0 };
    let hovered = false;

    const onPointerMove = (e: MouseEvent) => {
      const r = mount.getBoundingClientRect();
      pointer.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.y = ((e.clientY - r.top) / r.height) * 2 - 1;
    };
    const onEnter = () => (hovered = true);
    const onLeave = () => {
      hovered = false;
      pointer.x = 0;
      pointer.y = 0;
    };
    mount.addEventListener("mousemove", onPointerMove);
    mount.addEventListener("mouseenter", onEnter);
    mount.addEventListener("mouseleave", onLeave);

    const clock = new THREE.Clock();
    let rafId: number;
    let scale = 1;

    const animate = () => {
      const dt = clock.getDelta();
      const spin = hovered ? 1.6 : 0.45;
      group.rotation.y += dt * spin;
      group.rotation.x += dt * spin * 0.35;

      // Tilt toward the pointer, and ease back to rest when it leaves.
      group.rotation.z += (pointer.x * 0.4 - group.rotation.z) * 0.06;
      group.position.y += (-pointer.y * 0.18 - group.position.y) * 0.06;

      const target = hovered ? 1.18 : 1;
      scale += (target - scale) * 0.08;
      group.scale.setScalar(scale);

      key.intensity = hovered ? 30 : 18;

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      const r = mount.getBoundingClientRect();
      if (!r.width || !r.height) return;
      camera.aspect = r.width / r.height;
      camera.updateProjectionMatrix();
      renderer.setSize(r.width, r.height);
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      mount.removeEventListener("mousemove", onPointerMove);
      mount.removeEventListener("mouseenter", onEnter);
      mount.removeEventListener("mouseleave", onLeave);
      geometry.dispose();
      solid.material.dispose();
      wire.geometry.dispose();
      (wire.material as THREE.Material).dispose();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [category, color]);

  return <div className={`project-object3d ${className || ""}`} ref={mountRef} />;
};

export default ProjectObject3D;
