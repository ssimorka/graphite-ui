// Pure color logic: sRGB/OKLab conversion, WCAG contrast, tonal ramps,
// semantic theme mapping, interaction states, and exporters.
// No React here. See CLAUDE.md for the model this file implements.

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n))
}

function round1(n) {
  return Math.round(n * 10) / 10
}

function kebab(s) {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
}

// ---------- hex / rgb ----------

export function normalizeHex(hex) {
  let h = hex.trim()
  if (!h.startsWith('#')) h = '#' + h
  if (h.length === 4) {
    h =
      '#' +
      h
        .slice(1)
        .split('')
        .map((c) => c + c)
        .join('')
  }
  return h.toLowerCase()
}

export function hexToRgb(hex) {
  const h = normalizeHex(hex).slice(1)
  const num = parseInt(h, 16)
  return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 }
}

export function rgbToHex({ r, g, b }) {
  const c = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, '0')
  return `#${c(r)}${c(g)}${c(b)}`
}

// ---------- HSV (for the visual picker) ----------

export function hexToHsv(hex) {
  const { r, g, b } = hexToRgb(hex)
  const rr = r / 255
  const gg = g / 255
  const bb = b / 255
  const max = Math.max(rr, gg, bb)
  const min = Math.min(rr, gg, bb)
  const d = max - min

  let h = 0
  if (d !== 0) {
    if (max === rr) h = ((gg - bb) / d) % 6
    else if (max === gg) h = (bb - rr) / d + 2
    else h = (rr - gg) / d + 4
    h *= 60
    if (h < 0) h += 360
  }

  const s = max === 0 ? 0 : d / max
  const v = max
  return { h, s, v }
}

export function hsvToHex({ h, s, v }) {
  const c = v * s
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = v - c
  let rr = 0
  let gg = 0
  let bb = 0

  if (h < 60) {
    rr = c
    gg = x
  } else if (h < 120) {
    rr = x
    gg = c
  } else if (h < 180) {
    gg = c
    bb = x
  } else if (h < 240) {
    gg = x
    bb = c
  } else if (h < 300) {
    rr = x
    bb = c
  } else {
    rr = c
    bb = x
  }

  return rgbToHex({ r: (rr + m) * 255, g: (gg + m) * 255, b: (bb + m) * 255 })
}

// ---------- sRGB <-> linear ----------

function srgbToLinear(c255) {
  const c = c255 / 255
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function linearToSrgb255(c) {
  const clamped = clamp(c, 0, 1)
  const s =
    clamped <= 0.0031308
      ? clamped * 12.92
      : 1.055 * Math.pow(clamped, 1 / 2.4) - 0.055
  return Math.round(clamp(s, 0, 1) * 255)
}

// ---------- OKLab (Bjorn Ottosson) ----------

function linearRgbToOklab({ r, g, b }) {
  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b

  const l_ = Math.cbrt(l)
  const m_ = Math.cbrt(m)
  const s_ = Math.cbrt(s)

  return {
    L: 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_,
    a: 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_,
    b: 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_,
  }
}

function oklabToLinearRgb({ L, a, b }) {
  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ ** 3
  const m = m_ ** 3
  const s = s_ ** 3

  return {
    r: 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    g: -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    b: -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  }
}

function hexToOklab(hex) {
  const rgb = hexToRgb(hex)
  const linear = {
    r: srgbToLinear(rgb.r),
    g: srgbToLinear(rgb.g),
    b: srgbToLinear(rgb.b),
  }
  return linearRgbToOklab(linear)
}

function oklabToHex(lab) {
  const linear = oklabToLinearRgb(lab)
  return rgbToHex({
    r: linearToSrgb255(linear.r),
    g: linearToSrgb255(linear.g),
    b: linearToSrgb255(linear.b),
  })
}

// ---------- WCAG contrast ----------

export function relativeLuminance(hex) {
  const rgb = hexToRgb(hex)
  const R = srgbToLinear(rgb.r)
  const G = srgbToLinear(rgb.g)
  const B = srgbToLinear(rgb.b)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

export function contrastRatio(hexA, hexB) {
  const La = relativeLuminance(hexA)
  const Lb = relativeLuminance(hexB)
  const lighter = Math.max(La, Lb)
  const darker = Math.min(La, Lb)
  return (lighter + 0.05) / (darker + 0.05)
}

// ---------- tonal ramps ----------

// Stops at 98 rather than 100: at true L=1 the in-gamut chroma is always 0
// for any hue, so a tone-100 stop would always render as literal #ffffff.
// 98 keeps a faint hue tint instead. Semantic roles that need true white
// (e.g. onPrimary) still resolve tone 100 directly through the continuous
// ramp function below, so this only changes what the primitives grid shows.
export const TONE_STOPS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 98]

function inGamut(linear) {
  const eps = 1e-4
  return (
    linear.r >= -eps &&
    linear.r <= 1 + eps &&
    linear.g >= -eps &&
    linear.g <= 1 + eps &&
    linear.b >= -eps &&
    linear.b <= 1 + eps
  )
}

// Largest chroma at this L/hue that still lands inside the sRGB gamut, up to
// upperBound. Without this, a fixed chroma clips per-channel near L 0/100
// instead of desaturating, so a saturated ramp never reaches true black or
// white and on-colors pinned to those tones can be mathematically unfixable.
function maxChromaInGamut(L, hueRad, upperBound) {
  const linearAt = (c) =>
    oklabToLinearRgb({ L, a: c * Math.cos(hueRad), b: c * Math.sin(hueRad) })
  if (upperBound <= 0 || inGamut(linearAt(upperBound))) return upperBound
  let lo = 0
  let hi = upperBound
  for (let i = 0; i < 24; i += 1) {
    const mid = (lo + hi) / 2
    if (inGamut(linearAt(mid))) lo = mid
    else hi = mid
  }
  return lo
}

function makeRampFn(hueRad, chroma, chromaScale) {
  const desired = chroma * chromaScale
  return function toneToHex(tone) {
    const L = clamp(tone, 0, 100) / 100
    const c = maxChromaInGamut(L, hueRad, desired)
    const a = c * Math.cos(hueRad)
    const b = c * Math.sin(hueRad)
    return oklabToHex({ L, a, b })
  }
}

// The source hex's true tone on the OKLab lightness scale (0-100).
export function sourceToneOf(hex) {
  const lab = hexToOklab(hex)
  return clamp(lab.L * 100, 0, 100)
}

// Always returns exactly TONE_STOPS.length stops. When pinning the source
// tone, it replaces the nearest existing stop rather than adding an extra
// one, so the ramp stays a fixed size regardless of the source hex.
function buildRampStops(fn, sourceTone, pinSource) {
  const stops = [...TONE_STOPS]
  if (pinSource) {
    let nearestIndex = 0
    let nearestDist = Infinity
    stops.forEach((t, i) => {
      const dist = Math.abs(t - sourceTone)
      if (dist < nearestDist) {
        nearestDist = dist
        nearestIndex = i
      }
    })
    stops[nearestIndex] = sourceTone
  }
  stops.sort((x, y) => x - y)
  return stops.map((tone) => {
    const isSource = pinSource && Math.abs(tone - sourceTone) < 0.01
    return {
      tone: round1(tone),
      hex: fn(tone),
      source: isSource,
    }
  })
}

// Secondary is a companion accent, not a second brand color: it rotates a
// third of the way around the hue circle from the source and carries a little
// over half its chroma, so it reads as clearly distinct from primary while
// still belonging to the same system. Both numbers are read off the Figma kit
// (see docs/tokens/figma-snapshot.json, `Graphite Primitives/secondary/*`)
// rather than chosen here — this ramp is the code side of a decision already
// made in the design file.
const SECONDARY_HUE_TURN = -120 * (Math.PI / 180)
const SECONDARY_CHROMA_SCALE = 0.585

// Returns { accent, secondary, neutral, neutralVariant } plus the status
// ramps, each { tone(fn), stops, sourceTone? }. tone() is a continuous
// function so callers can resolve any tone, not just the named stops. The
// source hex is pinned into the accent ramp at its true tone.
export function makeRamps(hex) {
  const normalized = normalizeHex(hex)
  const lab = hexToOklab(normalized)
  const chroma = Math.sqrt(lab.a * lab.a + lab.b * lab.b)
  const hue = Math.atan2(lab.b, lab.a)
  const sourceTone = sourceToneOf(normalized)

  const accentFn = makeRampFn(hue, chroma, 1)
  const secondaryFn = makeRampFn(
    hue + SECONDARY_HUE_TURN,
    chroma,
    SECONDARY_CHROMA_SCALE,
  )
  const neutralFn = makeRampFn(hue, chroma, 0.04)
  const neutralVariantFn = makeRampFn(hue, chroma, 0.12)

  const accentStops = buildRampStops(accentFn, sourceTone, true).map((stop) =>
    stop.source ? { ...stop, hex: normalized } : stop,
  )

  // Secondary shares accent's tone ladder — including the pinned source tone —
  // because the kit samples it there rather than at a round 50. Verified
  // against the snapshot: sampling at 50 instead puts that stop 22/255 off
  // Figma's value, sampling at the source tone puts it within 3.
  //
  // The `source` flag is cleared afterwards. It means "this stop is the source
  // hex", which is true of accent and false here: secondary at the source tone
  // is a different hue entirely, and marking it would make the UI label a teal
  // swatch as the purple the user picked.
  const secondaryStops = buildRampStops(secondaryFn, sourceTone, true).map(
    (stop) => ({
      ...stop,
      source: false,
    }),
  )

  // Status ramps are built here rather than in a separate entry point so every
  // caller resolves tones the same way. They are not "from one input" the way
  // the four above are — their hue is fixed — so anything presenting the
  // source-derived ramps should keep listing those four explicitly.
  const statusChroma = clamp(chroma, STATUS_CHROMA_MIN, STATUS_CHROMA_MAX)
  const statusRamps = {}
  for (const name of STATUS_NAMES) {
    const fn = makeRampFn(STATUS_HUES[name], statusChroma, 1)
    statusRamps[name] = {
      tone: fn,
      stops: buildRampStops(fn, sourceTone, false),
    }
  }

  return {
    accent: { tone: accentFn, stops: accentStops, sourceTone },
    secondary: { tone: secondaryFn, stops: secondaryStops },
    neutral: {
      tone: neutralFn,
      stops: buildRampStops(neutralFn, sourceTone, false),
    },
    neutralVariant: {
      tone: neutralVariantFn,
      stops: buildRampStops(neutralVariantFn, sourceTone, false),
    },
    ...statusRamps,
  }
}

// ---------- status ramps ----------

// Status has to stay recognizable: red must read as "danger" whatever the
// source color is, so hue is pinned per status rather than derived from the
// input. Chroma still tracks the source, so statuses carry the same intensity
// as the rest of the system — clamped at both ends, because a near-gray source
// would otherwise produce a gray "danger" and a neon one a garish red.
//
// Hues are read from anchor hexes rather than written as radians, so the
// intent stays legible and the numbers stay verifiable.
const STATUS_ANCHORS = {
  danger: '#d92d20',
  warning: '#dc6803',
  success: '#079455',
  info: '#2e90fa',
}

export const STATUS_NAMES = ['danger', 'warning', 'success', 'info']

// Anchor chromas run 0.14-0.21; source colors range from 0 (gray) to ~0.29.
const STATUS_CHROMA_MIN = 0.1
const STATUS_CHROMA_MAX = 0.2

const STATUS_HUES = Object.fromEntries(
  STATUS_NAMES.map((name) => {
    const lab = hexToOklab(STATUS_ANCHORS[name])
    return [name, Math.atan2(lab.b, lab.a)]
  }),
)

// ---------- semantic theme ----------

// Fixed reference point so dark surfaces land near #121212, per the model
// decision in CLAUDE.md, rather than the default Material tone-6 dark surface.
const DARK_SURFACE_TONE = sourceToneOf('#121212')

// Status roles take the same tone positions as the primary family, so a status
// fill and an accent fill behave identically — same emphasis, same on-color
// relationship — and only the hue says which is which.
const STATUS_TONES = {
  light: { base: 40, on: 98, container: 90, onContainer: 10 },
  dark: { base: 80, on: 20, container: 30, onContainer: 90 },
}

function withStatusRoles(map, tones) {
  for (const name of STATUS_NAMES) {
    const Cap = name[0].toUpperCase() + name.slice(1)
    map[name] = { ramp: name, tone: tones.base }
    map[`on${Cap}`] = { ramp: name, tone: tones.on }
    map[`${name}Container`] = { ramp: name, tone: tones.container }
    map[`on${Cap}Container`] = { ramp: name, tone: tones.onContainer }
  }
  return map
}

const LIGHT_MAP = withStatusRoles(
  {
    primary: { ramp: 'accent', tone: 40 },
    onPrimary: { ramp: 'accent', tone: 98 },
    primaryContainer: { ramp: 'accent', tone: 90 },
    onPrimaryContainer: { ramp: 'accent', tone: 10 },
    // Secondary takes the same tone positions as primary, on its own ramp, for
    // the same reason status roles do: a secondary fill and a primary fill then
    // behave identically — same emphasis, same on-color relationship — and only
    // the hue says which is which.
    secondary: { ramp: 'secondary', tone: 40 },
    onSecondary: { ramp: 'secondary', tone: 98 },
    secondaryContainer: { ramp: 'secondary', tone: 90 },
    onSecondaryContainer: { ramp: 'secondary', tone: 10 },
    surface: { ramp: 'neutral', tone: 98 },
    // Overlays sit one tone step forward of surface. Elevation moves lighter in
    // both themes rather than following the state rule of darker-in-light: an
    // overlay reads as nearer the viewer, and nearer means brighter under a
    // single light source, whichever theme is on.
    surfaceElevated: { ramp: 'neutral', tone: 100 },
    onSurface: { ramp: 'neutral', tone: 10 },
    surfaceVariant: { ramp: 'neutralVariant', tone: 90 },
    onSurfaceVariant: { ramp: 'neutralVariant', tone: 30 },
    outline: { ramp: 'neutralVariant', tone: 50 },
    background: { ramp: 'neutral', tone: 98 },
    onBackground: { ramp: 'neutral', tone: 10 },
  },
  STATUS_TONES.light,
)

const DARK_MAP = withStatusRoles(
  {
    primary: { ramp: 'accent', tone: 80 },
    onPrimary: { ramp: 'accent', tone: 20 },
    primaryContainer: { ramp: 'accent', tone: 30 },
    onPrimaryContainer: { ramp: 'accent', tone: 90 },
    secondary: { ramp: 'secondary', tone: 80 },
    onSecondary: { ramp: 'secondary', tone: 20 },
    secondaryContainer: { ramp: 'secondary', tone: 30 },
    onSecondaryContainer: { ramp: 'secondary', tone: 90 },
    surface: { ramp: 'neutral', tone: DARK_SURFACE_TONE },
    surfaceElevated: { ramp: 'neutral', tone: DARK_SURFACE_TONE + 6 },
    onSurface: { ramp: 'neutral', tone: 90 },
    surfaceVariant: { ramp: 'neutralVariant', tone: 30 },
    onSurfaceVariant: { ramp: 'neutralVariant', tone: 80 },
    outline: { ramp: 'neutralVariant', tone: 60 },
    background: { ramp: 'neutral', tone: DARK_SURFACE_TONE },
    onBackground: { ramp: 'neutral', tone: 90 },
  },
  STATUS_TONES.dark,
)

function resolveTone(ramps, rampName, tone) {
  return ramps[rampName].tone(tone)
}

// Nearest tone on the same ramp that clears the contrast target against
// baseHex, searching outward from the original tone.
function autoFixTone(rampFn, baseHex, originalTone, target) {
  let best = null
  for (let t = 0; t <= 100; t += 1) {
    const hex = rampFn(t)
    const ratio = contrastRatio(hex, baseHex)
    if (ratio >= target) {
      const dist = Math.abs(t - originalTone)
      if (best === null || dist < best.dist) {
        best = { tone: t, hex, ratio, dist }
      }
    }
  }
  return best
}

// role -> { base role it must contrast against, target contrast ratio }
function pairsFor(textTarget, uiTarget) {
  const statusPairs = {}
  for (const name of STATUS_NAMES) {
    const Cap = name[0].toUpperCase() + name.slice(1)
    statusPairs[`on${Cap}`] = { base: name, target: textTarget, kind: 'AA' }
    statusPairs[`on${Cap}Container`] = {
      base: `${name}Container`,
      target: textTarget,
      kind: 'AA',
    }
  }
  return {
    ...statusPairs,
    onPrimary: { base: 'primary', target: textTarget, kind: 'AA' },
    onPrimaryContainer: {
      base: 'primaryContainer',
      target: textTarget,
      kind: 'AA',
    },
    onSecondary: { base: 'secondary', target: textTarget, kind: 'AA' },
    onSecondaryContainer: {
      base: 'secondaryContainer',
      target: textTarget,
      kind: 'AA',
    },
    onSurface: { base: 'surface', target: textTarget, kind: 'AA' },
    onSurfaceVariant: {
      base: 'surfaceVariant',
      target: textTarget,
      kind: 'AA',
    },
    onBackground: { base: 'background', target: textTarget, kind: 'AA' },
    outline: { base: 'surface', target: uiTarget, kind: 'UI' },
  }
}

// Maps ramp tones to semantic roles (primary family + surfaces + outline) for
// one mode, checks each on-color against its base, and optionally auto-fixes
// on-colors that fail the target ratio by walking the same ramp.
export function buildTheme(mode, ramps, level = 'AA', autoFix = true) {
  const map = mode === 'dark' ? DARK_MAP : LIGHT_MAP
  const textTarget = level === 'AAA' ? 7 : 4.5
  const uiTarget = 3
  const pairs = pairsFor(textTarget, uiTarget)

  const tokens = {}
  for (const [role, ref] of Object.entries(map)) {
    tokens[role] = {
      ramp: ref.ramp,
      tone: ref.tone,
      hex: resolveTone(ramps, ref.ramp, ref.tone),
    }
  }

  const contrast = {}
  for (const [role, pair] of Object.entries(pairs)) {
    const baseHex = tokens[pair.base].hex
    const entry = tokens[role]
    let ratio = contrastRatio(entry.hex, baseHex)
    let passes = ratio >= pair.target
    let fixed = false

    if (!passes && autoFix) {
      const rampFn = ramps[entry.ramp].tone
      const found = autoFixTone(rampFn, baseHex, entry.tone, pair.target)
      if (found) {
        tokens[role] = { ramp: entry.ramp, tone: found.tone, hex: found.hex }
        ratio = found.ratio
        passes = true
        fixed = true
      }
    }

    contrast[role] = {
      against: pair.base,
      ratio: round1(ratio),
      target: pair.target,
      passes,
      fixed,
      kind: pair.kind,
      level: pair.kind === 'UI' ? 'UI' : level,
    }
  }

  return { mode, level, tokens, contrast }
}

// Scrim — the modal veil behind a Dialog.
//
// The one role that resolves to rgba rather than a tone. A veil has to darken
// whatever happens to be behind it, which no fixed ramp tone can do, so it is
// alpha over the darkest neutral rather than a stop on the ramp. That is also
// why it sits outside the token maps: it has no `on-` partner and belongs in
// no contrast pairing, and putting it in `tokens` would enter it into both.
//
// The hue is neutral tone 10, so the scrim carries the source colour like
// every other role — #030305 for the seeded purple, #050303 for a red source.
// It was previously hardcoded in app/globals.scss and so did not move with the
// source at all.
//
// Alphas are the kit's: Graphite Semantic `scrim` documents 50% in Light and
// 70% in Dark. Dark needs more because the surface it veils is already dark,
// so an identical alpha would separate the dialog from its background far less.
const SCRIM_TONE = 10
const SCRIM_ALPHA = { light: 0.5, dark: 0.7 }

/** CSS colour for the modal scrim, derived from the neutral ramp. */
export function scrimFor(ramps, mode) {
  const { r, g, b } = hexToRgb(ramps.neutral.tone(SCRIM_TONE))
  return `rgb(${r} ${g} ${b} / ${SCRIM_ALPHA[mode]})`
}

// ---------- interaction states ----------

const STATE_DELTAS = { hover: 6, pressed: 12, selected: 6 }

// Families that carry a full interaction state set. Exported so consumers
// enumerate them from here rather than hardcoding the list in each exporter.
//
// `danger` joined the list because Button's destructive variant had no hover
// or pressed state while every other variant had both, which put it in breach
// of its own contract: button.md's composition rule says hover and pressed are
// tone-step moves on the resting fill's own ramp. The kit already carried
// `state/danger-*`, so this closes a code/kit gap rather than opening one.
//
// warning, success and info are deliberately still absent. The kit generates
// state sets for them too, but nothing in the system has a warning or success
// variant to spend them on, and governance rule 6's demand test applies to
// tokens as much as to components: build it when something asks.
export const STATE_FAMILIES = ['primary', 'secondary', 'danger']

// States are tone references on the same ramp as the base token, not opacity
// overlays. Direction preserves contrast: darker in light mode, lighter in
// dark mode. Focus is a separate ring token on the family's own ramp, not a
// fill change on the base token.
//
// Disabled is deliberately the exception: it drops to the neutral ramp rather
// than desaturating the family's own, because "disabled" should read the same
// whichever family it belongs to. A disabled secondary button that stayed
// tinted would still look actionable.
function familyStates(token, ramps, mode) {
  const direction = mode === 'dark' ? 1 : -1
  const rampFn = ramps[token.ramp].tone

  const out = { base: { ramp: token.ramp, tone: token.tone, hex: token.hex } }
  for (const [state, delta] of Object.entries(STATE_DELTAS)) {
    const tone = clamp(token.tone + direction * delta, 0, 100)
    out[state] = { ramp: token.ramp, tone, hex: rampFn(tone) }
  }

  const disabledTone = mode === 'dark' ? 30 : 90
  const disabledContentTone = mode === 'dark' ? 60 : 40
  out.disabled = {
    ramp: 'neutral',
    tone: disabledTone,
    hex: ramps.neutral.tone(disabledTone),
    content: {
      ramp: 'neutral',
      tone: disabledContentTone,
      hex: ramps.neutral.tone(disabledContentTone),
    },
  }

  const focusTone = mode === 'dark' ? 70 : 50
  out.focus = { ramp: token.ramp, tone: focusTone, hex: rampFn(focusTone) }

  return out
}

// Every interactive family gets the same state set, derived the same way, so
// adding a family is a one-line change rather than a copied block that can
// drift out of step with the original.
export function buildStates(tokens, ramps, mode) {
  // Driven off STATE_FAMILIES rather than a hand-written pair, so adding a
  // family is one edit to that list instead of four scattered ones.
  const families = Object.fromEntries(
    STATE_FAMILIES.map((f) => [f, familyStates(tokens[f], ramps, mode)]),
  )

  // `focus` stays at the top level as the page-level focus ring. It predates
  // per-family rings and is what --graphite-focus and every current consumer
  // reads; it is primary's ring, not a separate value.
  return { ...families, focus: families.primary.focus }
}

// ---------- exporters ----------

function themeBundle(bundle) {
  const { light, lightStates, dark, darkStates } = bundle
  return [
    {
      selector: ':root, [data-theme="light"]',
      theme: light,
      states: lightStates,
    },
    { selector: '[data-theme="dark"]', theme: dark, states: darkStates },
  ]
}

export function buildCss(bundle) {
  const lines = []

  for (const { selector, theme, states } of themeBundle(bundle)) {
    lines.push(`${selector} {`)

    for (const [role, t] of Object.entries(theme.tokens)) {
      const name = kebab(role)
      lines.push(`  --cts-${name}: ${t.hex};`)
      lines.push(`  --cts-${name}-ramp: ${t.ramp};`)
      lines.push(`  --cts-${name}-tone: ${round1(t.tone)};`)
    }

    for (const family of STATE_FAMILIES) {
      for (const [state, entry] of Object.entries(states[family])) {
        const name = state === 'base' ? family : `${family}-${state}`
        lines.push(`  --cts-${name}: ${entry.hex};`)
        lines.push(`  --cts-${name}-ramp: ${entry.ramp};`)
        lines.push(`  --cts-${name}-tone: ${round1(entry.tone)};`)
        if (entry.content) {
          lines.push(`  --cts-${name}-content: ${entry.content.hex};`)
          lines.push(`  --cts-${name}-content-ramp: ${entry.content.ramp};`)
          lines.push(
            `  --cts-${name}-content-tone: ${round1(entry.content.tone)};`,
          )
        }
      }
    }

    lines.push(`  --cts-focus-ring: ${states.focus.hex};`)
    lines.push(`  --cts-focus-ring-ramp: ${states.focus.ramp};`)
    lines.push(`  --cts-focus-ring-tone: ${round1(states.focus.tone)};`)

    lines.push('}')
    lines.push('')
  }

  return lines.join('\n').trim() + '\n'
}

function tokenEntry(t) {
  return { value: t.hex, ramp: t.ramp, tone: round1(t.tone) }
}

function stateEntry(entry) {
  const out = { value: entry.hex, ramp: entry.ramp, tone: round1(entry.tone) }
  if (entry.content) out.content = tokenEntry(entry.content)
  return out
}

function themeToJson(theme, states) {
  const familyToJson = (family) =>
    Object.fromEntries(
      Object.entries(states[family]).map(([s, e]) => [s, stateEntry(e)]),
    )

  return {
    tokens: Object.fromEntries(
      Object.entries(theme.tokens).map(([role, t]) => [role, tokenEntry(t)]),
    ),
    contrast: theme.contrast,
    states: {
      ...Object.fromEntries(STATE_FAMILIES.map((f) => [f, familyToJson(f)])),
      focus: stateEntry(states.focus),
    },
  }
}

export function buildJson(bundle) {
  const { hex, ramps, light, lightStates, dark, darkStates } = bundle
  const rampToJson = (ramp) =>
    ramp.stops.map((s) => ({ tone: s.tone, value: s.hex, source: !!s.source }))

  return {
    source: hex,
    primitives: {
      accent: rampToJson(ramps.accent),
      secondary: rampToJson(ramps.secondary),
      neutral: rampToJson(ramps.neutral),
      neutralVariant: rampToJson(ramps.neutralVariant),
    },
    semantic: {
      light: themeToJson(light, lightStates),
      dark: themeToJson(dark, darkStates),
    },
  }
}
