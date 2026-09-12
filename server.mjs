import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { onRequestGet as login } from "./functions/api/login.js";
import { onRequestGet as callback } from "./functions/api/callback.js";
import { onRequestGet as me } from "./functions/api/me.js";
import { onRequestGet as logout } from "./functions/api/logout.js";
import { readCookie, verifySession } from "./functions/_lib/session.js";
import { isConfigured } from "./functions/_lib/discord.js";

const root = path.dirname(fileURLToPath(import.meta.url));
loadEnv(path.join(root, ".env"));

const env = process.env;
const port = Number(env.PORT || 8787);
const packFile = path.join(root, "downloads", "Glow_shaders.rar");

const routes = {
  "/api/login": login,
  "/api/callback": callback,
  "/api/me": me,
  "/api/logout": logout
};

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".json": "application/json"
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

function toRequest(req) {
  const host = req.headers.host || `127.0.0.1:${port}`;
  const proto = req.headers["x-forwarded-proto"] || "http";
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (!value) continue;
    headers.set(key, Array.isArray(value) ? value.join(", ") : value);
  }
  return new Request(`${proto}://${host}${req.url}`, { method: req.method, headers });
}

async function sendWeb(res, response) {
  res.statusCode = response.status;
  const cookies = [];
  response.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") cookies.push(value);
    else res.setHeader(key, value);
  });
  if (cookies.length) res.setHeader("Set-Cookie", cookies);
  if (!response.body) {
    res.end();
    return;
  }
  res.end(Buffer.from(await response.arrayBuffer()));
}

async function sendPack(req, res) {
  const request = toRequest(req);
  if (!isConfigured(env)) {
    res.writeHead(302, { Location: "/download.html" });
    res.end();
    return;
  }
  const session = await verifySession(readCookie(request, "glow_session"), env.SESSION_SECRET);
  if (!session || session.kind !== "user" || !session.member) {
    res.writeHead(302, { Location: "/download.html?error=join" });
    res.end();
    return;
  }
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
  if (clean.startsWith("/downloads") || clean.startsWith("/functions") || clean.startsWith("/.")) return null;
  let rel = clean === "/" ? "/index.html" : clean;
  const file = path.normalize(path.join(root, rel));
  if (!file.startsWith(root)) return null;
  return file;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    if (url.pathname === "/api/download") {
      await sendPack(req, res);
      return;
    }
    const api = routes[url.pathname];
    if (api) {
      await sendWeb(res, await api({ request: toRequest(req), env }));
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
  console.log(`Glow site ready: http://127.0.0.1:${port}`);
});
