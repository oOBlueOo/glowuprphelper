import { redirect } from "../_lib/discord.js";
import { sessionCookie } from "../_lib/session.js";

export async function onRequestGet({ request }) {
  const secure = new URL(request.url).protocol === "https:";
  return redirect("/download.html", [sessionCookie("", 0, secure)]);
}
