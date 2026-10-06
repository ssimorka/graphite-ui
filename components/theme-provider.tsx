'use client'

import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { THEME_CHOICE_KEY, THEME_PAINT_KEY } from '@/lib/theme-storage'
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { GlobalTheme } from '@carbon/react'
import {
  makeRamps,
  buildTheme,
  buildStates,
  buildGraphiteVars,
  normalizeHex,
} from '@/lib/color.js'

// The same two names the exported theme file uses for [data-theme], so a
// project that takes the file and the provider has one vocabulary. Carbon's
// own names for these (white, g100) survive only as the zone class below,
// which the site's remaining Carbon components need.
export type ThemeName = 'light' | 'dark'

const CARBON_ZONE: Record<ThemeName, string> = { light: 'cds--white', dark: 'cds--g100' }

// Choices saved before the rename hold Carbon's names. Read them as the new
// ones so a returning visitor keeps their theme.
const LEGACY_THEME: Record<string, ThemeName> = { white: 'light', g100: 'dark' }

type ColorBundle = ReturnType<typeof buildTheme> & {
  states: ReturnType<typeof buildStates>
}

export type ContrastLevel = 'AA' | 'AAA'

type ThemeContextValue = {
  theme: ThemeName
  toggleTheme: () => void
  setTheme: (theme: ThemeName) => void
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
  theme: 'dark',
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
  // Carbon's secondary button is a fixed gray until these are bound, which
  // reads as a foreign color next to generated chrome — the same trap
  // --cds-support-* used to be. Bound to the secondary family so a Carbon
  // secondary button matches Graphite's own secondary variant.
  // Carbon labels it with --cds-text-on-color, which is onPrimary; measured
  // against all three secondary tones it clears AAA in both themes, so the
  // label needs no separate binding.
  ['--cds-button-secondary', (_t, s) => s.secondary.base.hex],
  ['--cds-button-secondary-hover', (_t, s) => s.secondary.hover.hex],
  ['--cds-button-secondary-active', (_t, s) => s.secondary.pressed.hex],
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
// text on a status container, for instance.
//
// --graphite-* carries everything, and is what Graphite's own components read.
// The set comes from buildGraphiteVars in lib/color.js, the same function the
// CSS exporter writes from, so what the site stamps and what Create hands out
// cannot name things differently.

function carbonVarsFor(theme: BuiltTheme, states: BuiltStates) {
  return Object.fromEntries(
    CARBON_VAR_BINDINGS.map(([name, resolve]) => [
      name,
      resolve(theme.tokens, states),
    ]),
  )
}

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

// The seeded default. Declared in lib/cover-source so server code can read the
// value: an import from this 'use client' module arrives on the server as a
// reference, not a string. Re-exported so existing importers keep their path.
export { COVER_SOURCE_HEX }

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>('dark')
  const [sourceHex, setSourceHexRaw] = useState(COVER_SOURCE_HEX)
  const [level, setLevel] = useState<ContrastLevel>('AA')
  // Whether the stored choice has been read. The server renders the defaults,
  // so the first client render must too; the stored choice is applied in a
  // layout effect straight after, before paint. Nothing is stamped or saved
  // until then, or the defaults would overwrite what was stored.
  const [restored, setRestored] = useState(false)

  useLayoutEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(THEME_CHOICE_KEY) ?? 'null')
      if (saved && typeof saved === 'object') {
        if (typeof saved.sourceHex === 'string' && HEX_RE.test(saved.sourceHex))
          setSourceHexRaw(normalizeHex(saved.sourceHex))
        const name = LEGACY_THEME[saved.theme] ?? saved.theme
        if (name === 'light' || name === 'dark') setTheme(name)
        if (saved.level === 'AA' || saved.level === 'AAA') setLevel(saved.level)
      }
    } catch {}
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(THEME_CHOICE_KEY, JSON.stringify({ sourceHex, theme, level }))
    } catch {}
  }, [restored, sourceHex, theme, level])

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
    if (!restored) return
    const root = document.documentElement
    root.classList.add('is-retheming')

    root.dataset.theme = theme
    root.classList.remove(...Object.values(CARBON_ZONE))
    root.classList.add(CARBON_ZONE[theme])

    const activeTheme = theme === 'light' ? light : dark
    const activeStates = theme === 'light' ? lightStates : darkStates

    if (sourceHex && activeTheme && activeStates && ramps) {
      const vars = {
        ...carbonVarsFor(activeTheme, activeStates),
        ...buildGraphiteVars(activeTheme, activeStates, ramps, theme),
      }
      for (const [prop, value] of Object.entries(vars)) {
        root.style.setProperty(prop, value)
      }
      // For the next page load's inline script (lib/theme-storage.ts).
      try {
        localStorage.setItem(
          THEME_PAINT_KEY,
          JSON.stringify({ theme, cls: CARBON_ZONE[theme], vars }),
        )
      } catch {}
    }

    // Force a synchronous style flush so the new values are committed while
    // transitions are still suppressed, then re-arm immediately. Doing this
    // with requestAnimationFrame would leave the class stuck in a background
    // tab, where frames are throttled and the callback may never run.
    void root.offsetHeight
    root.classList.remove('is-retheming')
  }, [restored, theme, light, dark, lightStates, darkStates, sourceHex, ramps])

  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'))

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
      <GlobalTheme theme={theme === 'light' ? 'white' : 'g100'}>{children}</GlobalTheme>
    </ThemeContext.Provider>
  )
}
