import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const pages = [
  "index.html",
  "servicios.html",
  "nosotros.html",
  "blog.html",
  "contacto.html",
  "privacidad.html",
  "asesoria-legal.html",
  "asesoria-fiscal.html",
  "constitucion.html",
  "inversiones.html",
  "digitalizacion.html",
  "automatizacion.html",
  "agentes.html",
  "redes-sociales.html",
  "jotform.html",
  "404.html",
];

const errors = [];
const external = /^(?:https?:|mailto:|tel:|data:|javascript:|#)/i;

for (const page of pages) {
  const html = await readFile(resolve(root, page), "utf8");
  if (!/^<!doctype html>/i.test(html.trimStart())) errors.push(`${page}: falta <!doctype html>`);
  if (!/<html\b[^>]*\blang="es"/i.test(html)) errors.push(`${page}: falta lang="es"`);
  if (!/<meta\b[^>]*name="description"/i.test(html)) errors.push(`${page}: falta meta description`);

  if (page !== "404.html") {
    const canonicals = html.match(/<link\b[^>]*rel="canonical"/gi) || [];
    if (canonicals.length !== 1) errors.push(`${page}: canonical esperado 1, encontrado ${canonicals.length}`);
  }

  for (const match of html.matchAll(/\b(?:href|src)="([^"]+)"/gi)) {
    const reference = match[1];
    if (external.test(reference) || reference.startsWith("//")) continue;
    const clean = decodeURIComponent(reference.split(/[?#]/, 1)[0]);
    if (!clean || clean === "/") continue;
    const target = resolve(root, clean.replace(/^\//, ""));
    try {
      await access(target);
    } catch {
      errors.push(`${page}: recurso local inexistente ${reference}`);
    }
  }
}

const sitemap = await readFile(resolve(root, "sitemap.xml"), "utf8");
for (const page of pages.filter((page) => page !== "404.html" && page !== "index.html")) {
  if (!sitemap.includes(`/${page}</loc>`)) errors.push(`sitemap.xml: falta ${page}`);
}
if (!sitemap.includes("https://www.medla-empresas.com/</loc>")) errors.push("sitemap.xml: falta la portada");

if (errors.length) {
  process.stderr.write(`${errors.join("\n")}\n`);
  process.exitCode = 1;
} else {
  process.stdout.write(`site integrity: ok (${pages.length} páginas)\n`);
}
