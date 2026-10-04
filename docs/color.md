# Color

Pick one color. Graphite UI builds the whole palette from it: every background, text color, border, button, and status color, in both light and dark, each pair checked to make sure the text on it is readable.

The important idea is this: **you choose what a color is for, not what it is.** You say "this is the page background" or "this is a button", and the system decides the actual value. So when the source color changes, everything updates together and stays readable, and nobody has to go and edit components.

---

## How color works

> **In short:** one color goes in. The system turns it into a set of named colors that each have a job, then wires those into the components you build with.

It happens in five steps. Each one takes the result of the step above and adds a decision.

```
Your color              one color, chosen by the designer
      ↓
Raw shades              8 strips × 10 shades (no meaning attached)
      ↓
Named colors            32 jobs per theme (meaning, readability-checked)
      ↓
States                  hover / pressed / selected / disabled / focus
      ↓
Wired into components   58 --graphite-* variables the components read (plus 59 --cds-* for Carbon)
```

### 1. The source color

One hex value. The engine reads three properties from it in OKLab space (hue, chroma, and lightness, or `tone`) and uses them to construct everything downstream. The default source shipped with the kit is `#5e44aa`.

The calculations run in **OKLab**, a way of describing color built to match how eyes actually work. Its useful property: equal steps in the numbers look like equal steps to a person. Going from tone 30 to 40 looks like the same size jump as going from 80 to 90. Older color models, the ones behind HSL and hex codes, do not behave that way. That is why hand-picked palettes so often bunch up in the middle and flatten out at the ends.

### 2. Primitives: the ramps

Lightness sweeps from dark to light while chroma is scaled, producing four parallel ramps. Three hold the source hue constant; Secondary turns it 120°, so the counterpoint color is generated rather than picked:

| Ramp | Intensity | What it is for |
|---|---|---|
| **Accent** | Same as your color | Brand color, interactive elements, focus |
| **Secondary** | Just over half your color | Counterpoint accent: the vivid tenth of the 60/30/10 rhythm |
| **Neutral variant** | Barely tinted | Secondary surfaces, borders, supporting text |
| **Neutral** | Almost gray | Page backgrounds, primary surfaces, primary text |

Four further ramps carry status. They are built with the same machinery but are **not derived from the source hue**. See [Status and feedback](#status-and-feedback).

The neutrals are not gray. They carry a trace of the source hue, which is what makes a generated theme read as one family rather than "brand color applied to a gray UI."

Each ramp exposes **ten stops** at tones `10, 20, 30, 40, 50, 60, 70, 80, 90, 98`, labeled in the UI as weights `900` (darkest) through `050` (lightest). Two behaviors are worth knowing:

- **The ramp is continuous.** The ten stops are what you see in the primitives grid, but the underlying function resolves any tone from 0 to 100. Semantic roles and interaction states routinely land between named stops.
- **The source color is pinned.** Your exact hex appears in the Accent ramp at its true tone, replacing the nearest stop rather than being added alongside it. The ramp stays ten stops wide regardless of what you feed it, and your brand color survives generation unchanged.

Chroma is also clamped per tone to whatever the sRGB gamut actually allows. Near the light and dark ends the ramp desaturates instead of clipping, which is why the ramp can reach genuine near-black and near-white, and why on-colors pinned to those extremes are always achievable.

**Primitives carry no meaning.** `accent 40` is a color. It is not "the button color." Do not reference primitives directly in a design.

### 3. Semantic tokens

This is the layer you design with. Each theme maps the thirty-two roles onto specific ramp tones. The mapping differs per theme; the role names do not.

The `on` prefix is the system's core convention: **`onX` is the content color guaranteed to be legible on `X`.** `onSurface` is what you put on `surface`. That pairing is not a suggestion. It is verified by contrast check at generation time.

### 4. Component bindings

Semantic tokens are stamped onto 58 `--graphite-*` custom properties, which the governed components read, and 59 `--cds-*` properties, a compatibility layer for the remaining Carbon pieces (`--cds-text-primary`, `--cds-button-primary`, and so on). This is the layer that makes a token change repaint real components.

Designers do not usually touch this layer, but it explains an important constraint: several component variables share one semantic token. `--cds-text-primary` and `--cds-icon-primary` both resolve to `onBackground`, so **text and icons are the same color by construction.** If you need an icon that differs from body text, that is a system change, not a design choice you can make in a file.

### Export

The system exports in two formats:

- **CSS**: custom properties prefixed `--cts-`, in kebab-case (`--cts-on-surface-variant`), scoped to `:root, [data-theme="light"]` and `[data-theme="dark"]`. Each token ships with two companion variables recording its provenance: `--cts-primary-ramp: accent` and `--cts-primary-tone: 40`.
- **JSON**: `source`, `primitives` (all four ramps with every stop), and `semantic` (both themes, with tokens, contrast results, and states).

The provenance variables are worth knowing about. Every token is auditable back to a ramp and a tone, so "why is this color this color" always has an answer.

---

## Color roles

> **In short:** every color in the interface has a job: page background, body text, button fill, error message. You pick the job; the system picks the value.

Thirty-two roles, generated per theme. Values below are from the default source `#5e44aa`. They illustrate the structure; they are not fixed system colors. Change the source and every hex changes; the roles and their relationships do not.

### Surfaces and backgrounds

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `background` | The page itself | `neutral 98` · `#f8f8fc` | `neutral 18.2` · `#121215` |
| `surface` | Default container: cards, panels, sheets | `neutral 98` · `#f8f8fc` | `neutral 18.2` · `#121215` |
| `surfaceVariant` | Secondary surface: fields, hover fills, selected rows, tag backgrounds | `neutralVariant 90` · `#dedcea` | `neutralVariant 30` · `#2e2c37` |
| `surfaceElevated` | Raised container. No governed component binds it now: Modal's panel is `background` and overlays fill `elevation-01` | `neutral 100` · `#ffffff` | `neutral 24.2` · `#201f23` |

Note that `background` and `surface` resolve to the **same value** in both themes. This is deliberate: Graphite UI separates layers with borders and surface *variants*, not with shading. See [Color hierarchy](#color-hierarchy).

The dark background is pinned to the tone of `#121212` rather than derived from the ramp's low end. It is a fixed reference point so dark mode lands at a conventional near-black regardless of source hue.

### Content: text and icons

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `onBackground` | Primary text and primary icons | `neutral 10` · `#030305` | `neutral 90` · `#dedde2` |
| `onSurface` | Content on a default surface | `neutral 10` · `#030305` | `neutral 90` · `#dedde2` |
| `onSurfaceVariant` | Secondary text, secondary icons, supporting copy | `neutralVariant 30` · `#2e2c37` | `neutralVariant 80` · `#bdbcc9` |

Text hierarchy is two levels, not three: primary (`onBackground` / `onSurface`) and secondary (`onSurfaceVariant`). There is no separate "tertiary" or "helper" content role. Use type size and weight for finer hierarchy.

Icons follow text. Primary icons take `onBackground`; secondary icons take `onSurfaceVariant`; interactive icons take `primary`.

### Borders

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `outline` | The border role; its subtle and strong strengths are the outline ladder below | `neutralVariant 50` · `#63626d` | `neutralVariant 60` · `#807e8b` |

`outline` is the border role. Beside it the engine generates the kit's outline ladder, two strengths that belong to the role rather than being roles of their own:

| Variable | Purpose | Light | Dark |
|---|---|---|---|
| `--graphite-outline-subtle` | Decorative rules and container edges, low contrast by intent (~1.2:1), never the only cue | `neutralVariant 90` · `#dedcea` | `neutralVariant 30` · `#2e2c37` |
| `--graphite-outline-strong` | Load-bearing edges: a field's bottom rule, focusable container outlines | `neutralVariant 40` · `#474651` | `neutralVariant 70` · `#9e9daa` |

Interactive borders (a focused field, a selected card) bind to `primary` instead.

`outline` is contrast-checked against `surface` at 3:1, the WCAG threshold for non-text UI, so borders are guaranteed perceivable rather than decorative. `outline-strong` sits a tone beyond it in both themes, so it clears the same bar.

### Elevation

The kit's elevation ladder, generated beside the roles the same way. Components bind it for layers and their interaction fills: a menu or popover sits on 01, a hovered row takes 02, a pressed one 03.

| Variable | Purpose | Light | Dark |
|---|---|---|---|
| `--graphite-elevation-00` | Ground: the page itself, equal to `background` | `neutral 98` | `neutral 18` |
| `--graphite-elevation-01` | Resting layer. In light it equals the ground, because the ramp has no tone between 98 and 90; separation is the shadow's job there (`--graphite-shadow-overlay`) | `neutral 98` | `neutral 30` |
| `--graphite-elevation-02` | Hover step | `neutral 90` | `neutral 40` |
| `--graphite-elevation-03` | Pressed step, never a resting surface | `neutral 80` | `neutral 50` |

The thirty-two roles stay thirty-two: the kit files both ladders beside its roles in Graphite Semantic, and so does the engine (`LADDERS` in `lib/color.js`).

### Primary actions

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `primary` | Primary buttons, links, interactive borders and icons | `accent 40` · `#4c2f93` | `accent 80` · `#beb1ff` |
| `onPrimary` | Content on a primary fill: label text, icons | `accent 98` · `#f8f7ff` | `accent 20` · `#1a0044` |
| `primaryContainer` | Low-emphasis accent fill: selected rows, tags, highlighted regions | `accent 90` · `#ddd9ff` | `accent 30` · `#340b74` |
| `onPrimaryContainer` | Content on `primaryContainer` | `accent 10` · `#040015` | `accent 90` · `#ddd9ff` |

The pairing rule is strict: `onPrimary` goes on `primary`; `onPrimaryContainer` goes on `primaryContainer`. Mixing them across containers breaks the contrast guarantee.

`primary` inverts direction between themes, dark accent on light and light accent on dark, which is why hard-coding a brand hex breaks in one theme or the other.

### Secondary actions

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `secondary` | Secondary buttons and accents | `secondary 40` · `#005542` | `secondary 80` · `#7dd1b6` |
| `onSecondary` | Content on a secondary fill | `secondary 98` · `#e7fff6` | `secondary 20` · `#001c14` |
| `secondaryContainer` | Low-emphasis secondary fill | `secondary 90` · `#9ef2d6` | `secondary 30` · `#00372a` |
| `onSecondaryContainer` | Content on `secondaryContainer` | `secondary 10` · `#000503` | `secondary 90` · `#9ef2d6` |

Secondary is derived from the source too, at hue −120° and chroma × 0.585, so it reads as a partner to `primary` rather than a second brand. Same four-role shape, same pairing rule.

### Status and feedback

Four statuses, each with the same four-role shape as the primary family: a base, its on-color, a container, and the container's on-color.

| Role | Purpose | Light | Dark |
|---|---|---|---|
| `danger` | Errors, destructive actions, invalid input | `danger 40` · `#880c06` | `danger 80` · `#ffa192` |
| `warning` | Warnings, risky but permitted actions | `warning 40` · `#733300` | `warning 80` · `#ffa570` |
| `success` | Confirmation, completion, valid input | `success 40` · `#00572f` | `success 80` · `#5adb91` |
| `info` | Neutral information, tips, in-progress states | `info 40` · `#00478a` | `info 80` · `#8fc1ff` |

Each also has `on<Status>`, `<status>Container`, and `on<Status>Container`, at the same tones the primary family uses, so a status fill and an accent fill behave identically, and only the hue says which is which.

**Hue is fixed; chroma is not.** Status has to stay recognizable, since red must read as error whatever the source color is, so each status hue is pinned to an anchor rather than derived from the input. Chroma still tracks the source, clamped to 0.10–0.20, so statuses carry the same intensity as the rest of the system. A near-gray source still yields a legible red rather than a gray one; a neon source doesn't produce a garish one.

**The collision case.** Because the hues are fixed, a source color sitting on a status hue collapses the distinction: a red brand resolves `primary` and `danger` to nearly the same value. Nothing in the system can prevent this, which is the strongest argument for the rule below: never let color alone carry the meaning.

Containers work exactly like `primaryContainer`: a low-emphasis fill for banners, table rows, and tags, with its on-color for the text inside.

### Roles the system does not currently define

These are real gaps, not omissions from this page. Documenting them honestly is more useful than implying coverage that does not exist.

| Need | Current state | What to do today |
|---|---|---|
| **Links** | No distinct link role. Links bind to `primary`, with hover bound to the primary hover state. | Rely on underline plus `primary` for link affordance. Do not introduce a separate link color. |
| **Elevation scale** | ~~No shadow or elevation scale.~~ Resolved (#241, #242): the elevation ladder `elevation-00`–`03`, one overlay shadow (`--graphite-shadow-overlay`), and a generated scrim (`--graphite-scrim`, on the site only: the exporter does not emit it). | Menus and popovers fill `elevation-01` with the shadow and no edge; Tooltip is inverse (`onBackground`); the Modal panel is `background` over the scrim. Hover and pressed fills climb the ladder. |

---

## Color hierarchy

> **In short:** what makes one thing look like it sits on top of another. Here that comes mostly from borders and tinted areas; only overlays carry a shadow, and hover and pressed fills climb the elevation ladder.

Because `background` and `surface` resolve to the same value, Graphite UI does not build depth by stacking progressively lighter or darker planes. Hierarchy comes from three other mechanisms:

**1. Containment, via `outline`.** A card is a card because it has a border, not because it is a different shade than the page. This is the primary means of separating a container from its ground.

**2. Emphasis, via `surfaceVariant`.** When a region needs to read as *distinct* rather than merely *contained* (an input field, a hovered row, a table header), it takes `surfaceVariant`. That is one visible step away from the page in both themes.

**3. Attention, via the accent ramp.** Interactive and selected elements pull from Accent: `primary` for full-emphasis actions, `primaryContainer` for low-emphasis accent regions like selected rows and tags.

Read as a stack, from ground to foreground:

| Level | Token | Reads as |
|---|---|---|
| Page ground | `background` | The canvas |
| Container | `surface` + `outline` border | A defined region |
| Distinct region | `surfaceVariant` | A field, a hovered or grouped area |
| Selected / tagged | `primaryContainer` | Accented but not actionable |
| Primary action | `primary` | The thing to click |
| Primary content | `onBackground` / `onSurface` | What to read first |
| Secondary content | `onSurfaceVariant` | Supporting detail |

Two practical rules follow:

- **Do not nest more than two surface levels.** With one surface value and one variant, a third level has nothing to resolve to. Deeper structures need borders or spacing, not more fills.
- **`primaryContainer` is not a surface.** It signals accent state. A card that uses it reads as selected, not as elevated.

---

## Themes

> **In short:** light and dark are built at the same time from the same color. The names stay the same in both; only the values change.

Graphite UI generates **light and dark simultaneously** from the same source color. They are not two separate palettes that a designer maintains in parallel. They are two mappings of the same ramps.

The role name is the constant. `onSurface` means "primary content on a default surface" in both themes; only the tone it resolves to changes:

| Role | Light | Dark | Direction |
|---|---|---|---|
| `background` / `surface` | tone 98 | tone 18.2 | light ground → dark ground |
| `onBackground` / `onSurface` | tone 10 | tone 90 | dark text → light text |
| `primary` | accent 40 | accent 80 | dark accent → light accent |
| `onPrimary` | accent 98 | accent 20 | light label → dark label |
| `outline` | tone 50 | tone 60 | mid → slightly lighter mid |

The pattern: **light and dark are near-mirror images across the ramp**, with content and ground swapping ends and accent inverting with them. Hierarchy is preserved because the *relationships* are preserved: secondary content stays one perceptual step from primary content in both themes, even though the absolute values are opposite.

This is the concrete reason to use semantic tokens rather than values. A hex is correct in exactly one theme. `primary` is correct in both, on every source color the user picks, without a designer re-checking anything.

### Contrast levels

Themes generate at one of two contrast targets:

| Level | Text pairings | Non-text UI |
|---|---|---|
| **AA** (default) | 4.5:1 | 3:1 |
| **AAA** | 7:1 | 3:1 |

The level applies to the whole theme, not per-token. Switching to AAA regenerates every text pairing against the higher bar.

---

## Interaction states

> **In short:** how colors change when you hover over something, click it, tab to it, or when it is switched off.

A hovered button does not get a different color. It gets the same color, a few steps along its own ramp. That keeps it recognizably the same button and keeps the label readable.

States are **tone shifts along the same ramp as the base token**, not opacity overlays or separate color values. This keeps a hovered button the same color family as a resting one, and keeps its contrast intact.

Direction depends on theme: states go **darker in light mode, lighter in dark mode**, always away from the background, so emphasis increases rather than washes out.

| State | Derivation | Light (`#5e44aa`) | Dark (`#5e44aa`) |
|---|---|---|---|
| **Default** | `primary` | `accent 40` · `#4c2f93` | `accent 80` · `#beb1ff` |
| **Hover** | base ∓ 6 tone | `accent 34` · `#3d1b80` | `accent 86` · `#d0c9ff` |
| **Pressed** | base ∓ 12 tone | `accent 28` · `#2f016d` | `accent 92` · `#e4e0ff` |
| **Selected** | base ∓ 6 tone | `accent 34` · `#3d1b80` | `accent 86` · `#d0c9ff` |
| **Disabled** | Neutral ramp | fill `neutral 90` · `#dedde2`<br>content `neutral 40` · `#47474b` | fill `neutral 30` · `#2e2d31`<br>content `neutral 60` · `#808084` |
| **Focus** | Accent ring | `accent 50` · `#664db4` | `accent 70` · `#a08af7` |

Notes on each:

- **Hover and selected share a tone.** They are visually identical by design; selection is distinguished by persistence and by supporting affordances (a check, a bold label, a left border), not by color alone.
- **Pressed is twice the hover shift**, a clearly larger step, so the press reads as a distinct event rather than a stronger hover.
- **Disabled leaves the accent ramp entirely.** Both the fill and its content drop to Neutral. This is the one state where the element deliberately loses its brand color: disabled elements should not compete for attention. The disabled pairing is intentionally low-contrast and is **not** contrast-checked. It is exempt under WCAG, and it must never be the only signal that a control is unavailable.
- **Focus is a separate ring token, not a fill change.** It does not replace the base color; it draws a ring around the element in its own accent tone, so a focused button is still recognizably a button in its current state. Focus stacks with hover, pressed, and selected.

**Danger, warning, and success are roles, not states.** A field that fails validation takes `danger` for its border and message; it does not get an "error hover." The two compose: a destructive button still hovers and presses along its own ramp.

---

## Accessibility

> **In short:** text has to stand out enough from whatever is behind it to be readable. The system checks this before it hands you a palette, rather than leaving you to test afterwards.

The measure is a **contrast ratio**, written like 4.5:1. The bigger the number, the easier the text is to read.

Accessibility is enforced at generation time, not checked afterward. Every `on` role is verified against the surface it names before the theme is emitted.

### What the system guarantees

Fourteen pairings are checked on every generation, in both themes:

| Pairing | Target |
|---|---|
| `onPrimary` on `primary` | 4.5:1 (AA) / 7:1 (AAA) |
| `onPrimaryContainer` on `primaryContainer` | 4.5:1 / 7:1 |
| `onSurface` on `surface` | 4.5:1 / 7:1 |
| `onSurfaceVariant` on `surfaceVariant` | 4.5:1 / 7:1 |
| `onBackground` on `background` | 4.5:1 / 7:1 |
| `outline` on `surface` | 3:1 (non-text UI) |
| `onDanger` on `danger`, `onDangerContainer` on `dangerContainer` | 4.5:1 / 7:1 |
| `onWarning` on `warning`, `onWarningContainer` on `warningContainer` | 4.5:1 / 7:1 |
| `onSuccess` on `success`, `onSuccessContainer` on `successContainer` | 4.5:1 / 7:1 |
| `onInfo` on `info`, `onInfoContainer` on `infoContainer` | 4.5:1 / 7:1 |

If a pairing were to miss its target, the auto-fix walks the same ramp to the nearest tone that clears it, preserving hue while correcting lightness. In practice the mapping is conservative enough that the fix rarely has anything to do, because the default tone assignments clear their targets by wide margins.

The generated theme reports every ratio. Check the Contrast panel when you pick a source color; it is faster than measuring swatches by hand.

### What the system does not guarantee

The guarantee covers **defined pairings only.** Everything outside that list is your responsibility:

- **`onSurfaceVariant` on `surface`** is not a checked pairing. Secondary text on a default surface is common and usually fine, but verify it, especially at AA with a light source color.
- **Any cross-pairing you invent** is unchecked and likely to fail: `onPrimaryContainer` on `surface`, `primary` as body text, `outline` as text.
- **Text over images, gradients, or generated patterns.** No token can guarantee contrast against variable content. Use a solid surface behind the text.
- **Disabled states** are exempt by design.

### Focus indicators

Every interactive element needs a visible focus indicator. Use the focus ring token, which is generated per theme specifically to remain visible against both grounds. Never remove focus outlines, and never rely on the hover treatment to also serve as the focus state; keyboard users never trigger hover.

### Do not rely on color alone

This applies with unusual force here, for two system-specific reasons:

1. **The source color is user-chosen.** You cannot assume the accent is blue, or warm, or dark. Any meaning you attach to a specific hue will be wrong for some source colors.
2. **Status hue can collide with the source.** Status hues are fixed, so a source color sitting on one of them resolves `primary` and that status to nearly the same value. A red brand makes `primary` and `danger` near-identical. Hue alone cannot carry the distinction.

Always pair color with a second signal: an icon, a label, a change of weight, a position, or a border.

### Light and dark parity

Both themes are generated from the same ramps with the same targets, so a design that passes in one passes in the other. But **check both before shipping**. Anything you build outside the token system (custom illustrations, screenshots, images with baked-in backgrounds, hard-coded hexes) will not follow the theme, and dark mode is where that shows up first.

---

## Usage

### Do

- **Do assign roles, not values.** Reach for `primary`, `onSurfaceVariant`, `outline`, never the hex they currently resolve to.
- **Do respect `on` pairings.** `onSurface` belongs on `surface`. `onPrimary` belongs on `primary`. The contrast guarantee only holds for the pairing as defined.
- **Do use `outline` and `surfaceVariant` for containment,** and the elevation ladder for layer, hover and pressed fills. Only overlays carry a shadow (`--graphite-shadow-overlay`).
- **Do check the generated contrast panel** when you change the source color, especially at AAA or with very light or very dark sources.
- **Do pair color with a second signal** for any state or status meaning.
- **Do design in both themes** before handing off.
- **Do use the tone/ramp provenance** (`--cts-primary-tone`, `--cts-primary-ramp`) when you need to explain or audit a color decision.

### Don't

- **Don't apply raw hex values to components.** A hex is a snapshot of one source color in one theme. It will be wrong the moment either changes.
- **Don't reference primitives directly.** `accent 40` is a color without meaning. If you find yourself wanting a specific ramp stop, the role you need is either missing from the system or you are reaching for the wrong one. Raise it rather than hard-coding around it.
- **Don't invent status colors from the accent or neutral ramps.** Use `danger`, `warning`, `success`, and `info`. A red-ish accent does not make an error color, and a green borrowed from a component library will not track the source. It reads as a foreign color pasted onto a generated theme.
- **Don't use `primaryContainer` as a general surface.** It signals accent or selection. Used as a card background it makes everything look selected.
- **Don't nest three or more surface levels.** There is no third value to resolve to.
- **Don't rely on color alone** for state, status, or selection.
- **Don't build hover or selected states by changing opacity.** States are tone shifts on the ramp; opacity overlays break against the variable ground.
- **Don't treat a disabled element's low contrast as a bug**, but don't let it be the only cue that a control is unavailable either.

---

## Tokens

> **In short:** how to find the right named color for what you are building.

### Naming

Tokens use camelCase in JSON and JS (`onSurfaceVariant`), kebab-case in CSS with the `--cts-` prefix (`--cts-on-surface-variant`). Every token also emits its provenance: `--cts-on-surface-variant-ramp` and `--cts-on-surface-variant-tone`.

### Choosing a token

Work down this order. Stop at the first match.

1. **What is the element?** A ground, a container, content, a border, or an action.
2. **Ground or container?** → `background` for the page, `surface` for a container, `surfaceVariant` for a field or a distinct region.
3. **Content?** → `onX`, matching whatever it sits on. Primary content takes `onBackground` / `onSurface`; supporting content takes `onSurfaceVariant`.
4. **Border?** → `outline`. If the border indicates interaction or focus, `primary` or the focus ring instead.
5. **Action?** → `primary` + `onPrimary` for full emphasis; `secondary` for the second tier (the kit's secondary Button fills with `secondary` and keeps the `onPrimary` label); `primaryContainer` + `onPrimaryContainer` for low-emphasis accent regions.
6. **Interactive state?** → the state token for that role, never a manually adjusted value.
7. **No match?** The role is missing from the system. Flag it rather than working around it.

### Complete token reference

**Semantic roles**, 32 per theme:

`primary` · `onPrimary` · `primaryContainer` · `onPrimaryContainer` · `secondary` · `onSecondary` · `secondaryContainer` · `onSecondaryContainer` · `surface` · `surfaceElevated` · `onSurface` · `surfaceVariant` · `onSurfaceVariant` · `outline` · `background` · `onBackground`

Status, each with the same four-role shape:

`danger` · `onDanger` · `dangerContainer` · `onDangerContainer` · `warning` · `onWarning` · `warningContainer` · `onWarningContainer` · `success` · `onSuccess` · `successContainer` · `onSuccessContainer` · `info` · `onInfo` · `infoContainer` · `onInfoContainer`

**Interaction states**, 6 each for `primary`, `secondary` and `danger`:

`base` · `hover` · `pressed` · `selected` · `disabled` (+ disabled content) · `focus`. The page-level focus ring is primary's.

**Primitives**, 8 ramps × 10 stops, exported for reference and tooling. Available to inspect and copy; not for direct use in designs.

### Using tokens in Figma

The engine's output is CSS and JSON. There is no published Figma library shipping with it today, so the Figma side is a workflow you set up rather than a fact of the system. The recommended approach:

- Create Figma variables that **mirror the semantic role names exactly** (`primary`, `onSurfaceVariant`, `outline`), so a design file and a code file name the same thing the same way.
- Use a **variable mode per theme** (Light / Dark) so a single design switches themes the way the product does.
- Import primitives as a **separate, locked collection**. Keep them visible for reference and hidden from the picker, so designers select roles rather than stops.
- Regenerate rather than edit. If the source color changes, re-import from the JSON export instead of hand-adjusting values, or the file will drift from the product.

---

## Glossary

Every term this page uses, in plain English. Ordered the way you meet them.

| Term | What it means |
|---|---|
| **Source color** | The one color you choose. Everything else is calculated from it. |
| **Hue** | Which color it is: red, green, blue. Changing hue turns a red into an orange. |
| **Chroma** | How intense the color is. High chroma is vivid; zero chroma is gray. |
| **Tone** | How light or dark, from 0 (black) to 100 (white). Tone 40 is dark; tone 90 is pale. |
| **Ramp** | One hue laid out from dark to light: the same color at ten tones, like a paint strip. |
| **OKLab** | The color model the math runs in. Equal steps in numbers look like equal steps to the eye. |
| **Primitive** | A raw color on a ramp, with no job attached. Useful to look at, never to build with. |
| **Token / role** | A named color with a job, such as "page background" or "button fill". You build with these. |
| **On-color** | The text or icon color that goes on top of another. `onSurface` goes on `surface`, and is guaranteed readable there. |
| **Container** | A quieter version of a color, for filling an area rather than drawing attention. |
| **Theme** | Light or dark. Same role names in both; different values behind them. |
| **Contrast ratio** | How different two colors are in lightness, written like 4.5:1. Higher is easier to read. |
| **AA / AAA** | Two accessibility bars from the WCAG standard. AA is the common legal minimum; AAA is stricter. |

---

## Recommendations

Points where the system's current shape limits what can be documented or designed. Listed for the system owner, not as guidance for designers using it today.

**1. ~~No secondary action role.~~ Resolved.** The engine now generates a `secondary` family (`secondary`, `onSecondary`, `secondaryContainer`, `onSecondaryContainer`, plus hover, pressed, selected, disabled and focus states), and Button's secondary variant fills with it. The old convention of assembling one from `outline` and `primary` is retired. There is still no tertiary tier.

**2. ~~No overlay or scrim token.~~ Partly resolved.** `surfaceElevated` is the raised surface for what floats, and the scrim is generated from the darkest neutral so it tracks the source. The elevation scale is resolved too: the engine generates the kit's ladder (`elevation-00`–`03`) and overlays carry `--graphite-shadow-overlay` (#241, #242).

**3. Text hierarchy is two levels.** Primary and secondary only. Dense interfaces typically want a third, quieter tier for timestamps, counts, and metadata, such as an `onSurfaceDim` or equivalent.

**4. ~~`outline` covers subtle and strong borders with one value.~~ Resolved (#241).** `outline-subtle` and `outline-strong` are the outline ladder, so a divider inside a card and the border defining that card can read differently.

**5. The auto-fix mechanism has never been observed to fire.** A sweep of 292 source colors × both themes × both contrast levels (16,352 checks, status roles included) produced no failing pairing, so it has never had anything to correct. It is correct, just inert. The interface no longer offers it as a toggle; it reports the verified result instead. Worth revisiting only if a future role lands closer to its target.
