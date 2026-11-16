// Inline in <head>: never expose the final composition and then rewind it.
(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  root.dataset.motion = 'pending';
  const release = () => {
    if (root.dataset.motion === 'pending') root.dataset.motion = 'static';
  };
  // A failed/slow bundle must never leave photographs or text hidden.
  setTimeout(release, 700);
  for (const event of ['pointerdown', 'keydown', 'scroll', 'pagehide'])
    window.addEventListener(event, release, { once: true, passive: true });
})();
