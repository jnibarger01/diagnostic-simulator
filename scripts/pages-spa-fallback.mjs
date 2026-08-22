#!/usr/bin/env node
/**
 * GitHub Pages SPA fallback: copy the shell to index.html + 404.html,
 * rewrite prerendered CSS hashes to the client stylesheet, and write
 * .nojekyll so `_build` / `_shell.html` are not ignored by Jekyll.
 */
import { copyFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const CANDIDATES = ["dist/client", ".output/public", "dist/public", "dist"];

function findOutput() {
  for (const dir of CANDIDATES) {
    if (!existsSync(dir)) continue;
    const html = ["_shell.html", "index.html", "404.html"]
      .map((f) => join(dir, f))
      .find((p) => existsSync(p));
    if (html) return dir;
  }
  return null;
}

const root = findOutput();
if (!root) {
  console.error("[pages] no static output dir found. Looked in:", CANDIDATES.join(", "));
  process.exit(1);
}

const shell = ["_shell.html", "index.html", "404.html"]
  .map((f) => join(root, f))
  .find((p) => existsSync(p));
if (!shell) {
  console.error("[pages] no HTML shell in", root, readdirSync(root).slice(0, 40));
  process.exit(1);
}

const assetsDir = join(root, "assets");
const clientCss = existsSync(assetsDir)
  ? readdirSync(assetsDir).find((f) => f.endsWith(".css") && f.startsWith("styles-"))
  : null;

let html = readFileSync(shell, "utf8");
if (clientCss) {
  html = html.replace(/\/assets\/styles-[^"]+\.css/g, `/assets/${clientCss}`);
}

const indexHtml = join(root, "index.html");
const notFound = join(root, "404.html");
writeFileSync(indexHtml, html);
writeFileSync(notFound, html);
if (shell !== indexHtml && shell !== notFound) {
  writeFileSync(shell, html);
}
writeFileSync(join(root, ".nojekyll"), "");
writeFileSync(join(root, ".pages-output"), `${root}\n`);
console.log("[pages] SPA fallback ready", { root, shell, css: clientCss, indexHtml, notFound });
