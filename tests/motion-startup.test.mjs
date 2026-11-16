import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const source = readFileSync(new URL('../src/scripts/motion-prepaint.js', import.meta.url), 'utf8');
function boot(reduced = false) {
  const root = { dataset: {} }; const timers = []; const events = {};
  const context = { document: { documentElement: root }, window: { matchMedia: () => ({ matches: reduced }), addEventListener: (name, fn) => { events[name] = fn; } }, setTimeout: fn => timers.push(fn) };
  runInNewContext(source, context);
  return { root, timers, events };
}
test('prepares before modules; slow or failed modules reveal content and cannot restart', () => {
  const { root, timers } = boot();
  assert.equal(root.dataset.motion, 'pending');
  timers[0]();
  assert.equal(root.dataset.motion, 'static');
});
test('successful startup is not reverted by watchdog', () => {
  const { root, timers } = boot(); root.dataset.motion = 'ready';
  timers[0](); assert.equal(root.dataset.motion, 'ready');
});
test('reduced motion never hides content', () => {
  const { root, timers } = boot(true);
  assert.equal(root.dataset.motion, undefined); assert.equal(timers.length, 0);
});
test('interaction cancels pending entrance rather than moving content beneath the visitor', () => {
  for (const name of ['pointerdown', 'keydown', 'scroll', 'pagehide']) {
    const { root, events } = boot(); events[name]();
    assert.equal(root.dataset.motion, 'static');
  }
});
const startup = readFileSync(new URL('../src/scripts/motion-startup.ts', import.meta.url), 'utf8').replaceAll('export const ', 'var ');
test('late animation modules cannot re-arm entrances after fallback', () => {
  for (const phase of ['static', undefined, 'ready']) {
    const context = { document: { documentElement: { dataset: { motion: phase } } } };
    runInNewContext(startup, context);
    assert.equal(context.entranceEnabled, false);
    assert.equal(context.entranceQuery, 'not all');
  }
});
test('only a pending prepaint state allows a coordinated entrance', () => {
  const context = { document: { documentElement: { dataset: { motion: 'pending' } } } };
  runInNewContext(startup, context);
  assert.equal(context.entranceEnabled, true);
});
