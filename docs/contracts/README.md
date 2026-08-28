# Graphite UI — Contract Governance & Token Reference

These two sections apply to **every** component contract in this directory, not to any single one.

---

## Governance model

The contract file is canonical. Figma and the live site both implement a contract, neither one defines it.

**Rules:**
1. Every component has one contract file (`/contracts/<component>.md`) in the same repo as the site.
2. No component code changes without a matching contract update first, even for one-line fixes.
3. Each contract is versioned (semver). A prohibition change is breaking. A new optional slot is minor. A copy/description edit is a patch.
4. A drift check script reads each contract's declared token dependencies and verifies the component's actual code references those exact variable names, nothing else. Fails the build on mismatch.
5. Figma components carry the contract version number in their description field, so anyone opening the file knows which spec they're looking at.
6. Every component set in the kit is either **governed** — a contract declares it, and rule 5 puts that contract's version in its description — or **ungoverned**, and says so in the same place. Nothing is unlabelled. See "Carbon-only sets in the kit" below.

This is a solo-maintainer model. It doesn't require review gates, just a fixed place where truth lives and a script that checks reality against it.

---

## Carbon-only sets in the kit

The Graphite UI Kit began as IBM's Carbon Figma kit, re-tokenized with Graphite
variables. It carries 45 component pages; 18 are claimed by a contract, and 27
are claimed by nothing. Rule 6 governs those 27, and this is the reasoning
behind it, recorded once so it is not re-argued per component (#124).

### The rule

A set is **governed** if a contract declares it, and **ungoverned** otherwise.
Ungoverned sets stay in the file and say so in their description, where a
governed set carries its contract version. Movement is one-way: an ungoverned
set becomes governed by acquiring a contract, and nothing goes back.

### Why labelling rather than deleting

The harm an ungoverned set does is not that it exists. It is that a designer
opening the file cannot tell it from a governed one. Rule 5 exists so that
"anyone opening the file knows which spec they're looking at" — a Carbon set
has no spec, and saying so out loud is the whole fix.

Deletion is separately a bad idea right now. The library is published, so
removing a set is a breaking change for anything consuming it, and a Carbon
component set is real work that is cheap to keep and expensive to recreate.
Deletion waits for a breaking version of the kit, if it happens at all.

This is also why the rule does not force twenty-seven adoption decisions today.
Labelling is cheap and can be done in one pass; adoption is a contract plus an
implementation plus a Figma wave, and should be paid for only when something
actually needs it.

### Which bucket a set falls in

**Out of scope by construction.** Graphite contracts govern component
primitives. Three classes will never acquire one, so they are ungoverned
permanently rather than pending:

- *Application shells* — UI shell Header / Left panel / Right panel, Tree view,
  Content switcher. These compose an application; they are not primitives.
- *Vendor features* — AI label, AI layer, AI explainability popover. Carbon's AI
  affordances, tied to IBM product decisions Graphite does not make. Dropping
  these also decides the fate of the `AI`, `AI presence` and `AI revert`
  variable collections, which `scripts/figma-extract.js` already excludes from
  the snapshot as "component-level state rather than a foundation token layer".
- *Carbon idioms with no Graphite counterpart* — Structured list, Toggletip,
  Tile, Code snippet, Loading, Progress indicator.

  `Contained list` was on this list and has come off it. The component that
  used to be called `Item` was renamed to it when the code adopted the kit's
  names, so a contract now declares it and it is governed. This is the first
  set to move from ungoverned to governed, which is the one-way movement rule 6
  allows.

**Already spoken for.** Some Carbon sets are not separate components in
Graphite but values on one: Number input and Password input are `type` on
Text input; Dropdown is Select, or Menu for the menu case. These are
ungoverned, and the fold is recorded on the governing contract so the
functionality stays findable.

**In scope, awaiting demand.** Primitives Graphite has no contract for but
plausibly wants — Link, Search, Slider, Pagination, Date picker, Accordion.
Ungoverned until something asks: the repo uses one, a contract references one,
or committed work needs one. Wanting it in the abstract is not demand.

### What the rule decides today

Exactly one adoption. **Accordion** already meets the demand test twice over:
`components/sections/faq.tsx` uses Carbon's today, and it is the only new
contract the docs-site work requires. Everything else on the in-scope list
stays ungoverned until it earns a contract the same way.

---

## Token structure reference (current, confirmed)

- Source: one hex input, resolved in **OKLab**, sampled at fixed tone stops into a perceptual ramp.
- Semantic roles: the engine generates **32 roles**, every one emitted as a `--graphite-*` CSS variable, plus **19 interaction-state variables** and the generated `--graphite-scrim` — 52 in total. Names are kebab-case and match the vocabulary these contracts use, so `on-surface` in a contract is `--graphite-on-surface` in the CSS. The states are six per interactive family (`primary`, `secondary`, `danger`) plus the page-level `--graphite-focus`; families come from `STATE_FAMILIES` in `lib/color.js` rather than a hand-written list, and `buildStates` and `drift-check.mjs` both read that list rather than restating it. `danger` joined in #129, because Button's destructive variant was the one variant with no hover or pressed state — in breach of Button's own composition rule. `warning`, `success` and `info` have state sets in the kit but not in the engine, deliberately: nothing has a variant to spend them on, and rule 6's demand test applies to tokens too.
- Carbon's `--cds-*` variables are still stamped (56 of them) as a **compatibility layer**, so Carbon's own components keep picking up generated values. They are not the canonical surface and cannot express the full set — Graphite's own components read `--graphite-*` only.
- State resolution: discrete **tone-step** moves on the ramp (not opacity). Direction preserves WCAG contrast — darker in light themes, lighter in dark.
- Contrast is enforced at generation time, not audited after.
- Output per theme pass: **52 `--graphite-*` color variables** (canonical) and **56 `--cds-*` variables** (Carbon compatibility), light and dark generated together.
- A further **101 variables** are declared statically in `app/globals.scss`, almost all because they do not vary by theme and so are not part of the generated pass: 14 spacing, 3 density, 8 radius, 5 breakpoint, 3 font family, 62 typography (58 step values plus 4 weights), 5 motion, 1 scrim. Four of those groups now come from the Figma kit rather than from Carbon or from nothing — see `foundations/`. **`scrim` is the exception to the reason.** It does vary by theme — 50% in Light, 70% in Dark — and since #92 it is generated by `scrimFor()` in `lib/color.js` from the darkest neutral, so it tracks the source colour like every other role. Its declaration in `globals.scss` survives only as the pre-hydration fallback, which is why it is still counted here.

**Wave 0 is complete.** Both prerequisites shipped; recorded here because the contracts still refer to them:

- **Spacing is a runtime scale now** (issue #41). `--graphite-space-00…13` and three semantic `--graphite-density-*` steps are declared in `app/globals.scss`. Components bind to the density steps rather than raw steps. The drift check covers them, so rule 4 is no longer color-only. The closing caveat here used to read that the scale was "Carbon's numbers under Graphite names, not a scale generated from anything" — that is no longer true. Since #72 the numbers come from the Figma kit, and `token-drift.mjs` verifies them against it; the values were identical at the swap, so nothing moved.
- **Status roles are complete** (issue #42). `danger`, `warning`, `success`, and `info` each resolve base, `on*`, `*Container`, and `on*Container`, and all four sets now emit under `--graphite-*`. The `on*Container` text tokens have no Carbon equivalent — Carbon ships one per-status text token (`text-error`) and no slot for text on a container fill — so they exist only in the Graphite namespace.

No component contract carries a **[blocked on Wave 0]** marker any more. The two Wave 5 dependencies that used to be listed here as open — the shared overlay surface token and the Modal scrim — both closed in #92: `surfaceElevated` exists in the kit's `Graphite Semantic` collection, and `scrim` is generated by `scrimFor()` in `lib/color.js` rather than declared as a literal. The drift check reports no warnings for either.

## Component API conventions

Contracts say what a component *is*. This says what its React surface looks
like, so twenty-seven components do not each invent an answer. The shape follows
shadcn; the styling does not — variants resolve to CSS module classes on
`--graphite-*`, not utility classes.

1. **Variants are a `cva` recipe, and the recipe is exported.** A sibling that
   needs to render something button-shaped borrows `buttonVariants` instead of
   restating the rules or forking the styles.
2. **`className` is merged after the recipe.** A caller extends without
   forking. Nothing takes a `classNames` bag of internal overrides.
3. **Props spread to the underlying element.** If the DOM node accepts it, the
   component does too; no allowlist of the handful of attributes someone
   happened to need.
4. **`asChild` renders onto the child** instead of emitting a wrapper, for the
   cases where a button must actually be a link.
5. **Multi-part components export their parts** — `Card`, `CardHeader`,
   `CardTitle`, `CardContent`, `CardFooter` — rather than taking slots as
   props. Composition happens in JSX, where a caller can see it.
6. **Every part carries `data-slot`**, so a page can target a component's
   internals from outside without depending on generated class names.
7. **Motion comes from the shared tokens.** Components move on the same curve
   as the pages around them; no component picks its own easing.

Point 5 is the one that changes contracts rather than just code: a slot that
was a prop becomes a child component, which is a breaking change under rule 3.
Button is the reference implementation at 2.0.0; the rest follow.

### Reconciliation note

The gap list above was rewritten on 2026-08-19 after checking the source document against the codebase. As originally written it claimed spacing and status roles were both entirely absent; status roles in fact largely exist, and the `on-surface` binding gap was not known. The governance model puts the contract above the implementation, but that does not license the contract to be wrong about what the implementation contains — where the two disagreed on plain fact, fact won.

---

## Build order (six waves, dependency-ordered)

**Wave 0 — Token prerequisites (not components, blocks several below)**
Spacing scale, status color roles.

**Wave 1 — Zero-dependency primitives**
Label, Separator, Typography, Avatar, Tag, Progress bar

**Wave 2 — Form atoms**
Text input, Text area, Checkbox, Radio button group, Toggle, Select

**Wave 3 — Form composition**
Field (wraps Label + an input atom + help/error text)

**Wave 4 — Layout & navigation**
Card, Contained list, Tabs, Breadcrumb, Navigation Menu

**Wave 5 — Overlays (share one elevation/surface + focus-trap pattern)**
Overlay (internal: the shared pattern the other five implement), Tooltip, Popover, Menu, Modal, Notification

**Wave 6 — Data display**
Data table

Button is done and sits underneath Wave 4 (Card actions) and Wave 5 (Modal confirm/cancel) as a dependency. Button Group sits beside it at wave 0 for the same reason: Card and Modal wrap their footers in it, so it precedes both.

---

## What this unblocks

Once Wave 0's two token additions ship, three prohibitions above (Tag status variants, Notification status variants, Field error-state color) resolve themselves without touching any other contract — that's the actual payoff of doing token work before component work, rather than inventing a red for Notification today and a different red for Tag next week.

---

## Foundation contracts

The four foundations that came out of the Figma sync — spacing, radius,
breakpoint and typography — have contracts in [`foundations/`](foundations/).
They sit in their own directory because they are not components (no slots, no
props) and because they answer to a different checker: `token-drift.mjs`, which
diffs their declared values against `docs/tokens/figma-snapshot.json`, rather
than `drift-check.mjs`, which reads only the top level of this directory and is
unaffected by them.

Note that `typography` appears in both places and means two different things:
`typography.md` here is the **component**, `foundations/typography.md` is the
**scale it draws from**.

---

## Note on contract file location

Governance rule 1 above states the path as `/contracts/<component>.md`. In this repository the contracts live at `docs/contracts/<component>.md`. The rule's intent — one contract file per component, in the same repo as the site — holds; only the directory differs. Update rule 1 in a patch-level revision if you want the written path to match reality.
