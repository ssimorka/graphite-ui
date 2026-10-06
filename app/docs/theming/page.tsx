import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { DocsShell } from '@/components/docs-shell'
import { DOCS_NAV, docsCrumbs } from '@/components/docs-nav'
import { SiteFooter } from '@/components/sections/site-footer'
import { Breadcrumb } from '@/components/ui/breadcrumb'
import {
  Callout,
  NextCard,
  NextCards,
  SectionHeading,
  StatusBadge,
} from '@/components/doc-blocks'
import { DoDont } from '@/components/component-page'
import { buildTheme, makeRamps, STATE_FAMILIES, STATUS_NAMES } from '@/lib/color.js'
import { COVER_SOURCE_HEX } from '@/lib/cover-source'
import { spell } from '@/lib/spell'
import {
  ContrastTable,
  CurrentLevel,
  RoleTable,
  StatesTable,
  ThemePairs,
} from './live'
import { TOC } from './toc'
import styles from './theming.module.scss'

export const metadata: Metadata = {
  title: 'Theming · Graphite UI',
  description:
    'How one source color becomes eight ramps and thirty-two roles in a light and a dark theme, with every text pairing contrast-checked and interaction states derived on the same ramps.',
}

const lower = (n: number) => spell(n).toLowerCase()
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

// ------------------------------------------------------------ engine reads
// Counts and names come from the engine at the seed, so the copy cannot fall
// behind it. The tables are live and re-resolve with the header's source.

const RAMPS = makeRamps(COVER_SOURCE_HEX)
const LIGHT = buildTheme('light', RAMPS)
const ROLES = Object.keys(LIGHT.tokens)
const PAIRS = Object.keys(LIGHT.contrast)
const RAMP_NAMES = Object.keys(RAMPS)

// What each role is for. Every role the engine emits must be described here:
// a new role fails the build until it is, rather than going missing from the
// page.
const PURPOSE: Record<string, string> = {
  background: 'The page itself',
  surface: 'Default container: cards, panels, sheets',
  surfaceElevated: 'One step up from surface, for what floats: menus, popovers, the modal panel',
  surfaceVariant: 'Secondary surface: fields, hover fills, selected rows',
  onBackground: 'Primary text and icons on the page',
  onSurface: 'Content on a default surface',
  onSurfaceVariant: 'Secondary text and icons, supporting copy',
  outline: 'Borders and dividers',
  primary: 'Primary buttons, links, interactive borders and icons',
  onPrimary: 'Content on a primary fill',
  primaryContainer: 'Low-emphasis accent fill: selected rows, tags',
  onPrimaryContainer: 'Content on primaryContainer',
  secondary: 'The counterpoint accent: secondary buttons, the vivid tenth of 60/30/10',
  onSecondary: 'Content on a secondary fill',
  secondaryContainer: 'Low-emphasis secondary fill',
  onSecondaryContainer: 'Content on secondaryContainer',
  danger: 'Errors, destructive actions, invalid input',
  warning: 'Warnings, risky but permitted actions',
  success: 'Confirmation, completion, valid input',
  info: 'Neutral information, tips, in-progress states',
}
const statusRole = (role: string) => {
  const m = role.match(/^(on)?([A-Z]?[a-z]+)(Container)?$/)
  const status = m && STATUS_NAMES.find((s) => s === m[2].toLowerCase())
  if (!status || PURPOSE[role]) return null
  return m![1]
    ? `Content on ${m![3] ? `${status}Container` : `a ${status} fill`}`
    : `Low-emphasis ${status} fill: banners, rows`
}
const purposeOf = (role: string) => {
  const p = PURPOSE[role] ?? statusRole(role)
  if (!p) throw new Error(`Theming page: no purpose written for the ${role} role.`)
  return p
}

const GROUPS: { title: string; note: string; match: (r: string) => boolean }[] = [
  {
    title: 'Surfaces and backgrounds',
    note: 'background and surface resolve to the same value in both themes. Layers are separated by borders and surface variants; surfaceElevated is the one step up, kept for what floats over the page.',
    match: (r) => ['background', 'surface', 'surfaceElevated', 'surfaceVariant'].includes(r),
  },
  {
    title: 'Content: text and icons',
    note: 'Text hierarchy is two levels, not three. Icons follow text: primary icons take onBackground or onSurface, secondary icons take onSurfaceVariant.',
    match: (r) => ['onBackground', 'onSurface', 'onSurfaceVariant'].includes(r),
  },
  {
    title: 'Borders',
    note: 'One border role covers every border. Interactive borders bind to primary instead. It is checked against surface at 3:1, so borders are guaranteed perceivable.',
    match: (r) => r === 'outline',
  },
  {
    title: 'Primary and secondary actions',
    note: 'The pairing rule is strict: onPrimary goes on primary, onPrimaryContainer on primaryContainer, and the same for secondary. Mixing them across containers breaks the contrast guarantee. One recorded exception: the kit’s secondary Button labels its secondary fill with onPrimary, so the Button keeps one label color across variants. That pair passes at the default source but is not one the engine checks.',
    match: (r) => /^(on)?(Primary|primary|Secondary|secondary)(Container)?$/.test(r),
  },
  {
    title: 'Status and feedback',
    note: 'Hue is fixed per status, so red still reads as danger whatever the source is. Chroma tracks the source, so statuses carry the same intensity as everything else. Containers work like primaryContainer: a low-emphasis fill for banners, rows and tags.',
    match: (r) => STATUS_NAMES.some((s) => r.toLowerCase().replace(/^on/, '').startsWith(s)),
  },
]
const grouped = GROUPS.map((g) => ({ ...g, roles: ROLES.filter(g.match) }))
const ungrouped = ROLES.filter((r) => !GROUPS.some((g) => g.match(r)))
if (ungrouped.length) {
  throw new Error(`Theming page: no group for ${ungrouped.join(', ')}.`)
}

const PIPELINE: { step: string; detail: ReactNode }[] = [
  {
    step: 'Your color',
    detail: 'One hex. The engine reads three things from it: which color it is, how intense, and how light.',
  },
  {
    step: 'Ramps',
    detail: `${cap(lower(RAMP_NAMES.length))} strips of ten shades each. Four follow your color, four carry status.`,
  },
  {
    step: 'Roles',
    detail: `${cap(lower(ROLES.length))} named jobs per theme, such as page background, body text and button fill. Each takes a shade and is checked for readability.`,
  },
  {
    step: 'States',
    detail: `Hover, pressed, selected, disabled and focus for the ${STATE_FAMILIES.join(', ').replace(/, ([^,]*)$/, ' and $1')} families, as steps on their own ramps.`,
  },
  {
    step: 'Wired into components',
    detail: (
      <>
        Written as --graphite-* variables, so a new source repaints everything.
      </>
    ),
  },
]

const RAMP_ROWS: [string, string, string][] = [
  ['accent', 'Same as your color', 'Brand color, interactive elements, focus'],
  ['secondary', 'Just over half, 120° round the wheel', 'The counterpoint: the vivid tenth of 60/30/10'],
  ['neutralVariant', 'Barely tinted', 'Borders and supporting text'],
  ['neutral', 'Almost gray', 'Page backgrounds, surfaces, primary text'],
  [STATUS_NAMES.join(' / '), 'Tracks your color, within limits', 'Status and feedback. Hue is fixed per status'],
]

const HIERARCHY: [string, string, string][] = [
  ['Page ground', 'background', 'The canvas'],
  ['Container', 'surface + outline', 'A defined region'],
  ['Floating', 'surfaceElevated', 'Something over the page: a menu, a dialog'],
  ['Distinct region', 'surfaceVariant', 'A field, a hovered or grouped area'],
  ['Selected or tagged', 'primaryContainer', 'Accented but not actionable'],
  ['Primary action', 'primary', 'The thing to click'],
  ['Primary content', 'onBackground / onSurface', 'What to read first'],
  ['Secondary content', 'onSurfaceVariant', 'Supporting detail'],
]

const THEME_PAIRS: [string, string][] = [
  ['background', 'Light ground to dark ground'],
  ['onBackground', 'Dark text to light text'],
  ['primary', 'Dark accent to light accent'],
  ['onPrimary', 'Light label to dark label'],
  ['outline', 'Mid to slightly lighter mid'],
]

const DOS = [
  'Assign roles, not values. Reach for primary or onSurfaceVariant, never the hex they resolve to today.',
  'Respect on pairings. onSurface belongs on surface; onPrimary belongs on primary.',
  'Use outline and surfaceVariant for depth, and surfaceElevated only for what floats.',
  'Check the contrast table when you change the source color, especially at AAA.',
  'Pair color with a second signal for any state or status, because a status hue can collide with the source.',
  'Design in both themes before handing off.',
]

const DONTS = [
  'Don’t apply raw hex values to components. A hex is one source color in one theme.',
  'Don’t reference primitives directly. accent 40 is a color without a job.',
  'Don’t invent status colors from the accent or neutral ramps. Use the status roles.',
  'Don’t use primaryContainer as a general surface: it makes everything look selected.',
  'Don’t nest three or more surface levels. There is no third value to resolve to.',
  'Don’t build hover or selected states with opacity. States are tone steps on the ramp.',
]

const SELECTION_ORDER = [
  'What is the element? A ground, a container, content, a border, or an action.',
  'Ground or container? background for the page, surface for a container, surfaceElevated for something floating, surfaceVariant for a field or distinct region.',
  'Content? The on- role matching whatever it sits on.',
  'Border? outline, or primary and the focus ring if it marks interaction.',
  'Action? primary with onPrimary for full emphasis, secondary for the counterpoint, a container pair for low emphasis.',
  'Status? danger, warning, success or info, with their containers for quiet fills.',
  'Interactive state? The state variable for that family, never a hand-adjusted value.',
  'No match? The role is missing. Flag it rather than working around it.',
]

const stateVars = STATE_FAMILIES.flatMap((f) =>
  ['hover', 'pressed', 'selected', 'disabled', 'disabled-content', 'focus'].map((s) => `${f}-${s}`),
)
const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

export default function ThemingPage() {
  return (
    <main id="main-content" className="page-main">
      <DocsShell
        nav={DOCS_NAV}
        toc={TOC}
        tocFooter={
          <div className={styles.footnote}>
            <p className={styles.footnoteHead}>
              {RAMP_NAMES.length} ramps · {ROLES.length} roles · {PAIRS.length} pairs
            </p>
            <p className={styles.footnoteBody}>
              Every table on this page is live. Change the source color in the
              header and they re-resolve.
            </p>
          </div>
        }
      >
        <article className={styles.page}>
          <header className={styles.header}>
            <Breadcrumb items={docsCrumbs('/docs/theming')} />
            <h1 className={styles.title}>Theming</h1>
            <p className={styles.lede}>
              Pick one color. Graphite builds the whole palette from it: every
              background, text color, border, button and status color, in light
              and dark, with each text pairing checked so what sits on it stays
              readable. You choose what a color is for, and the system decides
              what it is.
            </p>
            <div className={styles.badges}>
              <StatusBadge tone="primary">{`${RAMP_NAMES.length} ramps`}</StatusBadge>
              <StatusBadge tone="neutral">{`${ROLES.length} roles`}</StatusBadge>
              <StatusBadge tone="neutral">Light + Dark</StatusBadge>
            </div>
          </header>

          <section id="how-it-works" className={styles.block}>
            <SectionHeading
              title="How color works"
              lede="One color goes in. The engine turns it into named colors that each have a job, then wires those into the components."
            />
            <ol className={styles.pipeline}>
              {PIPELINE.map((p, i) => (
                <li key={p.step} className={styles.pipelineStep}>
                  <span className={styles.marker} aria-hidden="true">
                    {i + 1}
                  </span>
                  <span className={styles.pipelineBody}>
                    <span className={styles.pipelineName}>{p.step}</span>
                    <span className={styles.pipelineDetail}>{p.detail}</span>
                  </span>
                </li>
              ))}
            </ol>
            <h3 className={styles.subheading}>Why the math matters</h3>
            <p className={styles.note}>
              The calculations run in <strong>OKLab</strong>, a color model built
              to match how eyes work: equal steps in its numbers look like equal
              steps to a person, so tone 30 to 40 reads as the same jump as 80 to
              90. The models behind HSL and hex do not behave that way, which is
              why hand-picked palettes bunch up in the middle and flatten at the
              ends.
            </p>
            <h3 className={styles.subheading}>The ramps</h3>
            <p className={styles.note}>
              A ramp is one color laid out from dark to light. Three follow your
              hue exactly at different intensities; <code>secondary</code> turns
              it 120° round the wheel, so the counterpoint is generated rather
              than picked. The two neutrals keep a trace of your color, which is
              what makes the finished interface read as one family.
            </p>
            <div className={styles.scroll}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>The eight ramps</caption>
              <thead>
                <tr>
                  <th scope="col">Ramp</th>
                  <th scope="col">Intensity</th>
                  <th scope="col">What it is for</th>
                </tr>
              </thead>
              <tbody>
                {RAMP_ROWS.map(([name, chroma, use]) => (
                  <tr key={name}>
                    <th scope="row">
                      <code>{name}</code>
                    </th>
                    <td>{chroma}</td>
                    <td>{use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <p className={styles.note}>
              Ten stops are shown per ramp, but the engine can produce any tone in
              between, and often does. Your exact color is kept: it sits on the
              accent ramp unchanged. The{' '}
              <a className={styles.link} href="/docs/foundations/color">
                Color
              </a>{' '}
              foundation shows every stop live.
            </p>
            <Callout title="A raw shade has no job.">
              <>
                Something like <code>accent 40</code> is just a shade, not
                &ldquo;the button color&rdquo;. Never reach for one directly in a
                design; use the roles in the next section.
              </>
            </Callout>
          </section>

          <section id="roles" className={styles.block}>
            <SectionHeading
              title="Color roles"
              lede={`Every color in the interface has a job. There are ${lower(ROLES.length)} of them per theme: you pick the job, the system picks the value.`}
            />
            <p className={styles.note}>
              One naming rule explains most of the list: a name starting with{' '}
              <code>on</code> is what goes on top of something else.{' '}
              <code>onSurface</code> is the text color for anything on{' '}
              <code>surface</code>, and that pairing is measured and guaranteed,
              not suggested.
            </p>
            {grouped.map((g) => (
              <div key={g.title} className={styles.group}>
                <h3 className={styles.subheading}>{g.title}</h3>
                <RoleTable
                  caption={g.title}
                  roles={g.roles.map((r) => [r, purposeOf(r)])}
                />
                <p className={styles.caption}>{g.note}</p>
              </div>
            ))}
            <h3 className={styles.subheading}>What the roles do not cover</h3>
            <ul className={styles.list}>
              <li>
                <strong>Links.</strong> There is no separate link role. Links
                bind to <code>primary</code> and keep their underline, so color
                is never the only affordance.
              </li>
              <li>
                <strong>The scrim.</strong> It is not a role but it is generated:{' '}
                <code>--graphite-scrim</code> is a translucent version of the
                darkest neutral, so it tracks the source too. It has no on-color
                and no contrast pairing.
              </li>
              <li>
                <strong>Shadows.</strong> There is no shadow scale. Depth is
                outline, surfaceVariant and, for what floats, surfaceElevated.
              </li>
            </ul>
          </section>

          <section id="hierarchy" className={styles.block}>
            <SectionHeading
              title="Color hierarchy"
              lede="What makes one thing read as sitting on another. Here that comes from borders and tinted areas, not from shading."
            />
            <p className={styles.note}>
              Because <code>background</code> and <code>surface</code> are the
              same value, depth is not built by stacking lighter or darker planes.
              It comes from <strong>containment</strong> (<code>outline</code>),{' '}
              <strong>emphasis</strong> (<code>surfaceVariant</code>) and{' '}
              <strong>attention</strong> (the accent ramp).
            </p>
            <div className={styles.scroll}>
            <table className={styles.table}>
              <caption className={styles.srOnly}>Hierarchy levels</caption>
              <thead>
                <tr>
                  <th scope="col">Level</th>
                  <th scope="col">Role</th>
                  <th scope="col">Reads as</th>
                </tr>
              </thead>
              <tbody>
                {HIERARCHY.map(([level, role, reads]) => (
                  <tr key={level}>
                    <th scope="row">{level}</th>
                    <td>
                      <code>{role}</code>
                    </td>
                    <td>{reads}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
            <Callout title="Two rules follow.">
              {[
                'Do not nest more than two surface levels. With one surface and one variant, a third level has nothing to resolve to.',
                <>
                  <code>primaryContainer</code> is not a surface. It signals
                  accent state, so a card using it reads as selected, not raised.
                </>,
              ]}
            </Callout>
          </section>

          <section id="themes" className={styles.block}>
            <SectionHeading
              title="Themes"
              lede="Light and dark are built at the same time from the same color. The names stay the same in both; only the values change."
            />
            <p className={styles.note}>
              You do not maintain two palettes. <code>onSurface</code> means main
              text on a panel in both themes, and comes out near-black in light
              and near-white in dark. Content and ground swap ends of the ramp,
              and the accent inverts with them, so the relationships survive even
              though the values are opposite.
            </p>
            <ThemePairs rows={THEME_PAIRS} />
            <Callout title="A hex is right in one theme. A role is right in both.">
              <>
                That is the concrete reason to build with roles.{' '}
                <code>primary</code> is correct in light and dark, on every source
                a visitor picks, without anyone re-checking it.
              </>
            </Callout>
            <h3 className={styles.subheading}>Contrast levels</h3>
            <p className={styles.note}>
              Themes generate at one of two targets, applied to the whole theme
              rather than per role: <strong>AA</strong> (4.5:1 text, 3:1
              non-text) or <strong>AAA</strong> (7:1 text, 3:1 non-text). The
              site is generating at <CurrentLevel /> right now.
            </p>
          </section>

          <section id="states" className={styles.block}>
            <SectionHeading
              title="Interaction states"
              lede="How a color changes on hover, press, selection and focus, and when it is switched off."
            />
            <p className={styles.note}>
              A hovered button keeps its color and moves a few steps along its own
              ramp, which keeps it recognizably the same button with a readable
              label. Steps go <strong>darker in light and lighter in dark</strong>
              , away from the page, so the button gains prominence instead of
              fading. {cap(lower(STATE_FAMILIES.length))} families carry a full
              set ({STATE_FAMILIES.join(', ')}); <code>primary</code> is shown
              live below.
            </p>
            <StatesTable />
            <ul className={styles.list}>
              <li>
                <strong>Hover and selected share a tone.</strong> Selection is
                told apart by persistence and a second affordance (a check, a
                weight, a border), not by color alone.
              </li>
              <li>
                <strong>Pressed is twice the hover step,</strong> so a press reads
                as its own event rather than a stronger hover.
              </li>
              <li>
                <strong>Disabled leaves the family&rsquo;s ramp.</strong> Fill and
                content drop to neutral, so disabled reads the same whichever
                family it belongs to. It is low contrast on purpose, exempt under
                WCAG, and never the only sign a control is unavailable.
              </li>
              <li>
                <strong>Focus is a ring, not a fill.</strong> It stacks with
                hover, pressed and selected, so a focused control still shows its
                state.
              </li>
            </ul>
            <Callout title="Status is a role, not a state.">
              <>
                A field that fails validation takes <code>danger</code> for its
                border and message; it does not get a &ldquo;danger hover&rdquo;.
                Roles and states compose: a destructive button still hovers and
                presses along the danger ramp.
              </>
            </Callout>
          </section>

          <section id="accessibility" className={styles.block}>
            <SectionHeading
              title="Accessibility"
              lede="Text has to stand out from what is behind it. The engine checks this before it hands over a palette, rather than leaving it to a test afterwards."
            />
            <p className={styles.note}>
              {cap(lower(PAIRS.length))} pairings are measured in both themes
              every time a palette is generated. If one fell short, the engine
              would move that color along its own ramp until it passed, keeping
              the hue. The{' '}
              <a className={styles.link} href="/docs/accessibility">
                Accessibility
              </a>{' '}
              page reruns a sweep of that at build time.
            </p>
            <ContrastTable />
            <h3 className={styles.subheading}>What is not guaranteed</h3>
            <ul className={styles.list}>
              <li>
                <code>onSurfaceVariant</code> on <code>surface</code> is not a
                checked pairing. It is common and usually fine, but verify it.
              </li>
              <li>
                Any cross-pairing you invent: <code>onPrimaryContainer</code> on{' '}
                <code>surface</code>, <code>primary</code> as body text,{' '}
                <code>outline</code> as text.
              </li>
              <li>
                Text over images, gradients or generative art. Put a solid
                surface behind it.
              </li>
              <li>Disabled states, which are exempt by design.</li>
            </ul>
            <Callout tone="warning" title="Never let color carry meaning alone.">
              <>
                The source is the visitor&rsquo;s choice, so no hue can be
                assumed. And status hues are fixed: a red source resolves{' '}
                <code>primary</code> and <code>danger</code> to nearly the same
                value. Pair color with an icon, a label, a weight or a border.
              </>
            </Callout>
          </section>

          <section id="usage" className={styles.block}>
            <SectionHeading
              title="Usage"
              lede="Six rules each way. Most of them are the same rule: build with the job, not the value."
            />
            <DoDont dos={DOS} donts={DONTS} />
          </section>

          <section id="tokens" className={styles.block}>
            <SectionHeading
              title="Tokens"
              lede="How the roles are named in code, and how to pick the right one."
            />
            <h3 className={styles.subheading}>Naming</h3>
            <p className={styles.note}>
              Roles are camelCase in the engine and JSON (
              <code>onSurfaceVariant</code>) and kebab-case CSS variables on the
              site (<code>--graphite-on-surface-variant</code>). The CSS that
              Create exports uses the same names. The{' '}
              <a className={styles.link} href="/docs/foundations/tokens">
                Tokens
              </a>{' '}
              foundation lists every variable live.
            </p>
            <h3 className={styles.subheading}>Choosing a role</h3>
            <p className={styles.note}>Work down this order and stop at the first match.</p>
            <ol className={styles.ordered}>
              {SELECTION_ORDER.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ol>
            <h3 className={styles.subheading}>Complete reference</h3>
            <p className={styles.label}>{`Roles: ${ROLES.length} per theme`}</p>
            <p className={styles.chips}>
              {ROLES.map((r) => (
                <code key={r}>{`--graphite-${kebab(r)}`}</code>
              ))}
            </p>
            <p className={styles.label}>{`Interaction states: ${stateVars.length + 1} per theme`}</p>
            <p className={styles.chips}>
              {[...stateVars, 'focus'].map((s) => (
                <code key={s}>{`--graphite-${s}`}</code>
              ))}
            </p>
            <p className={styles.label}>{`Primitives: ${RAMP_NAMES.length} ramps × 10 stops`}</p>
            <p className={styles.note}>
              For reference and tooling. Inspect and copy them; do not design
              with them.
            </p>
            <h3 className={styles.subheading}>In Figma</h3>
            <p className={styles.note}>
              The kit carries the same system as variables: semantic roles with a
              Light and a Dark mode, and the primitives as their own collection.
              Pick roles in a design, never primitive stops, and regenerate rather
              than hand-edit when the source changes.
            </p>
          </section>

          <section id="glossary" className={styles.block}>
            <SectionHeading
              title="Glossary"
              lede="Plain definitions for ramp, role, tone and the rest."
            />
            <p className={styles.note}>
              Every term on this page is defined in the{' '}
              <a href="/docs/glossary">glossary</a>.
            </p>
          </section>

          <section id="next-steps" className={styles.block}>
            <SectionHeading
              title="Next steps"
              lede="See the palette, build one, or check it holds up."
            />
            <NextCards>
              <NextCard href="/create" title="Create">
                Pick a source, tune the theme against a live preview, and take the code.
              </NextCard>
              <NextCard href="/docs/foundations/color" title="Color">
                {`All ${lower(RAMP_NAMES.length)} ramps at every stop, live from the header's source.`}
              </NextCard>
              <NextCard href="/docs/accessibility" title="Accessibility">
                The contrast targets, the sweep behind them, and the gaps that are still open.
              </NextCard>
            </NextCards>
          </section>
        </article>
      </DocsShell>
      <SiteFooter />
    </main>
  )
}
