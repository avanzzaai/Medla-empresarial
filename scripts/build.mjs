import { build } from "esbuild";

const javascript = [
  { entryPoints: ["site-shell.jsx"], outfile: "site-shell.js" },
  { entryPoints: ["app.jsx"], outfile: "app.js", bundle: true },
  { entryPoints: ["contacto.jsx"], outfile: "contacto.js" },
  { entryPoints: ["servicios-entry.jsx"], outfile: "servicios.js", bundle: true },
  { entryPoints: ["nosotros.jsx"], outfile: "nosotros.js", bundle: true },
  { entryPoints: ["blog.jsx"], outfile: "blog.js" },
  { entryPoints: ["specialty.jsx"], outfile: "specialty.js", bundle: true },
];

const styles = [
  { entryPoints: ["site-shell.css"], outfile: "site-shell.min.css" },
  { entryPoints: ["home-executive.css"], outfile: "home-executive.min.css" },
  { entryPoints: ["specialty.css"], outfile: "specialty.min.css" },
  { entryPoints: ["privacy-entry.css"], outfile: "privacy.min.css", bundle: true },
];

await Promise.all([
  ...javascript.map((options) => build({
    ...options,
    format: "iife",
    minify: true,
    target: "es2018",
    logLevel: "silent",
  })),
  ...styles.map((options) => build({
    ...options,
    minify: true,
    logLevel: "silent",
  })),
]);

process.stdout.write("build: ok (7 bundles JS, 4 bundles CSS)\n");
