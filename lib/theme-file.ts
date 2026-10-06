import { buildCss, buildGraphiteVars } from '@/lib/color.js'
import type { ContrastLevel, ExportBundle } from '@/lib/color.js'

/**
 * The theme as one file an adopter drops into their project and keeps.
 *
 * On the site, the source color lives in the visitor's browser and the theme
 * provider recomputes everything on load. A project that adopts Graphite needs
 * the opposite: its brand color fixed in its own code, and no Graphite runtime
 * required to paint it. This file is that. It carries every variable a
 * Graphite component reads, foundations and colors, in light and dark, as
 * plain CSS.
 *
 * Pure, so Create can build it in the browser. The foundations arrive as data
 * because they are read from app/globals.scss on the server (readFoundations),
 * which keeps that stylesheet their only source.
 */

export type FoundationDecl = { name: string; value: string; note?: string }

export type ThemeFileFoundations = {
  desktop: FoundationDecl[]
  mobile: FoundationDecl[]
  /** The max-width the mobile overrides apply below, in px. */
  mobileMaxWidth: number | null
}

export type ThemeFileInput = {
  bundle: ExportBundle
  level: ContrastLevel
  foundations: ThemeFileFoundations
  /** Foundation values chosen in Create, by variable name. */
  overrides?: Record<string, string>
}

const decl = (name: string, value: string, note?: string) =>
  `  ${name}: ${value.replace(/\s+/g, ' ').trim()};${note ? ` /* ${note} */` : ''}`

export function buildThemeFile({ bundle, level, foundations, overrides = {} }: ThemeFileInput) {
  // The stylesheet also declares a few generated variables (the scrim) as
  // first-paint fallbacks for the site. The color blocks below carry those
  // per theme, so they are left out of the foundations.
  const generated = new Set(
    Object.keys(buildGraphiteVars(bundle.light, bundle.lightStates, bundle.ramps, 'light')),
  )
  const keep = (d: FoundationDecl) => !generated.has(d.name)

  const desktop = foundations.desktop.filter(keep).map((d) =>
    d.name in overrides
      ? decl(d.name, overrides[d.name], 'chosen in Create')
      : decl(d.name, d.value, d.note),
  )
  const mobile = foundations.mobile.filter(keep).map((d) => decl(d.name, d.value, d.note))

  const lines = [
    '/*',
    ' * Graphite theme',
    ` * Source ${bundle.hex.toLowerCase()}, contrast target ${level}.`,
    ' *',
    ' * Everything a Graphite component reads, as plain CSS: import this file',
    ' * once, globally, and the components are themed. No Graphite runtime is',
    ' * needed to paint it.',
    ' *',
    ' * Light is the default. Set data-theme="dark" on <html> for dark, or',
    ' * data-theme="light" to pin light. With neither, the page follows the',
    " * visitor's OS setting.",
    ' *',
    ' * Made in Graphite UI Create. To change the source, make a new file there',
    ' * rather than editing the colors by hand: every value below is derived from',
    ' * the one source, and contrast is checked as a set.',
    ' */',
    '',
    '/* Foundations: the same in both themes. */',
    ':root {',
    ...desktop,
    '}',
  ]
  if (mobile.length && foundations.mobileMaxWidth) {
    lines.push(
      '',
      `/* The kit's mobile type sizes, below ${foundations.mobileMaxWidth + 1}px. */`,
      `@media (max-width: ${foundations.mobileMaxWidth}px) {`,
      '  :root {',
      ...mobile.map((l) => `  ${l}`),
      '  }',
      '}',
    )
  }
  lines.push('', '/* Colors, generated from the source. */', buildCss(bundle))
  return lines.join('\n')
}
