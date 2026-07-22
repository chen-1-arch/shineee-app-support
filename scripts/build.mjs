import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = path.join(projectRoot, "content");
const serverRoot = path.join(projectRoot, "dist", "server");

const pages = {
  "/": await readFile(path.join(contentRoot, "index.html"), "utf8"),
  "/index.html": await readFile(path.join(contentRoot, "index.html"), "utf8"),
  "/privacy": await readFile(path.join(contentRoot, "privacy.html"), "utf8"),
  "/privacy.html": await readFile(path.join(contentRoot, "privacy.html"), "utf8"),
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

console.log("Built Shineee! support and privacy routes.");
