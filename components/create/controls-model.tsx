'use client'

import { useMemo } from 'react'
import { makeRamps } from '@/lib/color.js'
import type { RampName } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { SOURCE_TRIGGER_ID } from '@/components/color-picker'
import { useTheme } from '@/components/theme-provider'
import {
  BODY_FONTS,
  CODE_FONTS,
  DENSITIES,
  HEADING_FONTS,
  RADII,
  useBuilder,
} from './builder'
import type { LockKey } from './builder'

export type ControlId =
  | 'source'
  | 'theme'
  | 'contrast'
  | 'radius'
  | 'density'
  | 'headings'
  | 'body'
  | 'code'
  | 'derived'

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
}

// The kit's eight presets: the 500 stop of each ramp, sampled at the seeded
// source. Sampled from the engine rather than typed, so they cannot drift from
// the ramps page.
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

  const presets = useMemo(() => {
    const seed = makeRamps(COVER_SOURCE_HEX)
    return PRESET_RAMPS.map((name) => ({
      key: seed[name].stops[4].hex,
      label: `${name}/500`,
      swatch: seed[name].stops[4].hex,
    }))
  }, [])

  const hex = (sourceHex || COVER_SOURCE_HEX).toLowerCase()
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
    },
    {
      id: 'theme',
      label: 'Theme',
      heading: 'Theme',
      value: theme === 'white' ? 'Light' : 'Dark',
      options: [
        { key: 'white', label: 'Light' },
        { key: 'g100', label: 'Dark' },
      ],
      selected: theme,
      select: (k) => setTheme(k as 'white' | 'g100'),
      lock: 'theme',
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
    },
    {
      id: 'density',
      label: 'Density',
      heading: 'Density',
      value: DENSITIES.find((d) => d.key === b.density)!.label,
      options: DENSITIES.map((d) => ({ key: d.key, label: d.label })),
      selected: b.density,
      select: (k) => b.setDensity(k as typeof b.density),
    },
    {
      id: 'headings',
      label: 'Headings',
      heading: 'Headings (font-1)',
      value: fontLabel(HEADING_FONTS, b.headingFont),
      options: fontOptions(HEADING_FONTS),
      selected: b.headingFont,
      select: b.setHeadingFont,
    },
    {
      id: 'body',
      label: 'Body',
      heading: 'Body (font-2)',
      value: fontLabel(BODY_FONTS, b.bodyFont),
      options: fontOptions(BODY_FONTS),
      selected: b.bodyFont,
      select: b.setBodyFont,
    },
    {
      id: 'code',
      label: 'Code',
      heading: 'Code (font-mono)',
      value: fontLabel(CODE_FONTS, b.codeFont),
      options: fontOptions(CODE_FONTS),
      selected: b.codeFont,
      select: b.setCodeFont,
    },
    {
      id: 'derived',
      label: 'Derived roles',
      heading: 'Derived roles',
      value: '32 roles',
      options: [],
      selected: '',
      select: () => {},
    },
  ]
}

/** The eight roles the Derived roles section shows, as the kit lists them. */
export const DERIVED_ROLES = [
  'primary', 'secondary', 'surface', 'surface-variant',
  'on-surface', 'outline', 'danger', 'success',
] as const
