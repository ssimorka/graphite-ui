import { buildGraphiteVars } from '@/lib/color.js'
import type { ExportBundle } from '@/lib/color.js'
import type { ThemeFileFoundations } from '@/lib/theme-file'

/**
 * The Tailwind bridge: one small file that names Graphite's variables as
 * Tailwind v4 theme tokens, so a project can write `bg-surface`,
 * `text-on-primary` or `p-space-05` and get Graphite's values.
 *
 * It holds no values of its own. Every token is `var(--graphite-*)`, read from
 * the theme file (or the provider), so the color engine stays the only source
 * and a dark theme or a new source color reaches every utility. `@theme
 * inline` is what makes that work: without it Tailwind would resolve each
 * variable once at :root, and a `data-theme` set further down would not reach
 * the utilities.
 *
 * Generated rather than hand-written, from the same name list the provider and
 * the theme file use, so a role the engine gains arrives here without an edit.
 *
 * Breakpoints are the exception: literal, because Tailwind writes them into
 * media queries, where a custom property does not resolve. They ship
 * commented out, since replacing Tailwind's sm to xl would silently move every
 * responsive class in a project that already uses them.
 */

type Line = string

const prefixOf = (name: string, family: string) => name.replace(`--graphite-${family}-`, '')

export function buildTailwindBridge({
  bundle,
  foundations,
}: {
  bundle: ExportBundle
  foundations: ThemeFileFoundations
}) {
  const generated = Object.keys(
    buildGraphiteVars(bundle.light, bundle.lightStates, bundle.ramps, 'light'),
  )
  const names = foundations.desktop.map((d) => d.name)
  const of = (family: string) => names.filter((n) => n.startsWith(`--graphite-${family}-`))
  const lines: Line[] = []
  const section = (title: string, body: Line[]) => {
    if (!body.length) return
    lines.push('', `  /* ${title} */`, ...body)
  }

  // Colors: every generated variable. Roles (bg-surface, text-on-primary),
  // states (bg-primary-hover), the ladders (bg-elevation-01,
  // border-outline-subtle), the focus ring and the scrim.
  section(
    'Colors: roles, states, ladders, focus and scrim',
    generated.map((n) => `  --color-${n.replace('--graphite-', '')}: var(${n});`),
  )

  // Spacing keeps Graphite's step names behind a `space-` prefix: p-space-05
  // is the kit's 16px. A bare p-05 would sit next to Tailwind's own p-5
  // (20px) and invite exactly the wrong guess.
  section('Spacing: p-space-05, gap-space-03, p-density-default', [
    ...of('space').map((n) => `  --spacing-space-${prefixOf(n, 'space')}: var(${n});`),
    ...of('density').map((n) => `  --spacing-density-${prefixOf(n, 'density')}: var(${n});`),
  ])

  // rounded-none is Graphite's square-corner token, which Create can re-bind,
  // so it follows a rounded theme the way the components do.
  section(
    'Radius: rounded-none, rounded-4, rounded-full',
    of('radius').map((n) => `  --radius-${prefixOf(n, 'radius')}: var(${n});`),
  )

  const fonts = of('font')
  section('Type families: font-1 for display, font-2 for body; font-sans is font-2', [
    ...fonts.map((n) => `  --font-${prefixOf(n, 'font')}: var(${n});`),
    ...(fonts.includes('--graphite-font-2') ? ['  --font-sans: var(--graphite-font-2);'] : []),
  ])

  section(
    'Weights: font-regular, font-semibold',
    of('text-weight').map((n) => `  --font-weight-${prefixOf(n, 'text-weight')}: var(${n});`),
  )

  // Each type step is a size with its line height, as the kit pairs them:
  // text-body-3 sets both. The Mobile sizes arrive through the variables.
  const steps = of('text')
    .filter((n) => n.endsWith('-size') && !n.startsWith('--graphite-text-weight-'))
    .map((n) => n.slice('--graphite-text-'.length, -'-size'.length))
  section(
    'Type steps: text-body-3, text-heading-2, text-component-button-2',
    steps.flatMap((s) => [
      `  --text-${s}: var(--graphite-text-${s}-size);`,
      ...(names.includes(`--graphite-text-${s}-line-height`)
        ? [`  --text-${s}--line-height: var(--graphite-text-${s}-line-height);`]
        : []),
    ]),
  )

  // Easings are a Tailwind theme namespace; durations and delays are not, so
  // those become utilities below. ease-graphite is the default curve, Out,
  // under the name the bridge has always used.
  const easings = of('motion').filter((n) => /^--graphite-motion-(easing|spring)-/.test(n))
  section('Motion: ease-graphite-out, ease-graphite-in-out, ease-graphite-spring-sheet', [
    ...(names.includes('--graphite-motion-easing-out')
      ? ['  --ease-graphite: var(--graphite-motion-easing-out);']
      : []),
    ...easings.map(
      (n) => `  --ease-graphite-${n.replace(/^--graphite-motion-(easing-)?/, '')}: var(${n});`,
    ),
  ])
  section(
    'Elevation: shadow-overlay',
    names.includes('--graphite-shadow-overlay')
      ? ['  --shadow-overlay: var(--graphite-shadow-overlay);']
      : [],
  )

  // Durations and the tooltip delay: Tailwind has no theme namespace for
  // either, so each is a utility, duration-graphite-fast or
  // delay-graphite-tooltip. They set the transition's timing, as Tailwind's own
  // duration-* and delay-* do.
  const timing = of('motion').flatMap((n) => {
    const m = /^--graphite-motion-(duration|delay)-([a-z]+)$/.exec(n)
    if (!m) return []
    const prop = m[1] === 'duration' ? 'transition-duration' : 'transition-delay'
    return [`@utility ${m[1]}-graphite-${m[2]} {`, `  ${prop}: var(${n});`, '}', '']
  })

  // Literal values: a media query cannot read a custom property.
  const bps = foundations.desktop.filter((d) => d.name.startsWith('--graphite-breakpoint-'))
  const breakpoints = bps.map(
    (d) => `  --breakpoint-${prefixOf(d.name, 'breakpoint')}: ${d.value};`,
  )

  return [
    '/*',
    ' * Graphite for Tailwind v4',
    ' *',
    ' * Names Graphite variables as Tailwind tokens. Holds no values: import',
    ' * graphite-theme.css as well, which carries them. In your global CSS:',
    ' *',
    ' *   @import "tailwindcss";',
    ' *   @import "./graphite-theme.css";',
    ' *   @import "./graphite-tailwind.css";',
    ' *',
    " * Tailwind's own palette and scales stay available beside these.",
    ' */',
    '',
    '@theme inline {',
    ...lines.slice(1),
    '}',
    '',
    ...(timing.length
      ? ['/* Motion durations and delays: duration-graphite-fast, delay-graphite-tooltip */', ...timing]
      : []),
    "/* The kit's breakpoints, off by default. Uncomment the block to replace",
    "   Tailwind's sm, md, lg and xl with the kit's (and add max). Literal because",
    '   Tailwind writes them into media queries.',
    '',
    '@theme {',
    ...breakpoints,
    '}',
    '*/',
    '',
  ].join('\n')
}
