import assert from "node:assert/strict";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

const testRoot = path.dirname(fileURLToPath(import.meta.url));

const code = esbuild.buildSync({
  entryPoints: [path.join(testRoot, "../components/use-scroll-scene.jsx")],
  bundle: true,
  format: "cjs",
  write: false,
}).outputFiles[0].text;

function target(tag = "body", roles = [], editable = false) {
  return { closest: (selector) => selector.split(",").some((part) => {
    if (part === tag) return true;
    if (part.startsWith("[contenteditable]")) return editable;
    const role = part.match(/^\[role=([^\]]+)\]$/)?.[1];
    return role && roles.includes(role);
  }) ? {} : null };
}

// Deterministic hook harness: exercise event intent and scheduling without a
// browser or wall-clock timers. Visual/browser behavior is checked separately.
function harness(options = {}) {
  const slots = [], listeners = new Map(), frames = new Map();
  let cursor = 0, effects = [], nextFrame = 0, now = 1000, output;
  const add = (name, fn) => {
    if (!listeners.has(name)) listeners.set(name, new Set());
    listeners.get(name).add(fn);
  };
  const remove = (name, fn) => listeners.get(name)?.delete(fn);
  const win = {
    innerHeight: 900, innerWidth: 1000, scrollY: 0,
    addEventListener: add, removeEventListener: remove,
    requestAnimationFrame: (fn) => { frames.set(++nextFrame, fn); return nextFrame; },
    cancelAnimationFrame: (id) => frames.delete(id),
  };
  const doc = {
    hidden: false,
    documentElement: { clientWidth: 980, clientHeight: 900, scrollHeight: 2400, clientLeft: 0 },
    addEventListener: add, removeEventListener: remove,
  };
  const React = {
    useState(initial) {
      const i = cursor++;
      slots[i] ??= { value: typeof initial === "function" ? initial() : initial };
      return [slots[i].value, (value) => { slots[i].value = typeof value === "function" ? value(slots[i].value) : value; }];
    },
    useRef(value) { return slots[cursor++] ??= { current: value }; },
    useCallback(fn) { cursor++; return fn; },
    useEffect(fn, deps) {
      const i = cursor++, old = slots[i];
      if (!old || deps.some((dep, index) => !Object.is(dep, old.deps[index]))) {
        old?.cleanup?.();
        slots[i] = { deps };
        effects.push(() => { slots[i].cleanup = fn(); });
      }
    },
  };
  const context = { module: { exports: {} }, exports: {}, React, window: win, document: doc, performance: { now: () => now } };
  vm.runInNewContext(code, context);
  const useScene = context.module.exports.default;
  const ref = { current: { getBoundingClientRect: () => ({ top: 170 - win.scrollY, bottom: 770 - win.scrollY, height: 600 }) } };
  let props = { ref, count: 4, reducedMotion: false, resetKey: 0, ...options };
  function render() {
    cursor = 0;
    output = useScene(props);
    const pending = effects;
    effects = [];
    pending.forEach((fn) => fn());
  }
  function flush() {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((fn) => fn());
    render();
  }
  function emit(name, event = {}) {
    for (const fn of listeners.get(name) || []) fn({ type: name, defaultPrevented: false, target: target(), ...event });
  }
  render(); flush();
  return {
    get phase() { return output.phase; },
    get scheduledFrames() { return frames.size; },
    win, doc, emit, flush,
    select(value) { output.selectPhase(value); render(); },
    scroll(y = 100) { win.scrollY = y; emit("scroll"); flush(); },
    tick(ms) { now += ms; },
    configure(changes) { props = { ...props, ...changes }; render(); flush(); },
    destroy() { slots.forEach((slot) => slot?.cleanup?.()); },
  };
}

let passed = 0;
function test(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }
function keyCase(key, element, expected, extra = {}) {
  const scene = harness();
  scene.select(3);
  scene.emit("keydown", { key, target: element, ...extra });
  scene.scroll();
  assert.equal(scene.phase, expected);
  scene.destroy();
}
test("initial phase is zero and no RAF loop remains", () => {
  const scene = harness(); assert.equal(scene.phase, 0); assert.equal(scene.scheduledFrames, 0); scene.destroy();
});
test("PageDown on an ordinary button resumes scroll", () => keyCase("PageDown", target("button"), 1));
test("ArrowDown on an ordinary button resumes scroll", () => keyCase("ArrowDown", target("button"), 1));
test("PageUp on an ordinary link resumes scroll", () => keyCase("PageUp", target("a"), 1));
test("Home on an ordinary link resumes scroll", () => keyCase("Home", target("a"), 1));
test("Space on an ordinary link scrolls rather than activates", () => keyCase(" ", target("a"), 1));
test("Space on a button keeps the manual phase", () => keyCase(" ", target("button"), 3));
test("Space on a details summary keeps the manual phase during scroll anchoring", () => keyCase(" ", target("summary"), 3));
test("legacy Spacebar on a details summary keeps the manual phase", () => keyCase("Spacebar", target("summary"), 3));
test("PageDown on a details summary still resumes intentional scrolling", () => keyCase("PageDown", target("summary"), 1));
test("Space on a custom button keeps the manual phase", () => keyCase("Spacebar", target("div", ["button"]), 3));
test("ArrowDown consumed by a tab stays manual", () => keyCase("ArrowDown", target("button", ["tab"]), 3));
test("Home inside a tablist stays manual", () => keyCase("Home", target("button", ["tablist"]), 3));
test("PageDown on a tab still scrolls when not prevented", () => keyCase("PageDown", target("button", ["tab"]), 1));
test("prevented page-scroll key cannot unlock a phase", () => keyCase("PageDown", target("button"), 3, { defaultPrevented: true }));
test("input keyboard navigation remains local", () => keyCase("ArrowDown", target("input"), 3));
test("editable text keyboard navigation remains local", () => keyCase("PageDown", target("div", [], true), 3));
test("slider keyboard navigation remains local", () => keyCase("PageDown", target("div", ["slider"]), 3));
test("modifier shortcut cannot unlock a phase", () => keyCase("Home", target("a"), 3, { ctrlKey: true }));

const pointer = { button: 0, pointerType: "mouse", pointerId: 7, clientX: 990, clientY: 220 };
test("native right scrollbar gutter unlocks on scroll", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", pointer); scene.scroll(); assert.equal(scene.phase, 1); scene.destroy();
});
test("a slow held scrollbar drag remains deliberate", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", pointer); scene.tick(3000); scene.scroll(); assert.equal(scene.phase, 1); scene.destroy();
});
test("native left scrollbar gutter is supported", () => {
  const scene = harness(); scene.doc.documentElement.clientLeft = 20; scene.select(3); scene.emit("pointerdown", { ...pointer, clientX: 5 }); scene.scroll(); assert.equal(scene.phase, 1); scene.destroy();
});
test("a content click near the edge does not unlock", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", { ...pointer, clientX: 978 }); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("no guessed edge intent when there is no measured gutter", () => {
  const scene = harness(); scene.doc.documentElement.clientWidth = 1000; scene.select(3); scene.emit("pointerdown", pointer); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("horizontal scrollbar position cannot unlock vertical progress", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", { ...pointer, clientY: 905 }); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("cancelled scrollbar drag leaves no stale intent", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", pointer); scene.emit("pointercancel", pointer); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("window blur clears a held scrollbar intent", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", pointer); scene.emit("blur"); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("released scrollbar intent expires", () => {
  const scene = harness(); scene.select(3); scene.emit("pointerdown", pointer); scene.emit("pointerup", pointer); scene.tick(1000); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("resize and programmatic focus scroll keep the manual choice", () => {
  const scene = harness(); scene.select(3); scene.emit("resize"); scene.flush(); scene.scroll(); assert.equal(scene.phase, 3); scene.destroy();
});
test("wheel resumes a selected phase", () => {
  const scene = harness(); scene.select(3); scene.emit("wheel", { deltaY: 15 }); scene.scroll(); assert.equal(scene.phase, 1); scene.destroy();
});
test("reduced motion stays static and allows manual tabs", () => {
  const scene = harness({ reducedMotion: true }); scene.select(2); scene.emit("keydown", { key: "PageDown", target: target("button") }); scene.scroll(); assert.equal(scene.phase, 2); scene.destroy();
});
test("category reset begins at zero and remains manually locked", () => {
  const scene = harness(); scene.scroll(250); scene.configure({ resetKey: 1 }); assert.equal(scene.phase, 0); scene.scroll(260); assert.equal(scene.phase, 0); scene.destroy();
});
test("five-phase consumer reaches the completed phase", () => {
  const scene = harness({ count: 5 }); scene.emit("wheel", { deltaY: 25 }); scene.scroll(300); assert.equal(scene.phase, 4); scene.destroy();
});
console.log(`\n${passed} scroll-scene tests passed.`);
