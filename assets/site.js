// Supakor.Studio — tilting cards, scroll reveals and the footer year. A plain script, so the
// page works even when the 3D module (main.js, from a CDN) can't load.
(function () {
  "use strict";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// ---------- 3D tilt cards ----------
  function startTilt() {
    if (reduceMotion || !window.matchMedia("(hover: hover)").matches) return;
    for (const el of document.querySelectorAll(".tilt")) {
      const glare = document.createElement("span");
      glare.className = "glare";
      el.appendChild(glare);
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 12}deg) rotateY(${(px - 0.5) * 14}deg) translateZ(0)`;
        el.style.setProperty("--gx", `${px * 100}%`);
        el.style.setProperty("--gy", `${py * 100}%`);
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    }
  }
  
  // ---------- reveal on scroll ----------
  function startReveal() {
    const items = document.querySelectorAll(".reveal");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("shown"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add("shown"); io.unobserve(e.target); }
    }, { threshold: 0.12 });
    items.forEach((el) => io.observe(el));
  }

  const year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());
  startReveal();
  startTilt();
})();
