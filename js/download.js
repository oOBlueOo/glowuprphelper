(function () {
  var key = "glow_joined_discord";
  var invite = (window.GLOW && window.GLOW.inviteUrl) || "https://discord.gg/glowuprp";
  var fivem = (window.GLOW && window.GLOW.fivemUrl) || "https://cfx.re/join/p3b9x7";
  var pack = (window.GLOW && window.GLOW.packHref) || "downloads/Glow_shaders.rar";
  if (location.hostname.indexOf("github.io") !== -1 && window.GLOW && window.GLOW.packReleaseHref) {
    pack = window.GLOW.packReleaseHref;
  }
  var joinBtn = document.getElementById("join-discord");
  var playBtn = document.getElementById("join-fivem");
  var locked = document.getElementById("panel-locked");
  var ready = document.getElementById("panel-ready");
  var status = document.getElementById("status-line");
  var packLink = document.getElementById("pack-download");

  if (joinBtn) joinBtn.href = invite;
  if (playBtn) playBtn.href = fivem;
  if (packLink) packLink.href = pack;

  function showUnlocked() {
    if (locked) locked.classList.add("hidden");
    if (ready) ready.classList.remove("hidden");
    if (status) status.textContent = "Pack unlocked. Download Glow_shaders.rar below.";
  }

  function showLocked() {
    if (locked) locked.classList.remove("hidden");
    if (ready) ready.classList.add("hidden");
    if (status) status.textContent = "Click Join Discord first. The pack unlocks after that.";
  }

  if (localStorage.getItem(key) === "1") showUnlocked();
  else showLocked();

  if (joinBtn) {
    joinBtn.addEventListener("click", function () {
      localStorage.setItem(key, "1");
      showUnlocked();
    });
  }
})();
