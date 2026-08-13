import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(projectRoot, "content");
const serverRoot = path.join(projectRoot, "dist", "server");

const sourcePages = {
  "index.html": await readFile(path.join(contentRoot, "index.html"), "utf8"),
  "privacy.html": await readFile(path.join(contentRoot, "privacy.html"), "utf8"),
  "terms.html": await readFile(path.join(contentRoot, "terms.html"), "utf8"),
  "en/index.html": await readFile(path.join(contentRoot, "en", "index.html"), "utf8"),
  "en/privacy.html": await readFile(path.join(contentRoot, "en", "privacy.html"), "utf8"),
  "en/terms.html": await readFile(path.join(contentRoot, "en", "terms.html"), "utf8"),
};

const pages = {
  "/": sourcePages["index.html"],
  "/index.html": sourcePages["index.html"],
  "/privacy": sourcePages["privacy.html"],
  "/privacy.html": sourcePages["privacy.html"],
  "/terms": sourcePages["terms.html"],
  "/terms.html": sourcePages["terms.html"],
  "/en": sourcePages["en/index.html"],
  "/en/": sourcePages["en/index.html"],
  "/en/index.html": sourcePages["en/index.html"],
  "/en/privacy": sourcePages["en/privacy.html"],
  "/en/privacy.html": sourcePages["en/privacy.html"],
  "/en/terms": sourcePages["en/terms.html"],
  "/en/terms.html": sourcePages["en/terms.html"],
};

const worker = `const pages = ${JSON.stringify(pages)};

export default {
  async fetch(request) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET, HEAD" },
      });
    }

    const url = new URL(request.url);
    const html = pages[url.pathname];

    if (!html) {
      return new Response("页面不存在", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    return new Response(request.method === "HEAD" ? null : html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=300",
        "Referrer-Policy": "no-referrer",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
      },
    });
  },
};
`;

await rm(path.join(projectRoot, "dist"), { recursive: true, force: true });
await mkdir(serverRoot, { recursive: true });
await writeFile(path.join(serverRoot, "index.js"), worker, "utf8");

// Keep the GitHub Pages-compatible static files generated from the same source
// as the worker routes so the two hosting paths cannot drift apart.
for (const [relativePath, html] of Object.entries(sourcePages)) {
  const outputPath = path.join(projectRoot, relativePath);
  await mkdir(path.dirname(outputPath), { recursive: true });
  await writeFile(outputPath, html, "utf8");
}

console.log("Built bilingual Shineee! support, privacy, and terms routes.");
