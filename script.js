(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var intro = document.getElementById("intro");

  /* ---------- Reveal on scroll (starts after the letter opens) ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
    });
  }, { threshold: 0.15 });
  function startReveals() {
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Opening letter ---------- */
  // ?open (or a #section link) skips the envelope, e.g. for guests coming back to check the venue
  if (/[?&]open\b/.test(location.search) || location.hash.length > 1) {
    intro.classList.add("gone");
    document.body.classList.remove("locked");
    var target = location.hash.length > 1 && document.getElementById(location.hash.slice(1));
    if (target) {
      root.style.scrollBehavior = "auto";
      target.scrollIntoView();
      root.style.scrollBehavior = "";
    }
    startReveals();
  }
  document.getElementById("openBtn").addEventListener("click", function () {
    intro.classList.add("open");
    setTimeout(function () {
      document.body.classList.remove("locked");
      window.scrollTo(0, 0);
      intro.classList.add("gone");
      startReveals();
    }, reduceMotion ? 200 : 1900);
  });

  /* ---------- Moments: tap a print to lift it to the front ---------- */
  document.querySelectorAll(".prints .print").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var spot = btn.parentNode, was = spot.classList.contains("front");
      document.querySelectorAll(".prints .front").forEach(function (s) { s.classList.remove("front"); });
      if (!was) spot.classList.add("front");
    });
  });

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
