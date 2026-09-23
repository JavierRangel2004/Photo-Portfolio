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
  document
    .querySelectorAll<HTMLElement>("[data-reveal-image]")
    .forEach((el) => {
      gsap.from(el, {
        clipPath: "inset(12% 0 12% 0)",
        duration: 1.25,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        clearProps: "clipPath",
      });
    });
  const desktop = window.matchMedia("(min-width: 900px)").matches;
  if (desktop) {
    document
      .querySelectorAll<HTMLElement>(".story-detail")
      .forEach((el) =>
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
  document
    .querySelectorAll<HTMLElement>(".process-list li")
    .forEach((el) =>
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
window.addEventListener("pagehide", () => media.revert(), { once: true });
const dialog = document.querySelector<HTMLDialogElement>("#photo-dialog");
const img = dialog?.querySelector<HTMLImageElement>("img");
const caption = dialog?.querySelector<HTMLElement>(".photo-dialog-caption");
let source: HTMLElement | null = null;
let current = 0;
const links = Array.from(
  document.querySelectorAll<HTMLAnchorElement>("[data-photo]"),
);
function showPhoto(index: number) {
  if (!img || !caption) return;
  current = (index + links.length) % links.length;
  const link = links[current];
  img.src = link.dataset.photo!;
  img.alt = link.querySelector("img")?.alt || "";
  caption.textContent = `${link.dataset.caption || ""} — ${current + 1} / ${links.length}`;
}
links.forEach((link, index) =>
  link.addEventListener("click", (event) => {
    if (!dialog || !img) return;
    event.preventDefault();
    source = link;
    showPhoto(index);
    dialog.showModal();
    document.body.classList.add("dialog-open");
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      gsap.fromTo(
        img,
        { scale: 0.94, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power3.out" },
      );
  }),
);
dialog
  ?.querySelector("button")
  ?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", (e) => {
  if (e.target === dialog) dialog.close();
});
dialog?.addEventListener("close", () => {
  document.body.classList.remove("dialog-open");
  source?.focus();
});
dialog?.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    e.preventDefault();
    showPhoto(current + 1);
  }
  if (e.key === "ArrowLeft") {
    e.preventDefault();
    showPhoto(current - 1);
  }
});
if (dialog && links.length > 1) {
  const es = document.documentElement.lang === "es";
  for (const [label, step] of [
    [es ? "Anterior" : "Previous", -1],
    [es ? "Siguiente" : "Next", 1],
  ] as const) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = step === -1 ? "photo-prev" : "photo-next";
    b.textContent = label;
    b.addEventListener("click", () => showPhoto(current + step));
    dialog.append(b);
  }
}
