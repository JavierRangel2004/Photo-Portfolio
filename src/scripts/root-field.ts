import { gsap } from "gsap";

/** A deterministic root field, drawn only while its geometry or interaction changes. */
export function createRootField(host: HTMLElement) {
  const canvas = host.querySelector<HTMLCanvasElement>(".root-field");
  const origin = host.querySelector<HTMLElement>(".roots-origin");
  const worlds = [...host.querySelectorAll<HTMLElement>(".root-world")];
  if (!canvas || !origin) return;
  const context = canvas.getContext("2d");
  if (!context) return;
  const ctx = context;
  const state = {
    growth: 0,
    pointerX: -1000,
    pointerY: -1000,
    force: 0,
    active: -1,
  };
  let width = 0,
    height = 0,
    visible = true,
    pending = 0;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const seed = (n: number) => {
    const v = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return v - Math.floor(v);
  };
  const draw = () => {
    pending = 0;
    if (!visible || !width || !height) return;
    const bounds = canvas.getBoundingClientRect();
    const source = origin.getBoundingClientRect();
    const start = {
      x: source.left + source.width * 0.5 - bounds.left,
      y: source.bottom - bounds.top - 8,
    };
    ctx.clearRect(0, 0, width, height);
    worlds.forEach((world, branch) => {
      const photo = world
        .querySelector(".root-aperture")!
        .getBoundingClientRect();
      const end = {
        x: photo.left + photo.width * 0.5 - bounds.left,
        y: photo.top + photo.height * 0.2 - bounds.top,
      };
      const side = branch === 0 ? -1 : 1;
      const strength = state.active < 0 || state.active === branch ? 1 : 0.23;
      // Each root has its own travel time and curvature; lateral roots inherit its tangent.
      for (let strand = 0; strand < 17; strand++) {
        const random = seed(branch * 100 + strand);
        const progress = reduced.matches
          ? 1
          : Math.min(1, Math.max(0, (state.growth - strand * 0.009) / 0.82));
        if (!progress) continue;
        const spread = (strand - 8) * 2.3;
        const points: { x: number; y: number }[] = [];
        const steps = 45;
        for (let step = 0; step <= steps; step++) {
          const t = (step / steps) * progress,
            u = 1 - t;
          let x =
            u * u * u * start.x +
            3 * u * u * t * (start.x + spread) +
            3 * u * t * t * (end.x - side * 75 + spread * 3) +
            t * t * t * end.x;
          let y =
            u * u * u * start.y +
            3 * u * u * t * (start.y + 70) +
            3 * u * t * t * (end.y - 70 + random * 65) +
            t * t * t * end.y;
          const envelope = Math.sin(t * Math.PI);
          x += Math.sin(t * 12 + random * 6) * (4 + random * 9) * envelope;
          y += Math.cos(t * 9 + random * 8) * 5 * envelope;
          const dx = state.pointerX - x,
            dy = state.pointerY - y;
          const influence =
            Math.max(0, 1 - Math.hypot(dx, dy) / 160) * state.force * envelope;
          x += dx * influence * 0.16;
          y += dy * influence * 0.16;
          points.push({ x, y });
        }
        ctx.beginPath();
        points.forEach((p, i) =>
          i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y),
        );
        ctx.strokeStyle =
          strand % 4 === 0
            ? `rgba(205,184,127,${0.5 * strength})`
            : `rgba(145,173,143,${0.22 * strength})`;
        ctx.lineWidth = strand % 4 === 0 ? 0.85 : 0.55;
        ctx.stroke();
        for (let twig = 0; twig < 4; twig++) {
          const t = 0.25 + twig * 0.16 + random * 0.06;
          if (progress < t) continue;
          const p =
            points[
              Math.min(points.length - 1, Math.round((t / progress) * steps))
            ];
          const length =
            (22 + seed(strand * 9 + twig + branch) * 48) *
            Math.min(1, (progress - t) * 5);
          const direction = (strand + twig) % 2 ? -1 : 1;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.bezierCurveTo(
            p.x + direction * length * 0.5,
            p.y + 5,
            p.x + direction * length * 0.5,
            p.y + length * 0.6,
            p.x + direction * length,
            p.y + length * 0.8,
          );
          ctx.strokeStyle = `rgba(145,173,143,${0.18 * strength})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    });
  };
  const render = () => {
    if (!pending && visible) pending = requestAnimationFrame(draw);
  };
  const resize = () => {
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    render();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && !document.hidden;
    if (visible) render();
  });
  intersection.observe(host);
  const visibility = () => {
    visible = !document.hidden;
    if (visible) render();
  };
  document.addEventListener("visibilitychange", visibility);
  const moveX = gsap.quickTo(state, "pointerX", {
    duration: 0.65,
    ease: "power3.out",
    onUpdate: render,
  });
  const moveY = gsap.quickTo(state, "pointerY", {
    duration: 0.65,
    ease: "power3.out",
    onUpdate: render,
  });
  const move = (event: PointerEvent) => {
    if (reduced.matches || event.pointerType !== "mouse") return;
    const rect = canvas.getBoundingClientRect();
    state.force = 1;
    moveX(event.clientX - rect.left);
    moveY(event.clientY - rect.top);
  };
  host.addEventListener("pointermove", move);
  host.addEventListener("pointerleave", () =>
    gsap.to(state, { force: 0, duration: 0.5, onUpdate: render }),
  );
  worlds.forEach((world, i) => {
    const focus = () => {
      state.active = i;
      render();
    };
    const blur = () => {
      state.active = -1;
      render();
    };
    world.addEventListener("pointerenter", focus);
    world.addEventListener("focus", focus);
    world.addEventListener("pointerleave", blur);
    world.addEventListener("blur", blur);
  });
  const enter = () => {
    gsap.killTweensOf(state, "growth");
    if (reduced.matches) {
      state.growth = 1;
      render();
    } else
      gsap.fromTo(
        state,
        { growth: 0 },
        { growth: 1, duration: 2.4, ease: "power2.inOut", onUpdate: render },
      );
  };
  reduced.addEventListener("change", enter);
  resize();
  canvas.classList.add("is-ready");
  enter();
  return { render, state };
}
