# Core Concepts

The ideas and architecture behind this project, for anyone extending it beyond the landing page.

## Stack

- **Next.js 16 (App Router)** — file-based routing under `app/`, React Server Components by default, client interactivity opted into per-file with `'use client'`.
- **React 19**
- **Carbon Design System** (`@carbon/react`, `@carbon/icons-react`) — IBM's open-source component library and design language, providing the `Header`, `Grid`/`Column`, `Tile`, `Button`, `Accordion`, `ContentSwitcher`, etc. used throughout.
- **Sass (SCSS)** — Carbon ships its styles as Sass source, so the project compiles `.scss` rather than consuming pre-built CSS, which lets it override Carbon's design tokens directly.
- **TypeScript** throughout.

There is no database, API layer, or auth — this is a static marketing site.

## App Router structure

```
app/
  layout.tsx     — root HTML shell, metadata, ThemeProvider + SiteHeader
  page.tsx       — the single route ("/"), composes all sections
  globals.scss   — Carbon import + every custom style in the project
components/
  site-header.tsx, theme-provider.tsx, reveal.tsx, use-reveal.ts
  sections/      — one file per landing-page section
```

Everything under `components/` that touches state, refs, or browser APIs (`useState`, `IntersectionObserver`, pointer events) is marked `'use client'`. There are currently no server components doing data fetching — every section is client-rendered because they all use hooks or Carbon components that require the DOM.

## Carbon Design System integration

### Why Carbon

Carbon is IBM's design system: a shared visual language (spacing scale, type scale, color tokens, grid) plus a React component library implementing it. Using it means layout and components (buttons, tiles, accordions, the 16-column grid) come pre-built and pre-themed, and the project's job is mostly composition + copy + light restyling, not building primitives from scratch.

### The Sass entry point

[`app/globals.scss`](../app/globals.scss) is the single stylesheet imported by `app/layout.tsx`. Its first line:

```scss
@use '@carbon/react' with ($use-akamai-cdn: true);
```

pulls in Carbon's entire style layer in one shot — reset, IBM Plex font-face declarations (served from IBM's Akamai CDN rather than self-hosted), the grid system, the type scale, every component's CSS, and theme custom-property definitions. Everything below that line is this project's own styling, layered on top.

### Theming (light/dark)

Carbon ships several built-in "theme zones" (`white`, `g10`, `g90`, `g100` — white through near-black). This project only uses two: `white` (light) and `g100` (dark, the default). Two things make runtime theme switching work together:

1. **CSS side** (`globals.scss`):
   ```scss
   :root, :root.cds--white { @include theme.theme(themes.$white); }
   :root.cds--g100          { @include theme.theme(themes.$g100); }
   ```
   Each theme is emitted as a block of CSS custom properties (`--cds-background`, `--cds-text-primary`, etc.) scoped to a class on `<html>`. Component styles and this project's own CSS consume those variables, so nothing needs to be re-styled per theme — swapping the class swaps every color.

2. **React side** (`components/theme-provider.tsx`): a small context holds the current theme name and a `toggleTheme` function. On change, it adds/removes the `cds--white`/`cds--g100` class on `document.documentElement` (so the CSS above takes effect) and wraps children in Carbon's own `<GlobalTheme>` component (so Carbon's React components, e.g. tooltips, are aware of the active theme for anything they don't drive purely from CSS variables).

`app/layout.tsx` hardcodes `className="cds--g100"` on `<html>` for the first paint (avoiding a flash of unthemed content), and `suppressHydrationWarning` because the class is then owned by client-side state after hydration.

### Grid system

Carbon's grid (`Grid`, `Column`) is a 16-column responsive grid with named breakpoints (`sm`, `md`, `lg`, etc.). Sections use it like:

```tsx
<Grid>
  <Column sm={4} md={8} lg={{ span: 10, offset: 3 }}>...</Column>
</Grid>
```

meaning: full-width on small screens, 8 of 8 columns on medium, and 10-of-16 centered (offset 3) on large screens. This is how every section controls its max content width and centering without custom media queries.

## Scroll-reveal animation system

A small, dependency-free "fade up on scroll" system built from two pieces:

- **`useReveal()`** ([`components/use-reveal.ts`](../components/use-reveal.ts)) — attaches an `IntersectionObserver` to a ref; once 15% of the element is visible, it flips `visible` to `true` and disconnects (one-shot, not re-triggered on scroll-away). If the user has `prefers-reduced-motion: reduce` set, it skips the observer entirely and reveals immediately.
- **`<Reveal>`** ([`components/reveal.tsx`](../components/reveal.tsx)) — a wrapper component that applies a `reveal` class (and `is-visible` once triggered) plus an optional `transition-delay` for staggering. The actual animation (`opacity` + `translateY`) lives in `globals.scss` under `.reveal` / `.reveal.is-visible`.

Sections stagger multiple children by passing an increasing `delay` (e.g. `delay={i * 80}`), so grids of cards fade in sequentially rather than all at once.

## Hero motion (parallax/spotlight)

The hero's motion effects are hand-rolled, not a library:
- Pointer position is written to CSS custom properties (`--mx`, `--my`, `--px`, `--py`) on every `pointermove`, throttled via `requestAnimationFrame` to avoid layout thrash.
- Scroll position is written to `--sy` the same way, via a passive `scroll` listener.
- `globals.scss` reads these variables to position a radial-gradient spotlight and offset parallax layers — the React side never touches actual DOM styles beyond setting custom properties, keeping the animation GPU/compositor-friendly.
- Both effects are skipped under `prefers-reduced-motion: reduce`.

## Build/dev tooling notes

- **Package manager**: the project is pinned to **pnpm** (`pnpm-lock.yaml`, `pnpm-workspace.yaml`). Using `npm install` will still work but ignores the lockfile and can drift dependency versions — prefer `pnpm install`.
- **Windows + Turbopack caveat**: Next.js 16's default dev server (Turbopack) fails to compile `globals.scss` on Windows with `Can't find stylesheet to import`, due to a path-resolution bug in the `resolve-url-loader` compatibility shim it uses for Sass. The workaround used in this project is running the classic webpack dev server instead:
  ```bash
  npx next dev --webpack
  ```
  This does **not** affect production builds — Vercel's Linux build environment compiles the same Turbopack pipeline without issue, so `next build` / deployed builds are unaffected.
- **pnpm build scripts**: pnpm blocks postinstall scripts by default for supply-chain safety. This repo's only postinstall scripts are IBM's `ibmtelemetry` (anonymous usage analytics, opt-out via `IBM_TELEMETRY_DISABLED=true`) and native binary builds for `sharp`/`@parcel/watcher`. Run `pnpm approve-builds --all` once after a fresh clone.

## Deployment

The project deploys to **Vercel** (same team that maintains Next.js, zero-config for the App Router). Production builds are static — `next build` output shows every route as `○ (Static)` / prerendered, since there's no server-side data fetching. See the main repo README/PR history for the live URL and Vercel project link.
