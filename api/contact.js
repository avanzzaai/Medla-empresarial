"use strict";

const PROVIDER_ENDPOINT = process.env.HIGHLEVEL_WEBHOOK_URL;
const PRIVACY_VERSION = "2026-09-04";
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 5;
const buckets = globalThis.__medlaContactBuckets || new Map();
globalThis.__medlaContactBuckets = buckets;

const ALLOWED_TYPES = new Set(["diagnostico", "propuesta", "alianza"]);
const ALLOWED_STAGES = new Set([
  "Pre-constitución",
  "Empresa emergente en ronda",
  "Pyme en crecimiento",
  "Empresa establecida",
  "Grupo o holding",
  "Otro",
]);
const ALLOWED_SCOPES = new Set([
  "Asesoría legal corporativa",
  "Constitución / reestructura",
  "Inversión y financiación",
  "Digitalización de procesos",
  "Automatización e integración",
  "IA aplicada",
  "Posicionamiento, captación y CRM",
  "CRM y desarrollo comercial",
  "ERP y digitalización",
  "Auditoría y asesoría fiscal",
  "Jotform y formularios",
  "Aún no lo tengo claro",
]);
const ALLOWED_BUDGETS = new Set(["A definir", "Hasta 10K", "10K – 25K", "25K – 50K", "50K – 100K", "100K+"]);

function text(value, maxLength) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getClientKey(request) {
  const forwarded = request.headers["x-forwarded-for"];
  return text(Array.isArray(forwarded) ? forwarded[0] : String(forwarded || request.socket?.remoteAddress || "unknown").split(",")[0], 80);
}

function isRateLimited(key) {
  const now = Date.now();
  for (const [bucketKey, timestamps] of buckets) {
    const active = timestamps.filter((timestamp) => now - timestamp < WINDOW_MS);
    if (active.length) buckets.set(bucketKey, active);
    else buckets.delete(bucketKey);
  }
  const recent = buckets.get(key) || [];
  recent.push(now);
  buckets.set(key, recent);
  return recent.length > MAX_REQUESTS;
}

function parseBody(request) {
  if (request.body && typeof request.body === "object") return request.body;
  if (typeof request.body === "string") return JSON.parse(request.body);
  return {};
}

module.exports = async function contactHandler(request, response) {
  response.setHeader("Cache-Control", "no-store");
  response.setHeader("Content-Type", "application/json; charset=utf-8");

  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ ok: false, error: "Método no permitido." });
  }

  if (!PROVIDER_ENDPOINT) {
    return response.status(503).json({ ok: false, error: "El canal de contacto no está configurado." });
  }

  if (isRateLimited(getClientKey(request))) {
    response.setHeader("Retry-After", "600");
    return response.status(429).json({ ok: false, error: "Demasiados intentos. Vuelve a probar más tarde." });
  }

  let body;
  try {
    body = parseBody(request);
  } catch {
    return response.status(400).json({ ok: false, error: "Solicitud no válida." });
  }

  if (JSON.stringify(body).length > 12000) return response.status(413).json({ ok: false, error: "Solicitud demasiado grande." });
  if (text(body.website, 200)) return response.status(200).json({ ok: true });

  const tipo = text(body.tipo_contacto, 30);
  const nombre = text(body.nombre, 120);
  const empresa = text(body.empresa, 160);
  const cargo = text(body.cargo, 120);
  const email = text(body.email, 180).toLowerCase();
  const telefono = text(body.telefono, 40);
  const etapa = text(body.etapa_empresa, 80);
  const presupuesto = text(body.rango_presupuesto, 40);
  const notas = text(body.notas, 3000);
  const origenContexto = text(body.origen_contexto, 80);
  const origenNota = text(body.origen_nota, 180);
  const paginaOrigen = text(body.pagina_origen, 500);
  const alcance = Array.isArray(body.alcance)
    ? [...new Set(body.alcance.map((item) => text(item, 100)).filter((item) => ALLOWED_SCOPES.has(item)))].slice(0, ALLOWED_SCOPES.size)
    : [];

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  const valid = ALLOWED_TYPES.has(tipo)
    && nombre.length >= 2
    && empresa.length >= 2
    && cargo.length >= 2
    && validEmail
    && ALLOWED_STAGES.has(etapa)
    && ALLOWED_BUDGETS.has(presupuesto)
    && alcance.length > 0
    && body.consentimiento_privacidad === true
    && body.version_privacidad === PRIVACY_VERSION;

  if (!valid) return response.status(400).json({ ok: false, error: "Revisa los campos obligatorios y vuelve a intentarlo." });

  const providerPayload = {
    tipo_contacto: tipo,
    nombre,
    empresa,
    cargo,
    email,
    telefono,
    alcance: alcance.join(", "),
    etapa_empresa: etapa,
    rango_presupuesto: presupuesto,
    notas,
    origen_contexto: origenContexto,
    origen_nota: origenNota,
    pagina_origen: paginaOrigen,
    consentimiento_privacidad: true,
    version_privacidad: PRIVACY_VERSION,
    fecha: new Date().toISOString(),
  };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const providerResponse = await fetch(PROVIDER_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(providerPayload),
      signal: controller.signal,
    });
    if (!providerResponse.ok) throw new Error(`Provider response ${providerResponse.status}`);
    return response.status(200).json({ ok: true });
  } catch {
    return response.status(502).json({ ok: false, error: "No ha sido posible entregar el mensaje. Inténtalo de nuevo." });
  } finally {
    clearTimeout(timeout);
  }
};
