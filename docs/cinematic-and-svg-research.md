# House of Echoes — Cinematic & Vector Craft Research

> Research-backed selection of cinematic web features for the site, plus an SVG/vector
> craft cheat-sheet. Compiled from a fan-out study of award-winning film-studio sites,
> current web-platform capabilities, and logo/icon craft sources (citations at the end).
> All recommendations are scoped to our reality: **no build step, vanilla HTML/CSS/JS,
> performance-conscious, accessible, graceful degradation**.

---

## Part 1 — What the best in the sector are doing (2025–2026)

The Awwwards **Film & TV** Sites of the Day (e.g. *Silent House*, *Artefakt*) and the
cinematic-studio roundups converge on a consistent recipe:

- **Two-colour, ultra-minimal palettes** as the "silent-luxury" frame — content and
  motion carry the design, not colour. (We already do this with the film-frame dark
  gradients + sand/black.)
- **Scroll as the director's cue** — sections behave like chapters: video/3D scrubbed to
  scroll, type fading in and out, custom cinematic easing.
- **Cinematic framing & players** — cinemascope/letterbox black-bar players, fullscreen
  looping hero film, hover-to-play reels in tight galleries.
- **Choreographed transitions** — listing → detail page transitions, fullscreen menus,
  custom cursors, horizontal-scroll galleries.
- **Emotion over spectacle** — mood, texture and restraint are judged as much as raw
  tech. The award winners that also win *Developer* awards pair this with WebGL/GSAP
  execution — but the *feeling* is what reads as luxury.

The takeaway for House of Echoes: we don't need WebGL to compete in this niche. We need
**restraint + a few precisely-executed cinematic moments**.

---

## Part 2 — Ranked feature selection for House of Echoes

Ranked by **wow-impact ÷ effort**, only including what fits a no-build static site and the
silent-luxury aesthetic. Each has a one-line build note and a degradation/reduced-motion note.

### Tier A — high impact, low effort (do first)

1. **Cinemascope letterbox reveals** (`clip-path: inset()`)
   *Build:* animate `inset()` top/bottom edges to pull black bars in on hero entry, section
   reveals and the showreel lightbox — `inset()` only animates edges, so no vertex-popping.
   *Degrade:* gate behind `prefers-reduced-motion`; bars simply start open.

2. **Proper SVG film grain** (`<feTurbulence type="fractalNoise">`)
   *Build:* one static `noise.svg` filter used as a CSS background layer with
   `mix-blend-mode` + low opacity; theme-aware (screen/soft-light for leaks in dark,
   multiply for burnt-film in light). Cheaper and crisper than animated/canvas grain.
   *Degrade:* purely decorative; drop opacity under reduced-motion. Keep it **non-animated**
   (animating `baseFrequency` re-rasterises every frame — expensive).

3. **Cinematic line-icon set** (this PR)
   *Build:* inline, stroke-only icons on a 24px grid (2px round stroke), `currentColor`
   theming, `pathLength="1"` "draw-on" when the card reveals.
   *Degrade:* fully drawn by default if JS/animation is unavailable; reduced-motion shows
   them static.

4. **Scroll-velocity drift on the horizontal gallery**
   *Build:* Lenis already exposes scroll velocity — map it to a small clamped `skewX`/scale
   on the work track for a subtle "film-reel drag", easing back to 0 on stop. Transforms
   only (GPU-composited).
   *Degrade:* clamp hard; disable under reduced-motion.

5. **Magnetic cursor on key CTAs** (already partially present)
   *Build:* `getBoundingClientRect()` + `transform: translate()` toward the pointer, reset
   on `mouseleave`. No library.
   *Degrade:* real cursor preserved; no-op on touch / reduced-motion.

### Tier B — high impact, medium effort

6. **Scroll-scrubbed hero / showreel** (canvas frame-sequence)
   *Build:* the robust approach is **not** seeking `video.currentTime` (stutters on mobile)
   — instead extract frames offline with FFmpeg (WebP @30fps), paint the scroll-mapped
   frame to `<canvas>` in `requestAnimationFrame`, preload ±a few frames by direction.
   *Needs:* an asset-prep step; larger payload. *Degrade:* static poster frame under
   reduced-motion / slow connection.

7. **View Transitions API for opening a project / lightbox**
   *Build:* `document.startViewTransition(updateDOM)` with a feature-detect fallback; tag the
   thumbnail and the opened media with a shared `view-transition-name` to morph between them.
   *Support:* same-document is **Baseline (Oct 2025)** — Chrome/Edge 111+, Safari 18+,
   Firefox 144+. *Degrade:* unsupported browsers just swap instantly.

8. **Native CSS scroll-driven reveals** (`animation-timeline: view()`)
   *Build:* replace some JS reveals with zero-JS `view()`-timeline animations where supported.
   *Support:* ~82–85% global; **Firefox still flag-gated**, so keep the IntersectionObserver
   path as the fallback (`@supports not (animation-timeline: view())`). *Degrade:* content
   fully visible without support; wrap in `prefers-reduced-motion: no-preference`.

### Tier C — high effort, optional (against silent-luxury restraint)

9. **WebGL shader grain / cursor displacement** — the only effect that genuinely pushes us
   toward a vendored lib (OGL/Three via import-map) **and** requires a hand-written
   `failIfMajorPerformanceCaveat` fallback. Recommendation: **skip** — it fights the
   restraint that reads as luxury, and the SVG/CSS routes get us 90% of the look.

**Recommended next build order:** 1 → 3 (this PR) → 2 → 4 → 7.

---

## Part 3 — SVG / vector craft cheat-sheet

The fix for "amateur-looking vectors": stop hand-tracing, build on a grid, and let real
geometry/fonts do the work.

### Logo / mark construction
- **Optical overshoot:** a circle the *same* height as a square looks too small. Round
  forms should overshoot ~**1–3%** of cap-height (Karow: 3% for `O`, 5% for pointed `A/V`).
  A round mark beside a wordmark should be **1–3% larger** than the cap-height, never equal.
- **Grids guide, eyes decide** — build on a circle/modular grid, then correct by eye (the
  Google "G" famously breaks its own grid to look right).
- **Irradiation:** a light-on-dark mark looks *fatter* than dark-on-light — shave weight by
  eye for inverted/knockout versions. (Relevant to our light ring on a dark disc.)
- **Ring math:** a stroke straddles the path centreline (half in/half out), so a stroked
  ring's effective outer radius is `r + strokeWidth/2`. To fit inside a target diameter use
  `radius = maxRadius − strokeWidth/2`.
- **Prefer filled shapes over strokes for final marks** — express a ring as a compound
  filled path (outer minus inner via `fill-rule="evenodd"`), not two stacked circles:
  fewer nodes, one fill, resolution-independent, no z-order fragility. Outline/expand all
  strokes before shipping. *(Our eclipse is intentionally a soft radial-gradient halo —
  a filled/gradient form, not a shaky stroke — which is the correct call here.)*

### Wordmarks from real font outlines (opentype.js) — what we already use
- `opentype.parse(arrayBuffer)` → `font.getPath(text, x, y, fontSize, {kerning:true})` →
  `path.toSVG({decimalPlaces:2, optimize:true, flipY:true})`.
- **Gotchas:** `y` is the **baseline**, not the top (derive position from
  `font.ascender/descender` or `getBoundingBox()`); all font metrics are in `unitsPerEm`
  (scale = `fontSize / unitsPerEm`); keep `kerning:true`; `flipY` handles the y-up→y-down
  inversion; `decimalPlaces:2` is plenty at logo scale.

### Icon system (the set added in this PR)
- **Grid:** 24×24 `viewBox`, ~1px keyline padding, 2px min element spacing.
- **Stroke:** **2px**, centred, `stroke-linecap="round"`, `stroke-linejoin="round"`,
  `fill="none"`. Corner radius 2px (≥8px shapes) / 1px (smaller).
- **Theme:** `stroke="currentColor"`; drive `color` from a theme variable so icons flip
  with light/dark automatically. (Only works for **inline** SVG, not `<img>`.)
- **A11y:** decorative → `aria-hidden="true" focusable="false"`; meaningful/standalone →
  `role="img"` + `<title>` (first child) + `aria-labelledby`.
- **Draw-on:** `pathLength="1"` + `stroke-dasharray:1; stroke-dashoffset:1` → animate offset
  to `0`. CSS over SMIL (deprecated) / JS (unneeded once `pathLength` removes length math).
  **Hide the dash only when motion is allowed** so icons show fully drawn if JS fails.
- **Delivery:** for a handful of icons, **inline** them — it's the only option giving
  per-path CSS control (theming + staggered draw-on) and per-instance ARIA.

### SVG hygiene & optimisation
- Set a **tight `viewBox`** to the artwork bounds; keep `removeViewBox:false` in SVGO.
- **SVGO `convertPathData`** is the biggest win (30–50% on complex art); `floatPrecision:3`
  default, drop to `2` for marks under ~64px after a side-by-side check. `multipass:true`
  for a few % more. Mind that arc-rounding is mildly lossy — eyeball curves.

---

## Sources

**Sector / award sites**
- Awwwards — Film & TV winners: https://www.awwwards.com/websites/film-tv/ ·
  https://www.awwwards.com/sites/silent-house · https://www.awwwards.com/sites/artefakt
- Qadra — 30 video-portfolio examples: https://qadra.studio/best-30-video-portfolio-website-examples/
- DesignRush — film-production sites: https://www.designrush.com/best-designs/websites/trends/film-production-company-websites
- Muzli — 100 best portfolios 2025: https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/
- Codrops — cinematic 3D scroll w/ GSAP: https://tympanus.net/codrops/2025/11/19/how-to-build-cinematic-3d-scroll-experiences-with-gsap/

**Cinematic effect techniques**
- CSS-Tricks — Grainy gradients (`feTurbulence`): https://css-tricks.com/grainy-gradients/
- Codrops — OPTIKKA scroll-synced video → frame sequences: https://tympanus.net/codrops/2025/10/16/creating-smooth-scroll-synchronized-animation-for-optikka-from-html5-video-to-frame-sequences/
- MDN — `requestVideoFrameCallback`: https://developer.mozilla.org/en-US/docs/Web/API/HTMLVideoElement/requestVideoFrameCallback
- CSS-Tricks — Animating with `clip-path`: https://css-tricks.com/animating-with-clip-path/
- Robb Owen — CSS blend-mode shaders: https://robbowen.digital/wrote-about/css-blend-mode-shaders/
- MDN — `prefers-reduced-motion`: https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- MDN — Detect WebGL: https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/By_example/Detect_WebGL

**Scroll-driven motion**
- Lenis README: https://github.com/darkroomengineering/lenis/blob/main/README.md
- MDN — Scroll-driven animations: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations
- Chrome — Scroll-driven animations: https://developer.chrome.com/docs/css-ui/scroll-driven-animations
- caniuse — `animation-timeline: scroll()`: https://caniuse.com/mdn-css_properties_animation-timeline_scroll
- Josh Comeau — Scroll-driven animations: https://www.joshwcomeau.com/animation/scroll-driven-animations/
- Chrome — View Transitions in 2025: https://developer.chrome.com/blog/view-transitions-in-2025
- MDN — View Transition API: https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API
- MDN — Intersection Observer API: https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API

**Vector / SVG craft**
- opentype.js README: https://github.com/opentypejs/opentype.js/blob/master/README.md
- Wikipedia — Overshoot (typography): https://en.wikipedia.org/wiki/Overshoot_(typography)
- Logo Geek — Optical corrections: https://logogeek.uk/logo-design/optical-corrections/
- Smashing — SVG circle decomposition: https://www.smashingmagazine.com/2019/03/svg-circle-decomposition-paths/
- SVGO — `convertPathData` / preset-default: https://svgo.dev/docs/plugins/convertPathData/ · https://svgo.dev/docs/preset-default/
- Lucide — Icon design guide: https://lucide.dev/contribute/icon-design-guide
- Maya Shavin — `currentColor` for SVG icons: https://mayashavin.com/articles/svg-icons-currentcolor
- CSS-Tricks — SVG line animation: https://css-tricks.com/svg-line-animation-works/ · Accessible SVGs: https://css-tricks.com/accessible-svgs/
- Deque — Accessible SVGs: https://www.deque.com/blog/creating-accessible-svgs/

**Icon set credit:** the cinematic service icons added to the site are built on
[Lucide](https://lucide.dev) geometry (ISC License) — `wine`, `concierge-bell`,
`clapperboard`, `film`, `aperture`, `smartphone` — re-coloured to the brand via
`currentColor`.
