# Figma-only disposition list

The artefact `#103` refers to and `#124` Part B produces: every component set on
the kit's 27 unclaimed component pages, with its bucket under governance rule 6.

**Derived 2026-08-28** by walking the kit (`p2jyUgkFhJd6A5M7L39Ixo`) page by page
through the Figma Plugin API, read-only. Regenerate the same way if the kit gains
or loses sets; nothing here is inferred from the page names.

This file sits in `kit/` rather than beside the contracts because
`scripts/drift-check.mjs` reads the top level of `docs/contracts/` and treats
every `.md` it finds there as a component contract — the same reason
`foundations/` is its own directory.

## What the walk found

| | |
|---|---|
| Unclaimed pages | 27 |
| Component sets on them | **132** |
| — public | 73 |
| — private (`_`-prefixed) | 59 |
| Variants across all sets | 2106 |

### The "~40 sets" estimate was low by more than 3x

`#124` put the total at *"the '~40 sets' figure"* and warned that page names
understate it. They understate it by 4.9x, and the estimate itself was low by
3.3x. Four pages carry ten or more sets on their own: Dropdown (16),
Date picker (16), Slider (10) and Structured list (9).

### Public and private sets are not the same obligation

The kit already separates them, and rule 6 did not know it. **59 of the 132 sets
are `_`-prefixed build blocks**, most carrying the description *"🚫 Do not edit
this component. This component is used to bu[ild]..."*. They are internals: a
sample of the Dropdown page found 3,139 instances across 31 distinct sets, led by
`_Dropdown chevron` (336) and `_Dropdown list item - Default` (324). They are
load-bearing, not dead weight.

**Rule 6's labelling obligation attaches to the 73 public sets.** A private set
inherits its page's disposition and needs no description of its own: it already
carries a stronger statement than "ungoverned", and it is not something a designer
could mistake for a governed component. Labelling all 132 would be three times the
work for less clarity.

## Disposition

### Application shells — 5 pages, 13 public / 4 private

*Ungoverned, permanently.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| Tree view | 2 | 2 | 50 |
| Content switcher | 1 | 2 | 312 |
| UI shell - Left panel | 2 | 0 | 36 |
| UI shell - Header | 6 | 0 | 43 |
| UI shell - Right panel | 2 | 0 | 8 |

### Vendor features (AI) — 3 pages, 9 public / 3 private

*Ungoverned, permanently.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| AI label | 3 | 0 | 47 |
| AI layer | 4 | 0 | 23 |
| AI explainability popover | 2 | 3 | 6 |

### Carbon idioms with no Graphite counterpart — 8 pages, 15 public / 17 private

*Ungoverned, permanently.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| Form | 3 | 1 | 6 |
| Loading | 2 | 2 | 16 |
| Progress indicator | 1 | 3 | 22 |
| Toggletip | 1 | 1 | 36 |
| Structured list | 2 | 7 | 60 |
| List | 2 | 0 | 6 |
| Tile | 1 | 0 | 65 |
| Code snippet | 3 | 3 | 38 |

### Already spoken for — 4 pages, 15 public / 14 private

*Ungoverned. The fold is recorded on the governing contract.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| Menu buttons | 3 | 0 | 96 |
| Number input | 2 | 4 | 54 |
| Password input | 2 | 2 | 113 |
| Dropdown | 8 | 8 | 461 |

### In scope, awaiting demand — 6 pages, 19 public / 18 private

*Ungoverned until something asks.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| Link | 1 | 0 | 36 |
| Search | 2 | 0 | 49 |
| Date picker | 11 | 5 | 215 |
| File uploader | 1 | 3 | 41 |
| Slider | 2 | 8 | 89 |
| Pagination | 2 | 2 | 37 |

### Adopt — 1 page, 2 public / 3 private

*Governed once its contract lands.*

| Page | Public sets | Private | Variants |
|---|---|---|---|
| Accordion | 2 | 3 | 141 |

## Four pages the rule did not reach

Rule 6 names five categories and reads as if it resolves all 27. Walking them
found **four pages that fall into none of its lists**: Menu buttons, File
uploader, Form and List. They are on `#124`'s page inventory but appear in no
category in `README.md`. Bucketed here, with the reasoning recorded once:

| Page | Bucket | Why |
|---|---|---|
| Menu buttons | Already spoken for | `Menu button`, `Combo button` and `Overflow` are the three sets `#103` flagged as unaccounted Button neighbours. Graphite composes this as Button plus Menu; both are governed, so there is nothing left over to contract. |
| File uploader | Awaiting demand | A Carbon primitive with no Graphite contract, same class as Date picker and Slider. Nothing asks for it today. |
| Form | Carbon idiom | A wrapper around form controls, which is the species Graphite has already declined once: Field was removed in `#135` because the kit puts label and helper text on the control itself. Adopting Form would reintroduce the wrapper by another name. |
| List | Carbon idiom | Carbon's plain ordered/unordered list, sibling to Structured list. Contained list is the governed member of this family; `List` and `List item` are the typographic ones and have no Graphite counterpart. |

That the rule had gaps is not a defect in it. It is what Part B is for: Part A
wrote the categories from five worked examples, and applying them to all 27
pages is the only thing that could have found the four that fit none.

## Four more things the walk turned up

**The AI sets are not isolated on their AI pages.** `AI layer - Field` is
instanced 246 times and `AI label` 201 times inside the **Dropdown** page's own
variant matrix, alongside `Revert AI button` (190). `#124` notes that dropping
the AI components would decide the fate of the `AI`, `AI presence` and `AI
revert` variable collections. It is more entangled than that: the AI sets are
woven into the variants of other Carbon components, so "drop the AI components"
is not a self-contained operation. This is a further argument for rule 6's
label-rather-than-delete stance, on top of the published-library one.

**The kit instances at least one external library.** The Dropdown page carries
85 instances of `Chat prompt line typeahead menu list | Carbon for AI`, which is
not a set on any of the 45 pages. The 27-page inventory does not bound what the
kit depends on.

**Two sets share a name.** The Structured list page has `_Structured list header
row item` **twice**, as two distinct sets with 2 variants each. Harmless while
both are private, but it defeats name-based lookup — which is how the gallery
version badge resolves, and how the `Progress bar bar` and `ContainedList`
failures in `#134` and `#136` happened. Worth a rename if that page is ever
touched.

**Accordion is bigger than an adoption note suggests.** It is the one page rule 6
resolves to *adopt*, and it carries `Accordion item` at **120 variants** plus a
bare `Accordion` component and three skeleton internals. Whoever writes
`accordion.md` should size it against that, not against the one-line mention in
`SHADCN-MIGRATION.md`.

## What this list does not settle

**Instance counts across the whole document.** Part B asked for "whether
anything instances it" per set. That was answered for private sets by sampling,
and it is *not* answered for the public Carbon sets, because there is nowhere in
this file that would answer it: the `04 Pages – Screens` page holds 27 instances
of a single `Screen` component and composes none of the Carbon sets. Usage by
other files consuming the published library is not visible from inside it
either.

This turns out not to matter. Under rule 6 nothing is deleted while the library
is published, so no disposition here depends on a usage count. The column would
change an answer only if deletion were on the table, and it is not.

## Every set, by page

Variant counts in parentheses. `_`-prefixed sets are the kit's own internals.

**Tree view** — Application shells

- Public: `Branch node item` (32), `Tree view` (2)
- Private: `_Tree view spacer - Branch node` (8), `_Tree view spacer - Leaf node` (8)

**Content switcher** — Application shells

- Public: `Content switcher` (24)
- Private: `_Content switcher text item` (144), `_Content switcher icon item` (144)

**UI shell - Left panel** — Application shells

- Public: `UI shell - Left panel menu item` (34), `UI shell - Left panel` (2)

**UI shell - Header** — Application shells

- Public: `UI shell - Header menu item` (15), `UI shell - Header sub-menu item` (6), `UI shell - Header sub-menu` (1), `UI shell - Header actions` (10), `UI shell - Header menu` (9), `UI shell - Header` (2)

**UI shell - Right panel** — Application shells

- Public: `UI shell - Right panel item` (7), `UI shell - Right panel` (1)

**AI label** — Vendor features (AI)

- Public: `AI label wrapper` (1), `AI label` (28), `AI label - Inline` (18)

**AI layer** — Vendor features (AI)

- Public: `AI layer - Background` (15), `AI layer - Field` (6), `AI layer - Shadow` (1), `AI layer - Border` (1)

**AI explainability popover** — Vendor features (AI)

- Public: `AI explainability popover` (2), `AI explainability popover actions footer` (1)
- Private: `_AI explainability popover/Test` (1), `_AI explainability popover/Test 2` (1), `_AI explainability popover/Test 3` (1)

**Form** — Carbon idioms with no Graphite counterpart

- Public: `Form on page` (2), `Form modal - Default` (2), `Form modal - Fluid` (1)
- Private: `_Form modal base` (1)

**Loading** — Carbon idioms with no Graphite counterpart

- Public: `Inline loading` (4), `Loading` (2)
- Private: `_Loading base` (2), `_Loading animation` (8)

**Progress indicator** — Carbon idioms with no Graphite counterpart

- Public: `Progress indicator` (2)
- Private: `_Progress indicator skeleton item` (2), `_Progress indicator item` (12), `_Progress indicator step label base` (6)

**Toggletip** — Carbon idioms with no Graphite counterpart

- Public: `Toggletip` (24)
- Private: `_Toggletip body item` (12)

**Structured list** — Carbon idioms with no Graphite counterpart

- Public: `Structured list` (4), `Structured list - Selectable` (4)
- Private: `_Structured list header row item` (2), `_Structured list header row item` (2), `_Structured list row item` (8), `_Structured list row item - Selectable` (32), `_Structured list header cell base` (2), `_Structured list row cell base` (4), `_Structured list select cell base` (2)

**List** — Carbon idioms with no Graphite counterpart

- Public: `List item` (4), `List` (2)

**Tile** — Carbon idioms with no Graphite counterpart

- Public: `Tile` (65)

**Code snippet** — Carbon idioms with no Graphite counterpart

- Public: `Code snippet - Single line` (3), `Code snippet - Inline` (6), `Code snippet - Multi-line` (5)
- Private: `_Code snippet tooltip` (7), `_Code snippet - Inline item` (5), `_Code snippet ghost button` (12)

**Menu buttons** — Already spoken for

- Public: `Menu button` (12), `Combo button` (12), `Overflow` (72)

**Number input** — Already spoken for

- Public: `Number input - Default` (21), `Number input - Fluid` (8)
- Private: `_Number input action item` (18), `_AI slug action item` (3), `_Revert button action item` (1), `_Number input base` (3)

**Password input** — Already spoken for

- Public: `Password input - Default` (93), `Password input - Fluid` (16)
- Private: `_Password input placeholder base` (1), `_Password input base` (3)

**Dropdown** — Already spoken for

- Public: `Dropdown - Default` (102), `Dropdown - Fluid` (15), `Dropdown - Combo box - Default` (48), `Dropdown - Combo box - Fluid` (15), `Dropdown - Multi-select - Default` (102), `Dropdown - Multi-select  - Fluid` (17), `Dropdown - Filterable multi-select - Default` (51), `Dropdown - Filterable multi-select - Fluid` (17)
- Private: `_Dropdown chevron` (2), `_Dropdown menu list - Default` (3), `_Dropdown list item - Default` (30), `_Dropdown parent checkbox - Default` (18), `_Dropdown list item - Fluid input` (20), `_Dropdown menu list - Fluid input` (2), `_Dropdown parent checkbox - Fluid` (12), `_Dropdown skeleton item` (7)

**Link** — In scope, awaiting demand

- Public: `Link` (36)

**Search** — In scope, awaiting demand

- Public: `Search - Default` (42), `Search - Fluid` (7)

**Date picker** — In scope, awaiting demand

- Public: `Time picker items - Fixed` (6), `Time picker items - Clock` (12), `Time picker items - Timezone` (6), `Date picker - Simple date - Default` (37), `Date picker - Simple date - Fluid` (10), `Date picker - Single calendar - Default` (39), `Date picker - Single calendar - Fluid` (12), `Date picker - Range calendar - Default` (12), `Date picker - Range calendar - Fluid` (12), `Time picker - Default` (18), `Time picker - Fluid` (12)
- Private: `_Date picker calendar day item` (11), `_Date picker month pagination` (4), `_Date picker month year` (2), `_Date picker calendar` (1), `_Time picker item - Fixed` (21)

**File uploader** — In scope, awaiting demand

- Public: `File uploader` (18)
- Private: `_File uploader - Drag and drop box states` (4), `_File uploader file item` (18), `_File uploader file list item` (1)

**Slider** — In scope, awaiting demand

- Public: `Slider` (9), `Slider - Range` (44)
- Private: `_Slider left rail` (2), `_Slider right rail` (1), `_Slider rail` (1), `_Slider item` (2), `_Slider skeleton item` (1), `_Slider base` (1), `_Slider - Range handle` (10), `_Slider - Range slider track` (18)

**Pagination** — In scope, awaiting demand

- Public: `Pagination - Nav` (3), `Pagination - Table bar` (9)
- Private: `_Pagination select menu item` (1), `_Pagination - Nav page item` (24)

**Accordion** — Adopt

- Public: `Accordion` (1), `Accordion item` (120)
- Private: `_Accordion header skeleton` (6), `_Accordion content skeleton` (2), `_Accordion skeleton item` (12)

