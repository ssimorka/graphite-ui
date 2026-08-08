# Site Functions

This document walks through every section and interactive piece of the Helix landing page, in the order it renders on the page, plus the shared components each one depends on.

## Page assembly

[`app/page.tsx`](../app/page.tsx) composes the whole page as a flat list of section components inside a single `<main>`:

```
Hero → TrustedBy → Features → ProductShowcase → Benefits →
Testimonials → Pricing → Faq → FinalCta → SiteFooter
```

[`app/layout.tsx`](../app/layout.tsx) wraps every page in `ThemeProvider` and renders the fixed `SiteHeader` above `children`. It also sets the page `<title>`/`<meta description>` and the browser theme color.

## Header — `components/site-header.tsx`

A Carbon `Header` (IBM's fixed top app bar) with:
- **Brand** — "Helix" wordmark, links to `#`.
- **Nav links** — Features, Product, Pricing, FAQ — each an in-page anchor jump (`#features`, `#product`, etc.) rather than a route change.
- **Theme toggle** — a `HeaderGlobalAction` icon button that calls `toggleTheme()` from `ThemeProvider` to flip between light and dark Carbon themes.
- **CTA cluster** (`.site-header__cta`) — "Sign in" (ghost button → `#pricing`) and "Start free" (primary button → `#cta`), hidden below the `md` breakpoint.

## Hero — `components/sections/hero.tsx`

The above-the-fold section. Function-wise it does three things beyond static markup:

1. **Pointer-driven spotlight/parallax** — `onPointerMove` tracks cursor position within the hero and writes CSS custom properties (`--mx`, `--my`, `--px`, `--py`) via `requestAnimationFrame`, which `globals.scss` uses to move a radial-gradient spotlight and offset background layers.
2. **Scroll-driven parallax** — a `scroll` listener computes how far the hero has scrolled past the viewport top and writes `--sy`, driving a subtler translate effect on scroll. Skipped entirely when `prefers-reduced-motion: reduce` is set.
3. **Content** — eyebrow tag, headline, subtitle, two CTAs (`Start free`, `Watch the demo`), a trust note, and a product screenshot (`/images/dashboard-dark.png`) with two floating stat cards (`99.99% uptime`, `p95 latency`) layered on top via absolute positioning.

## Trusted-by strip — `components/sections/trusted-by.tsx`

A static row of six placeholder logos (Northwind, Vantage, Cobalt, Meridian, Loop, Axion) under the label "Trusted by engineering teams shipping to millions." Wrapped in a single `Reveal` for a fade-in-on-scroll.

## Features — `components/sections/features.tsx`

Renders a 6-item `FEATURES` array (Live metrics, Distributed tracing, Structured logs, AI anomaly detection, Smart alerting, Enterprise security) as Carbon `Tile` cards in a responsive grid. Each card staggers its reveal animation by `(index % 3) * 80ms` so rows fade in left-to-right.

## Product showcase — `components/sections/product-showcase.tsx`

An interactive tabbed image viewer:
- A Carbon `ContentSwitcher` toggles between two `VIEWS` — **Dashboards** and **Traces & Logs**.
- Switching updates `index` state, which swaps the displayed screenshot (`dashboard-dark.png` / `traces-panel.png`) and the caption text beneath it.
- The `key={active.key}` on the image frame forces a remount on switch, so the CSS entry transition replays each time.

## Benefits — `components/sections/benefits.tsx`

Four stat-driven cards (68% faster resolution, 40% lower spend, 3.2x more ships/week, <1s query response), each with an icon, a big number, a title, and supporting copy. Purely presentational, staggered reveal per card.

## Testimonials — `components/sections/testimonials.tsx`

Three customer quotes rendered as Carbon `Tile` cards, each with a 5-star rating row, the quote, and an author (initial-letter avatar, name, role). Data is a static `TESTIMONIALS` array — no external CMS.

## Pricing — `components/sections/pricing.tsx`

Three plans (`Starter` / `Pro` / `Enterprise`) driven by a `PLANS` array. The `Pro` plan sets `featured: true`, which adds a `plan--featured` class and a "Most popular" badge. Each plan lists its included features with checkmark icons and a CTA button that scrolls to `#cta`. No real checkout logic — buttons are anchor links into the final CTA section.

## FAQ — `components/sections/faq.tsx`

Five question/answer pairs rendered as a Carbon `Accordion`. Purely static content covering setup time, OpenTelemetry support, pricing model, security/compliance, and migration.

## Final CTA — `components/sections/final-cta.tsx`

The bottom conversion section: headline, subtitle, and a form with a work-email `TextInput` and a "Start free" submit button. The form's `onSubmit` calls `e.preventDefault()` only — there is **no backend wired up**; this is a UI placeholder for a real signup integration.

## Footer — `components/sections/site-footer.tsx`

Four link columns (Product, Developers, Company, Legal), each populated from a static `COLUMNS` array, plus a brand block with tagline and social icon links (GitHub, X, LinkedIn — all pointing to `#`). The copyright line auto-computes the current year via `new Date().getFullYear()`.

## Shared building blocks

| File | Purpose |
|---|---|
| [`components/theme-provider.tsx`](../components/theme-provider.tsx) | Holds light/dark theme state (`white` / `g100`), exposes `useTheme()`, toggles the `cds--white`/`cds--g100` class on `<html>`, and wraps children in Carbon's `<GlobalTheme>`. |
| [`components/use-reveal.ts`](../components/use-reveal.ts) | Hook using `IntersectionObserver` to flip a `visible` flag once an element scrolls into view (15% threshold). Immediately `true` if the user prefers reduced motion. |
| [`components/reveal.tsx`](../components/reveal.tsx) | Thin wrapper around `useReveal` — renders any element (`div`/`li`/`section`) with a `reveal`/`is-visible` class pair and an optional stagger `delay` (ms), which `globals.scss` animates as an opacity + translateY fade-in. |

## What's real vs. placeholder

- **Real**: theme switching, scroll-reveal animations, hero parallax, product showcase tab switching, responsive Carbon grid layout.
- **Placeholder / not wired up**: the email capture form (no submit handler), all footer/social links (`href="#"`), sign-in flow, and pricing checkout — this is a marketing-site shell, not a connected SaaS backend.
