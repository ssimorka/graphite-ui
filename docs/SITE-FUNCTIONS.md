# Site Functions

What every route on the Graphite UI site renders, and the shared pieces each one
depends on. This file is written by hand and nothing checks it, so it goes stale
when routes change. If you add or remove a page, change this too.

## Shell

[`app/layout.tsx`](../app/layout.tsx) wraps every page in `ThemeProvider` and
renders the fixed `SiteHeader` above `children`. It also sets the default
`<title>` and metadata.

**`ThemeProvider`** ([`components/theme-provider.tsx`](../components/theme-provider.tsx))
holds the source color, the theme (`white` / `g100`) and the contrast level. On
every change it runs the engine in [`lib/color.js`](../lib/color.js) and stamps
the result onto `<html>` as `--graphite-*` variables (the primary namespace) and
a `--cds-*` compatibility layer for the Carbon pieces that remain. CLAUDE.md
keeps the current counts.

**`SiteHeader`** ([`components/site-header.tsx`](../components/site-header.tsx)),
64px tall and fixed:
- **Brand**, linking to `/`. Below 672px only the wordmark shows.
- **Nav**: Docs (`/docs`), Components (`/gallery`), Create (`/create`). Inline
  from 1056px. Below that a Menu button opens a tray, sliding in from the left
  under the bar, holding the same links as a vertical `NavigationMenu`, plus the
  docs sidebar groups on docs pages. The tray wears the drop panel's layer (see
  Shared pieces) and closes on Escape, an outside press, a link, or the window
  widening past 1056px.
- **Search**: a "Search docs" field from 1056px and an icon button below it. Both
  open the search palette, as do ⌘K / Ctrl K and `/`. From 672px the palette is
  a drop panel hung from whichever trigger is on screen; below that it is full
  screen.
- **GitHub** link, hidden below 480px.
- **Theme toggle** and the **source color chip**. The chip opens
  `ColorPickerPopover` ([`components/color-picker.tsx`](../components/color-picker.tsx)),
  a drop panel: an HSV picker, a hex field, the AA / AAA target, a live "Contrast
  verified" line, and a footer of Reset (back to the seeded source and AA) and
  Surprise me.
- **The choice persists.** Source, theme and level are kept in `localStorage`
  and an inline `<head>` script re-applies the last colors before first paint
  ([`lib/theme-storage.ts`](../lib/theme-storage.ts)), because most site links
  are plain anchors and every click is a full load.

**`DocsShell`** ([`components/docs-shell.tsx`](../components/docs-shell.tsx))
frames every docs page: a 256px sidebar from 1056px, and a 240px On this page
rail from 1312px on pages that pass a TOC. Below 1056px both rails drop and the
docs links move into the header menu. The sidebar groups live in
[`components/docs-nav.ts`](../components/docs-nav.ts), which also builds every
page's breadcrumb (`docsCrumbs`): Docs, then the sidebar group linking to its
first page, then the page.

Behind the top of each page sits a **header wash**: the accent mesh, faded out
by 30rem, running from the sidebar's edge to the window's right edge. Its
strength is capped by the contrast target and mode (`WASH_OPACITY`, from a
288-source sweep recorded in CLAUDE.md). A page with its own ground opts out
with `wash={false}`, as the Components index does. At the top of a page, above
the first section, the first On this page entry is active.

Docs pages end their "What is here" sections in **next cards**
(`NextCard` in [`components/doc-blocks.tsx`](../components/doc-blocks.tsx)),
which follow the card pattern under Shared pieces with an arrow-only corner
action.

**`SiteFooter`** ([`components/sections/site-footer.tsx`](../components/sections/site-footer.tsx))
closes every page: the brand and tagline, four link columns (Docs, Components,
Foundations, Resources), a stats line, and the Built by credit.

## Routes

| Route | What it is | Built from |
|---|---|---|
| `/` | The landing page | `app/page.tsx`, `components/sections/` |
| `/create` | The theme builder | `components/create/` |
| `/gallery` | Components index: every kit component A to Z | `components/sections/components-index.tsx` |
| `/docs` | Introduction | `app/docs/page.tsx` |
| `/docs/installation` | Running the project and the governance checks | `app/docs/installation/` |
| `/docs/quick-start` | Source color, a governed component, the variables, theme switching, and taking the tokens out | `app/docs/quick-start/` |
| `/docs/theming` | How color works, the roles, states and pattern reference | `components/sections/color-docs.tsx`, `pattern-guide.tsx` |
| `/docs/accessibility` | Contrast at AA and AAA and how it is measured, plus focus, motion and keyboard per component | `app/docs/accessibility/` |
| `/docs/governance` | The eight governance rules, the three drift checks, and the required CI job | `app/docs/governance/` |
| `/docs/foundations/color` | Color ramps, sampling, and the known divergence from the kit | `app/docs/foundations/color/`, `lib/ramp-divergence.ts` |
| `/docs/foundations/typography`, `spacing`, `radius`, `layout`, `tokens` | The other foundations, read from their contracts and the token snapshot | `app/docs/foundations/*` |
| `/docs/components/[slug]` | One page per governed component, 36 in all (35 components and Overlay); the docs nav lists them under Overview | `components/component-doc/` |
| `/search-index.json` | The static search index, built at build time | `lib/search-index.ts` |

## Home, `/`

Seven sections in the kit's order, one file each in `components/sections/`:

1. **Hero** (`hero.tsx`): eyebrow with the governed count, the h1, Get started
   (`/docs`) and Browse components (`/gallery`), and the source strip: the four
   source-derived ramps, live, where selecting a stop copies its hex. The strip
   wears the drop panel's layer, and its footer carries the hint and a filled
   Create a theme action (`/create`), stacked below 672px. The
   spotlight tracks the pointer, and the layers parallax on pointer and scroll
   through `--sy`; the scroll listener never attaches under reduced motion.
2. **Component wall** (`component-wall.tsx`): eight live governed components,
   each badged with its contract version, on a neutralVariant mesh gradient.
   Each card follows the card pattern: the component's name is the corner
   action and links to its docs page, while the specimens stay live above the
   card-wide overlay. Below 260px card width the foot stacks.
3. **Capabilities** (`capabilities.tsx`, inside `PageBands` for the grid lines):
   six capabilities, each with a stage panel that renders the engine's real
   output. From 1056px it is a sticky scroll track, where reading position picks
   the panel and fills its rail. There is no timer. Below 1056px all six stack.
4. **Theme** (`theme-cta.tsx`): Open the theme builder (`/create`) and Read how
   theming works (`/docs/theming`), on an accent mesh gradient.
5. **Two doors** (`two-doors.tsx`): For designers opens the Figma kit; For
   developers goes to `/gallery`. Each door follows the card pattern with its
   action in the bottom-left corner (Open the Figma Kit ↗, See the code →), and
   the whole door is the link.
6. **FAQ** (`faq.tsx`): five questions in the governed `Accordion`.
7. **Footer**.

Motion for all of it is catalogued in [ANIMATIONS.md](ANIMATIONS.md).

## Create, `/create`

A sticky 392px controls panel beside a full-width preview from 1312px. Below
that, a compact bar stuck to the bottom of the viewport opens each control in a
bottom sheet. Panel, bar and sheets wear the drop panel's layer; the bar and
sheets rise from the bottom, the panel drops in.

- **Controls**: source color (hex, Pick, and eight ramp swatches that copy
  their hex rather than set the source), theme, contrast target, radius,
  density, icons, typeface (headings, body, code), the derived roles
  (read-only), and
  Shuffle, Reset and Get the code. Source, theme, contrast and radius can be
  locked against Shuffle. The bar's footer is Reset, Shuffle and the filled
  Get the code; below 672px Reset and Shuffle are icons that share the width.
  On the bar, each control opens a bottom sheet. The Source color sheet lists
  the ramp stops to copy and ends in a filled Pick color action, which opens
  the header's color picker.
- **Preview**: two tabs, Components and Patterns, in the governed `Tabs`.
- **Components**: a Desktop / Tablet / Mobile toolbar (from 1056px only) over a
  rack of example cards with no frame of their own, on the page grid, which is
  fixed to the viewport. Cards carry a drop shadow and are dealt into one to
  three columns balanced by measured height. Radius, density and fonts are
  scoped to the preview. **Icons** picks one of the kit's three icon families,
  Regular, Bold or Solid, in the straight cut, and every icon in the examples
  follows it (`KitIcon` in [`components/kit-icon.tsx`](../components/kit-icon.tsx),
  paths in [`lib/kit-icons.ts`](../lib/kit-icons.ts), exported from the kit).
  The site's own chrome keeps its Carbon icons.
- **Patterns**: the generative composition (`GenerativeArt` in
  [`components/generative-art.tsx`](../components/generative-art.tsx)) at 16:9,
  repainted from the source and theme. Selecting a panel reshuffles it;
  Regenerate deals a new layout and Export PNG saves it at 1600 × 900. Its
  twenty tile types are the kit's Pattern Tiles (Graphite UI Kit 11692:22);
  the kit names one of them Download circle where the code says Circle.
- **Get the code**: CSS or JSON, from `buildCss` / `buildJson` in `lib/color.js`,
  copied or downloaded.

## Search

The index is built at build time from page metadata, TOCs, contracts and the
component doc configs, and served from `/search-index.json`. The palette
([`components/search/`](../components/search/)) fetches it on first open and
ranks results client-side, with no model. [SEARCH.md](SEARCH.md) documents its
states.

## Shared pieces

- **`Reveal` / `useReveal`**: fade-in on scroll through `IntersectionObserver`,
  once per element. Under reduced motion it reports visible immediately.
- **`PageBands`**: the full-bleed grid behind Capabilities, with its own pointer
  and scroll drift.
- **`MeshGradient`**: the radial-gradient fields behind the wall, the Theme
  section and the docs header wash, built from the live ramps.
- **The drop panel** ([`components/_drop-panel.scss`](../components/_drop-panel.scss)):
  the kit's AI layer and explainability popover shape, shared by the search
  palette, the color picker, the mobile tray, the Create controls and the home
  source strip. A surface tinted from its foot on `primary`, 8px corners, an
  edge shading to primary, a caret on the trigger where it drops from one, and
  a filled action in the footer's corner. Its motion is in ANIMATIONS.md.
- **The card pattern**: the drop panel's layer on a card, a glow that climbs
  the card on hover, and a filled corner action that is (or sits under) the
  card's one link. Used by the docs next cards, the home component wall, the
  Components index (where ungoverned cards show the action disabled) and the
  two doors. A 288-source sweep puts the weakest text on the tint at 5.08:1.
- **`components/ui/`**: the governed components. Each is held to its contract in
  `docs/contracts/` by `drift-check`.
