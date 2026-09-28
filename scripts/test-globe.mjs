import assert from "node:assert/strict";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { build } from "esbuild";

// Compile in memory: this test never rewrites the site's committed bundles.
const { outputFiles } = await build({
  entryPoints: [fileURLToPath(new URL("../components/medla-aperture.jsx", import.meta.url))],
  bundle: true,
  write: false,
  format: "iife",
  globalName: "MedlaScene",
  target: "es2018",
  logLevel: "silent",
});
const source = outputFiles[0].text;

function testScene(reducedMotion) {
  const effects = [], queue = new Map(), listeners = new Map();
  let nextId = 0, time = 0, draws = 0, intersection;
  let disconnected = 0;
  const finite = (...values) => values.forEach(value => {
    assert.equal(typeof value, "number", "Canvas coordinates must be numbers");
    assert.ok(Number.isFinite(value), "Canvas coordinates must remain finite");
  });
  const gradient = { addColorStop(offset) { finite(offset); assert.ok(offset >= 0 && offset <= 1); } };
  const context = {
    createLinearGradient(...values) { finite(...values); return gradient; },
    createRadialGradient(...values) { finite(...values); return gradient; },
    setTransform: finite,
    clearRect(...values) { finite(...values); draws++; },
    moveTo: finite,
    lineTo: finite,
    arc: finite,
    beginPath() {},
    fill() {},
    stroke() {},
  };
  const bounds = { left: 0, top: 0, width: 800, height: 700 };
  const eventTarget = {
    addEventListener(type, callback) { listeners.set(type, callback); },
    removeEventListener(type, callback) { if (listeners.get(type) === callback) listeners.delete(type); },
  };
  const hero = { ...eventTarget, getBoundingClientRect: () => bounds };
  const canvas = { getContext: () => context, getBoundingClientRect: () => bounds, closest: () => hero };
  const browser = { ...eventTarget, devicePixelRatio: 3 };
  const document = { ...eventTarget, hidden: false };
  const sandbox = {
    React: {
      useEffect(callback) { effects.push(callback); },
      useRef(value) { return { current: value }; },
      createElement(_tag, props) { if (props?.ref) props.ref.current = canvas; return null; },
    },
    window: browser,
    document,
    ResizeObserver: class {
      observe() {}
      disconnect() { disconnected++; }
    },
    IntersectionObserver: class {
      constructor(callback) { intersection = callback; }
      observe() { intersection([{ isIntersecting: true }]); }
      disconnect() { disconnected++; }
    },
    requestAnimationFrame(callback) { queue.set(++nextId, callback); return nextId; },
    cancelAnimationFrame(id) { queue.delete(id); },
  };
  browser.IntersectionObserver = sandbox.IntersectionObserver;
  vm.createContext(sandbox);
  vm.runInContext(source, sandbox);
  sandbox.MedlaScene.default({ reducedMotion });
  const cleanups = effects.map(callback => callback()).filter(callback => typeof callback === "function");

  function advance(frames) {
    for (let i = 0; i < frames; i++) {
      time += 1000 / 60;
      const callbacks = [...queue.values()];
      queue.clear();
      callbacks.forEach(callback => callback(time));
      assert.ok(queue.size <= 1, "Only one animation frame may be scheduled");
    }
  }

  advance(180);
  assert.equal(canvas.width, 1600, "Pixel ratio must be capped at two");
  assert.equal(canvas.height, 1400, "Pixel ratio must be capped at two");
  if (reducedMotion) {
    assert.equal(draws, 1, "Reduced motion must render one finished still");
    assert.equal(queue.size, 0, "Reduced motion must not keep an animation loop");
    listeners.get("pointermove")?.({ pointerType: "mouse", clientX: 740, clientY: 220 });
    advance(30);
    assert.equal(draws, 1, "Pointer movement must not animate reduced motion");
  } else {
    assert.ok(draws >= 85 && draws <= 91, "Rotation should render at approximately 30fps, not 60fps");
    assert.equal(queue.size, 1, "Normal motion should keep rotating while visible");
  }

  document.hidden = true;
  listeners.get("visibilitychange")();
  const beforeHidden = draws;
  advance(60);
  assert.equal(queue.size, 0, "A hidden tab must cancel animation scheduling");
  assert.equal(draws, beforeHidden, "A hidden tab must not redraw");

  document.hidden = false;
  listeners.get("visibilitychange")();
  advance(3);
  assert.ok(draws > beforeHidden, "Returning to the tab must restore the scene");
  intersection([{ isIntersecting: false }]);
  const beforeOffscreen = draws;
  advance(60);
  assert.equal(queue.size, 0, "An offscreen globe must cancel animation scheduling");
  assert.equal(draws, beforeOffscreen, "An offscreen globe must not redraw");

  intersection([{ isIntersecting: true }]);
  advance(3);
  assert.ok(draws > beforeOffscreen, "An onscreen globe must resume rendering");
  cleanups.forEach(callback => callback());
  assert.equal(queue.size, 0, "Unmounting must cancel pending frames");
  assert.equal(listeners.size, 0, "Unmounting must remove event listeners");
  assert.equal(disconnected, 2, "Unmounting must disconnect both observers");
}

testScene(false);
testScene(true);
console.log("globe: ok (30fps, finite coordinates, DPR cap, visibility, reduced motion, cleanup)");
