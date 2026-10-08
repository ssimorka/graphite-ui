# Site Functions

What every route on the Graphite UI site renders, and the shared pieces each one
depends on. This file is written by hand and nothing checks it, so it goes stale
when routes change. If you add or remove a page, change this too.

## Shell

[`app/layout.tsx`](../app/layout.tsx) wraps every page in `SiteTheme` (the
provider as the site configures it, [`components/site-theme.tsx`](../components/site-theme.tsx)) and
renders the fixed `SiteHeader` above `children`. It also sets the default
`<title>` and metadata.

**`ThemeProvider`** ([`components/theme-provider.tsx`](../components/theme-provider.tsx))
holds the source color, the theme (`light` / `dark`) and the contrast level. On
every change it runs the engine in [`lib/color.js`](../lib/color.js) and stamps
the result onto `<html>` as `--graphite-*` variables (the primary namespace). It
imports nothing from Carbon: the `--cds-*` compatibility layer for the Carbon
pieces that remain comes from [`components/carbon-compat.tsx`](../components/carbon-compat.tsx),
plugged in by [`components/site-theme.tsx`](../components/site-theme.tsx).
CLAUDE.md keeps the current counts.

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
| `/create/generative-art` | The rules behind Create's generative art: the tile library, the 60 / 30 / 10 color rhythm and the spans | `app/create/generative-art/`, `app/docs/theming/live.tsx` |
| `/gallery` | Components index: every kit component A to Z | `components/sections/components-index.tsx` |
| `/docs` | Introduction | `app/docs/page.tsx` |
| `/docs/contribute/run-locally` | Running the project and the governance checks; `/docs/installation` redirects here (`next.config.mjs`) | `app/docs/contribute/run-locally/` |
| `/docs/quick-start` | Source color, a governed component, the variables, theme switching, taking the tokens out, keeping the theme file in your own project, and the Tailwind bridge | `app/docs/quick-start/` |
| `/docs/theming` | How color works, the roles, hierarchy, themes, states, accessibility and usage | `app/docs/theming/` (`page.tsx`, `live.tsx`) |
| `/docs/accessibility` | Contrast at AA and AAA and how it is measured, plus focus, motion and keyboard per component | `app/docs/accessibility/` |
| `/docs/contribute/governance` | The eight governance rules, the three drift checks, and the required CI job; `/docs/governance` redirects here | `app/docs/contribute/governance/` |
| `/docs/contribute/carbon` | Which files still import Carbon, the `--cds-*` compatibility layer, and the migration plan | `app/docs/contribute/carbon/` |
| `/docs/contribute/drift` | The token snapshot, Dev Mode names, where the engine differs from the kit, and what the checks cannot see | `app/docs/contribute/drift/` |
| `/docs/contribute/status` | Every count the site quotes, each with what it counts, read from the repo at build time | `app/docs/contribute/status/` |
| `/docs/glossary` | Plain definitions of the terms the docs use | `app/docs/glossary/` |
| `/docs/foundations/color` | Color ramps, sampling, and the known divergence from the kit | `app/docs/foundations/color/`, `lib/ramp-divergence.ts` |
| `/docs/foundations/typography`, `spacing`, `radius`, `layout`, `tokens` | The other foundations, read from their contracts and the token snapshot | `app/docs/foundations/*` |
| `/docs/components/[slug]` | One page per governed component, 37 in all (36 components and Overlay); the docs nav lists them under Overview | `components/component-doc/` |
| `/search-index.json` | The static search index, built at build time | `lib/search-index.ts` |
| `/r/<name>.json` | One shadcn registry item, built from the repo on request | `app/r/[name]/`, `lib/registry.ts` |
| `/r/theme/<hex>.json` | The theme file for one source color as a registry item (`?level=AAA` raises the target) | `app/r/theme/[hex]/`, `lib/registry.ts` |

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
   action in the bottom-left corner (Open the Figma Kit ↗, Browse the components →), and
   the whole door is the link.
6. **FAQ** (`faq.tsx`): six questions in the governed `Accordion`.
7. **Footer**.

Motion for all of it is catalogued in [ANIMATIONS.md](ANIMATIONS.md).

## Create, `/create`

A sticky 392px controls panel beside a full-width preview from 1312px. Below
that, a compact bar stuck to the bottom of the viewport opens each control in a
bottom sheet. Panel, bar and sheets wear the drop panel's layer; the bar and
sheets rise from the bottom, the panel drops in.

- **Controls**: they follow the preview tab.
  - On **Components**: source color (hex, Pick, and eight ramp swatches that
    copy their hex rather than set the source), theme, contrast target,
    radius, density, icons, typeface (headings, body, code), the derived roles
    (read-only), and Surprise me, Reset and Get the code. Surprise me randomises
    every one of those settings, on every screen size; there are no locks.
  - On **Generative Art**: source color, Intensity (a 0 to 100 slider), Mix
    and Grid, then Regenerate in Surprise me's place, Reset and Export PNG in Get
    the code's. Intensity and Mix are disabled, with a note, when the art has
    no color: Intensity on a gray, black or white pick, Mix at intensity 0 too.
  - Reset puts everything back on either tab, the source included.
  - The bar's footer is Reset, Surprise me (Regenerate on the art tab) and the
    filled main action; below 672px Reset and Surprise me are icons that share the
    width. On the bar, each control opens a bottom sheet; a disabled control
    wears the kit's disabled field colors and its sheet says why. The Source
    color sheet lists the ramp stops to copy and ends in a filled Pick color
    action, which opens the header's color picker.
- **Preview**: two tabs, Components and Generative Art, in the governed
  `Tabs`. Both panels stay mounted; the art panel tells the controls which tab
  is showing from its tab panel's `hidden` attribute.
- **Components**: a Desktop / Tablet / Mobile toolbar (from 1056px only) over a
  rack of example cards with no frame of their own, on the page grid, which is
  fixed to the viewport. Cards carry a drop shadow and are dealt into one to
  three columns balanced by measured height. Radius, density and fonts are
  scoped to the preview. **Icons** picks one of the kit's three icon families,
  Regular, Bold or Solid, in the straight cut, and every icon in the examples
  follows it (`KitIcon` in [`components/kit-icon.tsx`](../components/kit-icon.tsx),
  paths in [`lib/kit-icons.ts`](../lib/kit-icons.ts), exported from the kit).
  The site's own chrome keeps its Carbon icons.
- **Generative Art**: the generative composition (`GenerativeArt` in
  [`components/generative-art.tsx`](../components/generative-art.tsx)) at
  16:9, and 3:4 below 672px. Its hue only ever comes from the source; the
  palette is the art's own (`artPalette`), not the UI roles', and is the same
  in both themes. Intensity sets the color's strength (past the pick's own)
  and how deep it sits, Mix the share of gray, Grid the tile size: columns and
  rows come from the canvas's measured size, so the grid reflows with its
  container. Moving a control recolors or reflows the current deal;
  Regenerate deals a new one; selecting a panel reshuffles just that panel.
  Export PNG saves it 1600 wide at the canvas's proportions. Its twenty tile
  types are the kit's Pattern Tiles (Graphite UI Kit 11692:22); the kit names
  one of them Download circle where the code says Circle.
- **Get the code**: three tabs, copied or downloaded. CSS is the whole theme
  as one file (`buildThemeFile` in `lib/theme-file.ts`: foundations, both
  themes and the builder's choices, under `--graphite-*`); Tailwind is the
  bridge that names those variables as Tailwind v4 tokens (`buildTailwindBridge`
  in `lib/tailwind-bridge.ts`); JSON is the engine's audit format (`buildJson`
  in `lib/color.js`).

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
