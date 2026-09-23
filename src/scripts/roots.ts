import { gsap } from "gsap";
import { createRootField } from "./root-field";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const hero = document.querySelector<HTMLElement>(".roots-hero");
if (hero) {
  const field = createRootField(hero);
  const worlds = [...hero.querySelectorAll<HTMLElement>("[data-world]")];
  const branches = [
    ...hero.querySelectorAll<SVGGElement>("[data-root-branch]"),
  ];
  const setActive = (id?: string) => {
    branches.forEach((branch) =>
      branch.classList.toggle("is-active", branch.dataset.rootBranch === id),
    );
    worlds.forEach((world) =>
      world.classList.toggle("is-active", world.dataset.world === id),
    );
  };
  worlds.forEach((world) => {
    world.addEventListener("pointerenter", () =>
      setActive(world.dataset.world),
    );
    world.addEventListener("pointerleave", () =>
      setActive(
        worlds.find((w) => w.contains(document.activeElement))?.dataset.world,
      ),
    );
    world.addEventListener("focus", () => setActive(world.dataset.world));
    world.addEventListener("blur", () => setActive());
  });
  const cinema = gsap.matchMedia();
  cinema.add(
    "(min-width: 960px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)",
    () => {
      hero.classList.add("roots-cinema");
      const garden = hero.querySelector<HTMLElement>(".roots-garden")!;
      const stories = [
        ...hero.querySelectorAll<HTMLElement>("[data-root-story]"),
      ];
      const photos = worlds.map((world) =>
        world.querySelector<HTMLElement>(".root-aperture")!,
      );
      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=180%",
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
        onUpdate: () => field?.render(),
      });
      // The full composition is the first and last state; each world takes the foreground between them.
      scene
        .to(".roots-heading h1", { opacity: 0, y: -30, duration: 0.5 }, 0.1)
        .to(".roots-caption", { opacity: 0, duration: 0.3 }, 0.1)
        .to(".roots-origin", { y: -25, duration: 0.5 }, 0.1);
      worlds.forEach((world, index) => {
        const start = 0.35 + index * 1.25;
        scene
          .to(
            world,
            {
              x: () =>
                garden.clientWidth * 0.64 -
                (world.offsetLeft + world.offsetWidth / 2),
              y: () =>
                garden.clientHeight * 0.42 -
                (world.offsetTop + world.offsetHeight / 2),
              scale: 1.38,
              rotation: 0,
              zIndex: 5,
              duration: 0.7,
              ease: "power2.inOut",
            },
            start,
          )
          .to(
            photos[index],
            { borderRadius: "48% 48% 3% 3%", rotation: 0, duration: 0.7 },
            start,
          )
          .to(
            stories[index],
            { autoAlpha: 1, x: 0, duration: 0.55 },
            start + 0.2,
          );
        worlds
          .filter((w) => w !== world)
          .forEach((other) =>
            scene.to(
              other,
              { opacity: 0.055, scale: 0.72, duration: 0.55 },
              start,
            ),
          );
        scene
          .to(
            stories[index],
            { autoAlpha: 0, x: -20, duration: 0.3 },
            start + 0.9,
          )
          .to(
            world,
            { x: 0, y: 0, scale: 1, zIndex: 2, duration: 0.35 },
            start + 1,
          )
          .to(
            photos[index],
            { clearProps: "borderRadius,rotation", duration: 0.01 },
            start + 1.2,
          )
          .to(worlds, { opacity: 1, scale: 1, duration: 0.25 }, start + 1);
      });
      scene
        .to(".roots-heading h1", { opacity: 1, y: 0, duration: 0.45 }, 4.15)
        .to(".roots-caption", { opacity: 1, duration: 0.45 }, 4.15)
        .to(".roots-origin", { y: 0, duration: 0.45 }, 4.15);
      // Keyboard navigation gets the complete composition rather than an off-scene link.
      const focus = () => {
        scene.scrollTrigger?.disable(true);
        scene.progress(1);
        field?.render();
      };
      hero.addEventListener("focusin", focus);
      return () => {
        hero.classList.remove("roots-cinema");
        hero.removeEventListener("focusin", focus);
        field?.render();
      };
    },
  );
  const media = gsap.matchMedia();
  media.add("(prefers-reduced-motion: no-preference)", () => {
    const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
    timeline
      .from(
        ".roots-heading h1 > *",
        { y: 24, opacity: 0, duration: 0.9, stagger: 0.12, clearProps: "all" },
        0,
      )
      .from(
        ".roots-origin",
        { scale: 0.8, opacity: 0, duration: 0.65, clearProps: "all" },
        0.1,
      )
      .fromTo(
        hero.querySelectorAll(".root-main"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.65,
          stagger: 0.12,
          ease: "power2.inOut",
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        0.25,
      )
      .fromTo(
        hero.querySelectorAll(".root-twig"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.05,
          stagger: 0.025,
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        0.8,
      )
      .from(
        ".root-aperture",
        {
          clipPath: "ellipse(0% 0% at 50% 15%)",
          duration: 1.25,
          stagger: 0.13,
          ease: "power3.inOut",
          clearProps: "clipPath",
        },
        0.45,
      )
      .from(
        ".root-world-label",
        { opacity: 0, y: 10, duration: 0.65, stagger: 0.1, clearProps: "all" },
        1,
      );
    // A keyboard visitor never waits for the entrance to expose their focused link.
    const reveal = () => timeline.progress(1);
    hero.addEventListener("focusin", reveal);
    return () => hero.removeEventListener("focusin", reveal);
  });
}
const closingMedia = gsap.matchMedia();
closingMedia.add("(prefers-reduced-motion: no-preference)", () => {
  document
    .querySelectorAll<HTMLElement>(".contact-close")
    .forEach((section) => {
      gsap.fromTo(
        section.querySelectorAll(".root-system path"),
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: 1.6,
          stagger: 0.025,
          ease: "power2.out",
          scrollTrigger: { trigger: section, start: "top 85%", once: true },
          clearProps: "strokeDasharray,strokeDashoffset",
        },
      );
    });
});
