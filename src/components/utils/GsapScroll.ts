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

      tl3
        .fromTo(
          ".character-model",
          { y: "0%" },
          { y: "-100%", duration: 4, ease: "none", delay: 1 },
          0
        )
        .fromTo(".whatIDO", { y: 0 }, { y: "15%", duration: 2 }, 0)
        .to(character.rotation, { x: -0.04, duration: 2, delay: 1 }, 0);

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
 * around to behind his head, then pushes forward into the monitor he's
 * typing on, handing off to the HTML terminal overlay "inside" the
 * screen.
 *
 * The orbit is driven by tweening polar coordinates (angle/radius) in an
 * onUpdate rather than tweening camera.position.x/z directly - a linear
 * tween between a front and a rear position would cut straight through
 * the character's head instead of arcing around it. camera.lookAt() each
 * frame keeps him framed throughout; nothing else in the render loop
 * touches camera.rotation, so there's no fight over it.
 */
export function setScreenDiveTimeline(
  character: THREE.Object3D<THREE.Object3DEventMap> | null,
  camera: THREE.PerspectiveCamera
) {
  if (!character || window.innerWidth <= 1024) return;
  if (!document.querySelector(".screen-dive")) return;

  // Sits between his head and the monitor so both stay in frame as the
  // camera comes around behind him.
  const orbitCenter = new THREE.Vector3(0, 10.2, 3.4);
  // The monitor plane he's typing at (Plane.004/screenlight sit here).
  const screenPoint = new THREE.Vector3(0, 9.2, 5.12);

  const orbit = { angle: 0, radius: 66, height: 8.4 };
  // Free-flight position/look used once the orbit hands over - the dive
  // can't stay on the orbit path, since shrinking its radius drives the
  // camera straight into his torso (the orbit centre sits behind the
  // monitor, so "closer" meant "inside him"). These waypoints lift up
  // over his shoulder instead and settle in front of the screen.
  const fly = { x: 0, y: 11.4, z: -13.6, lookX: 0, lookY: 10.2, lookZ: 3.4 };

  const applyOrbit = () => {
    camera.position.set(
      orbitCenter.x + Math.sin(orbit.angle) * orbit.radius,
      orbit.height,
      orbitCenter.z + Math.cos(orbit.angle) * orbit.radius
    );
    camera.lookAt(orbitCenter);
  };

  // The scene camera is a 14.5deg telephoto, which is fine for the wide
  // intro framing but makes anything close to the lens enormous - flying
  // past his shoulder at that focal length just fills the frame with
  // shoulder. Widening it through the dive keeps the approach readable.
  const lens = { fov: camera.fov };

  const applyFly = () => {
    camera.position.set(fly.x, fly.y, fly.z);
    camera.lookAt(fly.lookX, fly.lookY, fly.lookZ);
    if (camera.fov !== lens.fov) {
      camera.fov = lens.fov;
      camera.updateProjectionMatrix();
    }
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      // Starts only once whatIDO has fully scrolled past (its own tl3
      // runs to ".whatIDO" bottom/top). An earlier version started at
      // "top bottom", overlapping tl3's range - both timelines then
      // wrote ".character-model"'s y every frame and fought over it.
      trigger: ".screen-dive",
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
    },
  });

  tl
    // tl3 slid him out during whatIDO - bring him back for this section.
    // immediateRender:false on every fromTo here: the default (true)
    // applies the "from" values the moment the timeline is built, which
    // yanked the character off-screen and skewed the camera during the
    // intro sections, long before this section is reached.
    .fromTo(
      ".character-model",
      { y: "-100%" },
      { y: "0%", opacity: 1, duration: 1, ease: "none", immediateRender: false },
      0
    )
    // Front of the face -> around behind the head, closing in.
    .to(
      orbit,
      {
        angle: Math.PI,
        radius: 17,
        height: 11.4,
        duration: 3,
        ease: "none",
        onUpdate: applyOrbit,
      },
      1
    )
    // Climb well clear of his head (hair tops out near y=14.5) and look
    // down over him at the monitor.
    .to(
      fly,
      {
        y: 19,
        z: -5.5,
        lookY: 9.6,
        lookZ: screenPoint.z,
        duration: 1.1,
        ease: "power1.inOut",
        onUpdate: applyFly,
      },
      4
    )
    .to(lens, { fov: 34, duration: 1.1, onUpdate: applyFly }, 4)
    // Travel forward past him while still high up - dropping and moving
    // forward at the same time flew the camera straight through his head.
    .to(
      fly,
      {
        y: 16,
        z: 3.4,
        lookY: screenPoint.y,
        lookZ: screenPoint.z + 0.3,
        duration: 0.7,
        ease: "power1.inOut",
        onUpdate: applyFly,
      },
      5.1
    )
    // Now clear of him, drop down in front of the screen and push in.
    .to(
      fly,
      {
        y: 9.35,
        z: 4.05,
        lookY: screenPoint.y,
        lookZ: screenPoint.z + 0.6,
        duration: 0.8,
        ease: "power2.in",
        onUpdate: applyFly,
      },
      5.8
    )
    .to(lens, { fov: 52, duration: 1.5, onUpdate: applyFly }, 5.1)
    // Hand off from the 3D canvas to the terminal "inside" the screen.
    .to(".character-model", { opacity: 0, duration: 0.7 }, 6.3)
    .fromTo(
      ".screen-dive-stage",
      { opacity: 0, scale: 0.88 },
      { opacity: 1, scale: 1, duration: 0.9, immediateRender: false },
      6.3
    )
    // Trailing hold: the sticky stage releases exactly when this trigger
    // hits progress 1, so without padding the reveal only finished at the
    // instant the stage scrolled away. This leaves roughly the last third
    // of the section for the terminal to just sit there and be read.
    .to({}, { duration: 3 }, 7.2);
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
