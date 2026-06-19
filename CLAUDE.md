# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## Project

**House of Echoes** — a single-page, "silent-luxury" cinematic studio website for
videographer/director **Hakan Güneş**. Static site, no build step, no runtime deps.

```
index.html              # the whole page
assets/css/style.css    # design system (themes, motion, layout)
assets/js/main.js       # interactions (theme, cursor, reveals, parallax, video)
assets/js/lenis.min.js  # vendored smooth-scroll (when enabled)
assets/img/logo/*.svg    # swap-ready logo asset set
assets/video/hero.mp4    # hero background film
```

Run locally: `python3 -m http.server 4173` then open <http://localhost:4173>.

Conventions: sans-forward type (Hanken Grotesk) + Sacramento script accent; the
brand palette and a light/dark/system theme live as CSS custom properties at the
top of `style.css`. Cinematic "film frame" gradients stay dark in both themes.

## Deployed knowledge — CodeGraph

This repo ships with [CodeGraph](https://github.com/HusamAri/codegraph), a local
code knowledge-graph MCP server, so agents can explore the code with far fewer
tool calls.

- Registered as an MCP server in [`.mcp.json`](.mcp.json) (`codegraph serve --mcp`).
- Its read-only query tools are auto-allowed in [`.claude/settings.json`](.claude/settings.json).
- A `SessionStart` hook installs the CLI (`npm i -g @colbymchenry/codegraph`) and
  builds/syncs the index at the start of each session. The index lives in
  `.codegraph/` (git-ignored, rebuilt per environment).

Prefer the `codegraph_*` tools (`search`, `explore`, `node`, `callers`,
`callees`, `impact`, `files`, `status`) over broad file scans when navigating
code. Re-index manually with `codegraph sync` (incremental) or `codegraph index`.

## Recommended plugin — Superpowers

[Superpowers](https://github.com/obra/superpowers) is a Claude Code **plugin**
(a global install, not a committed repo file). Enable it once per machine:

```text
/plugin marketplace add obra/superpowers-marketplace
/plugin install superpowers@superpowers-marketplace
```

(or `/plugin install superpowers@claude-plugins-official`). It adds composable
skills — TDD, systematic-debugging, writing-plans, code-review,
subagent-driven-development, git worktrees — that activate automatically.
