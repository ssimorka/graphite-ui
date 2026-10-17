---
component: Navigation Menu
version: 3.0.0
wave: 4
slots:
  - name: Top-level items
    required: true
  - name: Nested items per top-level item
    required: false
props:
  - name: orientation
    values: [horizontal, vertical]
tokens:
  - name: primary
    usage: Active/current-page indicator.
  - name: on-surface
    usage: Default items.
  - name: spacing
    usage: Contained list padding and gaps between levels.
  - name: radius
    usage: Corner on each item.
composition_rules:
  - Depends on the overlay surface pattern (Wave 5) for any nested/flyout menus — same soft dependency as Select.
  - Inverted against the kit's Header menu sets (`UI shell - Header menu`, `Header menu item`, `Header sub-menu`, `Header sub-menu item`), decided 2026-10-08 (#360). Rule 7 applies: the kit wins. Until the inversion lands with UI shell - Header (#368), the code keeps its current geometry.
  - Composed by UI shell - Header, never the other way round.
prohibitions:
  - No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout.
  - Not an application shell. This component is a list of links; the header bar, its actions and the side panels are the UI shell contracts (Header, Left panel, Right panel), which compose it and are never folded into it.
---

### Navigation Menu
- **Slots:** Top-level items (required), nested items per top-level item (optional).
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `primary` for active/current-page indicator, `on-surface` for default items; the spacing scale for padding and level gaps.
- **Composition rules:** Depends on the overlay surface pattern (Wave 5) for any nested/flyout menus — same soft dependency as Select. Inverted against the kit's Header menu sets (see below); UI shell - Header composes it.
- **Prohibitions:** No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout. Not an application shell: the UI shell contracts compose it.

### Brought to the kit: the Header menu sets (#360)

**Decided 2026-10-08 (#360, recorded on #358):** Navigation Menu is inverted
against the kit's Header menu sets and becomes the code for them. The UI shell
Header composes it. Nothing is retired.

The kit's navigation counterpart is `UI shell - Header` and its five
satellites (`Header menu`, `Header menu item`, `Header sub-menu`,
`Header sub-menu item`, `Header actions`). The menu four are this component's;
the bar and `Header actions` are UI shell - Header's own contract.

**What changed.** Until 2026-10-07 rule 6 left UI shell permanently
ungoverned as an application shell, which left the kit silent on this
component, and rule 7's tie-break let the code keep its own geometry (#113,
settled from #128 and #141). Wave G3 (#358) schedules UI shell to build, so the
kit is no longer silent: it has a counterpart, rule 7 applies, and the kit wins.
That is question 1 of "When the kit has nothing" (invert), not question 2
(absorb): the component stays, as the code for the menu sets, so the Header can
compose it.

**When.** The inversion (kit parity on every axis of the four menu sets) lands
with UI shell - Header in #368, which composes it. Until then the geometry
below is the code's own, as it was.

### Why it is kept rather than removed

*Superseded on 2026-10-08:* the kit's Header menu sets are now its governed
counterpart (above), so rule 8's question no longer arises. The reasoning is kept
as the record of why it survived until then.

Separator, Avatar and Card were removed for having no counterpart in the kit
(#95, #97, #109). This component had no *governed* counterpart either, so the
question was fair. It was kept because it passed rule 6's demand test, which
those three failed: *"the repo uses one, a contract references one, or
committed work needs one. Wanting it in the abstract is not demand."*

`components/site-header.tsx` renders it: the header's flat links are this
component, and the docs links in the mobile tray are Tree view. That is "the
repo uses one", the first clause of the test. It got there through step 1 of
the build order in `docs/SHADCN-MIGRATION.md`, *"App shell, and de-Carbon the
chrome it replaces"*, which swapped out Carbon's `Header`, `HeaderNavigation`,
`HeaderMenuItem` and `SideNav`. When 2.0.0 was written that replacement was
committed work rather than done, which is why the evidence originally cited
the Carbon shell.

Note the boundary the migration plan draws in the same breath: *"Sidebar lives
outside `components/ui/` as site chrome rather than a system component."* The
kit and the site plan reached that line independently, and they agree —
application chrome is not a primitive. It is written above as a prohibition so
the distinction survives the de-Carbon pass, which is the moment it would
otherwise erode: the shell that replaces `site-header.tsx` may compose this
component, but must not be folded into it. Since 3.0.0 that shell is the UI
shell contracts rather than site chrome outside `components/ui/`; the line
between the shell and this component is unchanged.

### On the version

**2.0.0**, and the jump is the point. Nothing about the component's slots,
props or tokens moved, and the component's behaviour is unchanged — the only
code edit is its version docblock. But rule 3 says a prohibition
change is breaking, and "not an application shell" is a new prohibition, so a
major is what the rule asks for whether or not anything downstream notices.
Recording the disposition alone would have been a patch.

**2.0.1** is that kind of patch: the demand-test evidence above was corrected
once `site-header.tsx` stopped rendering Carbon's shell and started rendering
this component. No slot, prop, token or prohibition changed.

**3.0.0** follows the same rule. The prohibition changed: it used to place the
header bar, action rail and side panels outside `components/ui/` as site chrome,
and now names the UI shell contracts as what composes this component. The kit
counterpart changed with it, from none to the Header menu sets. No slot, prop or
token moved yet; the inversion that moves them lands with #368.
