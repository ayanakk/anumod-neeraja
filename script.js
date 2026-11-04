(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var scene = document.getElementById("envelopeScene");
  var isSmall = window.matchMedia("(max-width: 600px)").matches;

  /* ---------- Jasmine garlands ---------- */
  document.querySelectorAll("[data-garland]").forEach(function (el) {
    var W = 400, H = 74, n = 26, out = "";
    out += '<svg viewBox="0 0 ' + W + " " + H + '" preserveAspectRatio="none">';
    for (var s = 0; s < 2; s++) {
      var y0 = 6 + s * 8, sag = 34 - s * 10;
      out += '<path d="M0 ' + y0 + " Q " + (W / 4) + " " + (y0 + sag) + " " + (W / 2) + " " + y0 +
             " T " + W + " " + y0 + '" fill="none" stroke="#2f7a4f" stroke-width="1.6"/>';
    }
    for (var i = 0; i <= n; i++) {
      var t = i / n, x = t * W;
      // approximate the two sagging curves by sampling the quadratic segments
      var seg = t < 0.5 ? t * 2 : (t - 0.5) * 2;
      var y = 6 + 2 * 34 * seg * (1 - seg);
      var col = i % 4 === 0 ? "#f2a516" : "#fffdf3";
      out += '<circle cx="' + x.toFixed(1) + '" cy="' + (y + 3).toFixed(1) + '" r="' + (i % 4 === 0 ? 5 : 4) + '" fill="' + col + '" stroke="#d9c89a" stroke-width=".6"/>';
      if (i % 2 === 0) {
        out += '<line x1="' + x.toFixed(1) + '" y1="' + (y + 7).toFixed(1) + '" x2="' + x.toFixed(1) + '" y2="' + (y + 16 + (i % 4) * 3).toFixed(1) + '" stroke="#2f7a4f" stroke-width="1"/>' +
               '<circle cx="' + x.toFixed(1) + '" cy="' + (y + 19 + (i % 4) * 3).toFixed(1) + '" r="3.2" fill="#fffdf3" stroke="#d9c89a" stroke-width=".6"/>';
      }
    }
    el.innerHTML = out + "</svg>";
  });

  /* ---------- Falling flowers + sparkles ---------- */
  var petals = document.getElementById("petals");
  var kinds = ["j", "m", "j", "j", "m"];
  var count = isSmall ? 8 : 14;
  for (var i = 0; i < count; i++) {
    var p = document.createElement("span");
    p.className = "petal " + kinds[i % kinds.length];
    p.style.left = (Math.random() * 100) + "%";
    p.style.setProperty("--s", (16 + Math.random() * 12) + "px");
    p.style.setProperty("--sx", ((Math.random() < .5 ? -1 : 1) * (20 + Math.random() * 40)) + "px");
    p.style.animationDuration = (16 + Math.random() * 12) + "s";
    p.style.animationDelay = (-Math.random() * 24) + "s";
    petals.appendChild(p);
  }
  for (var k = 0; k < (isSmall ? 10 : 18); k++) {
    var sp = document.createElement("span");
    sp.className = "spark";
    sp.style.left = (Math.random() * 100) + "%";
    sp.style.top = (Math.random() * 100) + "%";
    sp.style.width = sp.style.height = (5 + Math.random() * 8) + "px";
    sp.style.animationDuration = (2.5 + Math.random() * 3) + "s";
    sp.style.animationDelay = (-Math.random() * 5) + "s";
    petals.appendChild(sp);
  }

  /* ---------- Reveal on scroll (starts after envelope opens) ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  function startReveals() {
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Envelope ---------- */
  document.getElementById("openBtn").addEventListener("click", function () {
    scene.classList.add("open");
    setTimeout(function () {
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      scene.classList.add("gone");
      startReveals();
    }, 1700);
  });

  /* ---------- Side dots ---------- */
  var panels = Array.prototype.slice.call(document.querySelectorAll(".panel"));
  var nav = document.getElementById("dots");
  var dots = panels.map(function (pn, idx) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", pn.getAttribute("data-name") || "Section " + (idx + 1));
    b.addEventListener("click", function () { pn.scrollIntoView({ behavior: "smooth" }); });
    nav.appendChild(b);
    return b;
  });
  var po = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var idx = panels.indexOf(e.target);
        dots.forEach(function (d, k) { d.classList.toggle("on", k === idx); });
      }
    });
  }, { threshold: 0.5 });
  panels.forEach(function (pn) { po.observe(pn); });

  /* ---------- Countdown: 13 Nov 2026, 11:45 AM IST ---------- */
  var target = new Date("2026-11-13T11:45:00+05:30").getTime();
  var nums = {};
  document.querySelectorAll("#countdown b").forEach(function (n) { nums[n.dataset.unit] = n; });
  function pad(n) { return String(n).padStart(2, "0"); }
  function tick() {
    var s = Math.max(0, Math.floor((target - Date.now()) / 1000));
    nums.days.textContent = pad(Math.floor(s / 86400));
    nums.hours.textContent = pad(Math.floor((s % 86400) / 3600));
    nums.mins.textContent = pad(Math.floor((s % 3600) / 60));
    nums.secs.textContent = pad(s % 60);
  }
  tick();
  setInterval(tick, 1000);
})();
