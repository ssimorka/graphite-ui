import fs from 'node:fs'
import path from 'node:path'
import type { Metadata } from 'next'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import { DocSnippet } from '@/components/doc-snippet'
import { RefTable, Surface } from '@/components/component-page'
import {
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
  buildGraphiteVars,
  buildStates,
  buildTheme,
  LADDERS,
  makeRamps,
  STATE_FAMILIES,
} from '@/lib/color.js'
import { SaveActions } from './examples/save-actions'
import { ReleaseNote } from './examples/release-note'
import { shadcnAdd } from '@/lib/registry-url'
import { TOC } from './toc'
import styles from './quick-start.module.scss'

export const metadata: Metadata = {
  title: 'Quick start · Graphite UI',
  description:
    'Use Graphite in your own project: take a theme from Create, add it, use the roles from CSS or Tailwind, switch theme, and add a component.',
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

// The per-family state suffixes buildGraphiteVars writes (lib/color.js).
// Stated here rather than read from a stamped page; the families themselves
// come from the engine.
const STATE_SUFFIXES = [
  'hover',
  'pressed',
  'selected',
  'disabled',
  'disabled-content',
  'focus',
]

/** The generated variables the theme file carries, counted from the engine. */
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
  const ladders = Object.keys(LADDERS.light).map((n) => `--graphite-${n}`)
  const all = Object.keys(buildGraphiteVars(light, lightStates, ramps, 'light'))
  const css = buildCss({
    hex: COVER_SOURCE_HEX,
    ramps,
    light,
    lightStates,
    dark,
    darkStates,
  })
  return { roles, states, ladders, all, css }
}

/**
 * The theme-invariant --graphite-* declarations, grouped by family. They are
 * the foundations the theme file writes above the colors, read from
 * globals.scss, which is their one source. The generated roles also appear
 * there as first-paint fallbacks, so anything the engine emits is excluded.
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

// How a project uses the downloaded theme file, in a Next.js root layout.
const THEME_FILE_USAGE = `// npm i @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono

// app/layout.tsx
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import './graphite-theme.css'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  )
}`

// The global stylesheet of a Tailwind v4 project using the bridge.
const TAILWIND_USAGE = `/* app/globals.css */
@import "tailwindcss";
@import "./graphite-theme.css";
@import "./graphite-tailwind.css";

/* then, in markup */
<div className="bg-surface text-on-surface p-space-05 rounded-none">
  <h2 className="font-1 text-heading-5">Graphite on Tailwind</h2>
</div>`

// Switching theme is one attribute; the theme file does the rest.
const THEME_SWITCH = `'use client'

export function ThemeToggle() {
  const toggle = () => {
    const root = document.documentElement
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'
  }
  return <button onClick={toggle}>Switch theme</button>
}`

// The example source color in the commands. Any six-digit hex works.
const EXAMPLE_HEX = '0f766e'

export default function QuickStartPage() {
  const contracts = readContracts()
  const bySlug = (slug: string) =>
    Object.values(contracts).find((c) => c.slug === slug)
  const button = bySlug('button')
  const group = bySlug('button-group')
  const gen = generatedVars()
  const generated = new Set(gen.all)
  const statics = staticVars(generated)
  // The head of the color part of the theme file for the seed: the selector
  // and the first roles, enough to show the naming and the shape.
  const cssHead = gen.css.split('\n').slice(0, 4).join('\n') + '\n  /* … */'

  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/quick-start')} />
            <h1 className={styles.title}>Quick start</h1>
            <p className={styles.lede}>
              Graphite in your own project, from a color to a themed screen.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="success">Any React project</StatusBadge>
              <StatusBadge tone="neutral">Installs with the shadcn CLI</StatusBadge>
            </div>
          </header>

          <section id="get-the-theme" className={styles.block}>
            <SectionHeading
              title="Get the theme"
              lede="One color in, a whole theme out."
            />
            <Step n={1} title="Set up the project">
              <p className={styles.stepText}>
                One command adds a <code>components.json</code>, the theme for
                your color and the Tailwind file. Put your own hex in place of{' '}
                <code>{EXAMPLE_HEX}</code>.
              </p>
              <DocSnippet code={shadcnAdd('init', `theme/${EXAMPLE_HEX}`, 'tailwind')} />
              <p className={styles.stepText}>
                The theme is one plain CSS file: foundations (space, radius,
                motion, type), then colors for light and dark, all as{' '}
                <code>--graphite-*</code> variables. To pick the color by eye,
                or to change radius, density or type too, use{' '}
                <a href="/create">Create</a> and download the file from Get the
                code instead.
              </p>
              <DocSnippet code={cssHead} />
            </Step>
          </section>

          <section id="add-it" className={styles.block}>
            <SectionHeading
              title="Add it to your project"
              lede="Plain CSS, with your color fixed in it."
            />
            <Step n={2} title="Import the theme and load the fonts">
              <p className={styles.stepText}>
                Import <code>graphite-theme.css</code> once, globally. Set{' '}
                <code>data-theme</code> on <code>&lt;html&gt;</code> to pick a
                theme, or leave it unset to follow the visitor&rsquo;s OS. To
                change color later, make a new file in Create: every value comes
                from the one color.
              </p>
              <p className={styles.stepText}>
                The theme names IBM Plex but does not load it. Load it under its
                own name, as below with Fontsource; <code>next/font</code>{' '}
                renames fonts, so the theme would not find them. In a new{' '}
                <code>create-next-app</code> project, clear the starter&rsquo;s{' '}
                <code>:root</code>, <code>@theme</code> and <code>body</code>{' '}
                rules from <code>globals.css</code>: they override the theme.
              </p>
              <DocSnippet code={THEME_FILE_USAGE} />
            </Step>
          </section>

          <section id="tailwind" className={styles.block}>
            <SectionHeading
              title="Use Tailwind"
              lede="Optional. The roles as Tailwind classes."
            />
            <Step n={3} title="Import the Tailwind file">
              <p className={styles.stepText}>
                On Tailwind v4, import <code>graphite-tailwind.css</code> after
                the theme file. It holds no values, so dark
                theme and a new color reach every class. Write{' '}
                <code>bg-surface</code>, <code>text-on-primary</code>,{' '}
                <code>p-space-05</code> or <code>text-body-3</code>. Spacing
                keeps a <code>space-</code> prefix because the kit&rsquo;s 05 is
                16px, where Tailwind&rsquo;s <code>p-5</code> is 20px. The kit&rsquo;s
                breakpoints are in the file too, commented out; uncomment them
                to replace Tailwind&rsquo;s.
              </p>
              <DocSnippet code={TAILWIND_USAGE} />
            </Step>
          </section>

          <section id="style" className={styles.block}>
            <SectionHeading
              title="Style with the roles"
              lede="Your own components read the same --graphite-* variables."
            />
            <Step n={4} title="Write a module against the roles">
              <p className={styles.stepText}>
                Use a role, never a hex. Here the container role and its{' '}
                <code>on-</code> partner are a checked pairing, so the text
                clears the contrast target for any color, in either theme.
              </p>
              <Surface label="Live: change the source and this follows">
                <ReleaseNote />
              </Surface>
              <DocSnippet code={example('release-note.tsx')} />
              <DocSnippet code={example('release-note.module.scss')} />
            </Step>
            <RefTable
              caption="The --graphite-* variables in a theme file"
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
                [
                  'Ladders (generated)',
                  String(gen.ladders.length),
                  gen.ladders.slice(0, 3).join(', '),
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
              {`Generated variables come from your color, ${gen.all.length} per theme: ${lower(gen.roles.length)} roles, ${lower(STATE_SUFFIXES.length)} states for each of the ${STATE_FAMILIES.join(', ')} families, ${lower(gen.ladders.length)} ladder steps for layers and borders, focus and scrim. Static ones are the same for every theme.`}{' '}
              <a href="/docs/foundations/tokens">Tokens</a> lists them all.
            </p>
          </section>

          <section id="switch-theme" className={styles.block}>
            <SectionHeading
              title="Switch theme"
              lede="One attribute. The theme file holds both."
            />
            <Step n={5} title="Set data-theme">
              <p className={styles.stepText}>
                Set <code>data-theme</code> to <code>light</code> or{' '}
                <code>dark</code> on <code>&lt;html&gt;</code>, or on any element
                to theme just that part.
              </p>
              <DocSnippet code={THEME_SWITCH} />
            </Step>
          </section>

          <section id="add-a-component" className={styles.block}>
            <SectionHeading
              title="Add a component"
              lede="Each one installs with everything it uses."
            />
            <Step n={6} title="Install Button and ButtonGroup">
              <p className={styles.stepText}>
                {`Button follows its contract at ${button?.version ?? 'an unversioned state'}, and ButtonGroup at ${group?.version ?? 'an unversioned state'}.`}{' '}
                The CLI adds their files to <code>components/ui</code>, the
                helpers they import, and <code>sass</code>,{' '}
                <code>clsx</code> and <code>class-variance-authority</code>.
              </p>
              <DocSnippet code={shadcnAdd('button', 'button-group')} />
              <p className={styles.stepText}>
                Button defaults to <code>secondary</code>, not the filled
                primary, and ButtonGroup allows one primary.
              </p>
              <Surface label="Live">
                <SaveActions />
              </Surface>
              <DocSnippet code={example('save-actions.tsx')} />
            </Step>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="Where to go once the basics work."
            />
            <NextCards>
              <NextCard href="/docs/theming" title="Theming">
                How the roles are derived, and which to use where.
              </NextCard>
              <NextCard href="/gallery" title="Components">
                Every component, with its contract version.
              </NextCard>
              <NextCard href="/docs#use-today" title="What you can use today">
                The theme, the Figma kit and the components, and their status.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
