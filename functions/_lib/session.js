const encoder = new TextEncoder();

function toB64(bytes) {
  let bin = "";
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  for (let i = 0; i < arr.length; i++) bin += String.fromCharCode(arr[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromB64(str) {
  const pad = str + "===".slice((str.length + 3) % 4);
  const bin = atob(pad.replace(/-/g, "+").replace(/_/g, "/"));
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function hmac(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  return crypto.subtle.sign("HMAC", key, encoder.encode(data));
}

export async function signSession(payload, secret) {
  const body = toB64(encoder.encode(JSON.stringify(payload)));
  const sig = toB64(await hmac(secret, body));
  return `${body}.${sig}`;
}

export async function verifySession(token, secret) {
  if (!token || !secret) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const expected = toB64(await hmac(secret, parts[0]));
  if (expected !== parts[1]) return null;
  try {
    const json = new TextDecoder().decode(fromB64(parts[0]));
    const data = JSON.parse(json);
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

export function readCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const parts = header.split(";").map((part) => part.trim());
  for (const part of parts) {
    if (part.startsWith(name + "=")) return decodeURIComponent(part.slice(name.length + 1));
  }
  return "";
}

export function sessionCookie(value, maxAge, secure) {
  const bits = [
    `glow_session=${encodeURIComponent(value)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`
  ];
  if (secure) bits.push("Secure");
  return bits.join("; ");
}
