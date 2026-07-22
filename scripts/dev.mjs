import http from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pages = {
  "/": "index.html",
  "/index.html": "index.html",
  "/privacy": "privacy.html",
  "/privacy.html": "privacy.html",
};

const server = http.createServer(async (request, response) => {
  const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
  const filename = pages[pathname];

  if (!filename) {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("页面不存在");
    return;
  }

  const html = await readFile(path.join(projectRoot, "content", filename), "utf8");
  response.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  response.end(html);
});

server.listen(4174, "127.0.0.1", () => {
  console.log("Local URL: http://127.0.0.1:4174");
});
