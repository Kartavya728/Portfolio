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
          // Pulls back sooner and faster than before (was delay:2,
          // duration:6) - with the old timing the camera stayed close
          // (character still large) for a good stretch of the scroll
          // while the About text below was already fading out
          // underneath it (see the opacity tween further down, which
          // starts at delay:3 regardless), leaving a visible window
          // where the oversized character overlapped the still-legible
          // text instead of having already shrunk away from it.
          { z: 75, y: 8.4, duration: 4, delay: 0, ease: "power3.inOut" },
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
      ScrollTrigger.create({
        trigger: ".whatIDO",
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
      const whatIDoEl = document.querySelector(".whatIDO");
      if (whatIDoEl) {
        setCharacterHidden(whatIDoEl.getBoundingClientRect().bottom < 0);
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
