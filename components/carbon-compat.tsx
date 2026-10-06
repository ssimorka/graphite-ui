'use client'

// Carbon compatibility for this site. Not part of the theme provider.
//
// The site still renders some Carbon components (the home grid, a Tag, the
// token tables), and Carbon reads its own --cds-* variables, a zone class on
// <html>, and its GlobalTheme context. All three used to live inside
// ThemeProvider, which meant lifting the provider into another project meant
// installing Carbon. They now plug in from here, through the provider's
// `extend` option and a wrapper component, so the provider imports nothing
// from Carbon and this file is the one place the site's Carbon layer is fed.

import { useEffect, type ReactNode } from 'react'
import { GlobalTheme } from '@carbon/react'
import { useTheme, type ThemeExtension, type ThemeName } from '@/components/theme-provider'
import type { buildStates, buildTheme } from '@/lib/color.js'

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

/** Carbon's names for the two themes, as the zone class on <html>. */
const CARBON_ZONE: Record<ThemeName, string> = { light: 'cds--white', dark: 'cds--g100' }

/** The provider's `extend` hook: Carbon's variables and zone class for one pass. */
export const carbonExtension: ThemeExtension = ({ theme, tokens, states }) => ({
  vars: Object.fromEntries(
    CARBON_VAR_BINDINGS.map(([name, resolve]) => [name, resolve(tokens, states)]),
  ),
  className: CARBON_ZONE[theme],
})

/**
 * Carbon's own theme context, for the Carbon components that read it. Also
 * clears the other theme's zone class: the server renders one on <html> for
 * first paint, and the provider only removes classes it added itself.
 */
export function CarbonTheme({ children }: { children: ReactNode }) {
  const { theme } = useTheme()
  useEffect(() => {
    document.documentElement.classList.remove(CARBON_ZONE[theme === 'light' ? 'dark' : 'light'])
  }, [theme])
  return <GlobalTheme theme={theme === 'light' ? 'white' : 'g100'}>{children}</GlobalTheme>
}
