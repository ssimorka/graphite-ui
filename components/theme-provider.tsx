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
import {
  makeRamps,
  buildTheme,
  buildStates,
  buildGraphiteVars,
  normalizeHex,
} from '@/lib/color.js'

// The provider for Graphite's generated theme: the source color, light or
// dark, and the contrast target, with every generated --graphite-* variable
// written onto <html> as they change.
//
// It imports nothing from Carbon, so a project can lift it out with only
// lib/color.js (the engine), lib/cover-source.ts and lib/theme-storage.ts
// beside it. This site's Carbon layer plugs in through `extend`; see
// components/carbon-compat.tsx.

// The same two names the exported theme file uses for [data-theme], so a
// project that takes the file and the provider has one vocabulary.
export type ThemeName = 'light' | 'dark'

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

// --graphite-* carries everything, and is what Graphite's own components read.
// The set comes from buildGraphiteVars in lib/color.js, the same function the
// CSS exporter writes from, so what the provider stamps and what Create hands
// out cannot name things differently.

/** One generation pass, as an `extend` hook sees it. */
export type ThemePass = {
  theme: ThemeName
  tokens: ReturnType<typeof buildTheme>['tokens']
  states: ReturnType<typeof buildStates>
}

/**
 * Extra variables and a root class derived from each pass, stamped with the
 * Graphite set. The site uses it for Carbon's --cds-* layer; a project could
 * use it to feed another library the same way.
 */
export type ThemeExtension = (pass: ThemePass) => {
  vars?: Record<string, string>
  className?: string
}

export type ThemeProviderProps = {
  children: ReactNode
  /** The source color the theme is generated from. A project passes its
   *  brand color here; the site seeds the kit's cover color. */
  defaultSourceHex?: string
  defaultTheme?: ThemeName
  defaultLevel?: ContrastLevel
  /**
   * Write the generated --graphite-* variables onto <html>. On by default.
   * Turn it off when the project imports the theme file from Create, which
   * already carries them: the provider then only switches data-theme, and the
   * file's values are never overridden by inline styles.
   */
  stampVars?: boolean
  /** Remember the choice across page loads, in localStorage. Off by default:
   *  a project usually wants its source fixed in code, not in the browser. */
  persist?: boolean
  extend?: ThemeExtension
}


const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

// The seeded default. Declared in lib/cover-source so server code can read the
// value: an import from this 'use client' module arrives on the server as a
// reference, not a string. Re-exported so existing importers keep their path.
export { COVER_SOURCE_HEX }

export function ThemeProvider({
  children,
  defaultSourceHex = COVER_SOURCE_HEX,
  defaultTheme = 'light',
  defaultLevel = 'AA',
  stampVars = true,
  persist = false,
  extend,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeName>(defaultTheme)
  const [sourceHex, setSourceHexRaw] = useState(() => normalizeHex(defaultSourceHex))
  const [level, setLevel] = useState<ContrastLevel>(defaultLevel)
  // Whether the stored choice has been read. The server renders the defaults,
  // so the first client render must too; the stored choice is applied in a
  // layout effect straight after, before paint. Nothing is stamped or saved
  // until then, or the defaults would overwrite what was stored. Without
  // `persist` there is nothing to read, so it starts restored.
  const [restored, setRestored] = useState(!persist)

  // Reading localStorage is the external system this effect syncs from, and
  // it has to land before paint, which is why the setters run here. React's
  // lint rule against setState in an effect (on in Next's default ESLint
  // config) cannot tell this case apart, so it is disabled for this one
  // effect, for that reason only.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (!persist) return
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
  }, [persist])
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!restored || !persist) return
    try {
      localStorage.setItem(THEME_CHOICE_KEY, JSON.stringify({ sourceHex, theme, level }))
    } catch {}
  }, [restored, persist, sourceHex, theme, level])

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

  // Stamp the variables onto document root.
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
    // So the browser's own scrollbars and form controls follow the theme.
    root.style.colorScheme = theme

    const activeTheme = theme === 'light' ? light : dark
    const activeStates = theme === 'light' ? lightStates : darkStates

    let cls: string | undefined
    if (sourceHex && activeTheme && activeStates && ramps) {
      const extra = extend?.({ theme, tokens: activeTheme.tokens, states: activeStates }) ?? {}
      const vars = {
        ...extra.vars,
        ...(stampVars ? buildGraphiteVars(activeTheme, activeStates, ramps, theme) : {}),
      }
      for (const [prop, value] of Object.entries(vars)) {
        root.style.setProperty(prop, value)
      }
      cls = extra.className
      if (cls) root.classList.add(cls)
      // For the next page load's inline script (lib/theme-storage.ts).
      if (persist) {
        try {
          localStorage.setItem(THEME_PAINT_KEY, JSON.stringify({ theme, cls, vars }))
        } catch {}
      }
    }

    // Force a synchronous style flush so the new values are committed while
    // transitions are still suppressed, then re-arm immediately. Doing this
    // with requestAnimationFrame would leave the class stuck in a background
    // tab, where frames are throttled and the callback may never run.
    void root.offsetHeight
    root.classList.remove('is-retheming')
    // The extension's class belongs to this pass; the next pass may pick
    // another (Carbon's zone class flips with the theme).
    return () => {
      if (cls) root.classList.remove(cls)
    }
  }, [restored, theme, light, dark, lightStates, darkStates, sourceHex, ramps, stampVars, persist, extend])

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
      {children}
    </ThemeContext.Provider>
  )
}
