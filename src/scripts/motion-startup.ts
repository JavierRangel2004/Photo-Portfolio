// Capture once before any GSAP context executes. A late bundle must not rewind
// content already released by the prepaint watchdog or by user interaction.
export const entranceEnabled = document.documentElement.dataset.motion === 'pending';
export const entranceQuery = entranceEnabled
  ? '(prefers-reduced-motion: no-preference)'
  : 'not all';
