import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import setCharacter from "./utils/character";
import setLighting from "./utils/lighting";
import { useLoading } from "../../context/LoadingProvider";
import handleResize from "./utils/resizeUtils";
import {
  handleMouseMove,
  handleTouchEnd,
  handleHeadRotation,
  handleTouchMove,
} from "./utils/mouseUtils";
import setAnimations from "./utils/animationUtils";
import { setProgress } from "../Loading";

const Scene = () => {
  const canvasDiv = useRef<HTMLDivElement | null>(null);
  const hoverDivRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef(new THREE.Scene());
  const { setLoading } = useLoading();

  const [character, setChar] = useState<THREE.Object3D | null>(null);
  useEffect(() => {
    const mount = canvasDiv.current;
    if (!mount) return;

    const rect = mount.getBoundingClientRect();
    const container = {
      width: rect.width || window.innerWidth,
      height: rect.height || window.innerHeight,
    };
    const aspect = container.width / container.height;
    const scene = sceneRef.current;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
    } catch (err) {
      console.warn("Character scene: WebGL unavailable, skipping 3D character.", err);
      setLoading(100);
      return;
    }

    renderer.setSize(container.width, container.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(14.5, aspect, 0.1, 1000);
    camera.position.z = 10;
    camera.position.set(0, 13.1, 24.7);
    camera.zoom = 1.1;
    camera.updateProjectionMatrix();

    let disposed = false;
    let rafId = 0;
    let resizeCharacter: THREE.Object3D | null = null;
    let headBone: THREE.Object3D | null = null;
    let screenLight: THREE.Object3D | null = null;
    let mixer: THREE.AnimationMixer | null = null;

    const clock = new THREE.Clock();
    const light = setLighting(scene);
    const progress = setProgress((value) => setLoading(value));
    const { loadCharacter } = setCharacter(renderer, scene, camera);

    let mouse = { x: 0, y: 0 };
    let interpolation = { x: 0.1, y: 0.2 };
    let debounce: ReturnType<typeof setTimeout> | undefined;
    let touchMoveTarget: HTMLElement | null = null;

    const onResize = () => {
      if (resizeCharacter) {
        handleResize(renderer, camera, canvasDiv, resizeCharacter);
      }
    };

    const onMouseMove = (event: MouseEvent) => {
      handleMouseMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchMove = (event: TouchEvent) => {
      handleTouchMove(event, (x, y) => (mouse = { x, y }));
    };

    const onTouchStart = (event: TouchEvent) => {
      touchMoveTarget = event.target as HTMLElement;
      debounce = setTimeout(() => {
        touchMoveTarget?.addEventListener("touchmove", onTouchMove);
      }, 200);
    };

    const onTouchEnd = () => {
      touchMoveTarget?.removeEventListener("touchmove", onTouchMove);
      touchMoveTarget = null;
      handleTouchEnd((x, y, interpolationX, interpolationY) => {
        mouse = { x, y };
        interpolation = { x: interpolationX, y: interpolationY };
      });
    };

    const landingDiv = document.getElementById("landingDiv");
    document.addEventListener("mousemove", onMouseMove);
    landingDiv?.addEventListener("touchstart", onTouchStart);
    landingDiv?.addEventListener("touchend", onTouchEnd);

    loadCharacter()
      .then((gltf) => {
        if (!gltf || disposed) return;

        const animations = setAnimations(gltf);
        if (hoverDivRef.current) animations.hover(gltf, hoverDivRef.current);
        mixer = animations.mixer;
        const loadedCharacter = gltf.scene;
        resizeCharacter = loadedCharacter;
        setChar(loadedCharacter);
        scene.add(loadedCharacter);
        headBone = loadedCharacter.getObjectByName("spine006") || null;
        screenLight = loadedCharacter.getObjectByName("screenlight") || null;
        window.addEventListener("resize", onResize);

        progress.loaded().then(() => {
          setTimeout(() => {
            if (disposed) return;
            light.turnOnLights();
            animations.startIntro();
          }, 2500);
        });
      })
      .catch((err) => {
        console.warn("Character scene: failed to load character.", err);
        progress.clear();
      });

    const animate = () => {
      if (disposed) return;
      rafId = requestAnimationFrame(animate);
      if (headBone) {
        handleHeadRotation(
          headBone,
          mouse.x,
          mouse.y,
          interpolation.x,
          interpolation.y,
          THREE.MathUtils.lerp
        );
        light.setPointLight(screenLight);
      }
      const delta = clock.getDelta();
      if (mixer) {
        mixer.update(delta);
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      disposed = true;
      clearTimeout(debounce);
      cancelAnimationFrame(rafId);
      progress.cancel();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("mousemove", onMouseMove);
      landingDiv?.removeEventListener("touchstart", onTouchStart);
      landingDiv?.removeEventListener("touchend", onTouchEnd);
      touchMoveTarget?.removeEventListener("touchmove", onTouchMove);
      scene.clear();
      renderer.dispose();
      renderer.forceContextLoss();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      <div className="character-container">
        <div className="character-model" ref={canvasDiv}>
          <div className="character-rim"></div>
          <div className="character-hover" ref={hoverDivRef}></div>
        </div>
      </div>
    </>
  );
};

export default Scene;
