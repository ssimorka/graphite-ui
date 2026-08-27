# Slider

Lets users increase or decrease a value by moving a handle along a horizontal track. Comes in single-value and range (two-handle) forms.

**Figma:** [Slider](https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo/Graphite-UI-Kit?node-id=3673-40574)
**Figma node IDs:** `3673:40574` (Slider), `41061:1531` (Slider - Range) — page "02 Components – Slider"
**Internal building blocks (do not use directly):** `_Slider left rail`, `_Slider item`, `_Slider - Range handle`, `_Slider - Range slider track`

## Variant properties — Slider

| Property | Options |
|---|---|
| Status | Enabled, Hover, Focus, Active, Error, Warning, Disabled, Read-only, Skeleton |

## Variant properties — Slider - Range

| Property | Options |
|---|---|
| Inputs | False, True |
| State | Enabled, Hover, Active, Disabled, Focused, Skeleton, Read only, Hover + Error, Active + Error, Focused + Error, Hover + Warning, Active + Warning, Focused + Warning |
| Handle | None, Left, Right |

## Other properties

| Property | Type | Notes |
|---|---|---|
| Warning / Error text | Text | validation copy |
| Min range text / Max range text (Range only) | Text | bound endpoints |
| Inputs (Range only) | Boolean | shows/hides paired numeric inputs next to the track |

## When to use

- **Slider** — single value along a range (volume, brightness, single threshold).
- **Slider - Range** — selecting a band between two values (price range, date range as numbers).

## Do / Don't

- Do enable `Inputs = True` on Range when precise values matter more than visual estimation.
- Don't use Slider for a small, discrete set of options — Radio button or Segmented control communicates that better than a continuous track.

---
*Generated from Figma component sets `3673:40574` / `41061:1531` — regenerate if variant properties change.*
