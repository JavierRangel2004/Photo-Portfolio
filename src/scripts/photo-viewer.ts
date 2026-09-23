import { gsap } from "gsap";

const dialog = document.querySelector<HTMLDialogElement>("#photo-dialog");
const img = dialog?.querySelector<HTMLImageElement>("img");
const caption = dialog?.querySelector<HTMLElement>(".photo-dialog-caption");
const links = [...document.querySelectorAll<HTMLAnchorElement>("[data-photo]")];
const reduced = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
let source: HTMLAnchorElement | null = null;
let current = 0;
let displayed = 0;
let request = 0;
let closing = false;

async function showPhoto(index: number, opening = false) {
  if (!dialog || !img || !caption || !links.length) return;
  const ticket = ++request;
  gsap.killTweensOf(img);
  gsap.set(img, { clearProps: "all" });
  current = (index + links.length) % links.length;
  const link = links[current];
  const next = new Image();
  next.src = link.dataset.photo!;
  // Keep the current photograph visible while the next original downloads.
  try {
    await next.decode();
  } catch {
    if (ticket !== request || closing) return;
    current = displayed;
    if (opening) window.location.assign(link.href);
    else
      caption.textContent =
        document.documentElement.lang === "es"
          ? "No se pudo cargar esa fotografía. Puedes intentar otra vez."
          : "That photograph could not load. You can try again.";
    return;
  }
  if (ticket !== request || closing) return;
  if (!opening && !reduced()) {
    await gsap.to(img, { opacity: 0, duration: 0.16, overwrite: true });
    if (ticket !== request || closing) return;
  }
  gsap.killTweensOf(img);
  gsap.set(img, { clearProps: "all" });
  displayed = current;
  img.src = next.src;
  img.alt = link.querySelector("img")?.alt || "";
  caption.textContent = `${link.dataset.caption || img.alt} — ${current + 1} / ${links.length}`;
  if (opening) {
    const origin = source?.querySelector("img")?.getBoundingClientRect();
    dialog.showModal();
    document.body.classList.add("dialog-open");
    const target = img.getBoundingClientRect();
    if (!reduced()) {
      gsap.fromTo(
        dialog,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, clearProps: "opacity" },
      );
      gsap.fromTo(
        img,
        {
          x: origin
            ? origin.left + origin.width / 2 - target.left - target.width / 2
            : 0,
          y: origin
            ? origin.top + origin.height / 2 - target.top - target.height / 2
            : 12,
          scale: origin
            ? Math.min(
                origin.width / target.width,
                origin.height / target.height,
              )
            : 0.96,
          opacity: 0.5,
        },
        {
          x: 0,
          y: 0,
          scale: 1,
          opacity: 1,
          duration: 0.62,
          ease: "power3.out",
          clearProps: "all",
        },
      );
    }
  } else if (!reduced()) {
    gsap.fromTo(
      img,
      { opacity: 0, scale: 0.99 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.38,
        ease: "power2.out",
        clearProps: "all",
      },
    );
  }
}
function closePhoto() {
  if (!dialog?.open || !img || closing) return;
  closing = true;
  ++request;
  gsap.killTweensOf(img);
  if (reduced()) dialog.close();
  else
    gsap.to(dialog, {
      opacity: 0,
      duration: 0.2,
      overwrite: true,
      onComplete: () => dialog.close(),
    });
}
links.forEach((link, index) =>
  link.addEventListener("click", (event) => {
    if (
      !dialog ||
      !img ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    )
      return;
    event.preventDefault();
    source = link;
    closing = false;
    void showPhoto(index, true);
  }),
);
dialog?.querySelector(".photo-close")?.addEventListener("click", closePhoto);
dialog?.addEventListener("click", (event) => {
  if (event.target === dialog) closePhoto();
});
dialog?.addEventListener("cancel", (event) => {
  event.preventDefault();
  closePhoto();
});
dialog?.addEventListener("close", () => {
  ++request;
  closing = false;
  gsap.set(dialog, { clearProps: "opacity" });
  document.body.classList.remove("dialog-open");
  source?.focus({ preventScroll: true });
});
dialog?.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;
  event.preventDefault();
  void showPhoto(current + (event.key === "ArrowRight" ? 1 : -1));
});
if (dialog && links.length > 1) {
  const es = document.documentElement.lang === "es";
  for (const [label, step] of [
    [es ? "Anterior" : "Previous", -1],
    [es ? "Siguiente" : "Next", 1],
  ] as const) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = step === -1 ? "photo-prev" : "photo-next";
    button.textContent = label;
    button.addEventListener("click", () => {
      if (!closing) void showPhoto(current + step);
    });
    dialog.append(button);
  }
}
