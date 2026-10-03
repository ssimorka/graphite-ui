# Motion

Every animation and transition in the codebase, what drives it, and what it does
under `prefers-reduced-motion`.

This file is written by hand, not generated. Nothing checks it, so it goes stale
the way `docs/components/` does rather than the way the contracts do — if you
change motion code, change this too. Where a component's motion is
contract-governed, the contract is the authority and this file only describes it.

## Tokens

Five, all declared on `:root` in `app/globals.scss`.

| Token | Value | Used by |
|---|---|---|
| `--graphite-motion-fast` | 120ms | Button, Toggle, the four overlay entrances, Accordion trigger, search palette, header nav and controls, footer links, hero spotlight |
| `--graphite-motion-base` | 240ms | Accordion panel and chevron, Capabilities carousel item state and body reveal, ramp swatch and Info card hovers, Create preview |
| `--graphite-motion-indeterminate` | 1400ms | Progress bar's indeterminate sweep |
| `--graphite-motion-ease` | `cubic-bezier(0.16, 1, 0.3, 1)` | Everything on the settle curve |
| `--graphite-motion-indeterminate-ease` | `cubic-bezier(0.65, 0, 0.35, 1)` | The sweep only |

**The Figma kit has no motion variables.** None of its sixteen collections covers
duration or easing, so a designer cannot bind one and re-invents a number per
frame. That gap is tracked in the site blueprint, not here.

## Easing vocabulary

**The settle curve, `--graphite-motion-ease`.** Anything entering the viewport or
replacing content: scroll reveal, hero rise, view-switch fade, the overlay
entrance, the carousel's body reveal.

**Plain `ease`.** Short mechanical moves that are not entrances: Toggle's track
and thumb, Progress determinate, the cover reveal, theme and link transitions.
Toggle's contract records this explicitly so the curve is not "corrected" onto
it later.

**`linear`.** One case only, `.hero__spotlight`. Its transition restarts on every
`pointermove`, and an ease-out decelerates each hop so the light rubber-bands
behind the cursor instead of tracking it. The duration is tokenised; the easing
is deliberate.

## Page-level motion

Marketing and docs surfaces, all in `app/globals.scss`.

| Motion | Selector | Duration | Easing | Trigger |
|---|---|---|---|---|
| Scroll reveal | `.reveal` | 700ms | settle | `IntersectionObserver`, once per element |
| Hero entrance | `.hero__source-strip` / `hero-rise` | 900ms | settle | Mount, one-shot |
| Hero parallax | `.hero__spotlight`, `.hero__grid-lines` | continuous | — | `pointermove` + `scroll` via rAF |
| Band grid parallax | `.page-bands__grid` | continuous | — | `scroll` via rAF, from `page-bands.tsx` |
| Spotlight tracking | `.hero__spotlight` | `fast` | linear | Pointer position rewrite |
| View-switch fade | `.cap-stage__frame` / `fade-swap` | 500ms | settle | Remount on `key={item.key}` |
| Cover reveal | `.art__cover` / `cover-in` | 320ms | ease | Mount, one-shot |
| Cover hint | `.art__cover-hint` | 160ms | ease | Hover / focus on the cover |
| Carousel rail fill | `.cap-item__fill` | scroll-driven | — | `scroll` via rAF, the same reading that picks the panel |
| Carousel body reveal | `.cap-item__reveal` / `cap-reveal` | `base` | settle | Mount, when the item becomes active |
| Carousel item state | `.cap-item`, `.cap-item__trigger` | `base` / `fast` | ease | Selection change, hover |
| Theme swap | `html`, `body`, `.cds--*` | 180ms | ease | Theme toggle |
| Ramp swatch hover | `.ramp-swatch` | `base` | ease-out | Pointer over a swatch |
| Wall card hover | `.card` glow, `.card .preview` | 300ms | ease-out | Pointer over a component card |
| Info card hover | `.door` glow, `.door .artefact` | `base` | ease-out | Pointer over a door |
| Header nav hover | `.navLink`, `.navIndicator` | `fast` | settle | Pointer over a nav item |
| Drop panels | `_drop-panel.scss` / `drop`, `caret`, `glow`, `rise` | 520ms drop, 360ms caret, 900ms glow, 420ms rise | spring; settle | Open: search palette and color picker drop from their trigger, the caret pops, the tint rises, sections cascade |
| Search palette (phone) | `search-palette.module.scss` / `in`, `spin` | `fast` fade; 690ms spinner | settle; linear | Open below 672px; while a query resolves |
| Mobile nav tray | `.trayPanel` / `tray-in`, `tray-out`, `tray-item-in`, `glow` | 560ms in, 220ms out, 420ms items | spring; ease-in; settle | Menu button. Links cascade per group; the menu glyph spins on each swap (`menu-icon-in`, 360ms) |
| Create controls | `controls.module.scss` / `up`, `drop`, `glow`, `rise` | 520 to 560ms | spring | Mount (bar, panel), open (sheets). Bar and sheets rise from the bottom; the panel drops |
| Hero strip glow | `.hero__source-strip` / `glow`, `rise` | 900ms; 420ms | settle | Mount, after `hero-rise`; the four ramps and the footer cascade |
| Card glow | `--glow` on cards | 300ms | ease-out | Hover on the docs next cards, wall cards, index cards and doors |
| Next card drop | `.nextCard` padding | 300ms | ease-out | Hover, 4px |
| Index card drop | `.previewInner` | 300ms | ease-out | Hover on a governed card, 4px |
| Create preview cards | `live-audio-waveform` / `pulse`, `skeleton` / `sweep` | 900ms; 1.6s | — | Infinite, inside the Create preview |

The 700ms, 900ms, 690ms, 500ms, 320ms, 300ms, 200ms, 180ms and 160ms values,
and the 1.6s sweep, are literals. They have no token, and minting one per call site would trade a
readable number for an indirection that explains nothing.

**The hover durations come from the kit, not from here.** `Read Me — Hover
states` (13463:16977) documents the Home prototype's 195 hover reactions and
fixes two durations: 240ms ease-out for the ramp swatch and the Info cards,
300ms ease-out for the component card, which moves its border and its preview
together. Those are the only two the prototype states; everything else it
leaves without a transition object, which in code means the component's own
timing governs, Button on `fast`.

**Where the site has hovers the kit does not.** That Read Me lists its own
gaps: the header nav links, the Search field, the GitHub icon and the whole
footer bar carry no hover interaction in the prototype. The site adds them
anyway. A nav item that does not answer the pointer reads as broken, and
governance rule 7's tie-break says the code keeps its own where the kit has no
opinion. They are listed above so the difference is on the record rather than
discovered later.

**Stagger lives in the panels, not in `Reveal`.** `Reveal` still fires flat
everywhere. The drop panels, the tray and the Create bar cascade their own
sections with `nth-child` delays (`drop.cascade` in `_drop-panel.scss`), on
open only.

**The spring, `cubic-bezier(0.34, 1.56, 0.64, 1)`.** A literal in
`_drop-panel.scss` (`$spring`) and the tray. It overshoots, which is the point
for a panel landing; it is not on the token list because nothing outside these
entrances should use it.

**Exits.** The tray is the one panel with an exit: it stays mounted and `inert`
through its slide-out and a timer unmounts it, since it has no nesting throw to
protect. Panels whose subtree holds `position: fixed` children (the Create bar
and panel) fill their entrance `backwards` only, so no transform survives the
animation to trap those children.

**The glow is a registered property.** `--glow` is declared with `@property`,
so the tint's height can transition like any other value, on entrance and on
card hover.

**The carousel has no timer.** From 1056px, 03 Capabilities is a tall scroll
track (`$cap-dwell`, 500px per capability) with its content stuck to the
viewport, and reading position picks the panel. `.cap-item__fill` is written
from the same scroll reading rather than given a keyframe, so the rail cannot
show a different progress than the one doing the selecting. Its only CSS is the
resting `scaleY(0)`. Nothing advances on its own, so there is no pause control:
the reader is what moves it. Below 1056px all six capabilities render stacked
and open, with no rail, count or selection.

## Component motion

Contract-governed, so it ships wherever the component renders rather than only on
the marketing page.

| Component | Motion | Duration | Easing |
|---|---|---|---|
| Button | background, border-color, color on hover/active, plus a 1px press displacement | `fast` | settle |
| Toggle | track background, thumb transform | `fast` | ease |
| Tooltip | entrance fade, `overlay-in` | `fast` | settle |
| Popover | entrance fade, `overlay-in` | `fast` | settle |
| Menu | entrance fade, `overlay-in` | `fast` | settle |
| Modal | entrance fade on the scrim, `overlay-in` | `fast` | settle |
| Accordion | panel height via `grid-template-rows` 0fr → 1fr, chevron rotates 180° | `base` | settle |
| Accordion trigger | background on hover | `fast` | ease |
| Progress, determinate | width | 200ms | ease |
| Progress, indeterminate | `graphite-progress-sweep`, infinite | `indeterminate` | `indeterminate-ease` |

### The overlay entrance

Stated once in `docs/contracts/overlay.md`; Tooltip, Popover, Menu and Modal each
declare `motion` in their own contract so `drift-check` can hold them to it,
exactly as they each declare their own surface rather than inheriting it
silently.

**Opacity only.** Tooltip carries its placement in `transform`, a different value
per side, so an animation that moved would overwrite the position it was moving
to — animations beat regular declarations.

**No exit.** All four unmount their content on close, so an exit is not
reachable from CSS. It is also not free: Popover's no-nesting prohibition is a
throw that stays off the prerender path only because content does not exist until
the Popover is open. Holding a closed overlay mounted to animate it out would
move that throw to build time.

Each stylesheet defines its own `overlay-in`. CSS Modules scopes keyframe names,
so the four compile to distinct identifiers and cannot collide.

## Reduced motion

Everything that moves is covered. The table groups the blocks by what they
neutralise rather than counting them.

| Where | Treatment |
|---|---|
| `.reveal` | Revealed immediately, transition removed |
| `.hero__source-strip` | `animation: none` |
| `.hero__spotlight`, `.hero__grid-lines` | Transforms and transitions removed |
| `.page-bands__grid` | Listener never attaches, so `--sy` holds at 0 |
| `.art__cover` | `animation: none` |
| `.art__cover-hint` | Travel removed, fade kept |
| `.cap-stage__frame`, `.cap-item__reveal` | `animation: none` |
| `.ramp-swatch` | Transition removed; the scale stays, as it is the whole affordance |
| Wall card, Info card | Transitions and movement removed |
| Drop panels, tray, Create controls, hero glow | Entrances, cascades and the glow removed; the tray and the Create sheets fade instead |
| Next cards, index cards | Transitions and the 4px drop removed |
| Button | Transition and press displacement removed |
| Toggle | Transitions removed |
| Tooltip, Popover, Menu, Modal | `animation: none` |
| Accordion | Panel opens without a transition |
| Search palette (phone) | Fade and spinner removed |
| Create preview, waveform, skeleton | Transitions and loops removed |
| Progress | Determinate transition removed; the sweep stretches to 3s |

Four are handled in JavaScript rather than CSS. `use-reveal.ts` reports visible immediately, so
the observer never runs. `hero.tsx` and `page-bands.tsx` each return before
attaching their scroll listener, so `--sy` stays at its default and the effect
never exists — the band grid needs no rule of its own for the same reason the
hero's parallax needs one only for its transitions. `capabilities.tsx` needs no
more than its smooth scroll switched off: the carousel is driven by the reader's
own scrolling, so under reduced motion clicking a title jumps to its panel.

**The progress sweep slows rather than stops.** A frozen indeterminate bar reads
as a broken one, so it stretches to 3s and stays legible.

### `transform: none` is usually the wrong reflex

It is the obvious neutraliser and it breaks layout wherever `transform` is also
doing positioning, which in this codebase is common:

- `.art__cover-hint` uses `-50%` to centre against `left: 50%`. Clearing the
  transform shifts it about 83px right. The override pins
  `translate(-50%, 0)` instead, keeping the centring and dropping only the
  travel.
- Tooltip's four placement classes each carry a different transform. This is why
  the overlay entrance animates opacity and nothing else.

Neutralise the axis that moves, not the whole property.

## Verifying motion

A hidden preview pane freezes `document.timeline`, and a frozen clock makes
`getComputedStyle` report an animation's backwards fill forever. A correct
entrance reads as `opacity: 0` and looks like a bug.

**The same pane also never hydrates.** Every `.reveal` on the page sits at
`opacity: 0`, no control responds, and DOM nodes carry no `__reactFiber$` key —
on pages the change under test does not touch, which is the tell. Confirm it
against `/docs` before spending time on a component: if the theme toggle there
is dead too, the pane is the problem. What still works is the server render, so
a panel can be inspected by making it the one that renders on load.

Sample the effect directly instead:

```js
const a = el.getAnimations()[0]
a.pause()
a.currentTime = 120
getComputedStyle(el).opacity   // the value at 120ms
a.finish(); a.play()
```

## Open

- **The kit has no motion variables**, so none of this is bindable design-side.
