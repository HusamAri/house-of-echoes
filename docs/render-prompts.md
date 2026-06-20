# House of Echoes — 3D Render Prompts (liquid-glass redesign)

Generate these tactile 3D objects, then drop each file into `assets/img/render/`
using the **exact filename** below — the new layout already has a slot wired for
each one (with a graceful glass-gradient placeholder until the image lands).

**Brand palette to enforce in every render:**
- Rich Black `#0D0D0D`
- Light Sand `#E6E0D5`
- Teal Shadow `#3F6A6F`
- Golden Hour `#D4A361`

**Global style cues to append to every prompt:**
> photoreal 3D product render, octane/redshift, soft studio lighting, golden-hour
> key light, gentle long shadows, shallow depth of field, ultra-clean, premium,
> matte + glossy material contrast, subtle film grain, no text, no logos, no
> watermark, centered, generous negative space. 8k.

> ⚠️ For the **PNG (transparent)** items, add: *"isolated object, transparent
> background, no floor, alpha cutout"*. For the **scene/JPG** items, keep the
> rendered surface/background.

---

### 1 — `hero-eclipse.png`  · transparent PNG · ~1600×1600 (1:1)
The signature centerpiece — a tactile version of the brand eclipse.
> A polished golden ring (thin torus, brushed gold `#D4A361`) hovering around a
> matte black sphere `#0D0D0D`, like a solar eclipse caught as a physical object;
> a faint warm halo of light leaking from behind the sphere's rim; one small
> frosted-glass orb resting nearby for scale. Golden-hour rim light, soft shadow.
> isolated object, transparent background, no floor, alpha cutout. + global cues.

### 2 — `bento-stones.png`  · transparent PNG · ~1300×1300 (1:1)
Balance / craft tile (à la the Dallo cairn).
> A balanced cairn of five smooth pebbles stacked vertically, in brand tones —
> matte rich-black, light-sand speckled, teal-shadow, and one golden-hour stone —
> calm, zen, perfectly balanced, tactile clay/stone material. Soft top light,
> long gentle shadow. isolated object, transparent background, alpha cutout.
> + global cues.

### 3 — `bento-orb.png`  · transparent PNG · ~1100×1100 (1:1)
The "liquid glass" hero prop.
> A single translucent frosted-glass sphere with smooth caustics and a warm
> golden-hour refraction inside it, faint teal edge tint, soft specular highlight
> on top; subtle internal swirl like trapped light. isolated object, transparent
> background, alpha cutout. + global cues.

### 4 — `bento-rings.png`  · transparent PNG · ~1400×1050 (4:3)
Cinema / films tile.
> Two or three interlocking thin golden torus rings `#D4A361` floating at angles,
> with a short translucent strip of film/celluloid curving through them and a
> small glass lens element; weightless, suspended composition, warm rim light,
> teal-shadow ambient. isolated objects, transparent background, alpha cutout.
> + global cues.

### 5 — `bento-aperture.png`  · transparent PNG · ~1100×1100 (1:1)
Services / craft tile.
> A camera lens aperture rendered as a tactile 3D object — overlapping brushed-gold
> blades forming an iris, dark matte barrel, a bead of golden-hour light at the
> center; precise, mechanical, jewel-like. isolated object, transparent background,
> alpha cutout. + global cues.

### 6 — `banner-still.jpg`  · scene JPG · ~2200×1000 (wide, ~21:9)
The wide top banner (à la the "Flowing Liquidity" / Cannabis-Lab still-life).
> A cinematic still-life on a light-sand `#E6E0D5` surface: a matte black sphere,
> a frosted-glass orb, a thin golden ring, and a couple of pale speckled stones
> arranged with lots of negative space; soft volumetric golden-hour light raking
> from the right, faint teal shadow in the corners, gentle haze. Keep the rendered
> surface and a soft seamless sand backdrop. wide cinematic framing. + global cues.

### 7 *(optional)* — `hero-scene.jpg` · scene JPG · ~1600×2000 (portrait 4:5)
If you want a richer hero backdrop behind the glass panel (à la IMG_4544 — a glass
panel floating over a real scene).
> A minimalist interior corner bathed in golden-hour light — a pale plaster wall,
> one dark wood shelf with a single ceramic object, soft long shadows, calm and
> expensive-looking, lots of empty wall space on the left for a UI panel to float
> over. muted sand + teal-grey tones. + global cues.

---

**Aspect-ratio quick list** (for the generator):
`hero-eclipse` 1:1 · `bento-stones` 1:1 · `bento-orb` 1:1 · `bento-rings` 4:3 ·
`bento-aperture` 1:1 · `banner-still` 21:9 · `hero-scene` 4:5.

Tip: generate the transparent-PNG items on a plain mid-grey background if your tool
can't do alpha, and I'll cut them out — but native transparent PNG is best so the
objects can break out of the glass tiles.
