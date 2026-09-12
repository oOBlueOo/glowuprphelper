import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(root, ".env"));

const env = process.env;
const port = Number(env.PORT || 8787);
const packFile = path.join(root, "downloads", "Glow_shaders.rar");

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json",
  ".bat": "application/octet-stream"
};

function loadEnv(file) {
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    const value = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

function sendPack(res) {
  if (env.DOWNLOAD_FILE_URL) {
    res.writeHead(302, { Location: env.DOWNLOAD_FILE_URL });
    res.end();
    return;
  }
  if (!fs.existsSync(packFile)) {
    res.writeHead(503, { "Content-Type": "text/plain" });
    res.end("Pack is not uploaded on this host yet.");
    return;
  }
  const stat = fs.statSync(packFile);
  res.writeHead(200, {
    "Content-Type": "application/octet-stream",
    "Content-Disposition": 'attachment; filename="Glow_shaders.rar"',
    "Content-Length": stat.size,
    "Cache-Control": "no-store"
  });
  fs.createReadStream(packFile).pipe(res);
}

function safeFile(urlPath) {
  const clean = decodeURIComponent(urlPath.split("?")[0]);
  if (clean.includes("\0") || clean.includes("..")) return null;
  if (clean.startsWith("/functions") || clean.startsWith("/.")) return null;
  if (clean.startsWith("/downloads") && clean !== "/downloads/Glow_shaders.rar") return null;
  const rel = clean === "/" ? "/index.html" : clean;
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return null;
  return file;
}

const server = http.createServer((req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/api/download" || url.pathname === "/downloads/Glow_shaders.rar") {
      sendPack(res);
      return;
    }
    const file = safeFile(url.pathname);
    if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found");
      return;
    }
    const ext = path.extname(file).toLowerCase();
    res.writeHead(200, { "Content-Type": types[ext] || "application/octet-stream" });
    fs.createReadStream(file).pipe(res);
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Server error");
    console.error(err);
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`GlowUpRP Helper ready: http://127.0.0.1:${port}`);
});
