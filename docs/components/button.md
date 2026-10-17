# Button

Starts an action. Buttons come in two colour families with the same three ranks: violet Primary, Outlined and Ghost, and green Secondary, Secondary outlined and Secondary ghost. Danger primary and Danger ghost are for destructive actions only.

**Figma:** [Button component set](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=1854-1776)
**Figma node ID:** `1854:1776` (component set, page "02 Components – Button")

## Variant properties

| Property | Options |
|---|---|
| Style | Primary, Outlined, Ghost, Secondary, Secondary outlined, Secondary ghost, Danger primary, Danger ghost |
| Type | Text + Icon, Icon only |
| Size | Expressive, 2x large, Extra large, Large (default), Medium, Small |
| State | Enabled, Hover, Focus, Active, Disabled, Skeleton |

456 variants. Not every Style × Type × Size × State combination exists: Icon only is not built out at every size. Check the component set in Figma before assuming a combination is there.

## Geometry

Read from the component set, not from the contract. The frame itself carries no padding or radius: layout lives in an inner `Button content` frame.

| Size | Height | Font size / line-height |
|---|---|---|
| Small | 32px | 12 / 16 |
| Medium | 42px | 14 / 20 |
| Large | 50px | 14 / 20 |
| Expressive | 50px | 16 / 24 |
| Extra large | 66px | 14 / 20 |
| 2x large | 82px | 14 / 20 |

- **Padding** (`Button content`): `15px 64px 15px 16px`. The large right inset is deliberate: it is the space the trailing icon sits in, and it gives a Carbon button its left-aligned label. The outlined styles use the same padding as the filled styles.
- **Corner radius:** `0` on every variant.
- **Gap:** `0`. The icon is positioned by the right padding, not by a gap.
- **Border:** 1px, inside, on the two outlined styles only.
- **Icon:** 24×24 frame at the trailing edge, holding an icon instance (`fi-rs-plus-small` in the shipped variants).

## Tokens

Resolved from the component set's bound variables, all semantic tier, never primitives. Names below are the Figma variable names; in code they are `--graphite-*` variables (`state/primary-hover` is `--graphite-primary-hover`).

| Style | Fill | Label and icon | Border |
|---|---|---|---|
| Primary | `primary` | `onPrimary` | none |
| Outlined | `transparent` | `primary` | `primary` |
| Ghost | `transparent` | `primary` | none |
| Secondary | `secondary` | `onPrimary` | none |
| Secondary outlined | `transparent` | `secondary` | `secondary` |
| Secondary ghost | `transparent` | `secondary` | none |
| Danger primary | `danger` | `onPrimary` | none |
| Danger ghost | `transparent` | `danger` | none |

- **Hover and pressed:** filled styles use their `state/*-hover` and `state/*-pressed` roles. Outlined and ghost styles use a `surfaceVariant` fill with a `state/primary-hover` or `state/secondary-hover` label.
- **Focus:** `state/primary-focus-ring`, 2px, on every style except the danger ones.
- **Disabled:** `state/*-disabled` and `state/*-disabled-content`. Outlined borders use `outlineSubtle`.
- **Contrast, light / dark, default source:** `primary` on `background` 9.28 / 9.39. `secondary` on `background` 8.33 / 10.04. `onPrimary` on `secondary` 8.29 / 10.36. The engine measures all of these at the theme's target for every source.

**Typography:** `family/font-2` (IBM Plex Sans), weight `weight/medium`.

## When to use

| Rank | Violet family | Green family |
|---|---|---|
| Filled | Primary | Secondary |
| Outlined | Outlined | Secondary outlined |
| Text | Ghost | Secondary ghost |

- **Filled** finishes the job of its group. Primary is the view's main job, at most one per view or form. Secondary is a strong action that isn't the main job: a card, a row, a sheet section.
- **Outlined** is a real alternative the user may want: Back, Cancel, Not now, Edit, or picking a different path (Start empty, Pick another backup, 5 more minutes).
- **Text** (ghost) is for skipping a step or low-stakes tools: Skip for now, Learn more, Shuffle, Share, Export.
- **Danger primary** replaces a filled button when the action destroys something. **Danger ghost** is a destructive action that isn't the main one, such as Remove in a list row.

## Picking the Primary

Name the job of the view first. The button that finishes that job is the Primary: Save, Apply, Continue, Send. Actions that explore, preview or branch off the job (Shuffle, Edit in another tool, Share, Export) are outlined or ghost, even when they are fun or prominent. If nothing on the view finishes a job, there is no Primary.

## Pairing rules

- One filled button per group. Primary, Secondary and Danger primary never sit next to each other.
- The filled button goes last: trailing edge in a row, bottom in a stack.
- Its partner comes from the same family. Primary pairs with Outlined or Ghost. Secondary pairs with Secondary outlined or Secondary ghost. Danger primary pairs with Ghost.
- Outlined when the other choice is real (Cancel a form). Ghost when it is an escape hatch (Skip).
- Two outlined, or two ghost, buttons can sit together. Two filled never can. Don't mix families in one group.
- When two buttons don't fit side by side, stack them full width with the filled button at the bottom.
- Repeated rows (a list where every row has its own action) count as separate groups.

In code, `ButtonGroup` enforces the first three and throws at render when one is broken (`docs/contracts/button-group.md`).

## Exempt

- Specimen rows that show every style side by side on purpose.
- Combo button (Menu buttons): the action and its dropdown arrow are one split control, so both halves match.
- Skeleton placeholders are not exempt. They follow the rules so the check stays clean.

## Do / Don't

- Do keep one Primary button per view or form.
- Do use the Skeleton state for loading placeholders, not a disabled Primary button.
- Don't put two filled buttons next to each other. Demote one to outlined or ghost from the same family.
- Don't mix button sizes within the same toolbar or form.
- Don't use Icon only without an accessible label (`aria-label` or equivalent) in code.

---
*Generated from Figma component set `1854:1776`, 2026-08-28; two colour families, Outlined, Secondary outlined and Secondary ghost added 2026-10-17. Regenerate if variant properties or tokens change.*
