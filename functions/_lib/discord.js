export const GUILD_ID = "870567426306211840";
export const GUILD_NAME = "GLOW UP RP";

export function originFrom(request, env) {
  if (env.PUBLIC_URL) return env.PUBLIC_URL.replace(/\/$/, "");
  const url = new URL(request.url);
  return url.origin;
}

export function isConfigured(env) {
  return Boolean(env.DISCORD_CLIENT_ID && env.DISCORD_CLIENT_SECRET && env.SESSION_SECRET);
}

export function authorizeUrl(env, request, state) {
  const redirect = `${originFrom(request, env)}/api/callback`;
  const params = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    redirect_uri: redirect,
    response_type: "code",
    scope: "identify guilds",
    state,
    prompt: "consent"
  });
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function exchangeCode(env, request, code) {
  const redirect = `${originFrom(request, env)}/api/callback`;
  const body = new URLSearchParams({
    client_id: env.DISCORD_CLIENT_ID,
    client_secret: env.DISCORD_CLIENT_SECRET,
    grant_type: "authorization_code",
    code,
    redirect_uri: redirect
  });
  const res = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body
  });
  if (!res.ok) throw new Error("token_exchange_failed");
  return res.json();
}

export async function fetchUser(accessToken) {
  const res = await fetch("https://discord.com/api/users/@me", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) throw new Error("user_failed");
  return res.json();
}

export async function userInGuild(accessToken, guildId) {
  const res = await fetch("https://discord.com/api/users/@me/guilds", {
    headers: { Authorization: `Bearer ${accessToken}` }
  });
  if (!res.ok) return false;
  const guilds = await res.json();
  return Array.isArray(guilds) && guilds.some((guild) => guild.id === guildId);
}

export function json(data, status = 200, extra = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...extra }
  });
}

export function redirect(location, cookies = []) {
  const headers = new Headers({ Location: location });
  for (const cookie of cookies) headers.append("Set-Cookie", cookie);
  return new Response(null, { status: 302, headers });
}
