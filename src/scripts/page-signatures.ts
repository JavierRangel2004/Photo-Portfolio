import { entranceQuery } from "./motion-startup";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

const motion = gsap.matchMedia();
motion.add(entranceQuery, () => {
  const cleanups: (() => void)[] = [];
  function revealOnFocus(element: Element, timeline: gsap.core.Timeline) {
    const reveal = () => {
      timeline.scrollTrigger?.kill();
      timeline.progress(1);
    };
    element.addEventListener("focusin", reveal);
    cleanups.push(() => element.removeEventListener("focusin", reveal));
  }
  function arrival(element: Element) {
    const timeline = gsap.timeline({
      defaults: { ease: "power3.out" },
      scrollTrigger: { trigger: element, start: "top 88%", once: true },
    });
    revealOnFocus(element, timeline);
    return timeline;
  }
  const opening = document.querySelector<HTMLElement>("[data-gallery-opening]");
  if (opening) {
    const kind = opening.dataset.galleryOpening;
    const prints = [...opening.querySelectorAll<HTMLElement>(".opening-print")];
    const first = prints[0]?.querySelector(".photo-link");
    const curtains = opening.querySelector(".opening-shutters");
    const panels = opening.querySelectorAll(".opening-shutters span");
    const sequence = arrival(opening);
    if (kind === "selection") {
      sequence.from(
        prints,
        {
          y: 40,
          rotation: (i: number) => [9, -7, 5][i],
          scale: 0.92,
          duration: 0.95,
          stagger: 0.1,
          clearProps: "transform",
        },
        0,
      );
    } else if (kind === "product" || kind === "events") {
      gsap.set(curtains, { visibility: "visible" });
      sequence
        .fromTo(
          panels,
          { [kind === "events" ? "xPercent" : "yPercent"]: 0 },
          {
            [kind === "events" ? "xPercent" : "yPercent"]: (i: number) =>
              i % 2 === 0 ? -102 : 102,
            duration: kind === "events" ? 1.05 : 0.85,
            stagger: 0.06,
            ease: "power3.inOut",
          },
          0,
        )
        .set(curtains, { visibility: "hidden" });
      if (first) {
        gsap.set(first.querySelector("img"), { transition: "none" });
        sequence.from(
          first.querySelector("img"),
          { scale: 1.055, duration: 1.1, clearProps: "transform,transition" },
          0,
        );
      }
    } else if (kind === "portraits" && first) {
      sequence
        .fromTo(
          first,
          { clipPath: "circle(13% at 50% 40%)" },
          {
            clipPath: "circle(85% at 50% 40%)",
            duration: 1.1,
            ease: "power3.inOut",
            clearProps: "clipPath",
          },
          0,
        )
        .fromTo(
          opening.querySelector(".opening-focus path"),
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 0.7,
            clearProps: "strokeDasharray,strokeDashoffset",
          },
          0.15,
        );
    } else if (first) {
      sequence.fromTo(
        first,
        { clipPath: "ellipse(8% 55% at 50% 50%)" },
        {
          clipPath: "ellipse(80% 80% at 50% 50%)",
          duration: 1.1,
          ease: "power3.inOut",
          clearProps: "clipPath",
        },
        0,
      );
    }
    if (kind !== "selection")
      sequence.from(
        prints.slice(1),
        {
          y: 25,
          rotation: 5,
          opacity: 0.4,
          duration: 0.85,
          clearProps: "transform,opacity",
        },
        0.3,
      );
    sequence.fromTo(
      opening.querySelector(".opening-thread path"),
      { strokeDasharray: 1, strokeDashoffset: 1 },
      {
        strokeDashoffset: 0,
        duration: 1.2,
        clearProps: "strokeDasharray,strokeDashoffset",
      },
      0.15,
    );
  }

  document
    .querySelectorAll<HTMLElement>("[data-service-motion]")
    .forEach((section) => {
      const photo = section.querySelector(".service-print .photo-link");
      const stem = section.querySelector(".service-stem path");
      const sequence = arrival(section);
      if (stem)
        sequence.fromTo(
          stem,
          { strokeDasharray: 1, strokeDashoffset: 1 },
          {
            strokeDashoffset: 0,
            duration: 1.15,
            clearProps: "strokeDasharray,strokeDashoffset",
          },
          0,
        );
      if (photo)
        sequence.from(
          photo,
          {
            clipPath: "inset(0 0 100% 0)",
            duration: 0.9,
            ease: "power3.inOut",
            clearProps: "clipPath",
          },
          0.1,
        );
      sequence.from(
        section.querySelector(".service-print"),
        { rotation: -2, duration: 1.1, clearProps: "transform" },
        0,
      );
    });
  const about = document.querySelector("[data-about-focus]");
  if (about) {
    const sequence = arrival(about);
    sequence
      .fromTo(
        about.querySelector(".about-focus-window"),
        { clipPath: "inset(18% 20% 18% 20%)" },
        {
          clipPath: "inset(0% 0% 0% 0%)",
          duration: 1.2,
          ease: "power3.inOut",
          clearProps: "clipPath",
        },
        0,
      )
      .fromTo(
        about.querySelector(".about-focus-lines path"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.7,
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        0.4,
      );
  }
  const thanks = document.querySelector(".thanks-intro");
  if (thanks) {
    arrival(thanks)
      .fromTo(
        thanks.querySelector(".sprout-stem"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 0.8,
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        0,
      )
      .from(
        thanks.querySelectorAll("[data-sprout-leaf]"),
        {
          scale: 0,
          transformOrigin: "50% 100%",
          duration: 0.6,
          stagger: 0.12,
          clearProps: "transform",
        },
        0.3,
      );
  }
  return () => cleanups.forEach((cleanup) => cleanup());
});
