# House of Echoes — Global-Studio Playbook

> The operating manual for taking this site to the level of the best
> director/videographer studios in the world, with a visual language
> **derived from the Kısa Plan films themselves** (not guessed). Read this
> before touching a section. Every change is briefed, built, tested across
> multiple windows, critiqued, and refined in a loop.

---

## 0 · North star

House of Echoes is the studio of **Hakan Güneş**. The work (the *Kısa Plan*
series) is quiet, observational, Anatolian, cinematic — "the hour between day
and night." The site must feel like **one of his films**: dark, textured,
unhurried, type-forward, emotionally precise. Silent luxury through restraint,
not decoration.

**Litmus test for every decision:** *Would this feel at home as a frame in a
Kısa Plan film?* If it's bright, busy, glossy, or bouncy — it's wrong.

---

## 1 · Visual language (derived from the films)

Evidence — dominant palettes + mood pulled from the six film stills:

| Film | Mood | Key colours (measured) |
|------|------|------------------------|
| Biatlon | warm golden-hour silhouette | `#FAAF18` `#F1A44C` `#674E2B` |
| Timeline | warm sand / dusk | `#D5CB92` `#A79152` `#60502B` |
| Garaj'da | earthy tan interior | `#A08C63` `#8D754E` `#1C2015` |
| Arkadaşlık | olive / khaki nature | `#A59F5E` `#C9C775` `#555730` |
| A Day Between | cold overcast teal | `#2B505F` `#0E3548` `#9AACB3` |
| Aralık | desaturated cold grey | `#505257` `#313A46` `#959AAE` |

**Take-aways → system:**

- **Format / motif — Cinemascope 2.39:1.** Letterbox framing, wide crops, and
  title-cards are the signature. Use as a recurring device (hero, section
  intros, media).
- **Typography — the title-card system.** A **bold condensed grotesque**
  (uppercase) for display/section titles + a **serif** for the *"Kısa Plan #N"*
  tags, numbers and quiet captions; clean grotesque (Hanken) for body. This is
  the films' literal type DNA. **Retire the Sacramento script** — it breaks the
  restraint.
- **Palette — dark, earthy, desaturated.** Near-black base; muted olive / teal-
  grey / sand midtones; **two accent temperatures** — warm golden-hour amber and
  cold teal-blue — assigned per section to evoke "the hour between." Lower the
  saturation of the current tokens; keep the brand anchors (Rich Black, Light
  Sand, Teal Shadow, Golden Hour) but film-grade them.
- **Texture — always-on film.** 35 mm grain + halation + vignette + the faintest
  gate-weave. The screen should never feel like flat digital UI.
- **Motion — the edit.** Slow, weighted cinematic easing; cuts and dissolves,
  never bounce; scroll behaves like a cut/dolly; hover-to-play. Honour
  `prefers-reduced-motion` everywhere.
- **Layout — negative space + type-as-image.** Asymmetric, photo/film-forward,
  big quiet title-cards. **Glass is demoted to a single refined accent**, not the
  page's language.
- **Vector — precise.** Crisp eclipse mark, an exact minimal icon set, and a
  condensed wordmark lockup that matches the title-cards. Built on a grid, optical
  corrections, SVGO-clean.

---

## 2 · Orchestration model

The **Orchestrator** (lead) owns this playbook, sequences phases, briefs agents,
integrates their output, runs the tests, makes the final taste call, and commits.
Specialised agents are deployed per the brief and run **in parallel** where
independent:

| Agent | Owns | Output |
|-------|------|--------|
| **Research / Benchmark** | Best global director-studio sites + the films | pattern shortlist, references |
| **Visual Design** | Tokens, type scale, colour grades, section comps | design spec |
| **Motion** | Motion language, per-section interactions, easing | motion spec + snippets |
| **Vectorizing** | Eclipse mark, icon set, wordmark (precise SVG) | optimised SVGs |
| **Taste** | Critique vs. anti-patterns each iteration | go / no-go + fixes |
| **Logic / IA** | Content order, narrative flow, labelling | IA map |
| **Creativity** | 1–2 signature "wow" moments per section | concept options |
| **Accessibility** | WCAG 2.2 AA audit per section | issues + fixes |
| **System Builder** | Implements the agreed design system in code | the build |

Hand-off rule: no agent output ships unmerged — the Orchestrator reconciles
conflicts (e.g. Creativity vs. Taste vs. Accessibility) against the North Star.

---

## 3 · The loops

**Per-section loop**
1. **Brief** the section against the visual language + IA.
2. **Diverge** — Creativity + Visual + Motion + Logic propose in parallel.
3. **Build** the chosen direction (System Builder).
4. **Test** across windows (§5) — *real* renders, repeated.
5. **Critique** — Taste + Accessibility audit the rendered result.
6. **Refine** → repeat 3–5 until the quality bar (§6) is met.
7. **Commit** + open a draft PR; record what changed.

**Global loops**
- **Cohesion loop** — after each section, re-check rhythm/typographic/colour
  consistency across the whole page.
- **Regression loop** — before final, a full multi-window pass to catch
  breakage introduced by later sections.
- **Polish loop** — micro-timing, grain levels, optical spacing, copy.

---

## 4 · Section-by-section plan

Each section is reconceived in the film language. (Order = page order.)

1. **Hero** — a single cinemascope frame: the hero film letterboxed, a condensed
   title-card lockup fading in like an opening title, quiet HUD. No glass.
2. **Manifesto / Concept** — one line, huge, type-as-image; slow dissolve; grain.
3. **The Work (Kısa Plan)** — the films as title-cards; hover-to-play; each card
   the cinemascope crop + condensed title + serif "Kısa Plan #N". Horizontal rail.
4. **Scenes & Stories** — wide film-still cards, coverflow rail, warm/cold grade
   alternating per scene.
5. **Services** — restrained list/rail; precise icons; no glassy noise.
6. **Process** — "four movements" as a quiet numbered sequence (serif numerals).
7. **Studio (Hakan)** — the portrait, full-bleed cinemascope, viewfinder HUD,
   lower-third credit.
8. **Contact** — a single invitation, big type, one accent.
9. **Footer** — minimal; the mark; one line.

Glass survives only where it earns its place (e.g. the nav pill, one overview
surface) — everywhere else, film grading + type carry the design.

---

## 5 · Testing protocol (real, multi-window)

All verified with headless Playwright (already wired). For **every** section:

- **Viewports:** `390×844` (mobile), `768×1024` (tablet), `1280×800` and
  `1440×900` (desktop), `1920×1080` (wide).
- **Themes:** dark **and** light.
- **States:** initial load **and** after interaction — scroll into view, hover,
  rail swipe, menu open, focus. *Not a single screenshot — multiple, per state.*
- **Repeat:** render at least twice per critical state to catch timing/flake.
- **Bug checklist:** horizontal overflow / clipping, text contrast (≥ 4.5:1
  body, 3:1 large), tap targets ≥ 44px, layout shift, motion glitches/jank,
  console errors, broken/oversized assets, focus order + visible focus,
  reduced-motion correctness.
- **Record:** keep the screenshots; note every defect and its fix in the PR.

---

## 6 · Quality bar (definition of done)

- **Taste:** passes the anti-pattern review; nothing arbitrary; rhythm + optical
  spacing intentional; copy earns its place.
- **Accessibility:** WCAG 2.2 AA — contrast, keyboard, focus, labels, reduced
  motion, semantics.
- **Performance:** no build step; images optimised + lazy; no main-thread
  jank on scroll; LCP image prioritised.
- **Cohesion:** consistent type scale, grade, motion easing, spacing across all
  sections.
- **Robustness:** degrades gracefully (no-JS, slow net, no-WebGL); verified at
  all five viewports in both themes.

---

## 7 · Risk & rollback

- Each section ships as its own commit / draft PR → easy revert.
- The visual-language shift (type + grade) lands as a tokens-first change so it
  can be tuned in one place.
- If a "wow" moment fails Taste or Accessibility, it's cut — restraint wins.

---

*This playbook is the contract. Build to it, test against it, refine in the loop.*
