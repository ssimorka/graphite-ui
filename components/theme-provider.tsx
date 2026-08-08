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
  // The Studio's two generation controls. They change what the engine emits,
  // so they live here rather than in one view: every surface stays in sync.
  level: ContrastLevel
  setLevel: (level: ContrastLevel) => void
  autoFix: boolean
  setAutoFix: (on: boolean) => void
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
  autoFix: true,
  setAutoFix: () => {},
  ramps: null,
})

export function useTheme() {
  return useContext(ThemeContext)
}

function carbonVarsFor(theme: ReturnType<typeof buildTheme>, states: ReturnType<typeof buildStates>) {
  const t = theme.tokens
  return {
    '--cds-background': t.background.hex,
    '--cds-layer': t.surface.hex,
    '--cds-layer-01': t.surface.hex,
    '--cds-layer-02': t.surfaceVariant.hex,
    '--cds-layer-accent': t.surfaceVariant.hex,
    '--cds-layer-accent-01': t.surfaceVariant.hex,
    '--cds-field': t.surfaceVariant.hex,
    '--cds-field-01': t.surfaceVariant.hex,
    '--cds-field-02': t.surfaceVariant.hex,
    '--cds-border-subtle': t.outline.hex,
    '--cds-border-subtle-00': t.outline.hex,
    '--cds-border-subtle-01': t.outline.hex,
    '--cds-border-subtle-02': t.outline.hex,
    '--cds-border-strong': t.outline.hex,
    '--cds-border-strong-01': t.outline.hex,
    '--cds-border-interactive': t.primary.hex,
    '--cds-text-primary': t.onBackground.hex,
    '--cds-text-secondary': t.onSurfaceVariant.hex,
    '--cds-icon-primary': t.onBackground.hex,
    '--cds-icon-secondary': t.onSurfaceVariant.hex,
    '--cds-icon-interactive': t.primary.hex,
    '--cds-interactive': t.primary.hex,
    '--cds-link-primary': t.primary.hex,
    '--cds-link-primary-hover': states.primary.hover.hex,
    '--cds-focus': states.focus.hex,
    '--cds-focus-inset': states.focus.hex,
    '--cds-button-primary': states.primary.base.hex,
    '--cds-button-primary-hover': states.primary.hover.hex,
    '--cds-button-primary-active': states.primary.pressed.hex,
    '--cds-text-on-color': t.onPrimary.hex,
    '--cds-icon-on-color': t.onPrimary.hex,
    '--cds-background-selected': t.primaryContainer.hex,
    '--cds-background-hover': t.surfaceVariant.hex,
    '--cds-layer-selected': t.primaryContainer.hex,
    '--cds-layer-selected-01': t.primaryContainer.hex,
    '--cds-layer-hover': t.surfaceVariant.hex,
    '--cds-layer-hover-01': t.surfaceVariant.hex,
    // Tags default to Carbon's fixed blue palette, which reads as a foreign
    // colour once the rest of the page is generated. Bind them to the accent.
    '--cds-tag-background-blue': t.primaryContainer.hex,
    '--cds-tag-color-blue': t.onPrimaryContainer.hex,
    '--cds-tag-hover-blue': states.primary.hover.hex,
    '--cds-tag-background-gray': t.surfaceVariant.hex,
    '--cds-tag-color-gray': t.onSurfaceVariant.hex,
  }
}

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

// Sampled from the Graphite UI Kit cover: bucketing every chromatic pixel by
// hue puts ~60% in the purple range, averaging this value. Seeding the source
// with it means the whole system matches the cover on first open, before the
// visitor has touched the colour control.
export const COVER_SOURCE_HEX = '#5e44aa'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<CarbonTheme>('g100')
  const [sourceHex, setSourceHexRaw] = useState(COVER_SOURCE_HEX)
  const [level, setLevel] = useState<ContrastLevel>('AA')
  const [autoFix, setAutoFix] = useState(true)

  const setSourceHex = (hex: string) => {
    if (HEX_RE.test(hex.trim())) setSourceHexRaw(normalizeHex(hex))
  }

  // Compute ramps + both themes whenever sourceHex changes
  const ramps = useMemo(() => (sourceHex ? makeRamps(sourceHex) : null), [sourceHex])

  const light = useMemo(
    () => (ramps ? buildTheme('light', ramps, level, autoFix) : null),
    [ramps, level, autoFix],
  )
  const dark = useMemo(
    () => (ramps ? buildTheme('dark', ramps, level, autoFix) : null),
    [ramps, level, autoFix],
  )
  const lightStates = useMemo(() => (ramps && light ? buildStates(light.tokens, ramps, 'light') : null), [ramps, light])
  const darkStates = useMemo(() => (ramps && dark ? buildStates(dark.tokens, ramps, 'dark') : null), [ramps, dark])

  const lightBundle = light && lightStates ? { ...light, states: lightStates } : null
  const darkBundle = dark && darkStates ? { ...dark, states: darkStates } : null

  // Stamp --cds-* variables onto document root.
  //
  // Transitions are suppressed for the duration of the write. A CSS transition
  // on `background-color` whose value comes from a custom property does not
  // resolve when that property is rewritten — the element strands on its
  // previous colour indefinitely. Carbon ships such a transition on every
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
      const vars = carbonVarsFor(activeTheme, activeStates)
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
    <ThemeContext.Provider value={{
        theme,
        toggleTheme,
        setTheme,
        sourceHex,
        setSourceHex,
        lightBundle,
        darkBundle,
        level,
        setLevel,
        autoFix,
        setAutoFix,
        ramps,
      }}>
      <GlobalTheme theme={theme}>{children}</GlobalTheme>
    </ThemeContext.Provider>
  )
}
