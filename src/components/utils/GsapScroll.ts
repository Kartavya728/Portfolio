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
function smoothstep(t: number) {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

/**
 * One continuous spiral from wherever the About-section camera left off,
 * around behind the character's head, and in until the monitor exactly
 * fills the frame. This used to be four sequential tweens (orbit, then
 * climb, then swing onto the screen's normal, then push in), each with
 * its own onUpdate - smooth individually, but the seams between them
 * showed up as a faint cut. Now it's a single GSAP tween driving one
 * progress value from 0 to 1: position is a continuous lerp between a
 * shrinking/rising orbit point and the square-on point on the screen's
 * normal, with the lerp weight itself sliding from 0 to 1 across that
 * same progress - so the turn and the zoom happen together as one
 * spiral, and look-at / up-vector / FOV are all continuous functions of
 * that same single progress value too. No phase boundaries anywhere.
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
  const orbitCenter = new THREE.Vector3(0, 10.2, 3.4);
  const screenPos = new THREE.Vector3();
  let facing = new THREE.Vector3(0, 0, 1);
  let right = new THREE.Vector3(1, 0, 0);
  let screenUp = worldUp.clone();
  let pushDistance = 2.2;
  let approachDistance = 6;
  // The screen's own true width/height (see resolveScreen) - kept around
  // so the HTML overlay can be projected onto the same corners every
  // frame, not just faded in over a static box at the very end.
  let screenWidth = 1;
  let screenHeight = 1;

  const squareOn = (distance: number) =>
    screenPos.clone().add(facing.clone().multiplyScalar(distance));

  const FINAL_FOV = 42;
  // Extra margin beyond the exact contain-fit point so nothing is ever
  // cropped by aspect/float rounding at the very final frame.
  const FILL_MARGIN = 1.04;

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
    right = new THREE.Vector3().crossVectors(screenUp, facing).normalize();

    // True on-screen width/height of the monitor, measured by projecting
    // every corner of its bounding box onto the screen's own up/right
    // axes - not just picking two of the box's x/y/z extents, which only
    // gives the right answer if the monitor happens to be world-axis
    // aligned. This is what makes the "every edge stays inside the
    // frame" distance below exact instead of an eyeballed guess.
    const corners = [
      new THREE.Vector3(box.min.x, box.min.y, box.min.z),
      new THREE.Vector3(box.max.x, box.min.y, box.min.z),
      new THREE.Vector3(box.min.x, box.max.y, box.min.z),
      new THREE.Vector3(box.max.x, box.max.y, box.min.z),
      new THREE.Vector3(box.min.x, box.min.y, box.max.z),
      new THREE.Vector3(box.max.x, box.min.y, box.max.z),
      new THREE.Vector3(box.min.x, box.max.y, box.max.z),
      new THREE.Vector3(box.max.x, box.max.y, box.max.z),
    ];
    let minU = Infinity,
      maxU = -Infinity,
      minR = Infinity,
      maxR = -Infinity;
    for (const corner of corners) {
      const rel = corner.clone().sub(screenPos);
      const u = rel.dot(screenUp);
      const r = rel.dot(right);
      minU = Math.min(minU, u);
      maxU = Math.max(maxU, u);
      minR = Math.min(minR, r);
      maxR = Math.max(maxR, r);
    }
    screenHeight = maxU - minU;
    screenWidth = maxR - minR;

    // Contain-fit: the smallest distance at which BOTH the width and the
    // height stay within the frustum at this viewport's actual aspect
    // ratio - the monitor's edges land right at (or just inside) the
    // frame on whichever axis is tighter, and it's never so close that
    // an edge gets cropped on the other.
    const vFov = THREE.MathUtils.degToRad(FINAL_FOV);
    const aspect = camera.aspect || window.innerWidth / window.innerHeight;
    const distanceForHeight = (screenHeight / 2 / Math.tan(vFov / 2)) * FILL_MARGIN;
    const distanceForWidth =
      (screenWidth / 2 / (Math.tan(vFov / 2) * aspect)) * FILL_MARGIN;
    pushDistance = Math.max(0.8, distanceForHeight, distanceForWidth);
    approachDistance = pushDistance * 3.2;
  };

  const originalFov = camera.fov;
  let diveActive = false;
  const state = { t: 0 };
  // Orbit start (angle/radius/height) is read from the camera's actual
  // live position each time the dive is (re-)entered, rather than a
  // hardcoded guess - that's what keeps the spiral's very first frame
  // glued to wherever tl2 actually left the camera, with no pop.
  const orbitStart = { angle: 0, radius: 66, height: 8.4 };
  // Where the orbit is aiming for: the exact cylindrical coordinates
  // (around the same orbitCenter axis) of the final square-on point on
  // the screen's normal, resolved once per dive-entry from the monitor's
  // measured position. Driving the camera in these same angle/radius/
  // height terms the whole way - rather than turning behind the head
  // and only then jumping to a straight-line Cartesian blend toward the
  // screen - is what makes this an actual spiral: the radius only gets
  // small once the angle has already swung around to point at the
  // screen, so the shrinking half of the move travels straight down a
  // ray from the character's centre toward the monitor instead of
  // cutting sideways through him to get there.
  const target = { angle: 0, radius: 3, height: 9 };
  const ORBIT_END_RADIUS = 24;

  const resolveOrbitStart = () => {
    const dx = camera.position.x - orbitCenter.x;
    const dz = camera.position.z - orbitCenter.z;
    orbitStart.radius = Math.max(1, Math.hypot(dx, dz));
    orbitStart.height = camera.position.y;
    orbitStart.angle = Math.atan2(dx, dz);
  };

  const resolveTarget = () => {
    const finalPoint = squareOn(pushDistance);
    const dx = finalPoint.x - orbitCenter.x;
    const dz = finalPoint.z - orbitCenter.z;
    target.radius = Math.max(0.5, Math.hypot(dx, dz));
    target.height = finalPoint.y;

    // There are always two ways to sweep from the start angle to the
    // screen's angle - the short way round and the long way round. Only
    // one of them passes across the space in front of the character
    // (between his face and the monitor); the other loops around behind
    // his head and shoulders instead - which is the one a plain
    // shortest-angle calculation actually picks here, since the
    // "shortest" arc isn't the one that stays clear of him. `facing`
    // (the screen's normal, pointing from the screen toward him) scores
    // each candidate's midpoint against the FAR side of that direction,
    // which is what the front-passing arc's midpoint lines up with.
    const raw = Math.atan2(dx, dz);
    let shortDiff = raw - orbitStart.angle;
    shortDiff = ((shortDiff % (Math.PI * 2)) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    const candidateShort = orbitStart.angle + shortDiff;
    const candidateLong = shortDiff >= 0 ? candidateShort - Math.PI * 2 : candidateShort + Math.PI * 2;
    const frontAngle = Math.atan2(facing.x, facing.z);
    const frontScore = (candidate: number) =>
      Math.cos((orbitStart.angle + candidate) / 2 - frontAngle);
    target.angle = frontScore(candidateShort) >= frontScore(candidateLong) ? candidateLong : candidateShort;
  };

  // The nav header and social/resume corner both float over the 3D
  // canvas the entire time; left alone they sit on top of the monitor
  // bezel once the camera is in close, so they fade out of the way for
  // the dive and back in once it's past (either direction).
  const chromeEls = ["header", "icons-section"]
    .map((cls) => document.querySelector(`.${cls}`) as HTMLElement | null)
    .filter((el): el is HTMLElement => !!el);
  const setChromeVisible = (visible: boolean) => {
    chromeEls.forEach((el) => {
      el.style.pointerEvents = visible ? "" : "none";
      el.style.opacity = visible ? "" : "0";
      el.style.transition = "opacity 0.4s ease";
    });
  };

  // The HTML terminal overlay - rather than only fading in as a static,
  // already-centred box right at the very end, this is kept visually
  // locked onto the 3D monitor's own projected screen corners for the
  // whole approach: it appears partway through the turn (already
  // roughly where the monitor is), then rides those corners inward as
  // the camera closes in, arriving exactly centred because that's where
  // the monitor's corners themselves end up once resolveScreen's
  // contain-fit framing is reached.
  const stageEl = document.querySelector(".screen-dive-stage") as HTMLElement | null;
  let stageHome: { cx: number; cy: number; w: number; h: number } | null = null;
  const cornerA = new THREE.Vector3();
  const cornerB = new THREE.Vector3();
  const cornerC = new THREE.Vector3();
  const cornerD = new THREE.Vector3();
  const trackStage = (opacity: number) => {
    if (!stageEl) return;
    if (!stageHome) {
      const r = stageEl.getBoundingClientRect();
      stageHome = { cx: r.left + r.width / 2, cy: r.top + r.height / 2, w: r.width, h: r.height };
    }
    const halfW = screenWidth / 2;
    const halfH = screenHeight / 2;
    cornerA.copy(screenPos).addScaledVector(right, -halfW).addScaledVector(screenUp, halfH);
    cornerB.copy(screenPos).addScaledVector(right, halfW).addScaledVector(screenUp, halfH);
    cornerC.copy(screenPos).addScaledVector(right, -halfW).addScaledVector(screenUp, -halfH);
    cornerD.copy(screenPos).addScaledVector(right, halfW).addScaledVector(screenUp, -halfH);
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const corner of [cornerA, cornerB, cornerC, cornerD]) {
      const ndc = corner.clone().project(camera);
      const px = (ndc.x * 0.5 + 0.5) * window.innerWidth;
      const py = (1 - (ndc.y * 0.5 + 0.5)) * window.innerHeight;
      minX = Math.min(minX, px);
      maxX = Math.max(maxX, px);
      minY = Math.min(minY, py);
      maxY = Math.max(maxY, py);
    }
    const targetCx = (minX + maxX) / 2;
    const targetCy = (minY + maxY) / 2;
    const targetW = maxX - minX;
    const scale = Math.max(0.05, targetW / stageHome.w);
    stageEl.style.opacity = String(opacity);
    stageEl.style.transformOrigin = "center center";
    stageEl.style.transform = `translate(${targetCx - stageHome.cx}px, ${
      targetCy - stageHome.cy
    }px) scale(${scale})`;
  };

  const beginDive = () => {
    resolveOrbitStart();
    resolveScreen();
    resolveTarget();
    diveActive = true;
    setChromeVisible(false);
  };

  // The final stretch of the approach is the camera closing in on
  // roughly where the character's own eyes are (it's arriving at his own
  // view of the screen) - so it unavoidably passes very near his head on
  // the way there. The 3D character fades out well before that point,
  // once the HTML terminal (tracked onto the monitor's corners, above)
  // is already substantially visible, so what's covering that close
  // pass is the terminal overlay, not a view of him clipping through
  // himself.
  const characterEl = document.querySelector(".character-model") as HTMLElement | null;

  // Windowed ease: 0 before `from`, 1 after `to`, smoothstepped between -
  // lets several properties share one progress value `t` while still
  // easing on their own overlapping windows, so the whole thing reads as
  // one continuous gesture (never a hard cut) without every property
  // having to move in lockstep the entire time.
  const windowEase = (t: number, from: number, to: number) =>
    smoothstep((t - from) / (to - from));

  // One continuous function of progress `t`, entirely in the orbit's own
  // cylindrical coordinates. The turn swings the SHORT way round to
  // `target.angle` - across the space in front of the character, between
  // him and the monitor, rather than looping behind his head - while the
  // radius stays out at a safe berth (ORBIT_END_RADIUS) until that turn
  // is basically done, and only shrinks toward the final push distance
  // once the angle (and, separately, the height) are already lined up
  // with the screen - so the close-in travels straight down a ray at the
  // screen's own height, clear of him, instead of cutting through him
  // partway round.
  const applyCurve = () => {
    if (!diveActive) return;
    const t = state.t;
    const turn = windowEase(t, 0, 0.55);
    const settle = windowEase(t, 0.3, 0.75);
    const radiusShrink = windowEase(t, 0.75, 1);
    const gaze = windowEase(t, 0.45, 1);
    // Widens across nearly the whole move - the base lens is a 14.5deg
    // telephoto, and staying that narrow through the whole turn made his
    // head fill the frame purely from lens compression even while the
    // camera was still physically well clear of him.
    const fovEase = windowEase(t, 0, 0.85);
    // The HTML terminal starts appearing mid-turn, already tracking the
    // monitor's projected corners, rather than popping in only once the
    // dive is basically finished.
    const overlayEase = windowEase(t, 0.2, 0.6);
    // The 3D character fades out right after the overlay above has
    // fully taken over, and before the close-in gets uncomfortably near
    // his head.
    const characterFade = 1 - windowEase(t, 0.6, 0.8);

    const angle = THREE.MathUtils.lerp(orbitStart.angle, target.angle, turn);
    const radiusAfterTurn = THREE.MathUtils.lerp(orbitStart.radius, ORBIT_END_RADIUS, turn);
    const radius = THREE.MathUtils.lerp(radiusAfterTurn, target.radius, radiusShrink);
    const height = THREE.MathUtils.lerp(orbitStart.height, target.height, settle);

    camera.position.set(
      orbitCenter.x + Math.sin(angle) * radius,
      height,
      orbitCenter.z + Math.cos(angle) * radius
    );

    // Look-at target and up-vector settle onto the screen across the
    // back half too, so the camera is already looking exactly at the
    // monitor by the time it arrives.
    const lookAt = orbitCenter.clone().lerp(screenPos, gaze);
    camera.up.copy(worldUp.clone().lerp(screenUp, gaze).normalize());
    camera.lookAt(lookAt);

    const fov = THREE.MathUtils.lerp(originalFov, FINAL_FOV, fovEase);
    if (Math.abs(camera.fov - fov) > 0.001) {
      camera.fov = fov;
      camera.updateProjectionMatrix();
    }

    trackStage(overlayEase);
    if (characterEl) characterEl.style.opacity = String(characterFade);
  };

  const restoreCamera = () => {
    camera.up.set(0, 1, 0);
    camera.rotation.set(0, 0, 0);
    camera.fov = originalFov;
    camera.updateProjectionMatrix();
    if (stageEl) {
      stageEl.style.opacity = "0";
      stageEl.style.transform = "";
    }
    if (characterEl) characterEl.style.opacity = "";
    setChromeVisible(true);
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
      onEnter: beginDive,
      onEnterBack: beginDive,
      onLeave: () => {
        diveActive = false;
        setChromeVisible(true);
        if (stageEl) {
          stageEl.style.transform = "";
          stageEl.style.opacity = "1";
        }
      },
      onLeaveBack: () => {
        diveActive = false;
        restoreCamera();
      },
    },
  });

  tl
    // Both the terminal overlay's tracking/fade-in and the 3D
    // character's fade-out are driven per-frame inside applyCurve
    // itself (see overlayEase/characterFade above), tied directly to
    // the same progress value as the camera move - not separate tweens
    // bolted onto the end of this timeline.
    .to(state, { t: 1, duration: 6.6, ease: "none", onUpdate: applyCurve }, 0.3)
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
