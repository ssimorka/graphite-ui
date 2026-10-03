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
  docs sidebar groups on docs pages.
- **Search**: a "Search docs" field from 1056px and an icon button below it. Both
  open the search palette, as do ⌘K / Ctrl K and `/`.
- **GitHub** link, hidden below 480px.
- **Theme toggle** and the **source color chip**. The chip opens
  `ColorPickerPopover` ([`components/color-picker.tsx`](../components/color-picker.tsx)):
  an HSV picker, a hex field, the AA / AAA target, a live "Contrast verified" line,
  and Surprise me.

**`DocsShell`** ([`components/docs-shell.tsx`](../components/docs-shell.tsx))
frames every docs page: a 256px sidebar from 1056px, and a 240px On this page
rail from 1312px on pages that pass a TOC. Below 1056px both rails drop and the
docs links move into the header menu. The sidebar groups live in
[`components/docs-nav.ts`](../components/docs-nav.ts).

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
| `/docs/components/[slug]` | One page per governed component, 23 in all | `components/component-doc/` |
| `/search-index.json` | The static search index, built at build time | `lib/search-index.ts` |

## Home, `/`

Seven sections in the kit's order, one file each in `components/sections/`:

1. **Hero** (`hero.tsx`): eyebrow with the governed count, the h1, Get started
   (`/docs`) and Browse components (`/gallery`), and the source strip: the four
   source-derived ramps, live, where selecting a stop copies its hex. The
   spotlight tracks the pointer, and the layers parallax on pointer and scroll
   through `--sy`; the scroll listener never attaches under reduced motion.
2. **Component wall** (`component-wall.tsx`): eight live governed components,
   each badged with its contract version, on a neutralVariant mesh gradient.
3. **Capabilities** (`capabilities.tsx`, inside `PageBands` for the grid lines):
   six capabilities, each with a stage panel that renders the engine's real
   output. From 1056px it is a sticky scroll track, where reading position picks
   the panel and fills its rail. There is no timer. Below 1056px all six stack.
4. **Theme** (`theme-cta.tsx`): Open the theme builder (`/create`) and Read how
   theming works (`/docs/theming`), on an accent mesh gradient.
5. **Two doors** (`two-doors.tsx`): For designers opens the Figma kit; For
   developers goes to `/gallery`.
6. **FAQ** (`faq.tsx`): five questions in the governed `Accordion`.
7. **Footer**.

Motion for all of it is catalogued in [ANIMATIONS.md](ANIMATIONS.md).

## Create, `/create`

A sticky 392px controls panel beside a full-width preview from 1312px. Below
that, a compact bar stuck to the bottom of the viewport opens each control in a
bottom sheet.

- **Controls**: source color (hex, Pick, eight presets), theme, contrast
  target, radius, density, typeface (headings, body, code), the derived roles
  (read-only), and Shuffle, Reset and Get the code. Source, theme, contrast and
  radius can be locked against Shuffle.
- **Preview**: a Desktop / Tablet / Mobile toolbar over a rack of example cards.
  Radius, density and fonts are scoped to the preview.
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
- **`MeshGradient`**: the radial-gradient fields behind the wall and the Theme
  section, built from the live ramps.
- **`components/ui/`**: the governed components. Each is held to its contract in
  `docs/contracts/` by `drift-check`.
