# Building the four shadcn-shaped pages

Goal, narrowed 2026-08-23: build four page types modelled on ui.shadcn.com,
using the Graphite design system (`docs/tokens/figma-snapshot.json` in Figma,
`--graphite-*` in code; the kit's written spec is the "00 Read Me" page,
node `11678:251`).

> **Amended 2026-08-28 — source of truth reversed.** This file was written when
> code was canonical and the kit's component pages were to be regenerated from
> it. That is no longer the direction. Governance rule 7 now states that where
> the kit and a contract disagree, **the kit wins**, and the contract is
> corrected to match.
>
> What survives: the four page targets, the shared foundation, and the build
> order. Those describe the *site's* information architecture, which shadcn
> still models well.
>
> What does not: any implication that components should move toward shadcn's
> shape. **The site's components should look like the kit's.** Button went
> first — square corners, Carbon's asymmetric `0 64px 0 16px` inset, a filled
> secondary, `primary` as the ghost label — and its contract was corrected to
> follow, not the other way round.
>
> The two hold together as long as the distinction does: shadcn-shaped
> *pages*, kit-shaped *components*.

| Target | Reference | Route | Status |
|---|---|---|---|
| Home | `ui.shadcn.com` | `/` | Exists, Carbon-styled. Restyle. |
| Docs | `/docs/installation` | `/docs/installation` | New. Needs the docs shell. |
| Component pages | `/docs/components/base/accordion` | `/docs/components/[slug]` | New. 28 components already exist. |
| UI Generator | `/create` | `/create` | New. Engine + studio already exist. |

## What `/create` actually is

Not an AI generator. A **preset configurator**: a live preview beside a row of
dropdowns, each with a lock toggle — Style, Base Color, Theme, Chart Color,
Heading font, Body font, Icon Library, Radius, Menu, Menu Accent — plus a
Shuffle that randomises everything unlocked, a preset id (`--preset b0`), and
a Get Code button.

Graphite's version should be stronger than the original. shadcn picks from a
fixed set of base colors; Graphite derives a whole theme from any source
color. The parts exist already: `theme-provider.tsx` (sourceHex, theme, level,
autoFix), `color-picker.tsx`, and `studio.tsx` (ramp rows, semantic table,
states matrix, copy-to-clipboard, toast). The Radius control maps directly onto
the kit's radius tokens (None / 2 / 4 / 6 / 8 / 16 / 20 / full).

## Shared foundation — build once, all four use it

1. **App shell.** Top nav (Home / Docs / Components / Create), search, theme
   toggle. Replaces Carbon's `Header` + `SideNav` in `components/site-header.tsx`.
2. **Docs shell.** Left sidebar plus right table of contents. Serves the docs
   page and every component page, so it is the single biggest piece.
3. **Source extraction.** Preview/code tabs need each example's real source
   text. A build step reads component and demo files and emits it. The same
   step later feeds a registry, so build it once for both. Precedent exists:
   `app/gallery/page.tsx` already reads contract frontmatter at build time.

## Build order

1. App shell, and de-Carbon the chrome it replaces.
2. Docs shell, then `/docs/installation`.
3. `/docs/components/[slug]`. The API reference section comes from
   `docs/contracts/*.md`, which are already versioned and governed — an
   advantage over shadcn, whose prop tables are hand-maintained. Note the
   contracts now follow the kit rather than lead it, so a page generated from
   them describes the kit at one remove.
4. Home restyle.
5. `/create`.

## Notes and open items

- The existing `/docs` (color essay, pattern guide, glossary) becomes a docs
  section rather than the whole route. It maps onto shadcn's Theming page.
- `/gallery` is superseded by `/docs/components`.
- **New components cost more than they look.** Governance is contract ->
  implementation -> drift-check -> Figma wave, so each new component is three
  pieces of work, not one. None of Accordion, Sidebar, Command, Scroll area,
  Skeleton, Collapsible or Sheet has a contract today. Keep the bill to one:
  Sidebar lives outside `components/ui/` as site chrome rather than a system
  component; mobile nav reuses Modal instead of Sheet; overflow stays native
  instead of Scroll area; Accordion covers Collapsible; there is no async
  content to Skeleton. That leaves **Accordion** as the only new contract, and
  it is needed anyway because `faq.tsx` is on Carbon's today. Command palette
  is deferred with search.
- **Font is settled by rule 7.** The kit's 65 typography variables specify IBM
  Plex, so IBM Plex it is. This previously read as an open question between the
  kit and shadcn's Inter/Geist; with the kit canonical there is no question to
  answer.
- Removing Carbon collapses `--cds-*` (56 vars, 124 references in
  `globals.scss`) into the single `--graphite-*` namespace, deleting the
  hand-listed binding table CLAUDE.md flags as driftable. Simplification, not
  just a reskin.
- **De-Carbon must not be done before fixing `token-drift`.**
  `scripts/token-drift.mjs:402` reads
  `node_modules/.pnpm/@carbon+grid@11.56.0/.../_config.scss` at a hardcoded
  path, and *warns rather than fails* when it misses. Dropping `@carbon/react`
  would therefore silence a governance check while CI stays green. Inline the
  grid values into the snapshot, and make a miss fail, before removing Carbon.
- The keep/drop call on the ~40 Carbon component sets in the kit is already
  tracked on the Figma side. This plan defers to it rather than restating it.
- **Scope note.** Nothing in *this plan* writes to the Figma file. That is not
  a statement about the project: Figma waves F1-F5 are a separate, active
  workstream that writes to the kit. The two run in parallel, and while the
  Figma chain is blocked on a manual library publish, the site work here is
  the unblocked half.
- `/docs/components` supersedes `/gallery`, which is currently the surface that
  shows each contract's version next to its implementation. Carry that display
  across; it is a governance affordance, not decoration.
