"use strict";

const assert = require("node:assert/strict");

process.env.HIGHLEVEL_WEBHOOK_URL = "https://example.invalid/webhook";
const contactHandler = require("./contact");

function request(method, body, address) {
  return {
    method,
    body,
    headers: { "x-forwarded-for": address },
    socket: {},
  };
}

function response() {
  return {
    headers: {},
    statusCode: 200,
    body: null,
    setHeader(name, value) { this.headers[name] = value; },
    status(code) { this.statusCode = code; return this; },
    json(body) { this.body = body; return this; },
  };
}

async function run() {
  const providerCalls = [];
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async (url, options) => {
    providerCalls.push({ url, options });
    return { ok: true, status: 200 };
  };

  try {
    const methodResponse = response();
    await contactHandler(request("GET", {}, "192.0.2.1"), methodResponse);
    assert.equal(methodResponse.statusCode, 405);
    assert.equal(methodResponse.headers.Allow, "POST");

    const invalidResponse = response();
    await contactHandler(request("POST", { nombre: "A" }, "192.0.2.2"), invalidResponse);
    assert.equal(invalidResponse.statusCode, 400);

    const honeypotResponse = response();
    await contactHandler(request("POST", { website: "robot.example" }, "192.0.2.3"), honeypotResponse);
    assert.equal(honeypotResponse.statusCode, 200);
    assert.equal(providerCalls.length, 0);

    const validPayload = {
      tipo_contacto: "diagnostico",
      nombre: "Ana Pérez",
      empresa: "Empresa de prueba",
      cargo: "Directora de operaciones",
      email: "ana@example.com",
      telefono: "+34 600 000 000",
      alcance: ["Digitalización de procesos", "IA aplicada"],
      etapa_empresa: "Pyme en crecimiento",
      rango_presupuesto: "25K – 50K",
      notas: "Necesitamos revisar un proceso.",
      origen_contexto: "digitalizacion",
      origen_nota: "automatizar-sin-arrastrar-caos",
      pagina_origen: "https://www.medla-empresas.com/digitalizacion.html",
      consentimiento_privacidad: true,
      version_privacidad: "2026-09-04",
      website: "",
    };
    const validResponse = response();
    await contactHandler(request("POST", validPayload, "192.0.2.4"), validResponse);
    assert.equal(validResponse.statusCode, 200);
    assert.equal(providerCalls.length, 1);

    const forwarded = JSON.parse(providerCalls[0].options.body);
    assert.equal(providerCalls[0].url, process.env.HIGHLEVEL_WEBHOOK_URL);
    assert.equal(forwarded.alcance, "Digitalización de procesos, IA aplicada");
    assert.equal(forwarded.email, "ana@example.com");
    assert.equal(forwarded.empresa, "Empresa de prueba");
    assert.equal(forwarded.cargo, "Directora de operaciones");
    assert.equal(forwarded.origen_contexto, "digitalizacion");
    assert.equal(forwarded.origen_nota, "automatizar-sin-arrastrar-caos");
    assert.equal(forwarded.pagina_origen, "https://www.medla-empresas.com/digitalizacion.html");
    assert.equal(Object.hasOwn(forwarded, "website"), false);
    assert.equal(Object.hasOwn(forwarded, "ip"), false);
    assert.match(forwarded.fecha, /^\d{4}-\d{2}-\d{2}T/);

    let limitedResponse;
    for (let attempt = 0; attempt < 6; attempt += 1) {
      limitedResponse = response();
      await contactHandler(request("POST", {}, "192.0.2.5"), limitedResponse);
    }
    assert.equal(limitedResponse.statusCode, 429);
    assert.equal(providerCalls.length, 1);

    const serviceCases = [
      ["fiscal", "Auditoría y asesoría fiscal"],
      ["crm", "CRM y desarrollo comercial"],
      ["erp", "ERP y digitalización"],
      ["desarrollo", "Desarrollo a medida"],
      ["comercial", "CRM y desarrollo comercial"],
      ["jotform", "Jotform y formularios"],
    ];
    for (const [index, [context, scope]] of serviceCases.entries()) {
      const serviceResponse = response();
      const previousCalls = providerCalls.length;
      await contactHandler(request("POST", {
        ...validPayload,
        alcance: [scope],
        origen_contexto: context,
      }, `192.0.2.${10 + index}`), serviceResponse);
      assert.equal(serviceResponse.statusCode, 200, `${context}: accepted`);
      assert.equal(providerCalls.length, previousCalls + 1);
      const serviceForwarded = JSON.parse(providerCalls.at(-1).options.body);
      assert.equal(serviceForwarded.alcance, scope);
      assert.equal(serviceForwarded.origen_contexto, context);
      assert.equal(serviceForwarded.notas, validPayload.notas);
    }

    const allServiceScopes = [
      "CRM y desarrollo comercial", "ERP y digitalización", "Desarrollo a medida", "Automatización e integración",
      "Auditoría y asesoría fiscal", "Constitución / reestructura", "Jotform y formularios",
      "IA aplicada", "Asesoría legal corporativa", "Inversión y financiación",
    ];
    const multiServiceResponse = response();
    await contactHandler(request("POST", {
      ...validPayload,
      alcance: allServiceScopes,
      notas: "x".repeat(3000),
    }, "192.0.2.20"), multiServiceResponse);
    assert.equal(multiServiceResponse.statusCode, 200);
    const multiServiceForwarded = JSON.parse(providerCalls.at(-1).options.body);
    assert.equal(multiServiceForwarded.alcance, allServiceScopes.join(", "));
    assert.equal(multiServiceForwarded.notas.length, 3000);

    const callsBeforeUnknown = providerCalls.length;
    const unknownScopeResponse = response();
    await contactHandler(request("POST", {
      ...validPayload,
      alcance: ["Servicio desconocido"],
    }, "192.0.2.21"), unknownScopeResponse);
    assert.equal(unknownScopeResponse.statusCode, 400);
    assert.equal(providerCalls.length, callsBeforeUnknown);

    const filteredScopeResponse = response();
    await contactHandler(request("POST", {
      ...validPayload,
      alcance: ["Auditoría y asesoría fiscal", "Servicio desconocido", "Auditoría y asesoría fiscal"],
    }, "192.0.2.22"), filteredScopeResponse);
    assert.equal(filteredScopeResponse.statusCode, 200);
    assert.equal(JSON.parse(providerCalls.at(-1).options.body).alcance, "Auditoría y asesoría fiscal");

    const callsBeforeConsent = providerCalls.length;
    const missingConsentResponse = response();
    await contactHandler(request("POST", {
      ...validPayload,
      alcance: ["Auditoría y asesoría fiscal"],
      consentimiento_privacidad: false,
    }, "192.0.2.23"), missingConsentResponse);
    assert.equal(missingConsentResponse.statusCode, 400);
    assert.equal(providerCalls.length, callsBeforeConsent);
  } finally {
    globalThis.fetch = originalFetch;
  }
}

run().then(
  () => process.stdout.write("contact api: ok\n"),
  (error) => {
    process.stderr.write(`${error.stack || error}\n`);
    process.exitCode = 1;
  },
);
