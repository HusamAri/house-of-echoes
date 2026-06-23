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
    $$(".theme-toggle [data-theme-val]").forEach((b) =>
      b.setAttribute("aria-checked", b.getAttribute("data-theme-val") === pref ? "true" : "false"));
  }
  function flashLights() {
    const flash = $(".theme-flash");
    if (!flash || reduceMotion) return;
    const tg = $(".theme-toggle");
    if (tg) {
      const r = tg.getBoundingClientRect();
      flash.style.setProperty("--flash-x", ((r.left + r.width / 2) / window.innerWidth * 100) + "%");
      flash.style.setProperty("--flash-y", ((r.top + r.height / 2) / window.innerHeight * 100) + "%");
    }
    flash.classList.remove("is-on"); void flash.offsetWidth; flash.classList.add("is-on");
  }
  function setPref(pref) {
    if (pref !== getPref()) flashLights();
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

  /* ---------- Rounded theme toggle — grab the knob and slide it ---------- */
  function initThemeControls() {
    const tg = $(".theme-toggle");
    if (!tg) return;
    const thumb = $(".theme-toggle__thumb", tg);
    const opts = $$(".theme-toggle__opt", tg);
    const order = ["light", "system", "dark"];
    const PAD = 5;
    let dragging = false, moved = false, startX = 0, step = 34;

    const nearestIdx = (clientX) => {
      const rel = clientX - tg.getBoundingClientRect().left - PAD - step / 2;
      return Math.round(Math.max(0, Math.min(step * 2, rel)) / step);
    };
    tg.addEventListener("pointerdown", (e) => {
      dragging = true; moved = false; startX = e.clientX;
      step = (opts[0] && opts[0].offsetWidth) || 34;
      tg.classList.add("is-grabbing");
      if (thumb) thumb.style.transition = "none";
      try { tg.setPointerCapture(e.pointerId); } catch (_) {}
    });
    tg.addEventListener("pointermove", (e) => {
      if (!dragging || !thumb) return;
      if (Math.abs(e.clientX - startX) > 3) moved = true;
      const rel = e.clientX - tg.getBoundingClientRect().left - PAD - step / 2;
      thumb.style.transform = "translateX(" + Math.max(0, Math.min(step * 2, rel)).toFixed(1) + "px)";
    });
    const end = (e) => {
      if (!dragging) return;
      dragging = false; tg.classList.remove("is-grabbing");
      if (thumb) { thumb.style.transition = ""; thumb.style.transform = ""; }
      setPref(order[nearestIdx(e.clientX)]);
    };
    tg.addEventListener("pointerup", end);
    tg.addEventListener("pointercancel", end);
    // keyboard: arrow / enter on focused option
    opts.forEach((o) => o.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setPref(o.getAttribute("data-theme-val")); }
    }));
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

  /* ---------- Selected Work: pinned horizontal scroll ---------- */
  function initHorizontalWork() {
    const section = $(".hwork");
    if (!section) return;
    const track = $(".hwork__track", section);
    if (!track) return;
    const mq = window.matchMedia("(min-width: 820px)");
    let active = false, maxX = 0;

    function setHeight() {
      maxX = Math.max(0, track.scrollWidth - window.innerWidth);
      section.style.height = (maxX + window.innerHeight) + "px";
      if (lenis) lenis.resize();
    }
    function update() {
      if (!active) return;
      const top = section.getBoundingClientRect().top;
      const total = section.offsetHeight - window.innerHeight;
      const progress = total > 0 ? Math.min(Math.max(-top / total, 0), 1) : 0;
      track.style.transform = `translate3d(${(-progress * maxX).toFixed(1)}px,0,0)`;
    }
    function evaluate() {
      const shouldPin = mq.matches && !reduceMotion;
      if (shouldPin && !active) { active = true; section.classList.remove("hwork--native"); setHeight(); }
      else if (!shouldPin && (active || !section.classList.contains("hwork--native"))) {
        active = false; section.classList.add("hwork--native"); section.style.height = ""; track.style.transform = "";
      }
      update();
    }
    evaluate();
    window.addEventListener("scroll", update, { passive: true });
    if (lenis) lenis.on("scroll", update);
    window.addEventListener("resize", () => { if (active) setHeight(); evaluate(); });
    window.addEventListener("load", () => { if (active) { setHeight(); update(); } });
    if (mq.addEventListener) mq.addEventListener("change", evaluate);
  }

  /* ---------- Hover-to-play video on work cards ---------- */
  function initHoverVideo() {
    if (!finePointer || reduceMotion) return;
    $$(".hcard").forEach((card) => {
      const v = $(".hcard__video", card);
      if (!v) return;
      // if the per-category clip 404s, fall back to the hero film as placeholder
      v.addEventListener("error", () => {
        const fb = v.dataset.fallback;
        if (fb && v.getAttribute("src") !== fb) { v.setAttribute("src", fb); if (card.classList.contains("is-playing")) v.play().catch(() => {}); }
      });
      let loaded = false;
      card.addEventListener("mouseenter", () => {
        if (!loaded) { loaded = true; v.setAttribute("src", v.dataset.src); }
        card.classList.add("is-playing");
        v.play().catch(() => {});
      });
      card.addEventListener("mouseleave", () => { card.classList.remove("is-playing"); v.pause(); });
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
    const els = $$(".reveal, .reveal-up, .reveal-line, .scenes__title, .services__title, .process__title, .service");
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

  /* ---------- Cinemascope showreel lightbox ---------- */
  function initReelLightbox() {
    const lb = $("#reelLightbox");
    const trigger = $(".reel__frame");
    if (!lb || !trigger) return;
    const video = $(".lightbox__video", lb);
    const closeBtn = $(".lightbox__close", lb);
    function open() {
      if (!video.getAttribute("src")) video.setAttribute("src", video.dataset.src);
      lb.classList.add("is-open"); lb.setAttribute("aria-hidden", "false");
      scrollLock(true);
      try { video.currentTime = 0; } catch (e) {}
      video.muted = false;
      const p = video.play();
      if (p && p.catch) p.catch(() => { video.muted = true; video.play().catch(() => {}); });
    }
    function close() {
      lb.classList.remove("is-open"); lb.setAttribute("aria-hidden", "true");
      scrollLock(false); video.pause();
    }
    trigger.addEventListener("click", (e) => { e.preventDefault(); open(); });
    closeBtn.addEventListener("click", close);
    lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && lb.classList.contains("is-open")) close(); });
  }

  /* ---------- Horizontal slide deck ---------- */
  function initDeck() {
    const deck = $("#deck");
    const track = $("#deckTrack");
    if (!deck || !track) return false;

    // Slides = direct section/footer children, minus decorative/duplicate ones.
    const skip = ["marquee", "brand-strip", "hwork"];
    let slides = Array.from(track.children).filter((el) => el.matches("section, footer"));
    slides.forEach((s) => { if (skip.some((c) => s.classList.contains(c))) s.classList.add("deck-skip"); });
    slides = slides.filter((s) => !s.classList.contains("deck-skip"));
    if (slides.length < 2) return false;

    // Each slide gets its own transition "approach" so the deck never repeats itself.
    const fxMap = { hero: "fade", manifesto: "rise", house: "flip", reel: "zoom",
      kisaplan: "flip", scenes: "rise", services: "cube", process: "zoom",
      studio: "flip", contact: "rise" };
    slides.forEach((s) => { s.dataset.fx = fxMap[s.id] || (s.classList.contains("footer") ? "fade" : "flip"); });

    document.body.classList.add("deck-on");
    // Off-screen slides never trigger the scroll-reveal observer, so show all content up-front.
    $$(".reveal, .reveal-up, .reveal-line, .scenes__title, .services__title, .process__title, .service, #hero, .manifesto__text")
      .forEach((el) => el.classList.add("is-in", "is-lit"));

    const dotsWrap = $("#deckDots");
    const counter = $("#deckCounter");
    const label = $("#deckLabel");
    const prog = $("#deckProg");
    let i = 0, lock = false;

    const names = { hero: "Opening", manifesto: "Concept", house: "The House", reel: "Showreel",
      kisaplan: "Kısa Plan", scenes: "Scenes", services: "Services", process: "Process",
      studio: "Studio", contact: "Contact" };
    function nameFor(s) { return names[s.id] || (s.classList.contains("footer") ? "Echoes" : (s.id || "")); }

    if (dotsWrap) slides.forEach((s, idx) => {
      const b = document.createElement("button");
      b.className = "deck-dot"; b.type = "button";
      b.setAttribute("aria-label", "Go to " + (nameFor(s) || "slide " + (idx + 1)));
      b.addEventListener("click", () => go(idx));
      dotsWrap.appendChild(b);
    });
    const dots = dotsWrap ? Array.from(dotsWrap.children) : [];
    const pad = (n) => String(n).padStart(2, "0");

    function render() {
      slides.forEach((s, idx) => {
        s.dataset.pos = idx === i ? "active" : (idx < i ? "left" : "right");
        s.setAttribute("aria-hidden", idx === i ? "false" : "true");
        s.style.pointerEvents = idx === i ? "" : "none";
      });
      dots.forEach((d, idx) => d.classList.toggle("is-on", idx === i));
      if (counter) counter.textContent = pad(i + 1) + " / " + pad(slides.length);
      if (label) label.textContent = nameFor(slides[i]);
      if (prog) prog.style.transform = "scaleX(" + (i + 1) / slides.length + ")";
      slides[i].scrollTop = 0;
    }
    function go(n) { i = Math.max(0, Math.min(slides.length - 1, n)); render(); }
    const next = () => go(i + 1), prev = () => go(i - 1);

    const pBtn = $("#deckPrev"), nBtn = $("#deckNext");
    if (pBtn) pBtn.addEventListener("click", prev);
    if (nBtn) nBtn.addEventListener("click", next);
    window.addEventListener("keydown", (e) => {
      if (e.target.matches && e.target.matches("input, textarea")) return;
      if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); next(); }
      else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); prev(); }
      else if (e.key === "Home") { go(0); } else if (e.key === "End") { go(slides.length - 1); }
    });

    // Wheel advances the deck, unless the active slide can still scroll internally.
    deck.addEventListener("wheel", (e) => {
      const s = slides[i];
      const canScroll = s.scrollHeight > s.clientHeight + 2;
      const atTop = s.scrollTop <= 0, atBot = s.scrollTop + s.clientHeight >= s.scrollHeight - 2;
      const dy = e.deltaY, dx = e.deltaX;
      if (canScroll && ((dy > 0 && !atBot) || (dy < 0 && !atTop))) return; // let the slide scroll
      e.preventDefault();
      if (lock) return;
      if (Math.abs(dy) < 6 && Math.abs(dx) < 6) return;
      lock = true; setTimeout(() => (lock = false), 850);
      (dy > 0 || dx > 0) ? next() : prev();
    }, { passive: false });

    // Touch swipe (horizontal intent only).
    let tx = 0, ty = 0;
    deck.addEventListener("touchstart", (e) => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
    deck.addEventListener("touchend", (e) => {
      const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy) * 1.3) { dx < 0 ? next() : prev(); }
    }, { passive: true });

    // Anchor links jump to the matching slide.
    $$('a[href^="#"]').forEach((a) => {
      const href = a.getAttribute("href");
      if (!href || href.length < 2) return;
      a.addEventListener("click", (ev) => {
        if (href === "#top") { ev.preventDefault(); document.body.classList.remove("menu-open"); go(0); return; }
        const t = document.getElementById(href.slice(1));
        if (!t) return;
        const slide = t.closest("section, footer");
        const idx = slides.indexOf(slide);
        if (idx >= 0) { ev.preventDefault(); document.body.classList.remove("menu-open"); go(idx); }
      });
    });

    render();
    return true;
  }

  /* ---------- Horizontal rails (content groups slide sideways) ---------- */
  function initRails() {
    $$(".rail-wrap").forEach((wrap) => {
      const rail = wrap.querySelector(".rail");
      if (!rail) return;
      const isFlow = rail.classList.contains("rail--flow");

      const mk = (dir, label, glyph) => {
        const b = document.createElement("button");
        b.className = "rail-arrow rail-arrow--" + dir; b.type = "button";
        b.setAttribute("aria-label", label); b.innerHTML = "<span>" + glyph + "</span>";
        b.addEventListener("click", () => {
          const card = rail.querySelector(":scope > *");
          const gap = parseFloat(getComputedStyle(rail).columnGap) || 16;
          const step = card ? card.getBoundingClientRect().width + gap : rail.clientWidth * 0.8;
          rail.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
        });
        wrap.appendChild(b); return b;
      };
      const prev = mk("prev", "Scroll left", "‹"), next = mk("next", "Scroll right", "›");

      const updateArrows = () => {
        prev.disabled = rail.scrollLeft <= 4;
        next.disabled = rail.scrollLeft + rail.clientWidth >= rail.scrollWidth - 4;
      };
      const flow = () => {
        if (!isFlow) return;
        const mid = rail.scrollLeft + rail.clientWidth / 2;
        $$(":scope > *", rail).forEach((c) => {
          const cmid = c.offsetLeft + c.offsetWidth / 2;
          const d = Math.min(1, Math.abs(cmid - mid) / (rail.clientWidth * 0.6));
          c.style.setProperty("--d", d.toFixed(3));
        });
      };
      let raf = 0;
      rail.addEventListener("scroll", () => {
        updateArrows();
        if (isFlow) { cancelAnimationFrame(raf); raf = requestAnimationFrame(flow); }
      }, { passive: true });
      window.addEventListener("resize", () => { updateArrows(); flow(); });
      updateArrows(); flow();
    });
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
    initParallax();
    initHorizontalWork();
    initRails();
    initManifesto();
    initTaglines();
    initHoverVideo();
    initReelLightbox();
  });

  // Failsafe: if preloader script timing misses, reveal hero after load
  window.addEventListener("load", () => {
    setTimeout(() => {
      const hero = $("#hero");
      if (hero && !hero.classList.contains("is-in")) hero.classList.add("is-in");
    }, 2600);
  });
})();
