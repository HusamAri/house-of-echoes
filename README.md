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

- **Display serif:** Cormorant Garamond (a free stand-in for Canela)
- **Grotesk:** Hanken Grotesk (a quieter, less-overused stand-in for Neue Haas Grotesk Light)
- **Sunmark:** the solar-eclipse logo, rebuilt in pure CSS/SVG (corona + disc)

## Craft

- **Cinematic hero video** under a graded scrim, with the eclipse + wordmark on top
  (gracefully falls back to the golden-hour gradient if the video can't play, and
  pauses entirely under `prefers-reduced-motion`)
- Eclipse-forming **preloader** with a live counter
- **Custom cursor** with magnetic hover (fine-pointer only)
- **Scroll-reveal** typography, **parallax** media, rotating taglines
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
│   └── img/favicon.svg     # eclipse favicon
└── README.md
```
