import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { createRequire } from "node:module";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const contactHandler = require("../api/contact.js");
const port = Number(process.env.MEDLA_PORT) || 4174;

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".ico", "image/x-icon"],
  [".jpg", "image/jpeg"],
  [".jpeg", "image/jpeg"],
  [".js", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".png", "image/png"],
  [".svg", "image/svg+xml"],
  [".txt", "text/plain; charset=utf-8"],
  [".webp", "image/webp"],
  [".xml", "application/xml; charset=utf-8"],
]);

function applySecurityHeaders(response) {
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  );
}

async function readRequestBody(request, response) {
  const chunks = [];
  let size = 0;
  for await (const chunk of request) {
    size += chunk.length;
    if (size > 16_000) {
      response.statusCode = 413;
      response.end(JSON.stringify({ ok: false, error: "Solicitud demasiado grande." }));
      return null;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function serveContact(request, response) {
  response.status = function status(code) { this.statusCode = code; return this; };
  response.json = function json(body) { this.end(JSON.stringify(body)); return this; };
  if (request.method === "POST") {
    request.body = await readRequestBody(request, response);
    if (request.body === null) return;
  }
  await contactHandler(request, response);
}

async function serveFile(request, response, pathname) {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.some((segment) => segment.startsWith(".") || ["api", "node_modules", "scripts"].includes(segment))) {
    response.statusCode = 404;
    pathname = "/404.html";
  }

  const relative = pathname.replace(/^\/+/, "") || "index.html";
  let target = resolve(projectRoot, relative);
  if (target !== projectRoot && !target.startsWith(`${projectRoot}${sep}`)) {
    response.statusCode = 400;
    response.end("Solicitud no válida.");
    return;
  }

  try {
    const info = await stat(target);
    if (info.isDirectory()) target = resolve(target, "index.html");
    await stat(target);
  } catch {
    response.statusCode = 404;
    target = resolve(projectRoot, "404.html");
  }

  response.setHeader("Content-Type", contentTypes.get(extname(target).toLowerCase()) || "application/octet-stream");
  response.setHeader("Cache-Control", /\.(?:html|css|js)$/i.test(target) ? "no-cache, must-revalidate" : "public, max-age=3600");
  if (request.method === "HEAD") {
    response.end();
    return;
  }
  createReadStream(target).pipe(response);
}

const server = createServer(async (request, response) => {
  applySecurityHeaders(response);
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, "http://127.0.0.1").pathname);
  } catch {
    response.statusCode = 400;
    response.end("Solicitud no válida.");
    return;
  }

  try {
    if (pathname === "/api/contact") await serveContact(request, response);
    else if (request.method === "GET" || request.method === "HEAD") await serveFile(request, response, pathname);
    else {
      response.statusCode = 405;
      response.setHeader("Allow", "GET, HEAD");
      response.end("Método no permitido.");
    }
  } catch {
    if (!response.headersSent) response.statusCode = 500;
    response.end("Error interno.");
  }
});

server.listen(port, "127.0.0.1", () => {
  process.stdout.write(`MEDLA preview: http://127.0.0.1:${port}/\n`);
});
