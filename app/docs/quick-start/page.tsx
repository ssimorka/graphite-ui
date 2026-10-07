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

// The fonts the theme names, loaded under their own names.
const FONT_INSTALL = 'npm i @fontsource/ibm-plex-sans @fontsource/ibm-plex-mono'

// The root layout of a project without the Tailwind bridge: fonts, then the
// theme, once.
const LAYOUT = `// app/layout.tsx
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import '@fontsource/ibm-plex-sans/700.css'
import '@fontsource/ibm-plex-mono/400.css'
import './graphite-theme.css' // with Tailwind, in globals.css instead

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

// The example source color in the commands: six hex digits, no #.
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
              <StatusBadge tone="success">Next.js App Router</StatusBadge>
              <StatusBadge tone="neutral">Installs with the shadcn CLI</StatusBadge>
            </div>
          </header>

          <section id="before" className={styles.block}>
            <SectionHeading title="Before you start" />
            <ul className={styles.list}>
              <li>Node 20 or newer.</li>
              <li>
                An existing Next.js project on the App Router, in TypeScript.{' '}
                <code>npx create-next-app@latest</code> gives you one.
              </li>
              <li>
                The <code>@/</code> import alias, which{' '}
                <code>create-next-app</code> sets up by default.
              </li>
              <li>Tailwind v4, only if you want the Tailwind classes in step 4.</li>
            </ul>
            <p className={styles.stepText}>
              Another React setup, such as Vite, works too. Put the imports from
              steps 2 to 4 in your entry file (for example{' '}
              <code>src/main.tsx</code>) instead of <code>app/layout.tsx</code>,
              and set up the <code>@/</code> alias in <code>tsconfig.json</code>{' '}
              and your bundler.
            </p>
          </section>

          <section id="get-the-theme" className={styles.block}>
            <Step n={1} title="Add the theme">
              <p className={styles.stepText}>
                Run this in your project root. Put your color in place of{' '}
                <code>{EXAMPLE_HEX}</code>: six hex digits, no <code>#</code>.
              </p>
              <DocSnippet code={shadcnAdd('init', `theme/${EXAMPLE_HEX}`, 'tailwind')} />
              <p className={styles.stepText}>
                It writes three files: <code>components.json</code> in the
                project root, and <code>app/graphite-theme.css</code> and{' '}
                <code>app/graphite-tailwind.css</code>. The theme meets the AA
                contrast target. For AAA, add <code>?level=AAA</code> to the
                theme URL and put that URL in quotes.
              </p>
              <p className={styles.stepText}>
                The theme is one plain CSS file: foundations (space, radius,
                motion, type), then colors for light and dark, all as{' '}
                <code>--graphite-*</code> variables.
              </p>
              <DocSnippet code={cssHead} />
              <p className={styles.stepText}>
                To pick the color by eye, or to change radius, density or type
                too, use <a href="/create">Create</a> instead. Get the code
                downloads <code>graphite-theme.css</code> (and{' '}
                <code>graphite-tailwind.css</code> from its Tailwind tab), at the
                contrast target you chose there. Save them in <code>app/</code>,
                then run the init item alone so components can install:
              </p>
              <DocSnippet code={shadcnAdd('init')} />
            </Step>
          </section>

          <section id="fonts" className={styles.block}>
            <Step n={2} title="Load the fonts">
              <p className={styles.stepText}>
                The theme names IBM Plex but does not load it. Install it from
                Fontsource, which keeps the real font names.{' '}
                <code>next/font</code> renames fonts, so the theme would not find
                them.
              </p>
              <DocSnippet code={FONT_INSTALL} />
              <p className={styles.stepText}>
                Import the weights in <code>app/layout.tsx</code>, as step 3
                shows.
              </p>
            </Step>
          </section>

          <section id="add-it" className={styles.block}>
            <Step n={3} title="Import the theme">
              <p className={styles.stepText}>
                Import <code>graphite-theme.css</code> once. Without Tailwind,
                import it in <code>app/layout.tsx</code>, after the fonts. With
                Tailwind, import it in <code>globals.css</code> instead (step 4),
                not in both.
              </p>
              <p className={styles.stepText}>
                Set <code>data-theme=&quot;light&quot;</code> on{' '}
                <code>&lt;html&gt;</code> as the default, so the server and the
                browser agree. Remove it to follow the visitor&rsquo;s OS.
              </p>
              <p className={styles.stepText}>
                In a new <code>create-next-app</code> project, delete the
                starter&rsquo;s <code>:root</code>, <code>@theme</code> and{' '}
                <code>body</code> rules from <code>globals.css</code>: they
                override the theme.
              </p>
              <DocSnippet code={LAYOUT} />
            </Step>
          </section>

          <section id="tailwind" className={styles.block}>
            <Step n={4} title="Use Tailwind (optional)">
              <p className={styles.stepText}>
                On Tailwind v4, import the theme and then{' '}
                <code>graphite-tailwind.css</code> in <code>globals.css</code>.
                The Tailwind file holds no values, so dark theme and a new color
                reach every class. Write <code>bg-surface</code>,{' '}
                <code>text-on-primary</code>, <code>p-space-05</code> or{' '}
                <code>text-body-3</code>. Spacing keeps a <code>space-</code>{' '}
                prefix because the kit&rsquo;s 05 is 16px, where Tailwind&rsquo;s{' '}
                <code>p-5</code> is 20px. The kit&rsquo;s breakpoints are in the
                file too, commented out; uncomment them to replace
                Tailwind&rsquo;s.
              </p>
              <DocSnippet code={TAILWIND_USAGE} />
            </Step>
          </section>

          <section id="style" className={styles.block}>
            <Step n={5} title="Style with the roles">
              <p className={styles.stepText}>
                CSS modules in <code>.module.scss</code> need{' '}
                <code>sass</code>: run <code>npm i -D sass</code> first. Step 7
                adds it too, but your own module comes before that.
              </p>
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
            <Step n={6} title="Switch theme">
              <p className={styles.stepText}>
                Set <code>data-theme</code> to <code>light</code> or{' '}
                <code>dark</code> on <code>&lt;html&gt;</code>, or on any element
                to theme just that part.
              </p>
              <DocSnippet code={THEME_SWITCH} />
            </Step>
          </section>

          <section id="add-a-component" className={styles.block}>
            <Step n={7} title="Add a component">
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
