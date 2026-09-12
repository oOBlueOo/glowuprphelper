import { isConfigured, redirect } from "../_lib/discord.js";
import { readCookie, verifySession } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) return redirect("/download.html");
  const session = await verifySession(readCookie(request, "glow_session"), env.SESSION_SECRET);
  if (!session || session.kind !== "user" || !session.member) {
    return redirect("/download.html?error=join");
  }

  if (env.SHADER_BUCKET) {
    const object = await env.SHADER_BUCKET.get("Glow_shaders.rar");
    if (!object) return new Response("Pack missing from storage.", { status: 503 });
    return new Response(object.body, {
      headers: {
        "Content-Type": "application/x-rar-compressed",
        "Content-Disposition": 'attachment; filename="Glow_shaders.rar"',
        "Cache-Control": "no-store"
      }
    });
  }

  if (env.DOWNLOAD_FILE_URL) {
    return redirect(env.DOWNLOAD_FILE_URL);
  }

  return new Response("Pack is not uploaded on this host yet.", { status: 503 });
}
