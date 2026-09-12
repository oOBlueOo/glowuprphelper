import { GUILD_ID, GUILD_NAME, isConfigured, json } from "../_lib/discord.js";
import { readCookie, verifySession } from "../_lib/session.js";

export async function onRequestGet({ request, env }) {
  if (!isConfigured(env)) {
    return json({
      configured: false,
      loggedIn: false,
      member: false,
      guildId: env.DISCORD_GUILD_ID || GUILD_ID,
      guildName: GUILD_NAME,
      inviteUrl: env.DISCORD_INVITE_URL || ""
    });
  }

  const session = await verifySession(readCookie(request, "glow_session"), env.SESSION_SECRET);
  const user = session && session.kind === "user" ? session : null;
  return json({
    configured: true,
    loggedIn: Boolean(user),
    member: Boolean(user && user.member),
    id: user ? user.id : null,
    username: user ? user.username : null,
    avatar: user ? user.avatar : null,
    guildId: env.DISCORD_GUILD_ID || GUILD_ID,
    guildName: GUILD_NAME,
    inviteUrl: env.DISCORD_INVITE_URL || ""
  });
}
