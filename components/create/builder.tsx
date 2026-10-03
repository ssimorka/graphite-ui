'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { hsvToHex } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { useTheme } from '@/components/theme-provider'
import type { IconSet } from '@/lib/kit-icons'

// ------------------------------------------------------------------ options
// The theme builder's small closed sets. Each is a row of choice chips in the
// kit's Controls panel (Graphite UI Site 13294:5358 and its siblings).

export const RADII = [
  { key: 'none', label: 'None', value: 'var(--graphite-radius-none)' },
  { key: '2', label: '2', value: 'var(--graphite-radius-2)' },
  { key: '4', label: '4', value: 'var(--graphite-radius-4)' },
  { key: '6', label: '6', value: 'var(--graphite-radius-6)' },
  { key: '8', label: '8', value: 'var(--graphite-radius-8)' },
  { key: '16', label: '16', value: 'var(--graphite-radius-16)' },
  { key: '20', label: '20', value: 'var(--graphite-radius-20)' },
  { key: 'full', label: 'Full', value: 'var(--graphite-radius-full)' },
] as const
export type RadiusKey = (typeof RADII)[number]['key']

export const DENSITIES = [
  { key: 'compact', label: 'Compact' },
  { key: 'default', label: 'Default' },
  { key: 'spacious', label: 'Spacious' },
] as const
export type DensityKey = (typeof DENSITIES)[number]['key']

// The kit's three icon families (Graphite UI Kit, Foundations: Icons), all in
// their straight-corner cut, which is the one the kit draws with. Mocked in
// Graphite UI Site as Controls section — Icons and Sheet — Icons.
export const ICON_FAMILIES: { key: IconSet; label: string }[] = [
  { key: 'regular', label: 'Regular' },
  { key: 'bold', label: 'Bold' },
  { key: 'solid', label: 'Solid' },
]

export const DEVICES = [
  { key: 'desktop', label: 'Desktop' },
  { key: 'tablet', label: 'Tablet' },
  { key: 'mobile', label: 'Mobile' },
] as const
export type DeviceKey = (typeof DEVICES)[number]['key']

/**
 * Typefaces the builder offers. The kit's own type is IBM Plex (governance rule
 * 7), so this is an opt-in override of the preview and of the exported CSS, not
 * a change to the system: every option is a family that is either shipped
 * already (Plex loads with Carbon's fonts) or is on every machine.
 */
export type FontOption = { key: string; label: string; stack: string }
export const HEADING_FONTS: FontOption[] = [
  { key: 'plex-sans', label: 'IBM Plex Sans', stack: "'IBM Plex Sans', system-ui, sans-serif" },
  { key: 'plex-serif', label: 'IBM Plex Serif', stack: "'IBM Plex Serif', Georgia, serif" },
  { key: 'system', label: 'System UI', stack: 'system-ui, -apple-system, sans-serif' },
  { key: 'georgia', label: 'Georgia', stack: "Georgia, 'Times New Roman', serif" },
]
export const BODY_FONTS: FontOption[] = HEADING_FONTS
export const CODE_FONTS: FontOption[] = [
  { key: 'plex-mono', label: 'IBM Plex Mono', stack: "'IBM Plex Mono', 'Courier New', monospace" },
  { key: 'system-mono', label: 'System mono', stack: "ui-monospace, SFMono-Regular, Menlo, monospace" },
  { key: 'courier', label: 'Courier New', stack: "'Courier New', Courier, monospace" },
]

/** The controls that carry a Lock in the kit; the others are never shuffled. */
export type LockKey = 'source' | 'theme' | 'contrast' | 'radius'

// ------------------------------------------------------------------- state
type Builder = {
  radius: RadiusKey
  setRadius: (r: RadiusKey) => void
  density: DensityKey
  setDensity: (d: DensityKey) => void
  headingFont: string
  setHeadingFont: (k: string) => void
  bodyFont: string
  setBodyFont: (k: string) => void
  codeFont: string
  setCodeFont: (k: string) => void
  iconSet: IconSet
  setIconSet: (s: IconSet) => void
  device: DeviceKey
  setDevice: (d: DeviceKey) => void
  locks: Record<LockKey, boolean>
  toggleLock: (k: LockKey) => void
  shuffle: () => void
  reset: () => void
  /**
   * Inline custom properties for the preview root. Scoped there on purpose:
   * the builder's radius, density and type are choices about the preview, and
   * must not restyle the site chrome around it.
   *
   * Radius re-binds `--graphite-radius-none`, the square-corner token every
   * governed component reads for its corners, so a rounded preview needs no
   * edit to any component. Components that use another radius token (Tag and
   * Toggle are pills, Tooltip is 2px) are deliberately left as they are.
   */
  previewStyle: CSSProperties
}

const BuilderContext = createContext<Builder | null>(null)

export function useBuilder(): Builder {
  const ctx = useContext(BuilderContext)
  if (!ctx) throw new Error('useBuilder must be used inside <BuilderProvider>')
  return ctx
}

// Card padding and the gap inside a card, per density: 16/12, 24/16, 32/24.
const CARD_PAD: Record<DensityKey, string> = { compact: '05', default: '06', spacious: '07' }
const CARD_GAP: Record<DensityKey, string> = { compact: '04', default: '05', spacious: '06' }

const stackOf = (options: FontOption[], key: string) =>
  (options.find((o) => o.key === key) ?? options[0]).stack

const pick = <T,>(items: readonly T[]) =>
  items[Math.floor(Math.random() * items.length)]

const DEFAULTS = {
  radius: 'none' as RadiusKey,
  density: 'default' as DensityKey,
  headingFont: 'plex-sans',
  bodyFont: 'plex-sans',
  codeFont: 'plex-mono',
  iconSet: 'regular' as IconSet,
}

export function BuilderProvider({ children }: { children: ReactNode }) {
  const { setSourceHex, setTheme, setLevel, theme } = useTheme()
  const [radius, setRadius] = useState<RadiusKey>(DEFAULTS.radius)
  const [density, setDensity] = useState<DensityKey>(DEFAULTS.density)
  const [headingFont, setHeadingFont] = useState(DEFAULTS.headingFont)
  const [bodyFont, setBodyFont] = useState(DEFAULTS.bodyFont)
  const [codeFont, setCodeFont] = useState(DEFAULTS.codeFont)
  const [iconSet, setIconSet] = useState<IconSet>(DEFAULTS.iconSet)
  const [device, setDevice] = useState<DeviceKey>('desktop')
  const [locks, setLocks] = useState<Record<LockKey, boolean>>({
    source: false,
    theme: false,
    contrast: false,
    radius: false,
  })

  const toggleLock = useCallback(
    (k: LockKey) => setLocks((l) => ({ ...l, [k]: !l[k] })),
    [],
  )

  // Shuffle randomises what is unlocked, and only the four controls the kit
  // gives a Lock. Density, type and icons have none, so they are not part of
  // the dice.
  const shuffle = useCallback(() => {
    if (!locks.source) {
      // A saturated, mid-value colour: a random hex is mostly muddy, and the
      // builder is there to show what a good source does.
      setSourceHex(hsvToHex({ h: Math.random() * 360, s: 0.55 + Math.random() * 0.35, v: 0.6 + Math.random() * 0.3 }))
    }
    if (!locks.theme) setTheme(pick(['white', 'g100'] as const))
    if (!locks.contrast) setLevel(pick(['AA', 'AAA'] as const))
    if (!locks.radius) setRadius(pick(RADII).key)
  }, [locks, setSourceHex, setTheme, setLevel])

  const reset = useCallback(() => {
    setSourceHex(COVER_SOURCE_HEX)
    setTheme('g100')
    setLevel('AA')
    setRadius(DEFAULTS.radius)
    setDensity(DEFAULTS.density)
    setHeadingFont(DEFAULTS.headingFont)
    setBodyFont(DEFAULTS.bodyFont)
    setCodeFont(DEFAULTS.codeFont)
    setIconSet(DEFAULTS.iconSet)
  }, [setSourceHex, setTheme, setLevel])

  const previewStyle = useMemo<CSSProperties>(
    () =>
      ({
        '--graphite-radius-none': RADII.find((r) => r.key === radius)!.value,
        // Density re-binds the default step, which is what ContainedList and
        // DataTable pad with when no density is passed, so a component that
        // takes the default follows the choice with no prop. The examples'
        // own spacing follows through the card variables below.
        '--graphite-density-default': `var(--graphite-density-${density})`,
        '--card-pad': `var(--graphite-space-${CARD_PAD[density]})`,
        '--card-gap': `var(--graphite-space-${CARD_GAP[density]})`,
        '--graphite-font-1': stackOf(HEADING_FONTS, headingFont),
        '--graphite-font-2': stackOf(BODY_FONTS, bodyFont),
        '--graphite-font-mono': stackOf(CODE_FONTS, codeFont),
        fontFamily: 'var(--graphite-font-2)',
      }) as CSSProperties,
    [radius, density, headingFont, bodyFont, codeFont],
  )

  const value: Builder = {
    radius,
    setRadius,
    density,
    setDensity,
    headingFont,
    setHeadingFont,
    bodyFont,
    setBodyFont,
    codeFont,
    setCodeFont,
    iconSet,
    setIconSet,
    device,
    setDevice,
    locks,
    toggleLock,
    shuffle,
    reset,
    previewStyle,
  }
  void theme // theme is read by the controls through useTheme directly
  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>
}
