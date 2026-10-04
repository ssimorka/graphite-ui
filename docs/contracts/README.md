# Graphite UI — Contract Governance & Token Reference

These two sections apply to **every** component contract in this directory, not to any single one.

---

## Governance model

**The Figma kit is canonical.** Where the kit and a contract disagree, the kit wins and the
contract is corrected to match it.

This reversed on 2026-08-28. It previously read: *"The contract file is canonical. Figma and
the live site both implement a contract, neither one defines it."* Contracts are still the
written specification the code is checked against — rule 4's drift check is unchanged, and a
component still may not change without its contract changing first. What moved is precedence:
a contract is now a description of the kit rather than an authority over it, so a disagreement
is a bug in the contract, not in Figma.

**Rules:**
1. Every component has one contract file (`docs/contracts/<component>.md`) in the same repo as the site.
2. No component code changes without a matching contract update first, even for one-line fixes.
3. Each contract is versioned (semver). A prohibition change is breaking. A new optional slot is minor. A copy/description edit is a patch.
4. A drift check script reads each contract's declared token dependencies and verifies the component's actual code references those exact variable names, nothing else. Fails the build on mismatch.
5. Figma components carry the contract version number in their description field, so anyone opening the file knows which spec they're looking at.
6. Every component set in the kit is either **governed** — a contract declares it, and rule 5 puts that contract's version in its description — or **ungoverned**, and says so in the same place. Nothing is unlabelled. Since #240, two buckets of ungoverned sets are **scheduled to build** and acquire contracts by that decision rather than by waiting for demand; three stay ungoverned permanently. See "Carbon-only sets in the kit" below.
7. Where the kit and a contract disagree, the kit wins. Correct the contract, not the kit. Where **the kit disagrees with itself**, the more specific artefact wins; where the kit has **no opinion**, the code keeps its own. See "When the kit is not of one mind" below.
8. Rules 6 and 7 say who wins; neither says what should **exist**. A governed component with no counterpart in the kit is kept only while something needs it, and the demand test decides. (The demand test no longer gates kit sets scheduled to build under rule 6; it still gates components the kit does not have.) See "When the kit has nothing" below.

### When the kit is not of one mind

Rule 7 settles kit-versus-contract. It does not settle kit-versus-kit, and that
came up three times in the first pass of bringing components across, so the
tie-break is written down rather than re-derived.

**The more specific artefact wins.** A component set beats a token specimen; a
variable authored to name particular components beats a binding those
components inherited from Carbon. Specificity here means "closer to the thing
being decided", not "more recently edited".

- The type specimen (node `11444:9897`) names `Input Label` as 12/12. Every
  form component renders its label at 12/16. The components won — they are
  what the label actually looks like. See #137.
- `surfaceElevated`'s description reads *"Shared overlay surface: Tooltip,
  Popover, Dropdown Menu, Dialog"*, while those same component sets filled
  with `Layer/layer-01`, which then resolved to `surface`. The variable won,
  because it was authored for those four in #92 (#139). **Since resolved in
  the kit:** `layer-01` now resolves to `elevation/01`, on the same stops as
  `surfaceElevated`, so the two agree and overlays bind `elevation-01` with
  the kit's shadow and no edge. See `overlay.md` 2.0.0.

**Where the kit has no opinion, the code keeps its own.** This is not a
disagreement and rule 7 does not reach it. The kit models static frames, so it
says nothing about behaviour the code has and Figma cannot express.

- Data table's header cell is transparent in the kit. The code's header is
  `position: sticky`, and a transparent sticky header lets rows scroll through
  it. #140 kept `surface` on the grounds that the kit does not model
  scrolling. **Corrected in #239:** that read the cell for the row. The kit's
  header *row* is opaque `surfaceVariant`, with the cells transparent on it, so
  the kit does have an opinion and it already answers the sticky case; the
  header takes `surface-variant`. What stays the code's own is the rule under
  the sticky header: the kit draws it at the top of the first row, which
  scrolls away.
- Hover, focus and pressed are variant axes in the kit and pseudo-classes in
  code. A `State=Hover` variant is not an instruction to add a `hover` prop.

**Record the call, don't just make it.** Every one of these lives in the
contract or the stylesheet it affects, next to the value it explains. A
divergence nobody wrote down reads as a mistake to the next person, and gets
"fixed" back.

### When the kit has nothing

Rule 7 settles kit-versus-contract and its tie-break settles kit-versus-kit.
Both answer **who wins a disagreement**. Neither answers **whether the
component should exist at all**, and six components have needed that second
answer.

#133 proposed a corollary for them: *"these stay code-only, and their contracts
remain authoritative for them, because a rule about who wins a disagreement
says nothing where only one party exists."* It is half right, and the halves
have to come apart.

- **On authority — ratified.** Where the kit has nothing, the contract is
  authoritative for that component. This is not a new rule; it is rule 7's
  tie-break ("where the kit has no opinion, the code keeps its own") applied to
  a component instead of a property.
- **On existence — struck.** The corollary read "rule 7 does not reach this" as
  "therefore keep", which does not follow. Nothing supported keep-by-default,
  and five merges went the other way before anyone noticed the proposal was
  still standing. Rule 8 replaces that half.

### The three questions, in order

1. **Does the kit have a governed counterpart?** Rule 7: the kit wins, bring
   the code to it. This is the F-wave inversion (#133 bucket A), and it covers
   eighteen components.
2. **No counterpart of its own, but does the kit answer the same need inside
   something it does govern?** Then absorb it there. "The kit has nothing" must
   mean *nothing anywhere*, not *no set with that name* — the trap Label and
   Field would have fallen into. Carbon ships no Label set, but it has a firm
   opinion about where a label lives: on the control. See #135.
3. **Does the kit say nothing at all?** The contract is authoritative (above),
   and rule 6's demand test decides whether the component is kept.

### What counts as demand

Rule 6 states it as *"the repo uses one, a contract references one, or
committed work needs one. Wanting it in the abstract is not demand."* Applied
to retention, one distinction does the work:

**A dependency survives the question; an illustration does not.** If the
reference still reads correctly after substituting something else, it was an
illustration.

Avatar and Typography are the worked pair, and they land on opposite sides:

- `contained-list.md` named **Avatar** in its *optional* leading slot, as one
  of several markers. The slot took a Tag instead and the contract lost only a
  word. Illustration. Removed in `e49b422`.
- `contained-list.md` names **Typography** as the type of its *required* title
  slot. Remove Typography and the slot has no type. Dependency.

Typography used to have a second dependency: `progress-bar.md` named it in the
remedy to a prohibition, *"no text label baked into the bar itself, pair with
Typography externally."* Progress bar 2.0.0 (#235) paints its own label and
helper, as the kit's set does, so that remedy is gone and the prohibition now
says only that no text sits inside the track. One dependency is still a
dependency: Typography passes the demand test on Contained list alone. Keep
the two reasons apart if this is revisited; the second was always the weaker,
since it was a prohibition's remedy rather than a slot's type.

Note that neither of those is "the repo imports it". Typography is imported
only by the gallery, and that is not what keeps it.

### The six, sorted

| | Question 2 or 3 | Demand | Outcome |
|---|---|---|---|
| Separator, Avatar, Card | 3 | None; only the gallery composed them | **Removed** (#95, #97, #109) |
| Label, Field | 2 | Answered on the form controls instead | **Absorbed** (#94, #107) |
| Navigation Menu | 3 | `site-header.tsx`, and step 1 of `SHADCN-MIGRATION.md` | **Kept** (#113) |
| Typography | 3 | Contained list's required title slot depends on it (Progress bar's remedy, the second, retired in #235) | **Kept** (#96) |

Settled in #133. The five merges that preceded the rule were each right on
their own facts, which is why none of them felt like a violation at the time;
what was missing was the sentence they had in common.

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

### Reading a kit component that binds Carbon tokens

Not every kit component binds Graphite Semantic. Several bind the Carbon
compatibility layer instead — Progress bar's fill is `Border/border-interactive`, Breadcrumb's link is
`Link/link-primary`, Contained list's rows are `Background/background`.

Do not follow those into component code. Contracts forbid it, and the whole
point of `--graphite-*` is that it is the canonical surface. Translate instead,
through the `CARBON_VAR_BINDINGS` table in `components/theme-provider.tsx`,
which is what feeds those Carbon variables in the first place:

| Kit binds | Fed by |
|---|---|
| `Background/background` | `background` |
| `Border/border-subtle-00` | `outline` in the `--cds-*` layer; the kit aliases it to `outlineSubtle`, which components bind as `outline-subtle` (D1, #241) |
| `Border/border-interactive` | `primary` |
| `Text/text-primary` | `onBackground` |
| `Text/text-secondary` | `onSurfaceVariant` |
| `Link/link-primary` | `primary` |

The kit also binds Carbon aliases the `--cds-*` layer does not carry. These
were resolved through the kit's own alias chains, and are bound as the role
they end at:

| Kit binds | Resolves to |
|---|---|
| `Border/border-inverse` | `onBackground` (Slider's fill, #269) |
| `Border/border-strong-01` | `outlineStrong` (File uploader's drop box, #270) |
| `Layer/layer-01` | `elevation/01` |
| `Layer accent/layer-accent-01` | `elevation/02` (Slider - Range's ground, #269) |
| `Background/background-hover` | `elevation/02` |
| `Background/background-inverse` | `onBackground` |
| `Icon/icon-primary` | `onSurface` |
| `Icon/icon-secondary` | `onSurfaceVariant` |
| `Icon/icon-inverse` | `background` |
| `Miscellaneous/interactive` | `primary` |
| `Focus/focus` | `state/primary-focus-ring`, bound as `primary-focus` |
| `Border/border-disabled`, `Button/button-disabled` | `state/primary-disabled` |
| `Text/text-disabled`, `Icon/icon-disabled` | `state/primary-disabled-content` |
| `Support/support-info` | `info` (File uploader's success mark, #270) |

The kit is still canonical: it decides which value a component gets. The table
only says which Graphite role produces that value, so the code can bind the
role rather than the Carbon alias.

### The disposition list

Part B is done. [`kit/figma-only.md`](kit/figma-only.md) lists every set on the 27
unclaimed pages with its bucket, derived by walking the kit through the Plugin
API rather than inferred from page names. Regenerate it the same way when the
kit gains or loses sets.

Two things it corrects here. **The total is 132 sets, not "~40"** — 73 public
and 59 private — across 2,106 variants; Dropdown and Date picker carry 16 each.
And **rule 6's labelling obligation attaches to the 73 public sets only.** The
kit already marks its own internals with a `_` prefix and a "🚫 Do not edit"
description; those inherit their page's disposition, and nobody can mistake one
for a governed component. Labelling all 132 would be triple the work for less
clarity.

The walk also found four pages that fit none of the categories below — Menu
buttons, File uploader, Form and List. They are bucketed in the list and folded
into the categories here.

It lives in `kit/` for the same reason `foundations/` exists: `drift-check.mjs`
reads the top level of this directory and treats every `.md` there as a
component contract. It said so, loudly, when the file was first written next to
them.

### Which bucket a set falls in

**Out of scope by construction.** Graphite contracts govern component
primitives. Three classes will never acquire one, so they are ungoverned
permanently rather than pending:

- *Application shells* — UI shell Header / Left panel / Right panel, Tree view,
  Content switcher. These compose an application; they are not primitives.

  This bullet also settles **Navigation Menu** (#113), which is why that issue
  is not an open Wave 4 item. The six UI shell sets are the kit's only
  navigation counterpart, and placing them out of scope here leaves the kit
  *silent* on `navigation-menu.md` rather than in disagreement with it. Rule
  7's tie-break then applies unchanged — where the kit has no opinion, the code
  keeps its own — so there was never an inversion to perform. The two halves of
  that argument were written days apart, in #128 and #141, and neither one
  mentioned the other. Recorded in full in `navigation-menu.md`.
- *Vendor features* — AI label, AI layer, AI explainability popover. Carbon's AI
  affordances, tied to IBM product decisions Graphite does not make. Dropping
  these also decides the fate of the `AI`, `AI presence` and `AI revert`
  variable collections, which `scripts/figma-extract.js` already excludes from
  the snapshot as "component-level state rather than a foundation token layer".
- *Carbon idioms with no Graphite counterpart* — Structured list, Toggletip,
  Tile, Code snippet, Loading, Progress indicator, Form, List. Form and List
  were added by the Part B walk: Form is a control wrapper, the species Field
  already was before #135 removed it, and List is the typographic sibling of the
  governed Contained list.

  `Contained list` was on this list and has come off it. The component that
  used to be called `Item` was renamed to it when the code adopted the kit's
  names, so a contract now declares it and it is governed. This is the first
  set to move from ungoverned to governed, which is the one-way movement rule 6
  allows.

**Build: wave G2, splitting a fold (#240).** These Carbon sets were
"already spoken for": not separate components in Graphite but values on one.
Number input and Password input were `type` on Text input; Dropdown was
Select, or Menu for the menu case; Menu buttons — the `Menu button`, `Combo
button` and `Overflow` sets #103 flagged as unaccounted — was Button composed
with Menu. #240 schedules each to become its own governed component, so the
fold recorded on the governing contract is replaced by a contract of its own.
Each one decides its API boundary with the contract it splits from.

**Build: wave G1 (#240).** Primitives Graphite had no contract for but plausibly
wanted — Link, Search, Slider, Pagination, Date picker, File uploader. They
used to wait for demand (the repo uses one, a contract references one, or
committed work needs one). #240 decided to build them instead: the site is to
be one-to-one with the kit, and these are the kit's general-purpose
primitives. Search already had a governed dependant by then (Contained list's
header search, #238).

**Build: carried from #219.** Three sets on governed pages were left out of
their components' parity work and scheduled with G1: **Notification - Toast**
(its own component, with its own timing), **Checkbox group**, and the **Search**
modes Contained list and Data table wait on.

**Movement is still one-way, and labelling still holds.** A set scheduled to
build stays labelled *ungoverned* in its kit description until its contract
lands; then rule 5 replaces the label with the version, as it did for
Contained list and Accordion.

### The demand test runs both ways (and now mostly one)

The test decided whether an ungoverned kit set *acquires* a contract. #240
retired that direction for the two build buckets: they acquire contracts by
decision, and the permanent three never do, so for kit sets the test is no
longer consulted. It still reads in the other direction, deciding whether a
governed component with no kit counterpart *keeps* one. That is rule 8, and it
is written up under "When the kit has nothing" in the governance model rather
than restated here.

### What the rule decides today

**Accordion** was the one adoption made under the demand test: it met it twice
over (`components/sections/faq.tsx` used Carbon's, and it was the only new
contract the docs-site work required).

**Since #240 (2026-10-04)** the plan is to build, in waves:

| Wave | Pages | Public sets |
|---|---|---|
| G1 | Link, Search, Pagination, Slider, File uploader, Date picker | 19 |
| Carried | Notification - Toast, Checkbox group | 2 |
| G2 | Menu buttons, Number input, Password input, Dropdown | 15 |

Each one gets the full governed pipeline to #219's definition of done: a
contract, the component at parity on every axis, a docs page, and its
contract version stamped in the kit set's description. **Application shells,
vendor AI features and Carbon idioms stay ungoverned permanently**, so the
Navigation Menu settlement (#113) is unaffected: the UI shell sets remain out
of scope, and the kit remains silent on `navigation-menu.md`.

---

## Token structure reference (current, confirmed)

- Source: one hex input, resolved in **OKLab**, sampled at fixed tone stops into a perceptual ramp.
- Semantic roles: the engine generates **32 roles**, every one emitted as a `--graphite-*` CSS variable, plus **19 interaction-state variables**, the generated `--graphite-scrim`, and the six ladder variables from `LADDERS` (`elevation-00`–`03`, `outline-subtle`, `outline-strong`) — 58 in total. The ladders are not roles: the kit files them beside its 32, so they enter no contrast pairing (#241). Names are kebab-case and match the vocabulary these contracts use, so `on-surface` in a contract is `--graphite-on-surface` in the CSS. The states are six per interactive family (`primary`, `secondary`, `danger`) plus the page-level `--graphite-focus`; families come from `STATE_FAMILIES` in `lib/color.js` rather than a hand-written list, and `buildStates` and `drift-check.mjs` both read that list rather than restating it. `danger` joined in #129, because Button's destructive variant was the one variant with no hover or pressed state — in breach of Button's own composition rule. `warning`, `success` and `info` have state sets in the kit but not in the engine, deliberately: nothing has a variant to spend them on, and rule 6's demand test applies to tokens too.
- Carbon's `--cds-*` variables are still stamped (59 of them) as a **compatibility layer**, so Carbon's own components keep picking up generated values. They are not the canonical surface and cannot express the full set — Graphite's own components read `--graphite-*` only.
- State resolution: discrete **tone-step** moves on the ramp (not opacity). Direction preserves WCAG contrast — darker in light themes, lighter in dark.
- Contrast is enforced at generation time, not audited after.
- Output per theme pass: **58 `--graphite-*` color variables** (canonical) and **59 `--cds-*` variables** (Carbon compatibility), light and dark generated together.
- A further **102 variables** are declared statically in `app/globals.scss`, almost all because they do not vary by theme and so are not part of the generated pass: 14 spacing, 3 density, 8 radius, 5 breakpoint, 3 font family, 62 typography (58 step values plus 4 weights), 5 motion, 1 scrim, 1 shadow (`--graphite-shadow-overlay`, the kit's `Shadows/Menu`, plain black in both themes, #242). Four of those groups now come from the Figma kit rather than from Carbon or from nothing — see `foundations/`. **`scrim` is the exception to the reason.** It does vary by theme — 50% in Light, 70% in Dark — and since #92 it is generated by `scrimFor()` in `lib/color.js` from the darkest neutral, so it tracks the source colour like every other role. Its declaration in `globals.scss` survives only as the pre-hydration fallback, which is why it is still counted here.

**Wave 0 is complete.** Both prerequisites shipped; recorded here because the contracts still refer to them:

- **Spacing is a runtime scale now** (issue #41). `--graphite-space-00…13` and three semantic `--graphite-density-*` steps are declared in `app/globals.scss`. Components bound to the density steps rather than raw steps until Contained list and Data table took the kit's fixed row sizes (#238, #239); no governed component binds one today, and the steps stay for the Create page's Density control. The drift check covers them, so rule 4 is no longer color-only. The closing caveat here used to read that the scale was "Carbon's numbers under Graphite names, not a scale generated from anything" — that is no longer true. Since #72 the numbers come from the Figma kit, and `token-drift.mjs` verifies them against it; the values were identical at the swap, so nothing moved.
- **Status roles are complete** (issue #42). `danger`, `warning`, `success`, and `info` each resolve base, `on*`, `*Container`, and `on*Container`, and all four sets now emit under `--graphite-*`. The `on*Container` text tokens have no Carbon equivalent — Carbon ships one per-status text token (`text-error`) and no slot for text on a container fill — so they exist only in the Graphite namespace.

No component contract carries a **[blocked on Wave 0]** marker any more. The two Wave 5 dependencies that used to be listed here as open — the shared overlay surface token and the Modal scrim — both closed in #92: `surfaceElevated` exists in the kit's `Graphite Semantic` collection, and `scrim` is generated by `scrimFor()` in `lib/color.js` rather than declared as a literal. The drift check reports no warnings for either. (Overlays have since moved off `surfaceElevated`: they fill `elevation-01` and carry `--graphite-shadow-overlay`, Tooltip is inverse, and Modal's panel is `background`. See `overlay.md` 2.0.0, #242.)

## Component API conventions

Contracts say what a component *is*. This says what its React surface looks
like, so the twenty-two components do not each invent an answer. The shape follows
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
5. **Multi-part components export their parts** rather than taking slots as
   props, so composition happens in JSX where a caller can see it. Card was
   the illustration here — `Card`, `CardHeader`, `CardTitle`, `CardContent`,
   `CardFooter` — and has since been removed for having no counterpart in the
   kit. The convention outlives the example.
6. **Every part carries `data-slot`**, so a page can target a component's
   internals from outside without depending on generated class names.
7. **Motion comes from the shared tokens.** Components move on the same curve
   as the pages around them; no component picks its own easing.

Point 5 is the one that changes contracts rather than just code: a slot that
was a prop becomes a child component, which is a breaking change under rule 3.
Button is the reference implementation (2.0.0 introduced the convention; it is now at 2.5.0); the rest follow.

### Reconciliation note

The gap list above was rewritten on 2026-08-19 after checking the source document against the codebase. As originally written it claimed spacing and status roles were both entirely absent; status roles in fact largely exist, and the `on-surface` binding gap was not known. The governance model puts the contract above the implementation, but that does not license the contract to be wrong about what the implementation contains — where the two disagreed on plain fact, fact won.

---

## Build order (six waves, dependency-ordered)

**Wave 0 — Token prerequisites (not components, blocks several below)**
Spacing scale, status color roles.

**Wave 1 — Zero-dependency primitives**
Typography, Tag, Progress bar. Label, Separator and Avatar were removed with the rest of the components the kit has no counterpart for (#94, #95, #97).

**Wave 2 — Form atoms**
Text input, Text area, Checkbox, Radio button group, Toggle, Select

**Wave 3 — Form composition**
None. This wave held Field, which wrapped Label, an input atom and help/error text. Both were removed when the code took the kit's shape: the kit ships no standalone label and no field wrapper, so every form control carries its own label and supporting text. See #94 and #107.

**Wave 4 — Layout & navigation**
Accordion, Contained list, Tabs, Breadcrumb, Navigation Menu. Card was removed (#109); the kit has none. Navigation Menu is complete but was never inverted, because the kit is silent on it rather than in disagreement — see #113 and the application-shells bullet above.

**Wave 5 — Overlays (share one elevation/surface + focus-trap pattern)**
Overlay (internal: the shared pattern the others implement), Tooltip, Popover, Menu, Modal, and Notification. Notification ships in this wave but is inline, not an overlay: it traps nothing and does not use the Overlay hook (see its contract, 3.0.0).

**Wave 6 — Data display**
Data table

Button is done and sits underneath Wave 5 (Modal confirm/cancel) as a dependency. Button Group sits beside it at wave 0 for the same reason: Modal wraps its footer in it, so it precedes Modal. Both used to name Card as well, until Card was removed (#109).

---

## What this unblocks

Once Wave 0's two token additions ship, three prohibitions above (Tag status variants, Notification status variants, form error-state color) resolve themselves without touching any other contract — that's the actual payoff of doing token work before component work, rather than inventing a red for Notification today and a different red for Tag next week.

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
