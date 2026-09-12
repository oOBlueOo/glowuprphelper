(function () {
  var page = document.body.getAttribute("data-page") || "";
  var nav = document.getElementById("site-nav");
  var footer = document.getElementById("site-footer");
  var discord = (window.GLOW && window.GLOW.inviteUrl) || "https://discord.gg/glowuprp";
  var fivem = (window.GLOW && window.GLOW.fivemUrl) || "https://cfx.re/join/p3b9x7";
  var store = (window.GLOW && window.GLOW.storeUrl) || "https://andrp.tebex.io/";
  var links = [
    { href: "index.html", id: "home", label: "Home" },
    { href: "download.html", id: "download", label: "Download" },
    { href: "install.html", id: "install", label: "Install" },
    { href: "cache.html", id: "cache", label: "Cache" },
    { href: "drivers.html", id: "drivers", label: "Drivers" },
    { href: "verify.html", id: "verify", label: "Verify" },
    { href: "tips.html", id: "tips", label: "Tips" },
    { href: discord, id: "discord", label: "Join Discord", external: true, accent: true },
    { href: fivem, id: "play", label: "Join FiveM", external: true, play: true },
    { href: store, id: "store", label: "Store", external: true, store: true }
  ];

  if (nav) {
    nav.innerHTML =
      '<a class="brand" href="index.html"><img src="images/logo-glowup-small.png" alt="GlowUp RP" />GlowUpRP Helper</a>' +
      '<div class="nav-links">' +
      links.map(function (item) {
        var cls = (item.id === page ? "active " : "") + (item.accent ? "accent" : "") + (item.store ? " store" : "") + (item.play ? " play" : "");
        var extra = item.external ? ' target="_blank" rel="noreferrer"' : "";
        return '<a class="' + cls + '" href="' + item.href + '"' + extra + ">" + item.label + "</a>";
      }).join("") +
      "</div>";
  }

  if (footer) {
    footer.innerHTML = 'glowuprphelper · <a href="' + discord + '" target="_blank" rel="noreferrer">Join Discord</a> · <a href="' + fivem + '" target="_blank" rel="noreferrer">Join FiveM</a> · <a href="' + store + '" target="_blank" rel="noreferrer">Store</a>';
  }

  document.querySelectorAll(".copy-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = document.getElementById(btn.getAttribute("data-copy"));
      if (!el) return;
      navigator.clipboard.writeText(el.textContent).then(function () {
        var old = btn.textContent;
        btn.textContent = "Copied";
        setTimeout(function () { btn.textContent = old; }, 1400);
      });
    });
  });
})();
