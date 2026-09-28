import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import { buildSync } from "esbuild";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

// Bundle source modules in memory; tests do not rewrite the published assets.
function loadModule(relative) {
  const code = buildSync({
    entryPoints: [path.join(root, relative)], bundle: true, write: false,
    format: "cjs", platform: "node", logLevel: "silent",
  }).outputFiles[0].text;
  const context = { module: { exports: {} }, exports: {} };
  vm.runInNewContext(code, context, { timeout: 1000 });
  return context.module.exports;
}

const { SERVICE_JOURNEYS } = loadModule("components/service-journeys.js");
const { journeyStage, journeyView } = loadModule("components/service-journey-state.js");
const expectedIds = ["erp", "automatizacion", "desarrollo", "jotform", "crm", "comercial", "fiscal", "constitucion", "legal", "inversiones", "ia"];
const groups = new Set(["operations", "growth", "decision", "ai"]);
const modes = new Set(["document", "fiscal", "flow", "entity", "architecture", "scenarios", "growth", "intake", "agent"]);
const titles = ["Diagnóstico", "Diseño", "Validación", "Entrega"];

// Read the actual form and API allowlists, not a duplicate fixture that can drift.
const contactSource = readFileSync(path.join(root, "contacto.jsx"), "utf8");
const presetLiteral = contactSource.match(/const CONTEXT_PRESETS\s*=\s*([\s\S]*?);\s*\n\s*const requestParams/);
assert.ok(presetLiteral, "Contact preset declaration must remain discoverable");
const presets = vm.runInNewContext(`(${presetLiteral[1]})`, {}, { timeout: 1000 });
const apiSource = readFileSync(path.join(root, "api/contact.js"), "utf8");
const scopesLiteral = apiSource.match(/const ALLOWED_SCOPES\s*=\s*new Set\((\[[\s\S]*?\])\);/);
assert.ok(scopesLiteral, "Contact API scope declaration must remain discoverable");
const scopes = new Set(vm.runInNewContext(scopesLiteral[1], {}, { timeout: 1000 }));

let passed = 0;
function test(name, fn) { fn(); passed++; console.log(`PASS ${name}`); }
function text(value, name) {
  assert.equal(typeof value, "string", `${name} must be text`);
  assert.ok(value.trim(), `${name} must not be empty`);
  assert.equal(value, value.trim(), `${name} must not have stray outer whitespace`);
}

test("catalog has exactly the eleven requested service journeys", () => {
  assert.ok(Array.isArray(SERVICE_JOURNEYS));
  assert.equal(SERVICE_JOURNEYS.length, 11);
  assert.deepEqual([...SERVICE_JOURNEYS.map(item => item.id)].sort(), [...expectedIds].sort());
  assert.equal(new Set(SERVICE_JOURNEYS.map(item => item.id)).size, 11);
});

test("custom development retains its own context instead of becoming an ERP enquiry", () => {
  const development = SERVICE_JOURNEYS.find(item => item.id === "desarrollo");
  assert.equal(development.context, "desarrollo");
  assert.ok(Object.hasOwn(presets, development.context));
  assert.match(presets[development.context].notas, /aplicaci[oó]n|portal|desarrollo a medida/i);
  assert.notEqual(presets[development.context].notas, presets.erp.notas);
  assert.notEqual(presets[development.context].notas, presets.digitalizacion.notas);
});

for (const journey of SERVICE_JOURNEYS) {
  test(`${journey.id}: complete, concrete four-stage content`, () => {
    for (const key of ["id", "label", "group", "mode", "href", "context", "caseTitle", "summary", "input", "outcome"]) text(journey[key], `${journey.id}.${key}`);
    assert.ok(groups.has(journey.group), `${journey.id}: unknown group`);
    assert.ok(modes.has(journey.mode), `${journey.id}: unknown visual mode`);
    assert.ok(Array.isArray(journey.stages));
    assert.equal(journey.stages.length, 4);
    journey.stages.forEach((stage, index) => {
      assert.equal(stage.title, titles[index]);
      for (const key of ["action", "evidence", "owner"]) text(stage[key], `${journey.id}.stages[${index}].${key}`);
    });
    assert.equal(new Set(journey.stages.map(stage => stage.action)).size, 4, "Every phase needs its own action");
    assert.equal(journey.deliverables.length, 3);
    journey.deliverables.forEach((item, index) => text(item, `${journey.id}.deliverables[${index}]`));
    assert.equal(new Set(journey.deliverables).size, 3);
    for (const key of ["trigger", "explanation", "resolution"]) text(journey.exception[key], `${journey.id}.exception.${key}`);
  });

  test(`${journey.id}: real local destination and accepted contact context`, () => {
    const destination = new URL(journey.href, "https://medla.test/");
    assert.equal(destination.origin, "https://medla.test", "Service destinations must stay local");
    assert.ok(destination.pathname.endsWith(".html"), "Service destination must be a page");
    assert.ok(existsSync(path.join(root, decodeURIComponent(destination.pathname))), `Missing page: ${journey.href}`);
    assert.ok(Object.hasOwn(presets, journey.context), `Missing contact preset: ${journey.context}`);
    const preset = presets[journey.context];
    assert.ok(Array.isArray(preset.alcance) && preset.alcance.length > 0);
    preset.alcance.forEach(scope => assert.ok(scopes.has(scope), `API rejects preset scope: ${scope}`));
    text(preset.notas, `${journey.context}: contact notes`);
  });

  test(`${journey.id}: each normal phase uses matching source content`, () => {
    for (let index = 0; index < 4; index++) {
      const view = journeyView(journey, index);
      assert.equal(view.stage, index);
      assert.equal(view.title, journey.stages[index].title);
      assert.equal(view.action, journey.stages[index].action);
      assert.equal(view.evidence, journey.stages[index].evidence);
      assert.equal(view.owner, journey.stages[index].owner);
      assert.equal(view.blocked, false);
      assert.equal(view.complete, index === 3);
    }
  });

  test(`${journey.id}: an unresolved issue cannot show a delivery`, () => {
    for (const requestedStage of [0, 1, 2, 3, 4, 100, "3"]) {
      const view = journeyView(journey, requestedStage, "open");
      assert.ok(view.stage <= 2);
      assert.equal(view.complete, false);
      assert.equal(view.blocked, view.stage === 2);
      if (view.blocked) {
        assert.equal(view.title, "Validación");
        assert.equal(view.action, journey.exception.explanation);
        assert.equal(view.evidence, journey.exception.trigger);
        assert.equal(view.owner, journey.stages[2].owner);
      }
    }
    const resolved = journeyView(journey, 3, "resolved");
    assert.equal(resolved.stage, 3);
    assert.equal(resolved.complete, true);
    assert.equal(resolved.blocked, false);
    assert.equal(resolved.action, journey.stages[3].action);
    assert.equal(resolved.evidence, journey.stages[3].evidence);
  });
}

test("stage input remains bounded, integral and safe for missing/non-finite values", () => {
  const cases = [[undefined, 0], [null, 0], [NaN, 0], [Infinity, 0], [-Infinity, 0], ["bad", 0], [-99, 0], [-0.5, 0], [0, 0], [1.9, 1], [2.99, 2], [3, 3], [99, 3], ["2", 2]];
  cases.forEach(([input, expected]) => {
    assert.equal(journeyStage(input), expected, `Unexpected phase for ${String(input)}`);
    assert.equal(journeyStage(input, "open"), Math.min(expected, 2));
    assert.equal(journeyStage(input, "resolved"), expected);
  });
});

test("opening, resolving and returning to the normal example never mutates case data", () => {
  const before = JSON.stringify(SERVICE_JOURNEYS);
  SERVICE_JOURNEYS.forEach(journey => {
    journeyView(journey, 2, "open");
    journeyView(journey, 3, "resolved");
    assert.equal(journeyView(journey, 0, "none").evidence, journey.stages[0].evidence);
  });
  assert.equal(JSON.stringify(SERVICE_JOURNEYS), before);
});

console.log(`\n${passed} service-journey tests passed (no network calls or form submissions).`);
