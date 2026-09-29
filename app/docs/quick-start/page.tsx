import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
import { RefTable, Surface } from '@/components/component-page'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
  Step,
} from '@/components/doc-blocks'
import { readContracts } from '@/lib/contracts'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { spell } from '@/lib/spell'
import {
  buildCss,
  buildStates,
  buildTheme,
  makeRamps,
  STATE_FAMILIES,
} from '@/lib/color.js'
import { SaveActions } from './examples/save-actions'
import { ReleaseNote } from './examples/release-note'
import { SourcePicker } from './examples/source-picker'
import { ThemeSwitch } from './examples/theme-switch'
import { TOC } from './toc'
import styles from './quick-start.module.scss'

export const metadata: Metadata = {
  title: 'Quick start · Graphite UI',
  description:
    'The shortest path to using Graphite in this repo: pick a source color, use a governed component, style with the generated variables, switch theme, and take the tokens out.',
}

const lower = (n: number) => spell(n).toLowerCase()
const read = (...p: string[]) =>
  fs.readFileSync(path.join(process.cwd(), ...p), 'utf8')

/**
 * The snippets on this page are the files in ./examples, read at build time.
 * The same files render the live previews, so a snippet cannot drift from a
 * component API without the type-check failing on the example first.
 */
const example = (file: string) =>
  read('app', 'docs', 'quick-start', 'examples', file).trimEnd()

const kebab = (s: string) =>
  s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

// The per-family state suffixes theme-provider.tsx writes (graphiteVarsFor).
// Stated here because that module is 'use client' and its values do not reach
// a server component; the families themselves come from the engine.
const STATE_SUFFIXES = [
  'hover',
  'pressed',
  'selected',
  'disabled',
  'disabled-content',
  'focus',
]

/** What the provider stamps onto <html>, counted from the engine's output. */
function generatedVars() {
  const ramps = makeRamps(COVER_SOURCE_HEX)
  const light = buildTheme('light', ramps)
  const dark = buildTheme('dark', ramps)
  const lightStates = buildStates(light.tokens, ramps, 'light')
  const darkStates = buildStates(dark.tokens, ramps, 'dark')
  const roles = Object.keys(light.tokens).map((r) => `--graphite-${kebab(r)}`)
  const states = STATE_FAMILIES.flatMap((f) =>
    STATE_SUFFIXES.map((s) => `--graphite-${f}-${s}`),
  )
  const css = buildCss({
    hex: COVER_SOURCE_HEX,
    ramps,
    light,
    lightStates,
    dark,
    darkStates,
  })
  return { roles, states, css }
}

/**
 * The theme-invariant --graphite-* declarations in globals.scss, grouped by
 * family. The generated roles also appear there as first-paint fallbacks, so
 * anything the engine emits is excluded.
 */
function staticVars(generated: Set<string>) {
  const src = read('app', 'globals.scss')
  const names = new Set(
    [...src.matchAll(/(--graphite-[a-z0-9-]+)\s*:/g)].map((m) => m[1]),
  )
  const groups = new Map<string, string[]>()
  for (const n of names) {
    if (generated.has(n)) continue
    const family = n.replace('--graphite-', '').split('-')[0]
    groups.set(family, [...(groups.get(family) ?? []), n])
  }
  return groups
}

/**
 * The useTheme() value, read from its type in theme-provider.tsx so the table
 * lists what the context actually carries. The descriptions are the part a
 * person wrote; a field that arrives without one shows an empty cell rather
 * than disappearing.
 */
function themeApi() {
  const src = read('components', 'theme-provider.tsx')
  const alias = src.match(/type CarbonTheme = ([^\n]+)/)?.[1]?.trim() ?? ''
  const body = src.match(/type ThemeContextValue = \{([\s\S]*?)\n\}/)?.[1] ?? ''
  return [...body.matchAll(/^ {2}(\w+): ([^\n]+)$/gm)].map((m) => ({
    name: m[1],
    type: m[2].replace(/CarbonTheme/g, alias),
  }))
}

const API_NOTES: Record<string, string> = {
  theme: 'The active theme. The names are Carbon’s: white is light, g100 is dark.',
  toggleTheme: 'Flips between the two. This is what the header’s theme button calls.',
  setTheme: 'Sets one directly.',
  sourceHex: 'The current source, lower-case with a leading #.',
  setSourceHex:
    'Changes the source. Anything that is not a 3- or 6-digit hex is ignored.',
  lightBundle: 'Tokens, contrast results and states for the light theme.',
  darkBundle: 'The same for dark. Both are computed whichever theme is showing.',
  level: 'The contrast target the engine resolves against.',
  setLevel: 'Changes it, and every role re-resolves.',
  ramps: 'The ramps for the current source, keyed by name.',
}

export default function QuickStartPage() {
  const contracts = readContracts()
  const bySlug = (slug: string) =>
    Object.values(contracts).find((c) => c.slug === slug)
  const button = bySlug('button')
  const group = bySlug('button-group')
  const gen = generatedVars()
  const generated = new Set([...gen.roles, ...gen.states, '--graphite-focus', '--graphite-scrim'])
  const statics = staticVars(generated)
  const staticCount = [...statics.values()].reduce((n, v) => n + v.length, 0)
  const api = themeApi()
  // The head of the engine's CSS export for the seed: the selector and the
  // first role, which is enough to show the naming and the shape.
  const cssHead = gen.css.split('\n').slice(0, 4).join('\n') + '\n  /* … */'

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>{`${generated.size} generated · ${staticCount} static`}</p>
            <p className={styles.footnoteBody}>
              The --graphite-* variables this page counts: written by the theme
              provider on every change, or declared once in globals.scss.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb
              items={[
                { label: 'Docs', href: '/docs' },
                { label: 'Getting started' },
                { label: 'Quick start' },
              ]}
            />
            <h1 className={styles.title}>Quick start</h1>
            <p className={styles.lede}>
              Six steps from a running project to a themed screen and a theme
              you can take away. Every snippet on this page is a file in the
              repo that also renders the preview beside it, so the code is known
              to compile.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">In this repo</StatusBadge>
              <StatusBadge tone="neutral">No npm package</StatusBadge>
            </div>
          </header>

          <section id="run-it" className={styles.block}>
            <SectionHeading
              title="Run it"
              lede="Graphite is used from inside this repository. There is no package to install into another project yet."
            />
            <Step n={1} title="Start the dev server">
              <p className={styles.stepText}>
                Clone, install and run as{' '}
                <a href="/docs/installation">Installation</a> describes. The
                short version is <code>pnpm install</code> then{' '}
                <code>pnpm dev</code>, and the server must run under webpack.
                Everything below assumes it is up on port 3000.
              </p>
            </Step>
          </section>

          <section id="pick-a-color" className={styles.block}>
            <SectionHeading
              title="Pick a source color"
              lede="One hex is the only input. Everything else on the site is resolved from it."
            />
            <Step n={2} title="Set the source">
              <p className={styles.stepText}>
                The quickest way is the swatch in the header: pick a color and
                the site repaints. <a href="/create">Create</a> does the same
                with a live preview, presets and the rest of the theme choices
                beside it. In code, the source lives in the theme provider and{' '}
                <code>setSourceHex</code> changes it.
              </p>
              <Surface label="Live: these set the site’s source color">
                <SourcePicker />
              </Surface>
              <DocSnippet code={example('source-picker.tsx')} />
              <DocSnippet code={example('source-picker.module.scss')} />
            </Step>
            <Callout title="The source is site-wide, and it resets on reload.">
              <>
              The provider holds it in React state, so every surface reads the
              same value, but nothing persists it. Reloading returns to the seed,{' '}
              <code>{COVER_SOURCE_HEX.toUpperCase()}</code>, sampled from the
              kit&rsquo;s cover image.
              </>
            </Callout>
          </section>

          <section id="use-a-component" className={styles.block}>
            <SectionHeading
              title="Use a component"
              lede="Governed components live in components/ui and import from there."
            />
            <Step n={3} title="Import a Button">
              <p className={styles.stepText}>
                {`Button follows its contract at ${button?.version ?? 'an unversioned state'}, and ButtonGroup at ${group?.version ?? 'an unversioned state'}.`}{' '}
                Button defaults to <code>secondary</code>, not the filled
                primary, and ButtonGroup throws if it is handed a second primary:
                one primary action per group is a contract rule, not a
                suggestion.
              </p>
              <Surface label="Live">
                <SaveActions />
              </Surface>
              <DocSnippet code={example('save-actions.tsx')} />
            </Step>
            <p className={styles.note}>
              Neither file is a client component, so both render from a server
              component. Pass <code>onClick</code> from a client one. The{' '}
              <a href="/docs/components/button">Button page</a> lists every
              variant and size, and <a href="/gallery">Components</a> lists the
              rest.
            </p>
          </section>

          <section id="style" className={styles.block}>
            <SectionHeading
              title="Style with the variables"
              lede="Your own components read the same --graphite-* variables the governed ones do."
            />
            <Step n={4} title="Write a module against the roles">
              <p className={styles.stepText}>
                Use a role, never a hex. Here the container role and its{' '}
                <code>on-</code> partner are a checked pairing, so the text
                clears the contrast target for any source, in either theme.
              </p>
              <Surface label="Live: change the source and this follows">
                <ReleaseNote />
              </Surface>
              <DocSnippet code={example('release-note.tsx')} />
              <DocSnippet code={example('release-note.module.scss')} />
            </Step>
            <RefTable
              caption="The --graphite-* variables, by where they come from"
              columns={[
                { label: 'Group', tone: 'name' },
                { label: 'Count', tone: 'muted' },
                { label: 'Examples', tone: 'type' },
              ]}
              rows={[
                [
                  'Roles (generated)',
                  String(gen.roles.length),
                  gen.roles.slice(0, 3).join(', '),
                ],
                [
                  'States (generated)',
                  String(gen.states.length),
                  gen.states.slice(0, 3).join(', '),
                ],
                ['Focus and scrim (generated)', '2', '--graphite-focus, --graphite-scrim'],
                ...[...statics.entries()].map(([family, names]) => [
                  `${family} (static)`,
                  String(names.length),
                  names.slice(0, 3).join(', '),
                ]),
              ]}
            />
            <p className={styles.note}>
              {`Generated variables are written onto <html> by the theme provider every time the source, theme or contrast target changes: ${lower(gen.roles.length)} roles, and ${lower(STATE_SUFFIXES.length)} states for each of the ${STATE_FAMILIES.join(', ')} families. Static ones are declared once in app/globals.scss because they do not vary by theme.`}{' '}
              <a href="/docs/foundations/tokens">Tokens</a> lists them all.
            </p>
          </section>

          <section id="switch-theme" className={styles.block}>
            <SectionHeading
              title="Switch theme"
              lede="Light and dark are both computed on every change, so switching is a lookup, not a rebuild."
            />
            <Step n={5} title="Read the theme from useTheme">
              <p className={styles.stepText}>
                <code>useTheme</code> is the hook the header&rsquo;s theme button
                uses. It needs a client component.
              </p>
              <Surface label="Live: switches the site theme">
                <ThemeSwitch />
              </Surface>
              <DocSnippet code={example('theme-switch.tsx')} />
            </Step>
            <RefTable
              caption="What useTheme returns"
              columns={[
                { label: 'Field', tone: 'name' },
                { label: 'Type', tone: 'type' },
                { label: 'What it is', tone: 'text' },
              ]}
              rows={api.map((f) => [f.name, f.type, API_NOTES[f.name] ?? ''])}
            />
          </section>

          <section id="take-the-tokens" className={styles.block}>
            <SectionHeading
              title="Take the tokens out"
              lede="Create exports the theme as it stands, from the same engine the site runs."
            />
            <Step n={6} title="Open Get the code in Create">
              <p className={styles.stepText}>
                In <a href="/create">Create</a>, Get the code opens the theme as
                CSS or JSON, with a Download button. The CSS carries both themes,
                light under <code>:root</code> and{' '}
                <code>[data-theme=&quot;light&quot;]</code>, dark under{' '}
                <code>[data-theme=&quot;dark&quot;]</code>, and each role comes
                with its ramp and tone. A second block adds the radius and three
                typefaces chosen in Create. The JSON holds the source, the four
                source ramps and both themes&rsquo; tokens, contrast results and
                states.
              </p>
              <DocSnippet code={cssHead} />
            </Step>
            <Callout tone="warning" title="The export names roles --cts-*, not --graphite-*.">
              <>
              That is the engine&rsquo;s exporter vocabulary, inherited from
              Carbon Token Studio. The components in this repo read{' '}
              <code>--graphite-*</code>, so alias or rename the exported
              variables before pointing them at Graphite components. The
              builder&rsquo;s radius and typeface block already uses{' '}
              <code>--graphite-*</code> names.
              </>
            </Callout>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="Where to go once the basics work."
            />
            <NextCards>
              <NextCard href="/docs/theming" title="Theming">
                How the ramps and roles are derived, and which role to use where.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                {`All ${lower(Object.keys(contracts).length)} governed components, with their contract versions.`}
              </NextCard>
              <NextCard href="/docs/governance" title="Governance">
                What a change to a component has to go through before it lands.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
