/* =========================================================
   HOUSE OF ECHOES — interactions
   Dependency-free. Respects prefers-reduced-motion.
   ========================================================= */
(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer  = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ---------- Preloader ---------- */
  function initPreloader() {
    const pre = $("#preloader");
    const count = $("#loadCount");
    if (!pre) return;
    let n = 0;
    const target = 100;
    const duration = reduceMotion ? 250 : 1500;
    const start = performance.now();

    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      // ease-out
      const eased = 1 - Math.pow(1 - p, 3);
      n = Math.floor(eased * target);
      if (count) count.textContent = String(n).padStart(2, "0");
      if (p < 1) {
        requestAnimationFrame(tick);
      } else {
        if (count) count.textContent = "100";
        setTimeout(() => {
          pre.classList.add("is-done");
          document.body.classList.remove("is-locked");
          // trigger hero reveal
          const hero = $("#hero");
          if (hero) hero.classList.add("is-in");
        }, reduceMotion ? 0 : 350);
      }
    }
    document.body.classList.add("is-locked");
    requestAnimationFrame(tick);
  }

  /* ---------- Custom cursor ---------- */
  function initCursor() {
    if (!finePointer) return;
    const cursor = $(".cursor");
    if (!cursor) return;
    let x = window.innerWidth / 2, y = window.innerHeight / 2;
    let cx = x, cy = y;

    window.addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });

    function render() {
      cx += (x - cx) * 0.2;
      cy += (y - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(render);
    }
    render();

    const hoverSel = '[data-cursor="hover"], a, button';
    document.addEventListener("mouseover", (e) => {
      if (e.target.closest(hoverSel)) document.body.classList.add("cursor-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest(hoverSel)) document.body.classList.remove("cursor-hover");
    });
  }

  /* ---------- Nav: scroll state + hide on scroll down ---------- */
  function initNav() {
    const nav = $("#nav");
    if (!nav) return;
    let last = 0;
    function onScroll() {
      const y = window.scrollY;
      nav.classList.toggle("is-scrolled", y > 60);
      if (y > last && y > 400 && !document.body.classList.contains("menu-open")) {
        nav.classList.add("is-hidden");
      } else {
        nav.classList.remove("is-hidden");
      }
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Overlay menu ---------- */
  function initMenu() {
    const toggle = $("#menuToggle");
    const overlay = $("#overlay");
    if (!toggle || !overlay) return;
    function close() { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-label", "Open menu"); }
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    $$("a", overlay).forEach((a) => a.addEventListener("click", close));
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveals() {
    const els = $$(".reveal, .reveal-up, .reveal-line, .scenes__title, .services__title, .process__title");
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.18, rootMargin: "0px 0px -8% 0px" });
    els.forEach((el) => io.observe(el));
  }

  /* ---------- Manifesto word lighting ---------- */
  function initManifesto() {
    const text = $(".manifesto__text");
    if (!text || !("IntersectionObserver" in window)) { if (text) text.classList.add("is-lit"); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { text.classList.add("is-lit"); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(text);
  }

  /* ---------- Rotating hero taglines ---------- */
  function initTaglines() {
    const tags = $$(".hero__tag");
    if (tags.length < 2 || reduceMotion) return;
    let i = 0;
    setInterval(() => {
      tags[i].classList.remove("is-active");
      i = (i + 1) % tags.length;
      tags[i].classList.add("is-active");
    }, 3200);
  }

  /* ---------- Parallax ---------- */
  function initParallax() {
    if (reduceMotion) return;
    const items = $$("[data-parallax]");
    if (!items.length) return;
    let ticking = false;
    function update() {
      const vh = window.innerHeight;
      items.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (rect.bottom < -200 || rect.top > vh + 200) return;
        const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
        const offset = (rect.top + rect.height / 2 - vh / 2) * -speed;
        el.style.transform = `translate3d(0, ${offset.toFixed(2)}px, 0)`;
      });
      ticking = false;
    }
    window.addEventListener("scroll", () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  /* ---------- Hero video (respect reduced-motion + graceful fallback) ---------- */
  function initHeroVideo() {
    const video = $(".hero__video");
    if (!video) return;
    if (reduceMotion) {
      // Let the gradient hero stand in; no looping motion.
      video.removeAttribute("autoplay");
      video.pause();
      video.style.display = "none";
      return;
    }
    // If the source can't be played, hide the element so the gradient shows.
    video.addEventListener("error", () => { video.style.display = "none"; }, { once: true });
    const tryPlay = () => { const p = video.play(); if (p && p.catch) p.catch(() => {}); };
    if (video.readyState >= 2) tryPlay();
    video.addEventListener("canplay", tryPlay, { once: true });
  }

  /* ---------- Boot ---------- */
  document.addEventListener("DOMContentLoaded", () => {
    initHeroVideo();
    initPreloader();
    initCursor();
    initNav();
    initMenu();
    initReveals();
    initManifesto();
    initTaglines();
    initParallax();
  });

  // Failsafe: if preloader script timing misses, reveal hero after load
  window.addEventListener("load", () => {
    setTimeout(() => {
      const hero = $("#hero");
      if (hero && !hero.classList.contains("is-in")) hero.classList.add("is-in");
    }, 2600);
  });
})();
