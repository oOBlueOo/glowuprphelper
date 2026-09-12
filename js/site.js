(function () {
  var page = document.body.getAttribute("data-page") || "";
  var nav = document.getElementById("site-nav");
  var footer = document.getElementById("site-footer");
  var links = [
    { href: "index.html", id: "home", label: "Home" },
    { href: "download.html", id: "download", label: "Download", accent: true },
    { href: "install.html", id: "install", label: "Install" },
    { href: "cache.html", id: "cache", label: "Clear Cache" },
    { href: "drivers.html", id: "drivers", label: "Drivers" },
    { href: "tips.html", id: "tips", label: "Tips" }
  ];

  if (nav) {
    nav.innerHTML =
      '<a class="brand" href="index.html"><img src="images/logo-glowup-small.png" alt="GlowUp RP" />Glow Shaders</a>' +
      '<div class="nav-links">' +
      links.map(function (item) {
        var cls = (item.id === page ? "active " : "") + (item.accent ? "accent" : "");
        return '<a class="' + cls + '" href="' + item.href + '">' + item.label + "</a>";
      }).join("") +
      "</div>";
  }

  if (footer) {
    footer.innerHTML = "Glow Shaders · GLOW UP RP members only for the pack · plugins + mods → FiveM · ENB → GTA V";
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
