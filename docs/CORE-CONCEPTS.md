# Core Concepts

The ideas and architecture behind this project, for anyone extending it beyond the landing page.

## Stack

- **Next.js 16 (App Router)**: file-based routing under `app/`, React Server Components by default, client interactivity opted into per file with `'use client'`.
- **React 19**, **TypeScript** throughout, **Sass (SCSS)** with CSS Modules for component and page styles.
- **The color engine** (`lib/color.js`, typed by `lib/color.d.ts`): one source hex becomes perceptual ramps in OKLab, semantic roles for light and dark, interaction states, and measured contrast pairings.
- **Governed components** (`components/ui/`): 22 components and the shared Overlay hook, each implementing a versioned contract in `docs/contracts/`.
- **Carbon Design System** (`@carbon/react`, `@carbon/icons-react`): still present, but no longer the component layer. It supplies the Sass reset and IBM Plex font faces, the grid on the home page, a few pieces of site chrome, and the chrome's icons. The Create preview draws the kit's own icons instead: Regular, Bold and Solid, exported from the Figma kit into `lib/kit-icons.ts` and rendered by `components/kit-icon.tsx`. Removing it is a tracked migration; see [SHADCN-MIGRATION.md](SHADCN-MIGRATION.md). The Introduction page (`/docs`) counts the files that still import `@carbon/react`.

There is no database, API layer or auth. Every route is prerendered at build time.

## App Router structure

```
app/
  layout.tsx             root HTML shell, metadata, ThemeProvider, SiteHeader
  page.tsx               the home page
  docs/                  Getting started and Foundations pages
    components/[slug]/   every component page, from one template
  gallery/               the Components index
  create/                the theme builder
  search-index.json/     the search index, a static route
  globals.scss           Carbon import, the static --graphite-* foundations, site styles
components/
  ui/                    the governed components
  component-doc/         the component page template and one config per component
  search/                the search dialog and its ranking
  sections/              home page sections and the site footer
  theme-provider.tsx     source color, theme and contrast level; stamps the variables
lib/                     the color engine, contract and kit readers, the kit's icon paths
```

Server components do read data, at build time: the docs pages read the contracts (`lib/contract-doc.ts`, `lib/contracts.ts`), the Figma snapshots (`lib/kit-page.ts`, `lib/kit-stats.ts`) and the stylesheets, so counts and tables on the site are derived from the repo rather than typed. Anything with state, refs or browser APIs is a client component.

## Carbon Design System integration

### Why Carbon, and what is left of it

The site started on Carbon, IBM's design system: its grid, type scale, color tokens and React components came pre-built and pre-themed. Graphite has since replaced the component layer with its own governed components, and the Figma kit (not Carbon) is the canonical design. What remains is below, and each remaining use is on the migration list in [SHADCN-MIGRATION.md](SHADCN-MIGRATION.md).

### The Sass entry point

[`app/globals.scss`](../app/globals.scss) is the single stylesheet imported by `app/layout.tsx`. Its first line:

```scss
@use '@carbon/react' with ($use-akamai-cdn: true);
```

pulls in Carbon's entire style layer in one shot — reset, IBM Plex font-face declarations (served from IBM's Akamai CDN rather than self-hosted), the grid system, the type scale, every component's CSS, and theme custom-property definitions. Everything below that line is this project's own styling, layered on top.

### Theming (light/dark)

Two layers make a theme, and only one of them is Carbon's.

1. **The engine's variables** (the canonical surface). `components/theme-provider.tsx` holds the source color, the theme (`white` for light, `g100` for dark, the default) and the contrast level. On every change it runs the engine and writes the result onto `<html>` as inline custom properties: 52 `--graphite-*` (32 roles, the primary, secondary and danger state families, the focus ring and the scrim) and 59 `--cds-*`, a hand-listed table that maps the engine's roles onto the Carbon names the remaining Carbon pieces read. Governed components read only `--graphite-*`.

2. **Carbon's theme zones.** `globals.scss` still emits Carbon's `white` and `g100` zones, and the provider still toggles the `cds--white` / `cds--g100` class on `<html>` and wraps children in Carbon's `<GlobalTheme>`, for the Carbon components that are left. For one frame during a rewrite it also sets `is-retheming`, because Carbon's 70ms background transition would otherwise strand buttons mid-change.

`app/layout.tsx` sets `className="cds--g100"` on `<html>` for the first paint, and `suppressHydrationWarning` because client state owns the class after hydration. The static foundations (spacing, radius, breakpoints, type, motion, density) do not vary by theme and are declared once in `globals.scss`.

### Layout and the grid

"The grid" means three different things on this site, and only one of them is Carbon's.

1. **Carbon's `Grid` / `Column`, on the home page only.** The seven sections in `components/sections/` still wrap their content in Carbon's 16-column grid, and nothing else on the site does. Most use it only as a centered container with Carbon's gutters, spanning every column:

   ```tsx
   <Grid>
     <Column sm={4} md={8} lg={16}>...</Column>
   </Grid>
   ```

   Two use real columns. The hero's headline block is 10 of 16, centered (`lg={{ span: 10, offset: 3 }}`), and Capabilities splits its list and stage 6 + 10 from `lg`. Replacing these is part of de-Carboning (see [SHADCN-MIGRATION.md](SHADCN-MIGRATION.md)). That work is blocked on `token-drift` no longer reading Carbon's grid config for the breakpoint check.

2. **Page stylesheets everywhere else.** `DocsShell` (sidebar, content, On this page rail), the Create page's controls-and-preview split, and the components index's auto-fill card grid are CSS grids in their own module stylesheets. Their widths come from those stylesheets, not from a column count. `/docs/foundations/layout` reads the values back from the stylesheets, so it cannot drift from them.

3. **The 48px grid backdrop.** The ruled cells behind the hero, the Capabilities band and the Create page are decoration (`background-size: 3rem 3rem`). Nothing snaps to them.

All three share the kit's breakpoints: `sm` 320, `md` 672, `lg` 1056, `xl` 1312. Carbon uses the same widths but calls the 1312 stop `xlg`. `token-drift` warns on any `@media` width that isn't one of these stops.

## Scroll-reveal animation system

A small, dependency-free "fade up on scroll" system built from two pieces:

- **`useReveal()`** ([`components/use-reveal.ts`](../components/use-reveal.ts)) — attaches an `IntersectionObserver` to a ref; once 15% of the element is visible, it flips `visible` to `true` and disconnects (one-shot, not re-triggered on scroll-away). If the user has `prefers-reduced-motion: reduce` set, it skips the observer entirely and reveals immediately.
- **`<Reveal>`** ([`components/reveal.tsx`](../components/reveal.tsx)) — a wrapper component that applies a `reveal` class (and `is-visible` once triggered) plus an optional `transition-delay` for staggering. The actual animation (`opacity` + `translateY`) lives in `globals.scss` under `.reveal` / `.reveal.is-visible`.

`delay` is supported but nothing passes one today, so every reveal on the site fires flat.

## Hero motion (parallax/spotlight)

The hero's motion effects are hand-rolled, not a library:
- Pointer position is written to CSS custom properties (`--mx`, `--my`, `--px`, `--py`) on every `pointermove`, throttled via `requestAnimationFrame` to avoid layout thrash.
- Scroll position is written to `--sy` the same way, via a passive `scroll` listener.
- `globals.scss` reads these variables to position a radial-gradient spotlight and offset parallax layers — the React side never touches actual DOM styles beyond setting custom properties, keeping the animation GPU/compositor-friendly.
- Both effects are skipped under `prefers-reduced-motion: reduce`.

## Build/dev tooling notes

- **Package manager**: pinned to **pnpm** (`pnpm-lock.yaml`). `npm install` ignores the lockfile and can drift dependency versions. CI pins Node 24 and pnpm 10.
- **Webpack, not Turbopack**: Turbopack fails on this project's Sass, so both scripts pass `--webpack` (`next dev --webpack`, `next build --webpack`). This is not a Windows-only issue and it is not dev-only: leave the flag on both.
- **pnpm build scripts**: pnpm blocks postinstall scripts by default. This repo's are IBM's `ibmtelemetry` (anonymous usage analytics, opt out with `IBM_TELEMETRY_DISABLED=true`) and native builds for `sharp` / `@parcel/watcher`. Run `pnpm approve-builds --all` once after a fresh clone.
- **Governance checks**: `pnpm drift-check`, `pnpm token-drift`, `pnpm component-doc-drift` and their self-tests run in CI as the `governance` job, which `main` requires. See `/docs/governance`.

## Deployment

The project deploys to **Vercel** (same team that maintains Next.js, zero-config for the App Router). Production builds are static: every route is prerendered, including the component pages (`generateStaticParams`) and the search index (`force-static`). The data they read is read at build time. See the main repo README/PR history for the live URL and Vercel project link.
