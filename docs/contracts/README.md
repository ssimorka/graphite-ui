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

This is a solo-maintainer model. It doesn't require review gates, just a fixed place where truth lives and a script that checks reality against it.

---

## Token structure reference (current, confirmed)

- Source: one hex input, resolved in **OKLab**, sampled at fixed tone stops into a perceptual ramp.
- Semantic roles: the engine generates **27 roles**, every one emitted as a `--graphite-*` CSS variable, plus 6 interaction-state variables — 33 in total. Names are kebab-case and match the vocabulary these contracts use, so `on-surface` in a contract is `--graphite-on-surface` in the CSS.
- Carbon's `--cds-*` variables are still stamped (55 of them) as a **compatibility layer**, so Carbon's own components keep picking up generated values. They are not the canonical surface and cannot express the full set — Graphite's own components read `--graphite-*` only.
- State resolution: discrete **tone-step** moves on the ramp (not opacity). Direction preserves WCAG contrast — darker in light themes, lighter in dark.
- Contrast is enforced at generation time, not audited after.
- Output per theme pass: **33 `--graphite-*` color variables** (canonical) and **55 `--cds-*` variables** (Carbon compatibility), light and dark generated together. A further **16 `--graphite-space-*` / `--graphite-density-*` variables** are declared statically in `app/globals.scss`; spacing does not vary by theme, so it is not part of the generated pass.

**Confirmed gap — Wave 0, build before touching components that need it:**

- **Spacing is a runtime scale now** (issue #41). `--graphite-space-01…13` and three semantic `--graphite-density-*` steps are declared in `app/globals.scss`, interpolated from Carbon's `$spacing-*` so the numbers cannot fall out of step. Components bind to the density steps rather than raw steps. The drift check covers them, so rule 4 is no longer color-only. What is still *not* done: the scale is Carbon's numbers under Graphite names, not a scale generated from anything — spacing has no ramp to sample, so this may simply be the right answer.
- **Status roles are complete** (issue #42). `danger`, `warning`, `success`, and `info` each resolve base, `on*`, `*Container`, and `on*Container`, and all four sets now emit under `--graphite-*`. The `on*Container` text tokens have no Carbon equivalent — Carbon ships one per-status text token (`text-error`) and no slot for text on a container fill — so they exist only in the Graphite namespace.

Where a component needs something from the gap list, its contract is marked **[blocked on Wave 0]** rather than guessing a value.

### Reconciliation note

The gap list above was rewritten on 2026-08-19 after checking the source document against the codebase. As originally written it claimed spacing and status roles were both entirely absent; status roles in fact largely exist, and the `on-surface` binding gap was not known. The governance model puts the contract above the implementation, but that does not license the contract to be wrong about what the implementation contains — where the two disagreed on plain fact, fact won.

---

## Build order (six waves, dependency-ordered)

**Wave 0 — Token prerequisites (not components, blocks several below)**
Spacing scale, status color roles.

**Wave 1 — Zero-dependency primitives**
Label, Separator, Typography, Avatar, Badge, Progress

**Wave 2 — Form atoms**
Input, Textarea, Checkbox, Radio Group, Switch, Select

**Wave 3 — Form composition**
Field (wraps Label + an input atom + help/error text)

**Wave 4 — Layout & navigation**
Card, Item, Tabs, Breadcrumb, Navigation Menu

**Wave 5 — Overlays (share one elevation/surface + focus-trap pattern)**
Tooltip, Popover, Dropdown Menu, Dialog, Alert

**Wave 6 — Data display**
Table

Button is done and sits underneath Wave 4 (Card actions) and Wave 5 (Dialog confirm/cancel) as a dependency.

---

## What this unblocks

Once Wave 0's two token additions ship, three prohibitions above (Badge status variants, Alert status variants, Field error-state color) resolve themselves without touching any other contract — that's the actual payoff of doing token work before component work, rather than inventing a red for Alert today and a different red for Badge next week.

---

## Note on contract file location

Governance rule 1 above states the path as `/contracts/<component>.md`. In this repository the contracts live at `docs/contracts/<component>.md`. The rule's intent — one contract file per component, in the same repo as the site — holds; only the directory differs. Update rule 1 in a patch-level revision if you want the written path to match reality.
