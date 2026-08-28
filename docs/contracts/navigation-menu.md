---
component: Navigation Menu
version: 2.0.0
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
  - The kit has no opinion here, so the code keeps its own geometry. The only navigation counterpart in the kit is Carbon's six UI shell sets, which rule 6 places out of scope by construction as application shells. Rule 7's tie-break covers the rest. See #113.
prohibitions:
  - No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout.
  - Not an application shell. This component is a list of links; a header bar, a global action rail or a collapsible side panel is site chrome and belongs outside `components/ui/`.
---

### Navigation Menu
- **Slots:** Top-level items (required), nested items per top-level item (optional).
- **Props:** orientation (horizontal, vertical).
- **Tokens:** `primary` for active/current-page indicator, `on-surface` for default items; the spacing scale for padding and level gaps.
- **Composition rules:** Depends on the overlay surface pattern (Wave 5) for any nested/flyout menus — same soft dependency as Select. The kit has no opinion on this component (see below), so the code keeps its own geometry.
- **Prohibitions:** No more than two nesting levels — a third level should become a dedicated page, not a deeper flyout. Not an application shell.

### Why this one is not brought to the kit (#113)

Every other Wave 2-6 component was inverted under rule 7: read the kit's set,
move the code to it, correct this file to follow. This one was not, and the
reason is a decision that already exists rather than an exception being made
for it.

The kit's only navigation counterpart is `UI shell - Header` and its five
satellites (`Header menu`, `Header menu item`, `Header sub-menu`,
`Header sub-menu item`, `Header actions`). Rule 6 lists UI shell under
**out of scope by construction — application shells**: *"These compose an
application; they are not primitives."* Ungoverned permanently, not pending.

So the candidate counterpart is one the contract system deliberately does not
read, which leaves the kit silent on this component rather than in
disagreement with it. That is precisely the case rule 7's tie-break names:
**where the kit has no opinion, the code keeps its own.** There is no
inversion to perform.

The two halves of that argument were settled three days apart and in different
documents — rule 6 in #128, the tie-break in #141 — which is why #113 sat open
looking like deferred work when it was already answered.

### Why it is kept rather than removed

Separator, Avatar and Card were removed for having no counterpart in the kit
(#95, #97, #109). This component has no *governed* counterpart either, so the
question is fair. It is kept because it passes rule 6's demand test, which
those three failed: *"the repo uses one, a contract references one, or
committed work needs one. Wanting it in the abstract is not demand."*

`components/site-header.tsx` renders Carbon's `Header`, `HeaderNavigation`,
`HeaderMenuItem` and `SideNav` today — the site's real navigation is the same
UI shell the kit declines to govern. Step 1 of the build order in
`docs/SHADCN-MIGRATION.md` is *"App shell, and de-Carbon the chrome it
replaces."* That is committed work, it names this replacement, and a nav list
is what the top nav is built from.

Note the boundary the migration plan draws in the same breath: *"Sidebar lives
outside `components/ui/` as site chrome rather than a system component."* The
kit and the site plan reached that line independently, and they agree —
application chrome is not a primitive. It is written above as a prohibition so
the distinction survives the de-Carbon pass, which is the moment it would
otherwise erode: the shell that replaces `site-header.tsx` may compose this
component, but must not be folded into it.

### On the version

**2.0.0**, and the jump is the point. Nothing about the component's slots,
props or tokens moved, and the component's behaviour is unchanged — the only
code edit is its version docblock. But rule 3 says a prohibition
change is breaking, and "not an application shell" is a new prohibition, so a
major is what the rule asks for whether or not anything downstream notices.
Recording the disposition alone would have been a patch.
