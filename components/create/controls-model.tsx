'use client'

import { useMemo } from 'react'
import { makeRamps } from '@/lib/color.js'
import type { RampName } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { SOURCE_TRIGGER_ID } from '@/components/color-picker'
import { useTheme } from '@/components/theme-provider'
import { ART_OPTIONS, ART_PRESETS, isHueless } from '@/components/generative-art'
import type { ArtSettings } from '@/components/generative-art'
import {
  CODE_FONTS,
  DENSITIES,
  TEXT_FONTS,
  ICON_FAMILIES,
  RADII,
  useBuilder,
} from './builder'
import type { BuilderView, LockKey } from './builder'

export type ControlId =
  | 'source'
  | 'theme'
  | 'contrast'
  | 'radius'
  | 'density'
  | 'icons'
  | 'headings'
  | 'body'
  | 'code'
  | 'derived'
  | 'look'
  | 'intensity'
  | 'range'
  | 'tone'
  | 'companion'
  | 'mix'
  | 'grid'

export type Option = { key: string; label: string; swatch?: string }

export type Control = {
  id: ControlId
  /** The label in the kit: SOURCE COLOR on the panel, Source color on the bar. */
  label: string
  /** The panel's caps heading. The compact bar groups the three faces by role. */
  heading: string
  /** What the picker shows as its value. */
  value: string
  options: Option[]
  selected: string
  select: (key: string) => void
  /** The Lock the kit draws on this control, if it draws one. */
  lock?: LockKey
  /** Which tab shows it. The source is shared; the rest belong to one tab. */
  view: BuilderView | 'both'
  /** A line under the control, when it is constrained. */
  note?: string
  /** Shown but not settable, with `note` saying why. */
  disabled?: boolean
}

/** The controls a tab shows, in order. */
export const forView = (controls: Control[], view: BuilderView) =>
  controls.filter((c) => c.view === 'both' || c.view === view)

// The kit's eight presets: the 500 stop of each ramp, sampled at the current
// source so they follow whatever is picked. Sampled from the engine rather than
// typed, so they cannot drift from the ramps page. Accent shows the source stop
// itself rather than its 500, so the first swatch is always the current pick.
const PRESET_RAMPS: RampName[] = [
  'accent', 'secondary', 'info', 'success', 'warning', 'danger',
  'neutralVariant', 'neutral',
]

/** Open the header's source-colour popover: the builder's "Pick" and "Custom hex". */
export function openSourcePicker() {
  const trigger = document.getElementById(SOURCE_TRIGGER_ID)
  if (!trigger) return
  window.scrollTo({ top: 0, behavior: 'smooth' })
  trigger.click()
  trigger.focus()
}

/**
 * One description of every control, read by both the desktop panel and the
 * compact bar, so the two cannot disagree about what a control offers.
 */
export function useControls(): Control[] {
  const { sourceHex, setSourceHex, theme, setTheme, level, setLevel } = useTheme()
  const b = useBuilder()

  const hex = (sourceHex || COVER_SOURCE_HEX).toLowerCase()

  const presets = useMemo(() => {
    const ramps = makeRamps(hex)
    return PRESET_RAMPS.map((name) => {
      const stops = ramps[name].stops
      const stop = (name === 'accent' && stops.find((s) => s.source)) || stops[4]
      return {
        key: stop.hex,
        label: name === 'accent' ? 'accent/source' : `${name}/500`,
        swatch: stop.hex,
      }
    })
  }, [hex])

  const fontLabel = (opts: { key: string; label: string }[], key: string) =>
    opts.find((o) => o.key === key)?.label ?? ''
  const fontOptions = (opts: { key: string; label: string }[]): Option[] =>
    opts.map((o) => ({ key: o.key, label: o.label }))

  return [
    {
      id: 'source',
      label: 'Source color',
      heading: 'Source color',
      value: hex.toUpperCase(),
      options: presets,
      selected: hex,
      select: (k) => setSourceHex(k),
      lock: 'source',
      view: 'both',
    },
    {
      id: 'theme',
      label: 'Theme',
      heading: 'Theme',
      value: theme === 'light' ? 'Light' : 'Dark',
      options: [
        { key: 'light', label: 'Light' },
        { key: 'dark', label: 'Dark' },
      ],
      selected: theme,
      select: (k) => setTheme(k as 'light' | 'dark'),
      lock: 'theme',
      view: 'components',
    },
    {
      id: 'contrast',
      label: 'Contrast',
      heading: 'Contrast target',
      value: level,
      options: [
        { key: 'AA', label: 'AA' },
        { key: 'AAA', label: 'AAA' },
      ],
      selected: level,
      select: (k) => setLevel(k as 'AA' | 'AAA'),
      lock: 'contrast',
      view: 'components',
    },
    {
      id: 'radius',
      label: 'Radius',
      heading: 'Radius',
      value: RADII.find((r) => r.key === b.radius)!.label,
      options: RADII.map((r) => ({ key: r.key, label: r.label })),
      selected: b.radius,
      select: (k) => b.setRadius(k as typeof b.radius),
      lock: 'radius',
      view: 'components',
    },
    {
      id: 'density',
      label: 'Density',
      heading: 'Density',
      value: DENSITIES.find((d) => d.key === b.density)!.label,
      options: DENSITIES.map((d) => ({ key: d.key, label: d.label })),
      selected: b.density,
      select: (k) => b.setDensity(k as typeof b.density),
      view: 'components',
    },
    {
      id: 'icons',
      label: 'Icons',
      heading: 'Icons',
      value: ICON_FAMILIES.find((f) => f.key === b.iconSet)!.label,
      options: ICON_FAMILIES.map((f) => ({ key: f.key, label: f.label })),
      selected: b.iconSet,
      select: (k) => b.setIconSet(k as typeof b.iconSet),
      view: 'components',
    },
    {
      id: 'headings',
      label: 'Headings',
      heading: 'Headings (font-1)',
      value: fontLabel(TEXT_FONTS, b.headingFont),
      options: fontOptions(TEXT_FONTS),
      selected: b.headingFont,
      select: b.setHeadingFont,
      view: 'components',
    },
    {
      id: 'body',
      label: 'Body',
      heading: 'Body (font-2)',
      value: fontLabel(TEXT_FONTS, b.bodyFont),
      options: fontOptions(TEXT_FONTS),
      selected: b.bodyFont,
      select: b.setBodyFont,
      view: 'components',
    },
    {
      id: 'code',
      label: 'Code',
      heading: 'Code (font-mono)',
      value: fontLabel(CODE_FONTS, b.codeFont),
      options: fontOptions(CODE_FONTS),
      selected: b.codeFont,
      select: b.setCodeFont,
      view: 'components',
    },
    {
      id: 'derived',
      label: 'Derived roles',
      heading: 'Derived roles',
      value: '32 roles',
      options: [],
      selected: '',
      select: () => {},
      view: 'components',
    },
    ...artControls(b.art, b.setArt, isHueless(hex)),
  ]
}

const label = (opts: readonly { key: string; label: string }[], key: string) =>
  opts.find((o) => o.key === key)?.label ?? ''

/** The Generative Art tab's controls. Its colors still come from the source. */
function artControls(
  art: ArtSettings,
  setArt: (patch: Partial<ArtSettings>) => void,
  hueless: boolean,
): Control[] {
  const look = ART_PRESETS.find((p) =>
    Object.entries(p.set).every(([k, v]) => art[k as keyof ArtSettings] === v),
  )
  const chip = <K extends keyof ArtSettings>(
    id: Exclude<ControlId, 'source'> & K,
    heading: string,
    lock?: LockKey,
  ): Control => ({
    id,
    label: heading,
    heading,
    value: label(ART_OPTIONS[id], art[id]),
    options: ART_OPTIONS[id].map((o) => ({ key: o.key, label: o.label })),
    selected: art[id],
    select: (k) => setArt({ [id]: k } as Partial<ArtSettings>),
    lock,
    view: 'art',
  })
  const intensity = chip('intensity', 'Intensity', 'intensity')
  return [
    {
      id: 'look',
      label: 'Look',
      heading: 'Look',
      value: look?.label ?? 'Custom',
      options: ART_PRESETS.map((p) => ({ key: p.key, label: p.label })),
      selected: look?.key ?? '',
      select: (k) => {
        const p = ART_PRESETS.find((x) => x.key === k)
        if (p) setArt(p.set)
      },
      view: 'art',
    },
    hueless
      ? {
          ...intensity,
          value: 'Off',
          selected: 'off',
          select: () => {},
          disabled: true,
          note: 'Your pick is grey, black or white, so there is no hue to draw with. Pick a color to turn intensity up.',
        }
      : intensity,
    chip('range', 'Contrast', 'range'),
    chip('tone', 'Color tone'),
    chip('companion', 'Companion', 'companion'),
    chip('mix', 'Mix'),
    chip('grid', 'Grid'),
  ]
}

/** The eight roles the Derived roles section shows, as the kit lists them. */
export const DERIVED_ROLES = [
  'primary', 'secondary', 'surface', 'surface-variant',
  'on-surface', 'outline', 'danger', 'success',
] as const
