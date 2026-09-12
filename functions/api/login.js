import { authorizeUrl, isConfigured, redirect } from "../_lib/discord.js";
import { sessionCookie, signSession } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return redirect("/download.html");
  const state = crypto.randomUUID();
  const token = await signSession({ kind: "oauth_state", state, exp: Date.now() + 10 * 60 * 1000 }, env.SESSION_SECRET);
  const secure = new URL(request.url).protocol === "https:";
  return redirect(authorizeUrl(env, request, state), [sessionCookie(token, 600, secure)]);
}
