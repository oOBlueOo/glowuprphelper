(function () {
  var status = document.getElementById("status-line");
  var panels = {
    login: document.getElementById("panel-login"),
    join: document.getElementById("panel-join"),
    ready: document.getElementById("panel-ready"),
    setup: document.getElementById("panel-setup")
  };
  var redirect = document.getElementById("redirect-uri");
  if (redirect) redirect.textContent = window.location.origin + "/api/callback";

  function show(name, message) {
    Object.keys(panels).forEach(function (key) {
      panels[key].classList.toggle("hidden", key !== name);
    });
    if (message) status.textContent = message;
  }

  function setInvite(url) {
    var invite = url || (window.GLOW && window.GLOW.inviteUrl) || "https://discord.com/channels/870567426306211840";
    ["join-btn", "join-btn-2"].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.href = invite;
    });
  }

  function avatarUrl(user) {
    if (user.avatar) {
      return "https://cdn.discordapp.com/avatars/" + user.id + "/" + user.avatar + ".png";
    }
    return "images/logo-glowup-small.png";
  }

  var params = new URLSearchParams(window.location.search);
  if (params.get("error") === "denied") status.textContent = "Discord login was cancelled.";
  if (params.get("error") === "join") status.textContent = "Join GLOW UP RP, then check again.";

  fetch("/api/me", { credentials: "same-origin" })
    .then(function (res) { return res.json(); })
    .then(function (data) {
      setInvite(data.inviteUrl);
      if (!data.configured) {
        show("setup", "Download lock needs a Discord app.");
        return;
      }
      if (!data.loggedIn) {
        show("login", "Members of GLOW UP RP can download the pack.");
        return;
      }
      if (!data.member) {
        document.getElementById("join-name").textContent = data.username || "Discord user";
        document.getElementById("join-avatar").src = avatarUrl(data);
        show("join", "You are signed in, but not in the Discord yet.");
        return;
      }
      document.getElementById("ready-name").textContent = data.username || "Member";
      document.getElementById("ready-avatar").src = avatarUrl(data);
      show("ready", "Pack unlocked.");
    })
    .catch(function () {
      show("setup", "Could not reach the download server.");
    });
})();
