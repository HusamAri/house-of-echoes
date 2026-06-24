# House of Echoes — Second Brain

> Working memory for this project: what it is, how it's built, the decisions and
> dead-ends behind it, the brand language, the tooling, and — most importantly —
> the owner's taste and the gotchas learned the hard way. Read this before
> resuming work so you don't relitigate settled calls.

_Last updated: 2026-06-23. Owner: Hakan Güneş (filmmaker). Repo:
`HusamAri/house-of-echoes`. Dev branch: `claude/great-ramanujan-0v81wt` → PRs to `main`._

---

## 1 · What it is

A single-page, no-build, vanilla **HTML/CSS/JS** "silent-luxury" cinematic site for
**House of Echoes**, the film studio of director/videographer **Hakan Güneş**. Static,
no framework, no runtime deps. Deployed via GitHub → **Vercel** _and_ **Netlify** (both
build PR previews automatically). Local dev: `python3 -m http.server 4173`.

Files:
```
index.html                     # the whole page
components.html                # glass UI styleguide (standalone)
assets/css/style.css           # design system + all sections (~1300 lines)
assets/js/main.js              # all interactions (IIFE, dependency-free)
assets/js/lenis.min.js         # vendored smooth scroll
assets/img/hakan-portrait.jpg  # generated director portrait (180KB)
assets/img/scenes/*.jpg        # 6 generated film stills (warm/cold)
assets/img/render/*            # 6 generated 3D objects (bento) + banner
assets/img/logo/*.svg          # eclipse + lockups
assets/video/hero.mp4          # hero film (eclipse + figure, golden hour)
assets/video/showreel.mp4      # 16:9 showreel (lightbox)
docs/playbook.md               # the studio-level overhaul operating manual
docs/render-prompts.md         # 3D object prompts
docs/cinematic-and-svg-research.md, second-brain.md
```

---

## 2 · Brand & visual language (DERIVED FROM THE FILMS — do not guess)

The Kısa Plan films were analysed frame-by-frame (stills + measured palettes). The
visual language **comes from them**:

- **Palette:** Rich Black `#0D0D0D` (graded to `#0B0B0C`), Light Sand `#E6E0D5`,
  Teal Shadow `#3F6A6F`, Golden Hour `#D4A361`. The films are **dark, desaturated,
  earthy**, swinging between **warm golden-hour** (Biatlon, Timeline, Garaj'da) and
  **cold teal-blue** (A Day Between, Aralık). Lean dark + filmic, NOT bright/glassy.
- **Type = title-card system** (the films literally do this): **Archivo** (condensed,
  bold, uppercase, tight tracking) for display titles via `--display`; **Fraunces**
  (serif, opsz/italic) for the "Kısa Plan #N" tags, numerals, captions, the Concept
  line via `--serif`; **Hanken Grotesk** body via `--sans`. **Sacramento script is
  RETIRED** — do not reintroduce a script face. All three are Google Fonts, Turkish
  (Latin-Extended) verified at the glyph level.
- **Motif:** cinemascope **2.39:1** letterboxing; vignette + 35mm grain always on.
- **Motion = the edit:** slow, weighted, cuts/dissolves, NO bounce. Tokens:
  `--ease`(enter) `--ease-2`(dolly) `--ease-exit` `--ease-micro`; durations
  `--dur-micro/move/reveal/dissolve`. The one allowed overshoot is the theme toggle.
  Everything gated behind `prefers-reduced-motion`.
- **Glass is an ACCENT, not the language** — the nav pill + one overview surface only.

---

## 3 · Architecture / current section order (vertical scroll)

`hero (pure film, no text)` → `manifesto/Concept` → `bento "The House"` → `showreel`
→ `Kısa Plan films` → `scenes` → `services` → `selected work (hwork)` → `marquee` →
`process` → `brand-strip` → `studio (Hakan)` → `contact` → `footer`.

**Content groups slide sideways** as horizontal **rails** (not vertical stacks):
- `.rail--flow` (scenes) = coverflow (JS sets `--d` per card → centre focused, sides dim)
- `.rail--slide` (films), `.rail--peek` (services), `.rail--steps` (process)
- Rails: scroll-snap, swipe on touch, injected glass arrows on desktop, keyboard-
  focusable (`tabindex=0` + arrow keys + focus ring), set up in `initRails()`.

Section labels are **viewfinder HUD** chips: mono + REC dot + focus-tick corners
(`.section-label`). Studio portrait has a REC/timecode HUD + lower-third + brackets.

---

## 4 · Generated assets & how

All generated via **Higgsfield MCP** `generate_image` (model `nano_banana_pro`,
~2 credits each; poll results with `show_generations`, NOT `job_status` which was
permission-denied). Then downloaded, optimised with **Pillow** (`pip install Pillow`),
background-removed with **rembg** (`pip install rembg`, u2net) for transparent objects.

- **Portrait** (`hakan-portrait.jpg`): made by the OWNER from a prompt I wrote, using
  his real photo as a face/character reference. Brand overlays composited in CSS.
- **Scenes** (`assets/img/scenes/*.jpg`): 6 film stills (restaurant/hotel/promo/doc/
  product warm; social cold) — set as `background-image` on `.scene__art--*`.
- **Bento 3D objects** (`assets/img/render/*`): glass orb, gold rings+film, aperture,
  stone cairn, eclipse, wide banner — transparent PNGs that break out of glass tiles.

---

## 5 · Tooling & workflows

- **CodeGraph** MCP for code navigation (`codegraph_*`).
- **Headless Playwright** (`pip install playwright; playwright install chromium`) for
  REAL multi-window tests — owner explicitly demanded "test from different windows,
  not only once." Harness: `scratchpad/shoot.py` (5 viewports × 2 themes). **Google
  Fonts + i.ytimg load in-sandbox; H.264 hero video decodes too.** External cert
  errors for some hosts are noise — filter them.
- **axe-core** (`npm pack axe-core`, inject `axe.min.js`, `axe.run`) for WCAG audits —
  run at load AND after scrolling into the page (that's how the menu `aria-hidden-focus`
  bug was found).
- **Git:** commit trailers `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>` +
  `Claude-Session:`. Set `git config user.email noreply@anthropic.com` / name `Claude`.
  Never put the model id in commits/PRs. Each change = its own commit → **draft PR**;
  owner reviews on preview and merges. Rebase onto `main` before push; force-with-lease.
  GitHub merge commits show as "Unverified" — that's GitHub's, leave them.

---

## 6 · OWNER TASTE & feedback patterns (most valuable section)

He is detail-obsessed, reacts fast and bluntly, and iterates section by section.
Honour these — they are settled:

- **Hero = pure film, NO text/overlays/logo.** He removed them explicitly. Don't add.
- **Sans-forward, no serif for body; ONE elegant accent** — now Fraunces (was the
  retired script). He disliked generic/"basic" design and shaky hand-drawn vectors
  ("vectoriel drawings of yours are terrible") → use real font outlines / pro icon
  geometry (Lucide) / generated imagery, never freehand SVG.
- He disliked: the **L-shaped theme slider**, the **rotating 3D cube** ("çok çirkin"),
  the **bright liquid-glass** look once it lost the cinematic feel, **flat/blurry
  placeholders**, and **"endless" pages**. He wanted: a **rounded theme pill outside
  the video**, **physical/tactile 3D controls**, **camera-screen / viewfinder overlays**
  for title side-info, **content that slides sideways with varied slider effects**, and
  the visual language **matched to his films**.
- He wants **orchestration**: deploy specialised agents (visual/motion/vector/taste/
  logic/creativity/accessibility/system-builder) and harmonise them; **playbook first**;
  **research + real tests** per section.
- Reconciliation rule learned: when his asks conflict (glassmorphism refs vs. the films'
  dark grade), the **films win** — glass demotes to accent.

---

## 7 · Gotchas / lessons

- **Liquid glass needs colour/imagery behind it** or it's invisible on flat dark — the
  bento needed a gradient-mesh backdrop + defined cards.
- **`aspect-ratio` on a `<button>`/empty box is unreliable on mobile Safari** → use
  `padding-bottom` for cinemascope film frames. A flex-column child with only absolute
  children collapses to 0×0 → give it explicit `width:100%` + aspect.
- **YouTube maxres thumbnails bake in the film's letterbox bars** → crop to cinemascope
  to hide them.
- **`role="group"` on a `<ul>` strips list semantics** (listitem errors) — don't.
  Closed menu overlay needs **`inert`** (not just `aria-hidden`) or its links stay
  tabbable.
- Manifesto "light-up" words: resting opacity must be ≥ ~0.55 for 3:1 contrast.
- Don't animate SVG `feTurbulence` per frame (re-rasterises) — static grain + transform
  shimmer only.

---

## 8 · Build journey (PR history)

Early: base site, taste-skill fixes, hero video, logo system, light/dark/system theme,
film texture, CodeGraph + Superpowers, glassmorphism kit, hero cinemascope reveal,
Kısa Plan films embed, mobile hero fit, studio portrait, bento + 3D objects, viewfinder
HUD labels. Then the **horizontal slide deck** (built, then **reverted** — he wanted
vertical + sideways sliders; the cube was cut). Then the **studio-level overhaul**
(playbook → Archivo/Fraunces type → film-grade → real Scenes stills → WCAG 2.1 AA →
cohesion). Latest merged: **PR #28**.

---

## 9 · Open next steps (not started)

- **Performance:** self-host the 3 Google fonts, drop third-party preconnects; CLS/LCP pass.
- **Signature motion:** literal cinemascope `clip-path: inset()` `.cine-reveal` on
  section intros + cross-dissolve + staggered title-card words (motion spec ready in
  `docs/playbook.md` / the motion agent output).
- **Per-category hover-play clips:** `work-{restaurant,hotel,product,doc,promo,social}.mp4`
  (3:4) — cards currently fall back to `hero.mp4`.
- Scroll-scrub eclipse (needs `eclipse-scrub.mp4`).
