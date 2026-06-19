# House of Echoes — Cinematic Studio

A high-end, "silent-luxury" portfolio website for **House of Echoes**, the
cinematic film studio of director & cinematographer **Hakan Güneş**.

> _What remains after · Images that linger · Some stories stay._

The site presents the studio as a full-round agency — restaurant & culinary
films, hotel & hospitality, promotional films, documentary, product films and
social-media content — each shown as a cinematic scene with its own story.

## Brand system

Built directly from the House of Echoes visual identity:

| Token | Value | Use |
| --- | --- | --- |
| Rich Black | `#0D0D0D` | Base canvas |
| Light Sand | `#E6E0D5` | Primary text |
| Teal Shadow | `#3F6A6F` | Cool accent |
| Golden Hour | `#D4A361` | Eclipse / highlight |

A **sans-forward** type system (no serif), with one script for accents:

- **Display + body:** Hanken Grotesk (a quieter, less-overused stand-in for Neue Haas Grotesk Light), tracked uppercase for wordmarks
- **Script accent:** Sacramento — an elegant monoline script for select lines (e.g. _"Some stories stay."_)
- **Sunmark:** the solar-eclipse logo (corona + disc)

## Logo system

The brand identity's lockups live in `assets/img/logo/`, generated from real
font outlines with [`opentype.js`](https://github.com/opentypejs/opentype.js)
(true vector letterforms — no hand-drawn type, no font dependency in the file):

| File | Lockup | Used in |
| --- | --- | --- |
| `eclipse.svg` | Monogram / symbol | manifesto watermark |
| `primary.svg` | Stacked lockup | asset set (footer mirrors via CSS) |
| `secondary.svg` | Horizontal lockup | asset set (nav mirrors via CSS) |
| `wordmark.svg` | Wordmark + minimal line | asset set (brand strip mirrors via CSS) |
| `submark.svg` | Eclipse + HOE | asset set |

The on-site lockups are **CSS-driven** so they recolour with the active theme
(wordmark uses `--text`; eclipse mark stays gold). The SVG files are the
swap-ready brand asset set: drop in a high-res set (matching aspect ratios) and
re-point the placements, or override the eclipse mark via the `--logo-mark-bg`
custom property.

## Themes — light · dark · system

A full **light / dark / system** theme system, persisted to `localStorage` and
applied before first paint (no flash). System mode tracks the OS preference live.

- The control is an **L-shaped slider** docked in the corner of every film
  player (hero, showreel, each scene): **Light** at the left of the bend,
  **System** at the corner, **Dark** up the right edge — a gold ring rides the L.
  All instances stay in sync.
- The cinematic **film frames stay dark in both themes** (like film stills in a
  gallery); only the page "chrome" recolours.
- **Theme-aware film texture:** in light, warm burnt-film light rays drift over
  the cream; in dark, faint light leaks with a very subtle, occasional glitch.

## Craft

- **Cinematic hero** — full-bleed background video (graceful golden-hour gradient
  fallback if it can't play; paused under `prefers-reduced-motion`)
- The logo system surfaces in **variable places** — nav, footer, a mid-page brand
  strip (wordmark + eclipse pattern + script tagline), and a faint eclipse watermark
- Eclipse-forming **preloader** with a live counter
- **Custom cursor** with magnetic hover (fine-pointer only)
- **Scroll-reveal** typography, **parallax** media
- A word-by-word **manifesto** that lights up on scroll
- **Film grain + vignette + light-leak** overlays for a cinematic grade
- Section imagery **art-directed in CSS** (no broken external image links)
- Fully responsive, `prefers-reduced-motion` aware, no build step, no dependencies

## Taste pass

The build was run through the [Impeccable](https://impeccable.style/) anti-pattern
detector and refined against [Taste Skill](https://tasteskill.dev/) principles —
clearing the AI "slop" tells (SaaS eyebrow chip, over-used font, em-dash cadence,
layout-thrash transitions, numbered-section scaffold, cramped padding) while
keeping the deliberate, on-concept film-slate numbering on the scenes.

## Run locally

It's a static site — open `index.html`, or serve it:

```bash
# Python
python3 -m http.server 4173

# or Node
npx serve .
```

Then visit <http://localhost:4173>.

## Deploy

Any static host works (Vercel, Netlify, GitHub Pages, Cloudflare Pages).
There is nothing to build — `index.html` is the entry point.

## Structure

```
.
├── index.html              # single immersive page
├── assets/
│   ├── css/style.css       # full design system
│   ├── js/main.js          # motion & interaction
│   ├── video/hero.mp4      # cinematic hero background film
│   └── img/
│       ├── favicon.svg     # eclipse favicon
│       └── logo/           # swap-ready logo lockups (eclipse, primary, …)
└── README.md
```
