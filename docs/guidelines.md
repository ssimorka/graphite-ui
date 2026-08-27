# Graphite Design System Guidelines

Machine-readable design system rules for AI-assisted code generation and design handoff.

## General Principles

- Graphite is a structured, enterprise-grade design system built around clarity, consistency, and accessibility.
- All designs must use tokens (variables), styles, and components from this library — never hardcode colors, spacing, or typography.
- The system supports Light and Dark modes via the "Graphite Theme" variable collection — always design with both in mind.
- Components follow a consistent variant structure: Style → Type → Size → State.

---

## Typography

**Font families:**
- Primary: `IBM Plex Sans` (all UI text)
- Monospace: `IBM Plex Mono` (code snippets only)

**Type scale (use text styles, not raw values):**

| Style | Weight | Size | Line Height |
|---|---|---|---|
| Display/1 | Bold | 96px | 120px |
| Heading/1 | Bold | 64px | 80px |
| Heading/2 | Bold | 56px | 72px |
| Heading/3 | Bold | 48px | 64px |
| Heading/4 | Bold | 40px | 48px |
| Heading/5 | Bold | 32px | 40px |
| Heading/6 | Bold | 24px | 32px |
| Title/1 | Regular | 32px | 40px |
| Title/2 | Regular | 24px | 32px |
| Title/3 | SemiBold | 18px | 28px |
| Title/4 | SemiBold | 16px | 24px |
| Title/5 | SemiBold | 14px | 20px |
| Body/1 | Regular | 18px | 28px |
| Body/2 | Regular | 16px | 24px |
| Body/3 | Regular | 14px | 20px |
| Caption/1 | Regular | 12px | 16px |
| Caption/2 | Medium | 12px | 16px |
| Footnote/1 | Regular | 14px | 20px |

Component-specific styles: Button (Medium weight, 3 sizes), Input Text, Input Label, Helper Text, Tooltip, Table Header.

**Rules:**
- Headings use Bold weight exclusively.
- Titles use Regular (1–2) or SemiBold (3–5) — never Bold.
- Body text is always Regular weight.
- Typography variables support Desktop and Mobile modes — use variables for responsive type sizing.
- Never set font size manually; always apply a text style or bind to a typography variable.

---

## Color System

### Architecture

Colors follow a three-tier token architecture:
1. **Primitives** (`Graphite Primitives`) — raw color ramps, never used directly in designs.
2. **Semantic** (`Graphite Semantic`) — role-based tokens with Light/Dark modes.
3. **Theme** (`Graphite Theme`) — component-level tokens with Light/Dark modes.

### Primitive Palette

- **Accent** (purple): `accent/050` → `accent/900` — primary interactive elements.
- **Secondary** (teal/green): `secondary/050` → `secondary/900` — secondary actions and accents.
- **Neutral** (gray): `neutral/050` → `neutral/900` — text, borders, and backgrounds.

### Semantic Roles

| Token | Purpose |
|---|---|
| `background` | Page-level background |
| `surface` | Card and container backgrounds |
| `surfaceVariant` | Alternate surface (e.g., sidebar) |
| `primary` | Primary interactive color (accent-derived) |
| `onPrimary` | Text/icons on primary color |
| `secondary` | Secondary interactive color (teal-derived) |
| `error` / `warning` / `success` / `info` | Status colors |
| `outline` | Borders and dividers |
| `onBackground` | Primary text on background |
| `onSurface` | Primary text on surface |
| `onSurfaceVariant` | Secondary/muted text |

### Rules

- Always use semantic or theme tokens — never reference primitives directly in components.
- All color tokens support Light and Dark modes — never hardcode hex values.
- Use `on*` tokens for text/icons placed on their corresponding surface.
- The "Graphite Layer" collection provides contextual tokens for nested layering.

---

## Spacing

Rem-based 14-step scale bound to the `Spacing` variable collection:

| Token | Value | Common Use |
|---|---|---|
| `spacing-00` | 0px | No spacing |
| `spacing-01` | 2px | Hairline gaps |
| `spacing-02` | 4px | Tight internal padding |
| `spacing-03` | 8px | Default internal padding, icon gaps |
| `spacing-04` | 12px | Component internal spacing |
| `spacing-05` | 16px | Standard padding, card gutters |
| `spacing-06` | 24px | Section internal padding |
| `spacing-07` | 32px | Between related sections |
| `spacing-08` | 40px | Major section breaks |
| `spacing-09` | 48px | Page section separation |
| `spacing-10` | 64px | Large section margins |
| `spacing-11` | 80px | Hero/feature spacing |
| `spacing-12` | 96px | Major page divisions |
| `spacing-13` | 160px | Maximum section separation |

**Rules:**
- Always use spacing variables — never set numeric padding/margin manually.
- Use the `Spacing block` component to visualize spacing in specs.

---

## Border Radius

Bound to the `Radius` variable collection:

| Token | Value | Use |
|---|---|---|
| `None` | 0px | Sharp-cornered elements |
| `2` | 2px | Subtle rounding (tags, badges) |
| `4` | 4px | Default component radius (inputs, cards) |
| `6` | 6px | Medium rounding |
| `8` | 8px | Buttons, modals |
| `16` | 16px | Large containers, tiles |
| `20` | 20px | Expressive elements |
| `full` | 9999px | Pill shapes, circular avatars |

---

## Breakpoints

| Mode | Viewport |
|---|---|
| SM | 320px |
| MD | 672px |
| LG–XL | 1056–1312px |
| Max–Max plus | 1584–1784px |

The `Breakpoint LG–XL` collection provides granular control (LG: 1056px, XL: 1312px).

---

## Components

### Naming Convention

- Public components: **Title Case** — `Button`, `Text Input - Default`, `Modal`.
- Internal/private: prefixed with underscore — `_Toggle switch - Small`.
- Never use underscore-prefixed components directly — they are internal building blocks.

### Variant Properties (consistent across components)

- **Size**: Expressive → 2x large → Extra large → Large → Medium → Small
- **State**: Enabled → Hover → Focus → Active → Disabled → Skeleton → Read-only
- **Style** (buttons): Primary, Secondary, Ghost, Danger primary, Danger ghost
- **Type** (buttons): Text + Icon, Icon only

### Key Components

**Button** — Primary CTA component
- Styles: Primary (filled), Secondary (outlined), Ghost (text-only), Danger primary/ghost
- Types: Text + Icon (default), Icon only (compact)
- Sizes: Expressive → 2x large → Extra large → Large (default) → Medium → Small
- Primary for main action, Secondary for alternatives, Ghost for tertiary
- Danger styles reserved for destructive actions (delete, remove)

**Text Input** — Form input fields
- Styles: Fixed (standard), Inline (compact), Fluid (full-width)
- Validation states: Error, Warning, plus Skeleton loading
- Default size is Large for Fixed style

**Dropdown / Select** — Selection components
- Default and Fluid layouts; standard, combo box, multi-select, filterable
- Use Dropdown for <10 options; Select for native browser behavior

**Data Table** — Complex tabular data
- Size via `Data table size` collection (XL, LG, MD, SM, XS)
- Sub-components: header/body rows, select/expand cells, toolbar, batch actions
- Supports AI-annotated rows via AI presence variables

**Modal** — Overlay dialogs
- Size via `Modal` collection (Large, Medium, Small, Extra small)
- Form modal for inputs, standard Modal for confirmations

**UI Shell** — App-level navigation
- Header: top nav bar with actions and menus
- Left Panel: sidebar navigation
- Right Panel: contextual detail panels

### AI Components

- `AI label` — Marks AI-generated content (inline and block)
- `AI layer` — Background and field treatments for AI content
- `AI explainability popover` — Explains AI decisions
- Visibility via `AI presence` / `AI revert` variable collections

---

## Effects & Elevation

- `Shadows/Menu` for floating menus and popovers.
- Border effects use inner shadow (`$border-subtle-01`, `$border-subtle-02`).
- Never create custom shadows — always use an effect style.

---

## Do's and Don'ts

**Do**
- Use semantic color tokens for all fills and strokes.
- Apply text styles from the Graphite type scale.
- Use spacing variables for all padding and gaps.
- Test designs in both Light and Dark modes.
- Use the Skeleton state for loading placeholders.
- Follow the Size/State/Style variant naming pattern.

**Don't**
- Hardcode hex color values.
- Use primitives (accent/500, neutral/200) directly in designs.
- Create custom font sizes outside the type scale.
- Use underscore-prefixed components in your designs.
- Mix component sizes within the same form or section.
- Skip the Disabled state when designing interactive flows.
