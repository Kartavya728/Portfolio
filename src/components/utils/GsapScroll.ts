import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function setCharTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  let intensity: number = 0;
  setInterval(() => {
    intensity = Math.random();
  }, 200);
  const tl1 = gsap.timeline({
    scrollTrigger: {
      trigger: ".landing-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl2 = gsap.timeline({
    scrollTrigger: {
      trigger: ".about-section",
      start: "center 55%",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  const tl3 = gsap.timeline({
    scrollTrigger: {
      trigger: ".whatIDO",
      start: "top top",
      end: "bottom top",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  let screenLight: any, monitor: any;
  character?.children.forEach((object: any) => {
    if (object.name === "Plane004") {
      object.children.forEach((child: any) => {
        child.material.transparent = true;
        child.material.opacity = 0;
        if (child.material.name === "Material.027") {
          monitor = child;
          child.material.color.set("#FFFFFF");
        }
      });
    }
    if (object.name === "screenlight") {
      object.material.transparent = true;
      object.material.opacity = 0;
      object.material.emissive.set("#C8BFFF");
      gsap.timeline({ repeat: -1, repeatRefresh: true }).to(object.material, {
        emissiveIntensity: () => intensity * 8,
        duration: () => Math.random() * 0.6,
        delay: () => Math.random() * 0.1,
      });
      screenLight = object;
    }
  });
  let neckBone = character?.getObjectByName("spine005");
  if (window.innerWidth > 1024) {
    if (character) {
      tl1
        .fromTo(character.rotation, { y: 0 }, { y: 0.7, duration: 1 }, 0)
        .to(camera.position, { z: 22 }, 0)
        .fromTo(".character-model", { x: 0 }, { x: "-25%", duration: 1 }, 0)
        .to(".landing-container", { opacity: 0, duration: 0.4 }, 0)
        .to(".landing-container", { y: "40%", duration: 0.8 }, 0)
        .fromTo(".about-me", { y: "-50%" }, { y: "0%" }, 0);

      tl2
        .to(
          camera.position,
          { z: 75, y: 8.4, duration: 6, delay: 2, ease: "power3.inOut" },
          0
        )
        .to(".about-section", { y: "30%", duration: 6 }, 0)
        .to(".about-section", { opacity: 0, delay: 3, duration: 2 }, 0)
        .fromTo(
          ".character-model",
          { pointerEvents: "inherit" },
          { pointerEvents: "none", x: "-12%", delay: 2, duration: 5 },
          0
        )
        .to(character.rotation, { y: 0.92, x: 0.12, delay: 3, duration: 3 }, 0)
        .to(neckBone!.rotation, { x: 0.6, delay: 2, duration: 3 }, 0)
        .to(monitor.material, { opacity: 1, duration: 0.8, delay: 3.2 }, 0)
        .to(screenLight.material, { opacity: 1, duration: 0.8, delay: 4.5 }, 0)
        .fromTo(
          ".what-box-in",
          { display: "none" },
          { display: "flex", duration: 0.1, delay: 6 },
          0
        )
        .fromTo(
          monitor.position,
          { y: -10, z: 2 },
          { y: 0, z: 0, delay: 1.5, duration: 3 },
          0
        )
        .fromTo(
          ".character-rim",
          { opacity: 1, scaleX: 1.4 },
          { opacity: 0, scale: 0, y: "-70%", duration: 5, delay: 2 },
          0.3
        );

      // No character-model hide/slide here any more: ScreenDive picks up
      // straight from wherever tl2 leaves the camera and turns from
      // there, so the character has to stay visible and untransformed
      // the whole way through - a slide-out-then-slide-back-in (the
      // previous behaviour) read as the character leaving and a
      // different one re-entering. What DOES need to happen here is the
      // WhatIDo cards fading out of the way as their section ends, since
      // they'd otherwise abruptly cut off mid-scroll instead of clearing
      // the stage for the dive.
      tl3
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0)
        .fromTo(
          ".what-box-in",
          { opacity: 1 },
          { opacity: 0, duration: 1.2, ease: "none", immediateRender: false },
          2.4
        );

      // Hard hide/show, independent of the scrub tween above. The scrub
      // tween only *visually* slides the character out via `y: -100%`,
      // but if a ScrollTrigger refresh (e.g. from a resize, or content
      // below changing height) ever recreates these timelines while
      // already scrolled past this section, the scrub can get stuck
      // showing an earlier (visible) frame until the next scroll event.
      // Since the character sits outside the scrollable content (so it
      // can be pinned during the intro), when "stuck visible" it also
      // floats on top of - and intercepts clicks on - every section
      // below. This ScrollTrigger only fires on actual enter/leave
      // crossings and forces the container fully out of the way
      // (display: none, not just transformed), so it can never block
      // clicks on later sections regardless of scrub timing.
      const setCharacterHidden = (hidden: boolean) => {
        const el = document.querySelector(".character-container") as HTMLElement | null;
        if (el) el.style.display = hidden ? "none" : "";
      };
      // Keyed to the ScreenDive section rather than ".whatIDO": the
      // character slides out of view during whatIDO (tl3 above) but is
      // brought back for ScreenDive, which orbits the camera around
      // behind his head and into the monitor - so it must stay mounted
      // until that section is done, and only then be fully hidden for
      // everything below it.
      ScrollTrigger.create({
        trigger: ".screen-dive",
        start: "top top",
        end: "bottom top",
        onLeave: () => setCharacterHidden(true),
        onEnterBack: () => setCharacterHidden(false),
      });
      // A freshly (re)created trigger only fires the callbacks above on
      // future enter/leave *crossings* - if this runs while already
      // scrolled past the section (e.g. a resize-triggered timeline
      // rebuild), nothing would cross and the container could stay
      // stuck visible. Set the correct state immediately too.
      const screenDiveEl = document.querySelector(".screen-dive");
      if (screenDiveEl) {
        setCharacterHidden(screenDiveEl.getBoundingClientRect().bottom < 0);
      }
    }
  } else {
    if (character) {
      const tM2 = gsap.timeline({
        scrollTrigger: {
          trigger: ".what-box-in",
          start: "top 70%",
          end: "bottom top",
        },
      });
      tM2.to(".what-box-in", { display: "flex", duration: 0.1, delay: 0 }, 0);
    }
  }
}

/**
 * ScreenDive: swings the camera from the front of the character's face
 * around behind his head, then lines up square with the monitor he's
 * typing on and pushes into it, handing off to the HTML terminal.
 *
 * Two things this has to be careful about:
 *
 * 1. Camera writes are gated on the section actually being active. This
 *    section is pinned, and ScrollTrigger's pin measurement during
 *    refresh renders scrub timelines at assorted progress values - which
 *    moved the camera mid-measurement, and tl1/tl2 (which re-capture
 *    their `to()` start values on refresh, having invalidateOnRefresh
 *    set) then locked onto that displaced camera as their starting
 *    point, wrecking the hero/about framing.
 * 2. The final framing is derived from the monitor object's own world
 *    transform rather than hardcoded coordinates, so the camera ends up
 *    exactly on the screen's normal with its up vector matched - that's
 *    what makes the screen read as a straight, axis-aligned rectangle
 *    rather than a skewed quad at the moment we cut to the terminal.
 */
export function setScreenDiveTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character || window.innerWidth <= 1024) return;
  if (!document.querySelector(".screen-dive")) return;

  // ---- resolve the monitor + head in world space ------------------
  // Same lookup the rest of this file uses: the screen is the child of
  // the top-level "Plane004" node carrying Material.027. Searching the
  // whole character for that material instead matched a different mesh
  // (the dive ended up square-on to his keyboard hand).
  let monitor: THREE.Object3D | null = null;
  character.children.forEach((object: any) => {
    if (object.name !== "Plane004") return;
    object.children.forEach((child: any) => {
      if (child.material?.name === "Material.027") monitor = child;
    });
  });
  const headBone = character.getObjectByName("spine006");
  if (!monitor || !headBone) return;
  const monitorObj = monitor as THREE.Object3D;

  const worldUp = new THREE.Vector3(0, 1, 0);
  const screenPos = new THREE.Vector3();
  let facing = new THREE.Vector3(0, 0, 1);
  let screenUp = worldUp.clone();

  const squareOn = (distance: number) =>
    screenPos.clone().add(facing.clone().multiplyScalar(distance));

  // Resolved lazily rather than at setup: tl2 slides the monitor into
  // place (monitor.position y/z) while the about section scrolls, so at
  // setup time it isn't where it will be during the dive.
  let screenResolved = false;
  const resolveScreen = () => {
    if (screenResolved) return;
    screenResolved = true;

    const screenQuat = new THREE.Quaternion();
    monitorObj.getWorldQuaternion(screenQuat);
    // Centre of the screen's bounds, not the object's origin - the
    // monitor's origin sits down at desk level, so aiming at it framed
    // the keyboard instead of the display.
    const box = new THREE.Box3().setFromObject(monitorObj);
    box.getCenter(screenPos);

    const headPos = new THREE.Vector3();
    headBone.getWorldPosition(headPos);

    // Which way does the screen face? Pick whichever local axis points
    // most directly at the person sitting in front of it, rather than
    // assuming the exporter's axis convention.
    const axes = [
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, -1),
      new THREE.Vector3(0, 1, 0),
      new THREE.Vector3(0, -1, 0),
      new THREE.Vector3(1, 0, 0),
      new THREE.Vector3(-1, 0, 0),
    ].map((v) => v.applyQuaternion(screenQuat).normalize());
    const toViewer = headPos.clone().sub(screenPos).normalize();
    facing = axes.reduce((best, axis) =>
      axis.dot(toViewer) > best.dot(toViewer) ? axis : best
    );
    // Screen "up" = whichever remaining axis is closest to world up,
    // squared off against the facing direction so the framing can't come
    // out tilted.
    screenUp = axes
      .filter((axis) => Math.abs(axis.dot(facing)) < 0.9)
      .reduce((best, axis) => (axis.dot(worldUp) > best.dot(worldUp) ? axis : best))
      .clone()
      .projectOnPlane(facing)
      .normalize();

    // How close do we have to get for the screen to fill the frame at the
    // final FOV? Measured off the monitor rather than guessed, then held
    // inside the gap between the screen and the person at the desk. Only
    // the extents across the screen matter, so the (thin) depth along the
    // facing axis is excluded.
    const size = new THREE.Vector3();
    box.getSize(size);
    const extents = [size.x, size.y, size.z];
    const facingComponents = [Math.abs(facing.x), Math.abs(facing.y), Math.abs(facing.z)];
    const depthAxis = facingComponents.indexOf(Math.max(...facingComponents));
    const screenHalf =
      Math.max(...extents.filter((_, i) => i !== depthAxis)) / 2;
    const fitDistance =
      screenHalf / Math.tan(THREE.MathUtils.degToRad(FINAL_FOV) / 2);
    pushDistance = Math.max(0.9, fitDistance * 0.62);
    approachDistance = Math.min(3.6, pushDistance * 2.6);
  };

  // ---- animated state ---------------------------------------------
  const orbitCenter = new THREE.Vector3(0, 10.2, 3.4);
  // angle/radius/height are placeholders until resolveOrbitStart() reads
  // the camera's actual position (wherever tl2 left it) right as the
  // dive begins - hardcoded guesses here previously didn't quite match,
  // so the very first onUpdate call snapped the camera a little, right
  // at the moment it was supposed to just start turning.
  const orbit = { angle: 0, radius: 66, height: 8.4 };
  let orbitStartResolved = false;
  const resolveOrbitStart = () => {
    if (orbitStartResolved) return;
    orbitStartResolved = true;
    const dx = camera.position.x - orbitCenter.x;
    const dz = camera.position.z - orbitCenter.z;
    orbit.radius = Math.max(1, Math.hypot(dx, dz));
    orbit.height = camera.position.y;
    orbit.angle = Math.atan2(dx, dz);
  };
  // Free-flight waypoints for everything after the orbit. The dive can't
  // stay on the orbit path - shrinking its radius drove the camera
  // straight into his torso, since the orbit centre sits behind him.
  // Distances along the screen's normal, filled in by resolveScreen from
  // the monitor's measured size. They have to stay inside the gap
  // between the screen and the person sitting at it (only ~5 units) -
  // a fixed 14 put the camera behind his chair, looking at the back of
  // both him and the monitor.
  let approachDistance = 3.4;
  let pushDistance = 1.5;
  const FINAL_FOV = 46;
  const fly = {
    x: 0,
    y: 11.4,
    z: -13.6,
    lookX: orbitCenter.x,
    lookY: orbitCenter.y,
    lookZ: orbitCenter.z,
  };
  // 14.5deg telephoto suits the wide intro framing but makes anything
  // near the lens enormous; widening through the dive keeps the approach
  // readable and lets the screen fill the frame naturally.
  const lens = { fov: camera.fov };
  const originalFov = camera.fov;

  let diveActive = false;

  const writeCamera = () => {
    if (!diveActive) return;
    camera.position.set(fly.x, fly.y, fly.z);
    camera.up.copy(worldUp);
    camera.lookAt(fly.lookX, fly.lookY, fly.lookZ);
    if (camera.fov !== lens.fov) {
      camera.fov = lens.fov;
      camera.updateProjectionMatrix();
    }
  };

  const applyOrbit = () => {
    if (!diveActive) return;
    fly.x = orbitCenter.x + Math.sin(orbit.angle) * orbit.radius;
    fly.y = orbit.height;
    fly.z = orbitCenter.z + Math.cos(orbit.angle) * orbit.radius;
    fly.lookX = orbitCenter.x;
    fly.lookY = orbitCenter.y;
    fly.lookZ = orbitCenter.z;
    writeCamera();
  };

  // Square-on: camera sits on the screen's normal, looking straight down
  // it, with up matched to the screen's own up.
  const applySquare = () => {
    if (!diveActive) return;
    camera.position.set(fly.x, fly.y, fly.z);
    camera.up.copy(screenUp);
    camera.lookAt(screenPos);
    if (camera.fov !== lens.fov) {
      camera.fov = lens.fov;
      camera.updateProjectionMatrix();
    }
  };

  const restoreCamera = () => {
    camera.up.set(0, 1, 0);
    camera.rotation.set(0, 0, 0);
    camera.fov = originalFov;
    camera.updateProjectionMatrix();
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      // Starts only once whatIDO has fully scrolled past (its own tl3
      // runs to ".whatIDO" bottom/top). Starting at "top bottom" instead
      // overlapped tl3's range, and both timelines then fought over
      // ".character-model"'s y every frame.
      trigger: ".screen-dive",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onEnter: () => {
        resolveOrbitStart();
        resolveScreen();
        diveActive = true;
      },
      onEnterBack: () => {
        resolveOrbitStart();
        resolveScreen();
        diveActive = true;
      },
      onLeave: () => {
        diveActive = false;
      },
      onLeaveBack: () => {
        diveActive = false;
        restoreCamera();
      },
    },
  });

  tl
    // Front of the face -> around behind the head, closing in. The
    // target angle is relative to wherever resolveOrbitStart() found the
    // camera (tl2's end position) rather than a fixed Math.PI, so this
    // is always a clean half-turn from whatever "front" actually was.
    .to(
      orbit,
      {
        angle: () => orbit.angle + Math.PI,
        radius: 17,
        height: 11.4,
        duration: 3,
        ease: "none",
        onUpdate: applyOrbit,
      },
      0.3
    )
    // Climb clear of his head (hair tops out near y=14.5) on the way over.
    .to(
      fly,
      {
        y: 19,
        z: -5.5,
        lookY: 9.6,
        lookZ: screenPos.z,
        duration: 1.1,
        ease: "power1.inOut",
        onUpdate: writeCamera,
      },
      4
    )
    .to(lens, { fov: 34, duration: 1.1, onUpdate: writeCamera }, 4)
    // Swing onto the screen's normal, still well back - from here on the
    // framing is square to the screen.
    .to(
      fly,
      {
        // Function-based so they resolve when the tween actually runs -
        // the screen's world transform isn't known until resolveScreen()
        // has run inside this section.
        x: () => squareOn(approachDistance).x,
        y: () => squareOn(approachDistance).y,
        z: () => squareOn(approachDistance).z,
        duration: 0.9,
        ease: "power1.inOut",
        onUpdate: applySquare,
      },
      5.1
    )
    // Push straight down the normal until the screen fills the frame.
    .to(
      fly,
      {
        x: () => squareOn(pushDistance).x,
        y: () => squareOn(pushDistance).y,
        z: () => squareOn(pushDistance).z,
        duration: 1,
        ease: "power2.in",
        onUpdate: applySquare,
      },
      6
    )
    .to(lens, { fov: FINAL_FOV, duration: 1.9, onUpdate: applySquare }, 5.1)
    // Hand off from the 3D canvas to the terminal "inside" the screen.
    .to(".character-model", { opacity: 0, duration: 0.6 }, 6.6)
    .fromTo(
      ".screen-dive-stage",
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.8, immediateRender: false },
      6.6
    )
    // Trailing hold so the terminal has room to be read before the pin
    // releases and it scrolls away into the career section.
    .to({}, { duration: 2.6 }, 7.4);
}

export function setAllTimeline() {
  const careerTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: ".career-section",
      start: "top 30%",
      // Ties the beam's growth to how far the user has actually scrolled
      // through the section (rather than a fixed pixel distance, which
      // finished the whole animation almost immediately for a section
      // this tall) - it reaches 100% exactly as the section's bottom
      // scrolls up to 50% of the viewport height, so the growing tip
      // never has to travel further down the screen than that.
      end: "bottom 50%",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });
  // The 5 career-info-box entries fade in staggered by 0.1 with their own
  // 0.5 duration each, so the LAST one doesn't finish revealing until
  // t=0.9 of this timeline. The beam's own growth previously finished at
  // t=0.5 - fully extending long before the later entries had even
  // appeared. Growing it over the same 0-0.9 span keeps its tip's
  // progress visually in step with how many entries have actually
  // appeared, rather than racing ahead of the text.
  const infoBoxCount = document.querySelectorAll(".career-info-box").length;
  const infoBoxStagger = 0.1;
  const infoBoxDuration = 0.5;
  const revealSpan =
    Math.max(0, infoBoxCount - 1) * infoBoxStagger + infoBoxDuration;

  careerTimeline
    .fromTo(
      ".career-timeline",
      { maxHeight: "10%" },
      { maxHeight: "100%", duration: revealSpan, ease: "none" },
      0
    )

    .fromTo(
      ".career-timeline",
      { opacity: 0 },
      { opacity: 1, duration: 0.1 },
      0
    )
    .fromTo(
      ".career-info-box",
      { opacity: 0 },
      { opacity: 1, stagger: infoBoxStagger, duration: infoBoxDuration },
      0
    )
    .fromTo(
      ".career-dot",
      { animationIterationCount: "infinite" },
      {
        animationIterationCount: "1",
        delay: 0.3,
        duration: 0.1,
      },
      0
    );

  if (window.innerWidth > 1024) {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: "20%", duration: 0.5, delay: 0.2 },
      0
    );
  } else {
    careerTimeline.fromTo(
      ".career-section",
      { y: 0 },
      { y: 0, duration: 0.5, delay: 0.2 },
      0
    );
  }
}
