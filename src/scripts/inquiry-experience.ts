import { gsap } from "gsap";

export function inquiryFieldValid(
  field: HTMLInputElement | HTMLTextAreaElement,
) {
  return (
    field.validity.valid &&
    field.value.trim().length >= (field.name === "message" ? 10 : 1)
  );
}

export function mountInquiryExperience(form: HTMLFormElement) {
  const es = document.documentElement.lang === "es";
  const radios = [
    ...form.querySelectorAll<HTMLInputElement>('input[name="type"]'),
  ];
  const fields = [
    ...form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
      'input[name="name"], input[name="email"], textarea[name="message"]',
    ),
  ];
  const progress = form.querySelector<HTMLElement>("[data-inquiry-progress]");
  const summary = form.querySelector<HTMLElement>("[data-inquiry-summary]");
  const frames = [...document.querySelectorAll<HTMLElement>("[data-edition]")];
  const caption = document.querySelector<HTMLElement>("[data-edition-name]");
  let active = "";
  const leaves = [
    ...form.querySelectorAll<SVGPathElement>("[data-sprout-leaf]"),
  ];
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  let previousValid = -1;
  const applyLeaves = (valid: number, animate: boolean) => {
    gsap.killTweensOf(leaves);
    leaves.forEach((leaf, index) => {
      const values = {
        opacity: index < valid ? 1 : 0.15,
        scale: index < valid ? 1 : 0.58,
      };
      if (animate)
        gsap.to(leaf, {
          ...values,
          duration: 0.45,
          ease: "power3.out",
          overwrite: true,
        });
      else gsap.set(leaf, values);
    });
  };
  reduced.addEventListener("change", () =>
    applyLeaves(Math.max(previousValid, 0), false),
  );
  function update() {
    const selected = radios.find((r) => r.checked);
    const valid = fields.filter(inquiryFieldValid).length + Number(!!selected);
    if (valid !== previousValid) {
      applyLeaves(valid, previousValid >= 0 && !reduced.matches);
      previousValid = valid;
    }
    progress?.style.setProperty("--completion", String(valid / 4));
    if (summary)
      summary.textContent =
        valid === 4
          ? es
            ? "Tu idea está lista para enviar."
            : "Your idea is ready to send."
          : es
            ? "Una idea, unos datos y empezamos."
            : "An idea, a few details, and we can begin.";
    const next = selected?.value || "gastronomy";
    if (next !== active) {
      const incoming = frames.find((f) => f.dataset.edition === next);
      frames.forEach((f) =>
        f.setAttribute("aria-hidden", String(f !== incoming)),
      );
      gsap.killTweensOf(frames);
      gsap.set(frames, { clearProps: "clipPath,transform" });
      if (
        incoming &&
        active &&
        !matchMedia("(prefers-reduced-motion: reduce)").matches
      ) {
        gsap.to(
          frames.filter((f) => f !== incoming),
          { opacity: 0, duration: 0.3, overwrite: true },
        );
        gsap.fromTo(
          incoming,
          { opacity: 0, clipPath: "inset(0 100% 0 0)" },
          {
            opacity: 1,
            clipPath: "inset(0 0% 0 0)",
            duration: 0.65,
            ease: "power3.inOut",
            overwrite: true,
            clearProps: "clipPath",
          },
        );
      } else
        frames.forEach((f) => {
          f.style.opacity = f === incoming ? "1" : "0";
        });
      if (caption)
        caption.textContent =
          selected?.closest("label")?.textContent?.trim() ||
          (es ? "Producto / Gastro" : "Product / Food");
      active = next;
    }
  }
  fields.forEach((field) => {
    const error = document.createElement("span");
    error.className = "field-error";
    error.id = `error-${field.name}`;
    field.setAttribute("aria-describedby", error.id);
    field.after(error);
    function validate() {
      const invalid = !inquiryFieldValid(field);
      field.setAttribute("aria-invalid", String(invalid));
      error.textContent = invalid
        ? (field.validity.typeMismatch
            ? es
              ? "Escribe un correo válido."
              : "Enter a valid email address."
            : "") ||
          (field.name === "message"
            ? es
              ? "Cuéntame tu idea en al menos 10 caracteres, sin contar espacios al inicio o al final."
              : "Describe your idea in at least 10 characters, excluding leading or trailing spaces."
            : es
              ? "Completa este campo."
              : "Please complete this field.")
        : "";
    }
    field.addEventListener("invalid", validate);
    field.addEventListener("blur", () => {
      if (field.value || field.getAttribute("aria-invalid") === "true")
        validate();
    });
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validate();
      form.removeAttribute("data-state");
      update();
    });
  });
  form.addEventListener("change", update);
  form.addEventListener("reset", () =>
    requestAnimationFrame(() => {
      fields.forEach((f) => {
        f.removeAttribute("aria-invalid");
        const e = document.getElementById(`error-${f.name}`);
        if (e) e.textContent = "";
      });
      update();
    }),
  );
  update();
}
