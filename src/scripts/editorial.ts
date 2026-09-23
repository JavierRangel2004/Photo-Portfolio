import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
const media = gsap.matchMedia();
media.add("(prefers-reduced-motion: no-preference)", () => {
  const heading = document.querySelector(".hero-heading");
  if (heading) {
    gsap.from(".hero-heading h1 > *", {
      y: 38,
      opacity: 0,
      duration: 1.15,
      stagger: 0.15,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".hero-intro", {
      y: 16,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: "power3.out",
      clearProps: "all",
    });
    gsap.from(".edition-photo", {
      clipPath: "inset(100% 0 0 0)",
      duration: 1.05,
      stagger: 0.1,
      delay: 0.1,
      ease: "power3.inOut",
      clearProps: "clipPath",
    });
  }
  // Interior headings and photographs share the same editorial pacing.
  const intro = document.querySelector(".page-intro, .contact-intro");
  if (intro) {
    gsap.from(intro.querySelectorAll("h1, :scope > p, :scope > div"), {
      y: 24,
      opacity: 0,
      duration: 0.85,
      stagger: 0.09,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
    gsap.from(".gallery-nav, .service-index", {
      opacity: 0,
      y: 10,
      duration: 0.6,
      delay: 0.16,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
  }
  const cells = gsap.utils.toArray<HTMLElement>(".gallery-cell");
  if (cells.length) {
    gsap.set(cells, { opacity: 0, y: 28 });
    ScrollTrigger.batch(cells, {
      start: "top 98%",
      once: true,
      interval: 0.08,
      batchMax: 6,
      onEnter: (batch) => {
        // Sort by visual position: masonry DOM order runs down columns.
        batch.sort((a, b) => {
          const ar = a.getBoundingClientRect(),
            br = b.getBoundingClientRect();
          return Math.abs(ar.top - br.top) < 80
            ? ar.left - br.left
            : ar.top - br.top;
        });
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.85,
          stagger: 0.065,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      },
    });
    // Inner settle belongs only to the opening selection, not every archive image.
    cells
      .filter((el) => el.getBoundingClientRect().top < innerHeight)
      .slice(0, 6)
      .forEach((el) => {
        const photo = el.querySelector("img");
        if (!photo) return;
        gsap.set(photo, { transition: "none" });
        gsap.from(photo, {
          scale: 1.06,
          duration: 1.1,
          ease: "power3.out",
          clearProps: "transform,transition",
        });
      });
    cells.forEach((el) =>
      el.addEventListener("focusin", () => {
        gsap.killTweensOf(el);
        gsap.set(el, { clearProps: "transform,opacity" });
      }),
    );
  }
  document
    .querySelectorAll<HTMLElement>(
      ".service-chapter, .about-story, .seo-overview",
    )
    .forEach((section) => {
      const children = [...section.children];
      gsap.from(children, {
        opacity: 0,
        y: 26,
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 92%", once: true },
      });
    });
  if (document.querySelector(".inquiry-form")) {
    gsap.from(
      ".inquiry-form > .inquiry-intro, .inquiry-form > fieldset, .inquiry-form > .form-pair, .inquiry-form > label",
      {
        opacity: 0,
        y: 14,
        duration: 0.65,
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity",
      },
    );
    gsap.from(".contact-edition", {
      rotate: -3,
      y: 20,
      opacity: 0,
      duration: 0.9,
      delay: 0.12,
      ease: "power3.out",
      clearProps: "transform,opacity",
    });
  }
  document
    .querySelectorAll<HTMLElement>("[data-reveal-image]")
    .forEach((el) => {
      if (el.closest(".about-story, .service-chapter, .seo-overview")) return;
      gsap.from(el, {
        y: 18,
        opacity: 0,
        duration: 1.25,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        clearProps: "transform,opacity",
      });
    });
  const desktop = window.matchMedia("(min-width: 900px)").matches;
  if (desktop) {
    document.querySelectorAll<HTMLElement>(".story-detail").forEach((el) =>
      gsap.fromTo(
        el,
        { y: 45 },
        {
          y: -45,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest(".work-story"),
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        },
      ),
    );
  }
  document.querySelectorAll<HTMLElement>(".process-list li").forEach((el) =>
    gsap.from(el, {
      y: 22,
      opacity: 0,
      duration: 0.7,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 94%", once: true },
      clearProps: "all",
    }),
  );
  return () => ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});
import "./photo-viewer";

// Service chapter navigation reflects position without intercepting native scrolling.
const serviceLinks = [
  ...document.querySelectorAll<HTMLAnchorElement>(".service-index a"),
];
if (serviceLinks.length && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      serviceLinks.forEach((link) => {
        if (link.hash === `#${visible.target.id}`)
          link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    },
    { rootMargin: "-15% 0px -55% 0px" },
  );
  document
    .querySelectorAll(".service-chapter")
    .forEach((chapter) => observer.observe(chapter));
}

import "./roots";
