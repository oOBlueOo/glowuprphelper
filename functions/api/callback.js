import { GUILD_ID, exchangeCode, fetchUser, isConfigured, redirect, userInGuild } from "../_lib/discord.js";
import { readCookie, sessionCookie, signSession, verifySession } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return redirect("/download.html");
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const secure = url.protocol === "https:";
  if (!code) return redirect("/download.html?error=denied");

  const pending = await verifySession(readCookie(request, "glow_session"), env.SESSION_SECRET);
  if (!pending || pending.kind !== "oauth_state" || pending.state !== state) {
    return redirect("/download.html?error=denied");
  }

  try {
    const tokens = await exchangeCode(env, request, code);
    const user = await fetchUser(tokens.access_token);
    const member = await userInGuild(tokens.access_token, env.DISCORD_GUILD_ID || GUILD_ID);
    const session = await signSession({
      kind: "user",
      id: user.id,
      username: user.global_name || user.username,
      avatar: user.avatar,
      member,
      exp: Date.now() + 12 * 60 * 60 * 1000
    }, env.SESSION_SECRET);
    const dest = member ? "/download.html" : "/download.html?error=join";
    return redirect(dest, [sessionCookie(session, 12 * 60 * 60, secure)]);
  } catch {
    return redirect("/download.html?error=denied");
  }
}
