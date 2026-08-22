'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { GlobalTheme } from '@carbon/react'
import {
  makeRamps,
  buildTheme,
  buildStates,
  normalizeHex,
  STATE_FAMILIES,
} from '@/lib/color.js'

type CarbonTheme = 'white' | 'g100'

type ColorBundle = ReturnType<typeof buildTheme> & {
  states: ReturnType<typeof buildStates>
}

export type ContrastLevel = 'AA' | 'AAA'

type ThemeContextValue = {
  theme: CarbonTheme
  toggleTheme: () => void
  setTheme: (theme: CarbonTheme) => void
  sourceHex: string
  setSourceHex: (hex: string) => void
  lightBundle: ColorBundle | null
  darkBundle: ColorBundle | null
  // The generation control. It changes what the engine emits, so it lives here
  // rather than in one view: every surface stays in sync.
  level: ContrastLevel
  setLevel: (level: ContrastLevel) => void
  ramps: ReturnType<typeof makeRamps> | null
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'g100',
  toggleTheme: () => {},
  setTheme: () => {},
  sourceHex: '',
  setSourceHex: () => {},
  lightBundle: null,
  darkBundle: null,
  level: 'AA',
  setLevel: () => {},
  ramps: null,
})

export function useTheme() {
  return useContext(ThemeContext)
}

type BuiltTheme = ReturnType<typeof buildTheme>
type BuiltStates = ReturnType<typeof buildStates>
type Tokens = BuiltTheme['tokens']

// Every Carbon variable the generated theme drives, as [variable, resolver].
//
// A list rather than an object literal so the count is derivable: the site copy
// quotes this number in several places, and stating it by hand is how it came
// to read 33 while the map had grown to 42.
const CARBON_VAR_BINDINGS: readonly [
  string,
  (t: Tokens, s: BuiltStates) => string,
][] = [
  ['--cds-background', (t) => t.background.hex],
  ['--cds-layer', (t) => t.surface.hex],
  ['--cds-layer-01', (t) => t.surface.hex],
  ['--cds-layer-02', (t) => t.surfaceVariant.hex],
  ['--cds-layer-03', (t) => t.surfaceElevated.hex],
  ['--cds-layer-accent', (t) => t.surfaceVariant.hex],
  ['--cds-layer-accent-01', (t) => t.surfaceVariant.hex],
  ['--cds-field', (t) => t.surfaceVariant.hex],
  ['--cds-field-01', (t) => t.surfaceVariant.hex],
  ['--cds-field-02', (t) => t.surfaceVariant.hex],
  ['--cds-border-subtle', (t) => t.outline.hex],
  ['--cds-border-subtle-00', (t) => t.outline.hex],
  ['--cds-border-subtle-01', (t) => t.outline.hex],
  ['--cds-border-subtle-02', (t) => t.outline.hex],
  ['--cds-border-strong', (t) => t.outline.hex],
  ['--cds-border-strong-01', (t) => t.outline.hex],
  ['--cds-border-interactive', (t) => t.primary.hex],
  ['--cds-text-primary', (t) => t.onBackground.hex],
  ['--cds-text-secondary', (t) => t.onSurfaceVariant.hex],
  ['--cds-icon-primary', (t) => t.onBackground.hex],
  ['--cds-icon-secondary', (t) => t.onSurfaceVariant.hex],
  ['--cds-icon-interactive', (t) => t.primary.hex],
  ['--cds-interactive', (t) => t.primary.hex],
  ['--cds-link-primary', (t) => t.primary.hex],
  ['--cds-link-primary-hover', (_t, s) => s.primary.hover.hex],
  ['--cds-focus', (_t, s) => s.focus.hex],
  ['--cds-focus-inset', (_t, s) => s.focus.hex],
  ['--cds-button-primary', (_t, s) => s.primary.base.hex],
  ['--cds-button-primary-hover', (_t, s) => s.primary.hover.hex],
  ['--cds-button-primary-active', (_t, s) => s.primary.pressed.hex],
  ['--cds-text-on-color', (t) => t.onPrimary.hex],
  ['--cds-icon-on-color', (t) => t.onPrimary.hex],
  ['--cds-background-selected', (t) => t.primaryContainer.hex],
  ['--cds-background-hover', (t) => t.surfaceVariant.hex],
  ['--cds-layer-selected', (t) => t.primaryContainer.hex],
  ['--cds-layer-selected-01', (t) => t.primaryContainer.hex],
  ['--cds-layer-hover', (t) => t.surfaceVariant.hex],
  ['--cds-layer-hover-01', (t) => t.surfaceVariant.hex],
  // Tags default to Carbon's fixed blue palette, which reads as a foreign
  // color once the rest of the page is generated. Bind them to the accent.
  ['--cds-tag-background-blue', (t) => t.primaryContainer.hex],
  ['--cds-tag-color-blue', (t) => t.onPrimaryContainer.hex],
  ['--cds-tag-hover-blue', (_t, s) => s.primary.hover.hex],
  ['--cds-tag-background-gray', (t) => t.surfaceVariant.hex],
  ['--cds-tag-color-gray', (t) => t.onSurfaceVariant.hex],
  // Carbon's support colors are fixed values that read as foreign next to a
  // generated theme — the reason earlier passes kept leaving a stray "success
  // green" in the chrome. They now resolve to the generated status ramps.
  ['--cds-support-error', (t) => t.danger.hex],
  ['--cds-support-warning', (t) => t.warning.hex],
  ['--cds-support-success', (t) => t.success.hex],
  ['--cds-support-info', (t) => t.info.hex],
  ['--cds-text-error', (t) => t.danger.hex],
  ['--cds-tag-background-red', (t) => t.dangerContainer.hex],
  ['--cds-tag-color-red', (t) => t.onDangerContainer.hex],
  ['--cds-tag-background-green', (t) => t.successContainer.hex],
  ['--cds-tag-color-green', (t) => t.onSuccessContainer.hex],
  // Container fills for all four statuses. Carbon's notification backgrounds
  // are the only slot it offers that covers every status — there is no yellow
  // or orange tag — so warning and info reach their container here rather than
  // through the tag palette. Note Carbon has no matching per-status *text*
  // token (only text-error), so onWarningContainer and onInfoContainer are
  // generated but stay unbound. See docs/contracts/README.md.
  ['--cds-notification-background-error', (t) => t.dangerContainer.hex],
  ['--cds-notification-background-warning', (t) => t.warningContainer.hex],
  ['--cds-notification-background-success', (t) => t.successContainer.hex],
  ['--cds-notification-background-info', (t) => t.infoContainer.hex],
]

/** How many Carbon variables a generated theme maps. Quote this, never a literal. */
export const CARBON_VAR_COUNT = CARBON_VAR_BINDINGS.length

// ---------- Graphite namespace ----------
//
// Carbon's variables are a compatibility layer: they exist so Carbon's own
// components pick up generated values, and their names and shape are Carbon's.
// They cannot express the full generated set — there is no Carbon slot for
// text on a status container, for instance — so seven roles were computed and
// dropped on every pass.
//
// --graphite-* carries everything, and is what Graphite's own components read.
// Derived from the token keys rather than hand-listed, so it cannot drift from
// what the engine actually produces.

const kebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export const graphiteVarName = (role: string) => `--graphite-${kebab(role)}`

function graphiteVarsFor(theme: BuiltTheme, states: BuiltStates) {
  const out: Record<string, string> = {}
  for (const [role, token] of Object.entries(theme.tokens)) {
    out[graphiteVarName(role)] = (token as { hex: string }).hex
  }
  // Interaction states are tone references on the same ramp, not separate
  // roles, so they live alongside rather than inside the token map. Driven off
  // STATE_FAMILIES so a new family arrives here without an edit.
  for (const family of STATE_FAMILIES) {
    const f = states[family]
    out[`--graphite-${family}-hover`] = f.hover.hex
    out[`--graphite-${family}-pressed`] = f.pressed.hex
    out[`--graphite-${family}-selected`] = f.selected.hex
    out[`--graphite-${family}-disabled`] = f.disabled.hex
    out[`--graphite-${family}-disabled-content`] = f.disabled.content.hex
    out[`--graphite-${family}-focus`] = f.focus.hex
  }
  // The page-level ring. Same value as --graphite-primary-focus; kept because
  // it is the name components already read and the one that means "focus"
  // without picking a family.
  out['--graphite-focus'] = states.focus.hex
  return out
}

function carbonVarsFor(theme: BuiltTheme, states: BuiltStates) {
  return Object.fromEntries(
    CARBON_VAR_BINDINGS.map(([name, resolve]) => [
      name,
      resolve(theme.tokens, states),
    ]),
  )
}

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

// Sampled from the Graphite UI Kit cover: bucketing every chromatic pixel by
// hue puts ~60% in the purple range, averaging this value. Seeding the source
// with it means the whole system matches the cover on first open, before the
// visitor has touched the color control.
export const COVER_SOURCE_HEX = '#5e44aa'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CarbonTheme>('g100')
  const [sourceHex, setSourceHexRaw] = useState(COVER_SOURCE_HEX)
  const [level, setLevel] = useState<ContrastLevel>('AA')

  const setSourceHex = (hex: string) => {
    if (HEX_RE.test(hex.trim())) setSourceHexRaw(normalizeHex(hex))
  }

  // Compute ramps + both themes whenever sourceHex changes
  const ramps = useMemo(
    () => (sourceHex ? makeRamps(sourceHex) : null),
    [sourceHex],
  )

  const light = useMemo(
    () => (ramps ? buildTheme('light', ramps, level) : null),
    [ramps, level],
  )
  const dark = useMemo(
    () => (ramps ? buildTheme('dark', ramps, level) : null),
    [ramps, level],
  )
  const lightStates = useMemo(
    () => (ramps && light ? buildStates(light.tokens, ramps, 'light') : null),
    [ramps, light],
  )
  const darkStates = useMemo(
    () => (ramps && dark ? buildStates(dark.tokens, ramps, 'dark') : null),
    [ramps, dark],
  )

  const lightBundle =
    light && lightStates ? { ...light, states: lightStates } : null
  const darkBundle = dark && darkStates ? { ...dark, states: darkStates } : null

  // Stamp --cds-* variables onto document root.
  //
  // Transitions are suppressed for the duration of the write. A CSS transition
  // on `background-color` whose value comes from a custom property does not
  // resolve when that property is rewritten — the element strands on its
  // previous color indefinitely. Carbon ships such a transition on every
  // button, so without this the primary button keeps painting the old hue while
  // its token already reads the new one. Killing transitions for one frame
  // makes every token-driven surface repaint atomically and correctly.
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('is-retheming')

    root.classList.remove('cds--white', 'cds--g100')
    root.classList.add(`cds--${theme}`)

    const activeTheme = theme === 'white' ? light : dark
    const activeStates = theme === 'white' ? lightStates : darkStates

    if (sourceHex && activeTheme && activeStates) {
      const vars = {
        ...carbonVarsFor(activeTheme, activeStates),
        ...graphiteVarsFor(activeTheme, activeStates),
      }
      for (const [prop, value] of Object.entries(vars)) {
        root.style.setProperty(prop, value)
      }
    }

    // Force a synchronous style flush so the new values are committed while
    // transitions are still suppressed, then re-arm immediately. Doing this
    // with requestAnimationFrame would leave the class stuck in a background
    // tab, where frames are throttled and the callback may never run.
    void root.offsetHeight
    root.classList.remove('is-retheming')
  }, [theme, light, dark, lightStates, darkStates, sourceHex])

  const toggleTheme = () => setTheme((t) => (t === 'white' ? 'g100' : 'white'))

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
        setTheme,
        sourceHex,
        setSourceHex,
        lightBundle,
        darkBundle,
        level,
        setLevel,
        ramps,
      }}
    >
      <GlobalTheme theme={theme}>{children}</GlobalTheme>
    </ThemeContext.Provider>
  )
}
