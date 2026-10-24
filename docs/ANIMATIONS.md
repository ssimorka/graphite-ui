# Motion

Every animation and transition in the codebase, what drives it, and what it does
under `prefers-reduced-motion`.

This file is written by hand, not generated. Nothing checks it, so it goes stale
the way `docs/components/` does rather than the way the contracts do — if you
change motion code, change this too. Where a component's motion is
contract-governed, the contract is the authority and this file only describes it.

## Tokens

From the kit's `Motion` collection (2026-10-24), declared on `:root` in
`app/globals.scss` and checked against the snapshot by `token-drift`. The rules
and the reasons are in `docs/contracts/foundations/motion.md`.

| Token | Value | Use |
|---|---|---|
| `--graphite-motion-duration-instant` | 0ms | Keyboard-opened and frequent UI |
| `--graphite-motion-duration-fast` | 120ms | Hover color, toggles, indicators, exits |
| `--graphite-motion-duration-base` | 200ms | Popovers, toasts, scrims, panels; a cascade's span |
| `--graphite-motion-duration-slow` | 300ms | Dialogs, drop panels, sheets |
| `--graphite-motion-duration-emphasis` | 400ms | The cap: the hero rise, scroll reveal, the glow |
| `--graphite-motion-delay-tooltip` | 500ms | First tooltip hover only |
| `--graphite-motion-easing-out` | `cubic-bezier(0.2, 0, 0, 1)` | Enter and exit; the default |
| `--graphite-motion-easing-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Moving across the screen: the day-night wheel, loops |
| `--graphite-motion-easing-linear` | `linear` | Progress, spinners, and the hero spotlight's tracking |
| `--graphite-motion-spring-sheet` | `linear()`, critically damped | Code only: the mobile nav tray and Create's sheets |

Two code-only values sit beside them: `--graphite-motion-indeterminate`
(1400ms, the period of every loop, which the cap does not govern) and
`--graphite-motion-travel` (1, or 0 under reduced motion, multiplying every
movement distance).

**No raw timing is left.** `naming-check` fails on a duration, `cubic-bezier(`
or keyword easing in any stylesheet under `app/` or `components/`. There were
ninety when the collection landed. An exception has to be argued with
`motion-allow: <reason>` in the comment above it; there are none.

## Easing vocabulary

**Out, `--graphite-motion-easing-out`.** Everything that enters or leaves:
scroll reveal, hero rise, view-switch fade, the overlay entrance, the carousel's
body reveal, hovers, the tray's exit. It replaced both the site's old settle
curve (`cubic-bezier(0.16, 1, 0.3, 1)`) and the plain `ease` that Toggle and the
cover kept apart from it.

**In-out.** Something already on screen moving across it: the day-night wheel,
and the waveform and skeleton loops.

**Linear.** Progress, spinners, and one exception: `.hero__spotlight`, whose
transition restarts on every `pointermove`, where an ease-out decelerates each
hop so the light rubber-bands behind the cursor instead of tracking it.

**No springs that overshoot, no ease-in.** The drop panels, the tray, the
Create bar, the menu glyph, the dice and the sparkle all overshot on
`cubic-bezier(0.34, 1.56, 0.64, 1)`; the tray left on an ease-in. All of it now
lands on Out, and the tray and Create's sheets slide on the sheet spring.

## Page-level motion

Marketing and docs surfaces, all in `app/globals.scss`.

| Motion | Selector | Duration | Easing | Trigger |
|---|---|---|---|---|
| Scroll reveal | `.reveal` | `emphasis` | Out | `IntersectionObserver`, once per element |
| Hero entrance | `.hero__source-strip` / `hero-rise` | `emphasis` | Out | Mount, one-shot |
| Hero parallax | `.hero__spotlight`, `.hero__grid-lines` | continuous | — | `pointermove` + `scroll` via rAF |
| Band grid parallax | `.page-bands__grid` | continuous | — | `scroll` via rAF, from `page-bands.tsx` |
| Spotlight tracking | `.hero__spotlight` | `fast` | Linear | Pointer position rewrite |
| View-switch fade | `.cap-stage__frame` / `fade-swap` | `slow` | Out | Remount on `key={item.key}` |
| Cover reveal | `.art__cover` / `cover-in` | `slow` | Out | Mount, one-shot |
| Cover hint | `.art__cover-hint` | `fast` | Out | Hover / focus on the cover |
| Carousel rail fill | `.cap-item__fill` | scroll-driven | — | `scroll` via rAF, the same reading that picks the panel |
| Carousel body reveal | `.cap-item__reveal` / `cap-reveal` | `base` | Out | Mount, when the item becomes active |
| Carousel item state | `.cap-item`, `.cap-item__trigger` | `base` / `fast` | Out | Selection change, hover |
| Theme swap | `html`, `body`, `.cds--*` | `base` | Out | Theme toggle |
| Ramp swatch hover | `.ramp-swatch` | `base` | Out | Pointer over a swatch |
| Wall card hover | `.card` glow, `.card .preview` | `slow` | Out | Pointer over a component card |
| Info card hover | `.door` glow, `.door .artefact` | `base` | Out | Pointer over a door |
| Header nav hover | `.navLink`, `.navIndicator` | `fast` | Out | Pointer over a nav item |
| Drop panels | `_drop-panel.scss` / `drop`, `caret`, `glow`, `rise` | `slow` drop, `base` caret, `emphasis` glow, `base` rise | Out | Open: the color picker drops from its trigger, the caret grows, the tint rises, sections cascade inside one `base` span. Search no longer drops: it appears at once |
| Search palette | `search-palette.module.scss` / `spin` | half `indeterminate` spinner | Linear | While a query resolves. The palette itself has no entrance |
| Mobile nav tray | `.trayPanel` / `tray-in`, `tray-out`, `tray-item-in`, `glow` | `slow` in, `fast` out, `base` items | sheet spring; Out | Menu button. Links cascade per group; the menu glyph turns on each swap (`menu-icon-in`, `base`) |
| Create controls | `controls.module.scss` / `up`, `drop`, `glow`, `rise` | `slow` | Out; sheet spring for the sheets | Mount (bar, panel), open (sheets). Bar and sheets rise from the bottom; the panel drops |
| Hero strip glow | `.hero__source-strip` / `glow`, `rise` | `emphasis`; `base` | Out | Mount, after `hero-rise`; the four ramps and the footer cascade |
| Card glow | `--glow` on cards | `slow` | Out | Hover on the docs next cards, wall cards, index cards and doors |
| Next card drop | `.nextCard` padding | `slow` | Out | Hover, 4px |
| Index card drop | `.previewInner` | `slow` | Out | Hover on a governed card, 4px |
| Create preview cards | `live-audio-waveform` / `pulse`, `skeleton` / `sweep` | half `indeterminate`; `indeterminate` | In-out | Infinite, inside the Create preview |

Every value above is a token. The literals this table used to list (700, 900,
690, 500, 320, 300, 180 and 160ms, and the 1.6s sweep) each moved to the
nearest step, and anything past the 400ms cap came down to `emphasis`.

**The hover durations come from the kit, not from here.** `Read Me — Hover
states` (13463:16977) documents the Home prototype's 195 hover reactions and
fixes two durations: 240ms ease-out for the ramp swatch and the Info cards
(now `base`, 200ms, the nearest step of the Motion collection), 300ms ease-out
for the component card (`slow`), which moves its border and its preview
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

**The spring is the sheet spring.** `--graphite-motion-spring-sheet`, on the
tray and Create's sheets. It used to be `cubic-bezier(0.34, 1.56, 0.64, 1)`, an
overshoot, on every panel; the kit's rule is no bounce, so the drop panels land
on Out and only the edge-anchored sheets keep a spring, a critically damped
one.

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
the marketing page. Each moving component records its motion in a `motion:`
block in its contract (trigger, property, duration token, easing token,
reduced-motion behaviour), and `drift-check` holds the block and the code to
each other both ways.

| Component | Motion | Duration | Easing |
|---|---|---|---|
| Button | background and color on hover and press; the press is instant | `fast` | Out |
| Toggle | track background, thumb slide | `fast` | Out |
| Tooltip | first hover waits `delay-tooltip`, then grows from the caret; instant from the keyboard and while one is showing or within 300ms of one closing | `fast` | Out |
| Popover | grows from the caret; fast exit | `base` in, `fast` out | Out |
| Menu | grows from the trigger's corner; instant from the keyboard; the chosen row flashes, then a fast exit | `base` in, `fast` flash and out | Out |
| Dropdown list | grows from the trigger edge; instant from the keyboard; the chevron turns | `fast` | Out |
| Modal | scrim fades, panel rises 8px; both leave together | `base` scrim, `slow` panel, `fast` out | Out |
| Toast | bottom only, one at a time, queued; rises 16px, drops 8px on the way out | `base` in, `fast` out | Out |
| Notification | height and opacity, with `appear`; the reverse when closed | `base` in, `fast` out | Out |
| Accordion | panel height via `grid-template-rows`, chevron turns 180° | `base` | In-out |
| Accordion trigger | background on hover | `fast` | Out |
| Tabs | the selected indicator slides between tabs; the panel swaps at once | `fast` | In-out |
| Data table expand | chevron turns 180° | `fast` | Out |
| Menu buttons | the chevron turns 180° while the menu is open | `fast` | Out |
| Progress, determinate | width | `base` | Linear |
| Progress, indeterminate | `graphite-progress-sweep`, infinite | `indeterminate` | Linear |
| Modal inline loading | `modal-spin`, infinite | `indeterminate` | Linear |
| File uploader, uploading | `uploader-spin`, infinite | `indeterminate` | Linear |

### The overlay motion

One partial, `components/ui/_overlay-motion.scss`, gives Popover, Tooltip, Menu
and Dropdown's list one entrance and one exit; Modal has its own (a scrim and a
rising panel), on the same tokens.

**It grows from the source.** Opacity, and the individual `scale` property from
0.96, with the origin on the caret's tip or the trigger's corner. It never
animates `transform`: Tooltip and Popover carry their placement in `transform`,
and an animated transform would overwrite the position it grew from.

**It has an exit now.** `usePresence` (in `overlay.tsx`) holds a closing overlay
mounted, inert, with `data-state="closed"`, for the fast step, then unmounts
it. Presence starts from `open`, so a closed overlay is never rendered at all,
and Popover's no-nesting throw still only fires once its parent has opened.
Tooltip has no exit on purpose: the next one along a toolbar appears at once,
and one fading out beside it would read as two.

**From the keyboard it is instant.** `overlay.tsx` records whether the last
gesture was a key press (`openedByKeyboard`), and an overlay opened by one
carries `data-instant`, which drops the entrance.

**Under reduced motion it fades.** The scale rides `--graphite-motion-travel`.

### Sheets you can catch

`components/use-sheet-drag.ts` drags the mobile nav tray (to the left) and
Create's option sheets (down) toward the edge they came from. A press while the
sheet moves (its entrance, a spring back, a fling away) reads where it is right
now through the Web Animations API, cancels the movement there, and hands it to
the pointer. On release it springs home on `--graphite-motion-spring-sheet`, or
leaves if it has travelled past a third of its size or is flung faster than
0.5px/ms. Under reduced motion the pointer still moves it; the release jumps.

### Command search is instant

The search palette appears with no entrance at all: no scrim fade, no drop, no
caret pop, no cascade. It is opened from the keyboard and many times a session,
which is exactly what the kit's rules make instant.

## Reduced motion

One global layer in `globals.scss` now sits under everything below: it sets
`--graphite-motion-travel: 0`, so any distance written through it collapses and
a rise becomes a fade, and it narrows every transition to properties that do not
move anything. `[data-motion='reduce']` applies the same to a subtree. The
per-component blocks below predate it and still hold; a new component needs only
to write its distances through `--graphite-motion-travel`.

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
| Search palette | Spinner removed |
| Create preview, waveform, skeleton | Transitions and loops removed |
| Progress | Determinate transition removed; the sweep stretches to twice `indeterminate` |
| Data table | Expand chevron transition removed |
| Modal | Inline-loading spinner stretches to twice `indeterminate` |

Four are handled in JavaScript rather than CSS. `use-reveal.ts` reports visible immediately, so
the observer never runs. `hero.tsx` and `page-bands.tsx` each return before
attaching their scroll listener, so `--sy` stays at its default and the effect
never exists — the band grid needs no rule of its own for the same reason the
hero's parallax needs one only for its transitions. `capabilities.tsx` needs no
more than its smooth scroll switched off: the carousel is driven by the reader's
own scrolling, so under reduced motion clicking a title jumps to its panel.

**The progress sweep slows rather than stops.** A frozen indeterminate bar reads
as a broken one, so it stretches to twice `indeterminate` (2.8s) and stays
legible.

### `transform: none` is usually the wrong reflex

It is the obvious neutraliser and it breaks layout wherever `transform` is also
doing positioning, which in this codebase is common:

- `.art__cover-hint` uses `-50%` to centre against `left: 50%`. Clearing the
  transform shifts it about 83px right. Its travel is written through
  `--graphite-motion-travel` instead, so reduced motion drops only the travel
  and the centring stays, with no override at all.
- Tooltip's side placements and its centred alignment carry their position in a
  transform. This is why the overlay entrance animates opacity and nothing else.

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

- **The kit has no distance scale.** Travels still borrow the spacing scale and
  multiply it by `--graphite-motion-travel`; whether the kit wants `distance/*`
  is open.
