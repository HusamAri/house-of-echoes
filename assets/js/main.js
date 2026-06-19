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

  let lenis = null;

  /* ---------- Smooth inertia scroll (Lenis) ---------- */
  function initSmoothScroll() {
    if (reduceMotion || typeof Lenis === "undefined") return;
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.6 });
    // hold scrolling until the preloader lifts
    const pre = $("#preloader");
    if (pre && !pre.classList.contains("is-done")) lenis.stop();
    function raf(t) { lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);
    // route in-page anchors through Lenis for a smooth glide
    document.addEventListener("click", (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute("href");
      if (href === "#" || href === "#top") { e.preventDefault(); lenis.scrollTo(0); return; }
      const target = document.querySelector(href);
      if (target) { e.preventDefault(); lenis.scrollTo(target); }
    });
  }
  const scrollLock = (on) => { if (lenis) { on ? lenis.stop() : lenis.start(); } };

  /* ---------- Theme: light / dark / system ---------- */
  const THEME_KEY = "hoe-theme";
  const sysMq = window.matchMedia("(prefers-color-scheme: dark)");
  function getPref() {
    let v;
    try { v = localStorage.getItem(THEME_KEY); } catch (e) {}
    return v === "light" || v === "dark" || v === "system" ? v : "system";
  }
  function resolveTheme(pref) { return pref === "system" ? (sysMq.matches ? "dark" : "light") : pref; }
  function applyTheme(pref) {
    const root = document.documentElement;
    const resolved = resolveTheme(pref);
    root.setAttribute("data-theme-pref", pref);
    root.setAttribute("data-theme", resolved);
    const m = $('meta[name="theme-color"]');
    if (m) m.setAttribute("content", resolved === "dark" ? "#0D0D0D" : "#E7E1D6");
  }
  function syncControls() {
    const pref = getPref();
    $$(".theme-l").forEach((el) => {
      $$("[data-theme-val]", el).forEach((b) =>
        b.setAttribute("aria-checked", b.getAttribute("data-theme-val") === pref ? "true" : "false"));
      const tip = $(".theme-l__tip", el);
      if (tip) tip.textContent = pref;
    });
  }
  function setPref(pref) {
    try { localStorage.setItem(THEME_KEY, pref); } catch (e) {}
    applyTheme(pref);
    syncControls();
  }
  function initTheme() {
    applyTheme(getPref());
    const onSys = () => { if (getPref() === "system") applyTheme("system"); };
    if (sysMq.addEventListener) sysMq.addEventListener("change", onSys);
    else if (sysMq.addListener) sysMq.addListener(onSys);
  }

  /* ---------- L-shaped theme control in each film player corner ---------- */
  function buildThemeControl() {
    const el = document.createElement("div");
    el.className = "theme-l";
    el.setAttribute("role", "radiogroup");
    el.setAttribute("aria-label", "Theme");
    el.innerHTML =
      '<span class="theme-l__track" aria-hidden="true"></span>' +
      '<button class="theme-l__opt theme-l__opt--light"  data-theme-val="light"  role="radio" aria-label="Light theme"  title="Light"  data-cursor="hover">☀</button>' +
      '<button class="theme-l__opt theme-l__opt--system" data-theme-val="system" role="radio" aria-label="System theme" title="System" data-cursor="hover">◐</button>' +
      '<button class="theme-l__opt theme-l__opt--dark"   data-theme-val="dark"   role="radio" aria-label="Dark theme"   title="Dark"   data-cursor="hover">☾</button>' +
      '<span class="theme-l__thumb" aria-hidden="true"></span>' +
      '<span class="theme-l__tip" aria-hidden="true">system</span>';
    el.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-theme-val]");
      if (!btn) return;
      e.preventDefault();
      setPref(btn.getAttribute("data-theme-val"));
    });
    return el;
  }
  function initThemeControls() {
    $$("[data-player]").forEach((pl) => {
      if (getComputedStyle(pl).position === "static") pl.style.position = "relative";
      pl.appendChild(buildThemeControl());
    });
    syncControls();
  }

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
          scrollLock(false);
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

  /* ---------- Magnetic hover (award-style micro-interaction) ---------- */
  function initMagnetic() {
    if (!finePointer || reduceMotion) return;
    $$(".reel__play, .scene__link, .contact__mail, .footer__top-link, [data-magnetic]").forEach((el) => {
      const strength = parseFloat(el.getAttribute("data-magnetic")) || 0.3;
      el.style.transition = "transform .35s var(--ease)";
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = (e.clientX - (r.left + r.width / 2)) * strength;
        const my = (e.clientY - (r.top + r.height / 2)) * strength;
        el.style.transform = `translate(${mx.toFixed(1)}px, ${my.toFixed(1)}px)`;
      });
      el.addEventListener("mouseleave", () => { el.style.transform = "translate(0,0)"; });
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
    function close() { document.body.classList.remove("menu-open"); toggle.setAttribute("aria-label", "Open menu"); scrollLock(false); }
    toggle.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      scrollLock(open);
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
        const base = el.dataset.parallaxBase ? el.dataset.parallaxBase + " " : "";
        el.style.transform = `${base}translate3d(0, ${offset.toFixed(2)}px, 0)`;
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
    initSmoothScroll();
    initTheme();
    initThemeControls();
    initHeroVideo();
    initPreloader();
    initCursor();
    initMagnetic();
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
