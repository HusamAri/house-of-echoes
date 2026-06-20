# 3D render slots

Drop the generated 3D objects here using these exact filenames — the bento board
in `index.html` already references each one (and shows a glass placeholder until
the file exists):

| File | Used by | Aspect |
|------|---------|--------|
| `banner-still.jpg`  | wide top banner tile        | ~21:9 |
| `bento-orb.png`     | big "Ecosystem" feature tile | 1:1 (transparent) |
| `bento-rings.png`   | "Selected films" tile        | 4:3 (transparent) |
| `bento-aperture.png`| "Services" tile              | 1:1 (transparent) |
| `bento-stones.png`  | "Process" tile               | 1:1 (transparent) |
| `hero-eclipse.png`  | (reserved for hero re-comp)  | 1:1 (transparent) |

Prompts to generate them: see [`docs/render-prompts.md`](../../../docs/render-prompts.md).
PNGs should be transparent so the objects can break out of the glass tiles.
