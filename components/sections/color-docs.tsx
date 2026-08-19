'use client'

import {
  Grid,
  Column,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from '@carbon/react'
import { Checkmark, Close, ArrowRight } from '@carbon/icons-react'
import type { ReactNode } from 'react'
import { useTheme, CARBON_VAR_COUNT } from '@/components/theme-provider'
import { weightLabelFor } from '@/components/studio'
import { Reveal } from '@/components/reveal'

// Every value on this page is read from the live bundles rather than written
// into the copy, so the documentation always describes the palette the visitor
// is actually looking at. Change the source color in the header and the tables
// re-resolve — which is the argument the page is making, demonstrated instead
// of asserted.

type Entry = { hex: string; ramp: string; tone: number }

const TOC = [
  { href: '#how-it-works', label: 'How color works' },
  { href: '#roles', label: 'Color roles' },
  { href: '#hierarchy', label: 'Color hierarchy' },
  { href: '#themes', label: 'Themes' },
  { href: '#states', label: 'Interaction states' },
  { href: '#accessibility', label: 'Accessibility' },
  { href: '#usage', label: 'Usage' },
  { href: '#tokens', label: 'Tokens' },
  // Pattern reference and Glossary are sibling sections on this page rather
  // than part of ColorDocs, so they are listed by hand in page order.
  { href: '#patterns', label: 'Pattern reference' },
  { href: '#glossary', label: 'Glossary' },
]

const PIPELINE = [
  {
    step: 'Your color',
    detail:
      'One color. The system reads three things from it: which color it is, how intense, and how light.',
  },
  {
    step: 'Raw shades',
    detail:
      'Seven strips of ten shades each, dark to light. Three built from your color, four fixed ones for danger, warning, success, and info.',
  },
  {
    step: 'Named colors',
    detail:
      'Twenty-seven jobs, such as page background, body text, and button fill. Each gets a shade, and each is checked for readability.',
  },
  {
    step: 'States',
    detail:
      'What each of those looks like on hover, on click, when selected, when switched off, and when focused.',
  },
  {
    step: 'Wired into components',
    detail:
      `${CARBON_VAR_COUNT} variables the component library reads, so changing a color actually repaints the product.`,
  },
]

const RAMPS = [
  {
    name: 'Accent',
    chroma: 'Same as your color',
    use: 'Brand color, interactive elements, focus',
  },
  {
    name: 'Neutral variant',
    chroma: 'Barely tinted',
    use: 'Secondary surfaces, borders, supporting text',
  },
  {
    name: 'Neutral',
    chroma: 'Almost gray',
    use: 'Page backgrounds, primary surfaces, primary text',
  },
  {
    name: 'Error / Warning / Success / Info',
    chroma: 'Tracks your color, within limits',
    use: 'Status and feedback. Hue is fixed per status, not derived',
  },
]

const ROLE_GROUPS = [
  {
    title: 'Surfaces and backgrounds',
    note: 'background and surface resolve to the same value in both themes. Layers are separated by borders and surface variants, not by shading.',
    roles: [
      { name: 'background', purpose: 'The page itself' },
      { name: 'surface', purpose: 'Default container: cards, panels, sheets' },
      {
        name: 'surfaceVariant',
        purpose: 'Secondary surface: fields, hover fills, selected rows, tags',
      },
    ],
  },
  {
    title: 'Content: text and icons',
    note: 'Text hierarchy is two levels, not three. Icons follow text: primary icons take onBackground, secondary icons take onSurfaceVariant.',
    roles: [
      { name: 'onBackground', purpose: 'Primary text and primary icons' },
      { name: 'onSurface', purpose: 'Content on a default surface' },
      {
        name: 'onSurfaceVariant',
        purpose: 'Secondary text and icons, supporting copy',
      },
    ],
  },
  {
    title: 'Borders',
    note: 'One border token covers every border in the system. Interactive borders bind to primary instead. Checked against surface at 3:1, so borders are guaranteed perceivable.',
    roles: [
      { name: 'outline', purpose: 'All borders and dividers' },
    ],
  },
  {
    title: 'Primary actions',
    note: 'The pairing rule is strict: onPrimary goes on primary, onPrimaryContainer goes on primaryContainer. Mixing them across containers breaks the contrast guarantee.',
    roles: [
      {
        name: 'primary',
        purpose: 'Primary buttons, links, interactive borders and icons',
      },
      { name: 'onPrimary', purpose: 'Content on a primary fill' },
      {
        name: 'primaryContainer',
        purpose: 'Low-emphasis accent fill: selected rows, tags',
      },
      { name: 'onPrimaryContainer', purpose: 'Content on primaryContainer' },
    ],
  },
  {
    title: 'Status and feedback',
    note: 'Hue is fixed per status so red still reads as danger whatever the source is; chroma tracks the source so statuses carry the same intensity as the rest of the system. Containers work exactly like primaryContainer: a low-emphasis fill for banners, rows, and tags.',
    roles: [
      { name: 'danger', purpose: 'Errors, destructive actions, invalid input' },
      { name: 'onDanger', purpose: 'Content on a danger fill' },
      { name: 'dangerContainer', purpose: 'Low-emphasis danger fill: banners, rows' },
      { name: 'onDangerContainer', purpose: 'Content on dangerContainer' },
      { name: 'warning', purpose: 'Warnings, risky but permitted actions' },
      { name: 'onWarning', purpose: 'Content on a warning fill' },
      { name: 'warningContainer', purpose: 'Low-emphasis warning fill' },
      { name: 'onWarningContainer', purpose: 'Content on warningContainer' },
      { name: 'success', purpose: 'Confirmation, completion, valid input' },
      { name: 'onSuccess', purpose: 'Content on a success fill' },
      { name: 'successContainer', purpose: 'Low-emphasis success fill' },
      { name: 'onSuccessContainer', purpose: 'Content on successContainer' },
      { name: 'info', purpose: 'Neutral information, tips, in-progress states' },
      { name: 'onInfo', purpose: 'Content on an info fill' },
      { name: 'infoContainer', purpose: 'Low-emphasis info fill' },
      { name: 'onInfoContainer', purpose: 'Content on infoContainer' },
    ],
  },

]

// Documented as gaps rather than quietly omitted: a designer hitting one of
// these needs to know it is missing from the system, not assume they failed to
// find the right token.
const GAPS = [
  {
    need: 'Secondary actions',
    state: 'No secondary role is generated.',
    today:
      'Build secondary buttons from outline (border) plus primary (label) on a transparent or surface fill. Keep it consistent across the product.',
  },
  {
    need: 'Links',
    state: 'No distinct link role. Links bind to primary.',
    today:
      'Rely on underline plus primary for link affordance. Do not introduce a separate link color.',
  },
  {
    need: 'Overlay, scrim, elevation',
    state: 'No overlay or elevation token. The system has no shading-based elevation model.',
    today:
      'Express elevation with outline and surfaceVariant. Modal scrims currently have no system value.',
  },
]

const HIERARCHY = [
  { level: 'Page ground', token: 'background', reads: 'The canvas' },
  {
    level: 'Container',
    token: 'surface + outline border',
    reads: 'A defined region',
  },
  {
    level: 'Distinct region',
    token: 'surfaceVariant',
    reads: 'A field, a hovered or grouped area',
  },
  {
    level: 'Selected / tagged',
    token: 'primaryContainer',
    reads: 'Accented but not actionable',
  },
  { level: 'Primary action', token: 'primary', reads: 'The thing to click' },
  {
    level: 'Primary content',
    token: 'onBackground / onSurface',
    reads: 'What to read first',
  },
  {
    level: 'Secondary content',
    token: 'onSurfaceVariant',
    reads: 'Supporting detail',
  },
]

const THEME_PAIRS = [
  { light: 'background', dark: 'background', direction: 'Light ground → dark ground' },
  { light: 'onBackground', dark: 'onBackground', direction: 'Dark text → light text' },
  { light: 'primary', dark: 'primary', direction: 'Dark accent → light accent' },
  { light: 'onPrimary', dark: 'onPrimary', direction: 'Light label → dark label' },
  { light: 'outline', dark: 'outline', direction: 'Mid → slightly lighter mid' },
]

const STATE_ROWS = [
  { key: 'base', label: 'Default', derivation: 'primary' },
  { key: 'hover', label: 'Hover', derivation: 'base ∓ 6 tone' },
  { key: 'pressed', label: 'Pressed', derivation: 'base ∓ 12 tone' },
  { key: 'selected', label: 'Selected', derivation: 'base ∓ 6 tone' },
  { key: 'disabled', label: 'Disabled', derivation: 'Neutral ramp' },
]

const CONTRAST_ROWS = [
  { role: 'onPrimary', against: 'primary' },
  { role: 'onPrimaryContainer', against: 'primaryContainer' },
  { role: 'onSurface', against: 'surface' },
  { role: 'onSurfaceVariant', against: 'surfaceVariant' },
  { role: 'onBackground', against: 'background' },
  { role: 'outline', against: 'surface' },
  { role: 'onDanger', against: 'danger' },
  { role: 'onDangerContainer', against: 'dangerContainer' },
  { role: 'onWarning', against: 'warning' },
  { role: 'onWarningContainer', against: 'warningContainer' },
  { role: 'onSuccess', against: 'success' },
  { role: 'onSuccessContainer', against: 'successContainer' },
  { role: 'onInfo', against: 'info' },
  { role: 'onInfoContainer', against: 'infoContainer' },
]

const DOS = [
  'Assign roles, not values. Reach for primary or onSurfaceVariant, never the hex they currently resolve to.',
  'Respect on pairings. onSurface belongs on surface; onPrimary belongs on primary.',
  'Use outline and surfaceVariant for depth, since the system has no elevation shading.',
  'Check the contrast table when you change the source color, especially at AAA.',
  'Pair color with a second signal for any state or status meaning, because status hue can collide with the source.',
  'Design in both themes before handing off.',
]

const DONTS = [
  'Don’t apply raw hex values to components. A hex is a snapshot of one source color in one theme.',
  'Don’t reference primitives directly. accent 40 is a color without meaning.',
  'Don’t invent status colors from the accent or neutral ramps. Use the status roles.',
  'Don’t use primaryContainer as a general surface, because it makes everything look selected.',
  'Don’t nest three or more surface levels. There is no third value to resolve to.',
  'Don’t build hover or selected states by changing opacity. States are tone shifts on the ramp.',
]

const SELECTION_ORDER = [
  'What is the element? A ground, a container, content, a border, or an action.',
  'Ground or container? background for the page, surface for a container, surfaceVariant for a field or distinct region.',
  'Content? onX, matching whatever it sits on.',
  'Border? outline, or primary and the focus ring if it indicates interaction.',
  'Action? primary + onPrimary for full emphasis, primaryContainer + onPrimaryContainer for low emphasis.',
  'Communicating status? danger, warning, success, or info, with their containers for low-emphasis fills.',
  'Interactive state? The state token for that role, never a manually adjusted value.',
  'No match? The role is missing from the system. Flag it rather than working around it.',
]

// Plain-language definitions for every term the page cannot avoid using.
// Ordered as a reader meets them, not alphabetically — this is meant to be
// readable top to bottom, and it doubles as a recap of the whole model.
const GLOSSARY = [
  {
    term: 'Source color',
    plain:
      'The one color you choose. Everything else on this page is calculated from it.',
  },
  {
    term: 'Hue',
    plain:
      'Which color it is: red, green, blue. Changing hue turns a red into an orange.',
  },
  {
    term: 'Chroma',
    plain:
      'How intense the color is. High chroma is vivid; zero chroma is gray.',
  },
  {
    term: 'Tone',
    plain:
      'How light or dark the color is, from 0 (black) to 100 (white). Tone 40 is dark; tone 90 is pale.',
  },
  {
    term: 'Ramp',
    plain:
      'One hue laid out from dark to light: the same color at ten different tones, like a paint strip.',
  },
  {
    term: 'OKLab',
    plain:
      'The color model the math runs in. Its useful property: equal steps in numbers look like equal steps to the eye.',
  },
  {
    term: 'Primitive',
    plain:
      'A raw color on a ramp, with no job attached. Useful to look at, never to build with.',
  },
  {
    term: 'Token / role',
    plain:
      'A named color with a job, such as “page background” or “button fill”. You build with these.',
  },
  {
    term: 'On-color',
    plain:
      'The text or icon color that goes on top of another. onSurface is what you put on surface, and it is guaranteed to be readable there.',
  },
  {
    term: 'Container',
    plain:
      'A quieter version of a color, for filling an area rather than drawing attention. Think tinted banner rather than solid button.',
  },
  {
    term: 'Theme',
    plain:
      'Light or dark. Same role names in both; different values behind them.',
  },
  {
    term: 'Contrast ratio',
    plain:
      'How different two colors are in lightness, written like 4.5:1. Higher means easier to read. Below about 4.5:1, small text gets hard for many people.',
  },
  {
    term: 'AA / AAA',
    plain:
      'Two accessibility bars from the WCAG standard. AA is the common legal minimum; AAA is stricter.',
  },
]

function toneLabel(tone: number) {
  return weightLabelFor(tone) ?? String(Math.round(tone))
}

/** One-line plain-English gloss opening a section, for readers skimming. */
export function InShort({ children }: { children: ReactNode }) {
  return (
    <p className="doc-summary">
      <span className="doc-summary__label">In short</span>
      <span>{children}</span>
    </p>
  )
}

function Swatch({ hex, size = 'md' }: { hex: string; size?: 'md' | 'sm' }) {
  return (
    <span
      className={`doc-swatch doc-swatch--${size}`}
      style={{ background: hex }}
      aria-hidden="true"
    />
  )
}

function TokenValue({ entry }: { entry?: Entry }) {
  if (!entry) return <span className="doc-value__meta">—</span>
  return (
    <span className="doc-value">
      <Swatch hex={entry.hex} />
      <span className="doc-value__text">
        <span className="doc-value__hex">{entry.hex}</span>
        <span className="doc-value__meta">
          {entry.ramp} {toneLabel(entry.tone)}
        </span>
      </span>
    </span>
  )
}

export function ColorDocs() {
  const { lightBundle, darkBundle, level } = useTheme()

  const lightTokens = lightBundle?.tokens
  const darkTokens = darkBundle?.tokens
  const lightStates = lightBundle?.states
  const darkStates = darkBundle?.states

  const textTarget = level === 'AAA' ? '7:1' : '4.5:1'

  return (
    <article className="docpage">
      <section className="section docpage__intro">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 8, offset: 1 }}>
            <Reveal>
              <p className="section__eyebrow">Docs</p>
              <h1 className="section__title docpage__title">Color</h1>
              <p className="section__subtitle docpage__lede">
                Pick one color. Graphite UI builds the whole palette from it:
                every background, text color, border, button, and status color,
                in both light and dark, each pair checked to make sure the text
                on it is readable.
              </p>
              <p className="docpage__body">
                The important idea is this:{' '}
                <strong>you choose what a color is for, not what it is.</strong>{' '}
                You say &ldquo;this is the page background&rdquo; or &ldquo;this
                is a button&rdquo;, and the system decides the actual value. So
                when the source color changes, everything updates together and
                stays readable, and nobody has to go and edit components.
              </p>
              <p className="doc-note">
                Every value on this page is live. It reflects the source color
                set in the header right now. Change it and these tables
                re-resolve.
              </p>
            </Reveal>
          </Column>
          <Column sm={4} md={8} lg={{ span: 3, offset: 10 }}>
            <Reveal delay={80}>
              <nav className="docpage__toc" aria-label="On this page">
                <p className="docpage__toc-label">On this page</p>
                <ul>
                  {TOC.map((item) => (
                    <li key={item.href}>
                      <a href={item.href}>{item.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="how-it-works">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">How color works</h2>
              <InShort>
                One color goes in. The system turns it into a set of named
                colors that each have a job, then wires those into the
                components you build with.
              </InShort>
              <p className="docpage__body">
                It happens in five steps. Each one takes the result of the step
                above and adds a decision.
              </p>

              <ol className="doc-pipeline">
                {PIPELINE.map((item, i) => (
                  <li key={item.step} className="doc-pipeline__step">
                    <span className="doc-pipeline__index">{i + 1}</span>
                    <span className="doc-pipeline__body">
                      <span className="doc-pipeline__name">{item.step}</span>
                      <span className="doc-pipeline__detail">{item.detail}</span>
                    </span>
                  </li>
                ))}
              </ol>

              <h3 className="doc-subheading">Why the math matters</h3>
              <p className="docpage__body">
                The calculations run in <strong>OKLab</strong>, a way of
                describing color built to match how eyes actually work. Its
                useful property: equal steps in the numbers look like equal
                steps to a person. Going from tone 30 to 40 looks like the same
                size jump as going from 80 to 90.
              </p>
              <p className="docpage__body">
                Older color models (the ones behind HSL and hex codes) do not
                behave that way. That is why hand-picked palettes so often bunch
                up in the middle and flatten out at the light and dark ends.
              </p>

              <h3 className="doc-subheading">Step 2: the ramps</h3>
              <p className="docpage__body">
                A <strong>ramp</strong> is one color laid out from dark to
                light, like a paint strip. The system keeps your color&rsquo;s
                hue and varies how light it is, then repeats that at three
                levels of intensity:
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Ramp</TableHeader>
                      <TableHeader>Intensity</TableHeader>
                      <TableHeader>What it is for</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {RAMPS.map((ramp) => (
                      <TableRow key={ramp.name}>
                        <TableCell>
                          <code>{ramp.name}</code>
                        </TableCell>
                        <TableCell>{ramp.chroma}</TableCell>
                        <TableCell>{ramp.use}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="docpage__body">
                The two neutrals are not quite gray. They keep a trace of your
                color, and that trace is what makes the finished interface look
                like one family instead of a brand color dropped onto a gray
                page.
                Each ramp gives you ten steps, labeled 900 (darkest) through
                050 (lightest).
              </p>
              <p className="docpage__body">
                Two things worth knowing.{' '}
                <strong>The ten steps are just the ones shown.</strong> The
                system can produce any shade in between, and often does.{' '}
                <strong>Your exact color is kept.</strong> It appears on the
                accent ramp unchanged, taking the place of whichever step it
                sits closest to. Your brand color survives intact.
              </p>
              <p className="doc-callout">
                These raw colors have no meaning attached. Something like{' '}
                <code>accent 40</code> is just a shade. It is not &ldquo;the
                button color.&rdquo; Never reach for one directly in a design;
                use the named roles in the next section instead.
              </p>

              <h3 className="doc-subheading">What you get out</h3>
              <p className="docpage__body">
                Two files. CSS for engineers to point a build at, and JSON for
                tooling and design files. Alongside each color the export
                records <em>where it came from</em>, which ramp and which step,
                so &ldquo;why is this color this color?&rdquo; always has an
                answer.
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="roles">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 12, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Color roles</h2>
              <InShort>
                Every color in the interface has a job: page background, body
                text, button fill, error message. You pick the job; the system
                picks the value.
              </InShort>
              <p className="docpage__body">
                There are twenty-seven of these jobs, and each theme fills them
                in. One naming rule explains most of the list: a name starting
                with <code>on</code> is what goes <em>on top of</em> something
                else. <code>onSurface</code> is the text color for anything
                sitting on <code>surface</code>. That pairing is not a
                suggestion. The system measures it and guarantees it is
                readable.
              </p>
              <p className="docpage__body">
                The roles are grouped below by what they are for. You will use a
                handful of them constantly and most of the rest rarely.
              </p>

              {ROLE_GROUPS.map((group) => (
                <div key={group.title} className="doc-group">
                  <h3 className="doc-subheading">{group.title}</h3>
                  <div className="doc-table">
                    <Table size="lg">
                      <TableHead>
                        <TableRow>
                          <TableHeader>Token</TableHeader>
                          <TableHeader>Purpose</TableHeader>
                          <TableHeader>Light</TableHeader>
                          <TableHeader>Dark</TableHeader>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.roles.map((role) => (
                          <TableRow key={role.name}>
                            <TableCell>
                              <code>{role.name}</code>
                            </TableCell>
                            <TableCell>{role.purpose}</TableCell>
                            <TableCell>
                              <TokenValue entry={lightTokens?.[role.name]} />
                            </TableCell>
                            <TableCell>
                              <TokenValue entry={darkTokens?.[role.name]} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="doc-note">{group.note}</p>
                </div>
              ))}

              <h3 className="doc-subheading">
                Roles the system does not currently define
              </h3>
              <p className="docpage__body">
                These are real gaps, not omissions from this page. If you need
                one of them, the answer is not to improvise a value.
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Need</TableHeader>
                      <TableHeader>Current state</TableHeader>
                      <TableHeader>What to do today</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {GAPS.map((gap) => (
                      <TableRow key={gap.need}>
                        <TableCell>
                          <strong>{gap.need}</strong>
                        </TableCell>
                        <TableCell>{gap.state}</TableCell>
                        <TableCell>{gap.today}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="hierarchy">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Color hierarchy</h2>
              <InShort>
                What makes one thing look like it sits on top of another. In
                this system that comes from borders and tinted areas, not from
                shadows or shading.
              </InShort>
              <p className="docpage__body">
                Because <code>background</code> and <code>surface</code> resolve
                to the same value, Graphite UI does not build depth by stacking
                progressively lighter or darker planes. Hierarchy comes from
                three other mechanisms: <strong>containment</strong> via{' '}
                <code>outline</code>, <strong>emphasis</strong> via{' '}
                <code>surfaceVariant</code>, and <strong>attention</strong> via
                the accent ramp.
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Level</TableHeader>
                      <TableHeader>Token</TableHeader>
                      <TableHeader>Reads as</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {HIERARCHY.map((row) => (
                      <TableRow key={row.level}>
                        <TableCell>{row.level}</TableCell>
                        <TableCell>
                          <code>{row.token}</code>
                        </TableCell>
                        <TableCell>{row.reads}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="doc-callout">
                Two rules follow. <strong>Do not nest more than two surface
                levels.</strong> With one surface value and one variant, a
                third level has nothing to resolve to.{' '}
                <strong><code>primaryContainer</code> is not a surface.</strong>{' '}
                It signals accent state, so a card using it reads as selected,
                not elevated.
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="themes">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Themes</h2>
              <InShort>
                Light and dark are built at the same time from the same color.
                The names stay the same in both; only the values change.
              </InShort>
              <p className="docpage__body">
                You do not maintain two palettes. There is one set of names, and
                each theme fills them differently. <code>onSurface</code> means
                &ldquo;main text on a panel&rdquo; in both, and it comes out
                near-black in light and near-white in dark.
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Role</TableHeader>
                      <TableHeader>Light</TableHeader>
                      <TableHeader>Dark</TableHeader>
                      <TableHeader>Direction</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {THEME_PAIRS.map((pair) => (
                      <TableRow key={pair.light}>
                        <TableCell>
                          <code>{pair.light}</code>
                        </TableCell>
                        <TableCell>
                          <TokenValue entry={lightTokens?.[pair.light]} />
                        </TableCell>
                        <TableCell>
                          <TokenValue entry={darkTokens?.[pair.dark]} />
                        </TableCell>
                        <TableCell>{pair.direction}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <p className="docpage__body">
                The pattern:{' '}
                <strong>
                  light and dark are near-mirror images across the ramp
                </strong>
                , with content and ground swapping ends and accent inverting
                with them. Hierarchy survives because the relationships
                survive: secondary content stays one perceptual step from
                primary content in both themes, even though the absolute values
                are opposite.
              </p>
              <p className="doc-callout">
                This is the concrete reason to use semantic tokens rather than
                values. A hex is correct in exactly one theme.{' '}
                <code>primary</code> is correct in both, on every source color a
                user picks, without a designer re-checking anything.
              </p>

              <h3 className="doc-subheading">Contrast levels</h3>
              <p className="docpage__body">
                Themes generate at one of two targets, applied to the whole
                theme rather than per token: <strong>AA</strong> (4.5:1 text,
                3:1 non-text) or <strong>AAA</strong> (7:1 text, 3:1 non-text).
                The system is currently generating at <strong>{level}</strong>.
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="states">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Interaction states</h2>
              <InShort>
                How colors change when you hover over something, click it, tab
                to it, or when it is switched off.
              </InShort>
              <p className="docpage__body">
                A hovered button does not get a different color. It gets the
                same color, a few steps along its own ramp. That keeps it
                recognizably the same button and keeps the label readable.
              </p>
              <p className="docpage__body">
                Which direction depends on the theme: steps go{' '}
                <strong>darker in light mode and lighter in dark mode</strong>,
                always away from the background, so the button gets more
                prominent rather than fading into the page.
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>State</TableHeader>
                      <TableHeader>Derivation</TableHeader>
                      <TableHeader>Light</TableHeader>
                      <TableHeader>Dark</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {STATE_ROWS.map((row) => (
                      <TableRow key={row.key}>
                        <TableCell>{row.label}</TableCell>
                        <TableCell>
                          <span className="doc-value__meta">
                            {row.derivation}
                          </span>
                        </TableCell>
                        <TableCell>
                          <TokenValue
                            entry={lightStates?.primary?.[row.key] as Entry}
                          />
                        </TableCell>
                        <TableCell>
                          <TokenValue
                            entry={darkStates?.primary?.[row.key] as Entry}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell>Disabled content</TableCell>
                      <TableCell>
                        <span className="doc-value__meta">Neutral ramp</span>
                      </TableCell>
                      <TableCell>
                        <TokenValue
                          entry={lightStates?.primary?.disabled?.content}
                        />
                      </TableCell>
                      <TableCell>
                        <TokenValue
                          entry={darkStates?.primary?.disabled?.content}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Focus</TableCell>
                      <TableCell>
                        <span className="doc-value__meta">Accent ring</span>
                      </TableCell>
                      <TableCell>
                        <TokenValue entry={lightStates?.focus} />
                      </TableCell>
                      <TableCell>
                        <TokenValue entry={darkStates?.focus} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <ul className="doc-list">
                <li>
                  <strong>Hover and selected share a tone.</strong> They are
                  visually identical by design; selection is distinguished by
                  persistence and supporting affordances (a check, a bold
                  label, a left border), not by color alone.
                </li>
                <li>
                  <strong>Pressed is twice the hover shift,</strong> a clearly
                  larger step, so the press reads as a distinct event rather
                  than a stronger hover.
                </li>
                <li>
                  <strong>Disabled leaves the accent ramp entirely.</strong>{' '}
                  Both the fill and its content drop to neutral. This is the one
                  state where an element deliberately loses its brand color. The
                  pairing is intentionally low-contrast and is not
                  contrast-checked. It is exempt under WCAG, and it must never
                  be the only signal that a control is unavailable.
                </li>
                <li>
                  <strong>Focus is a separate ring token, not a fill change.</strong>{' '}
                  It does not replace the base color, so a focused button is
                  still recognizably in its current state. Focus stacks with
                  hover, pressed, and selected.
                </li>
              </ul>

              <p className="doc-callout">
                Danger, warning, and success are roles, not states. A field that
                fails validation takes <code>danger</code> for its border and
                message; it does not get a &ldquo;danger hover.&rdquo; Status
                roles and interaction states compose: a destructive button
                still hovers and presses along its own ramp.
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="accessibility">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Accessibility</h2>
              <InShort>
                Text has to stand out enough from whatever is behind it to be
                readable. The system checks this before it hands you a palette,
                rather than leaving you to test afterwards.
              </InShort>
              <p className="docpage__body">
                The measure is a <strong>contrast ratio</strong>, written like
                4.5:1. The bigger the number, the easier the text is to read.
                Fourteen pairings are checked in both themes every time a
                palette is generated. If one ever fell short, the system nudges
                that color along its own ramp until it passes, keeping the hue
                and changing only how light it is.
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Pairing</TableHeader>
                      <TableHeader>Target</TableHeader>
                      <TableHeader>Light</TableHeader>
                      <TableHeader>Dark</TableHeader>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {CONTRAST_ROWS.map((row) => {
                      const lc = lightBundle?.contrast?.[row.role]
                      const dc = darkBundle?.contrast?.[row.role]
                      return (
                        <TableRow key={row.role}>
                          <TableCell>
                            <code>{row.role}</code> on <code>{row.against}</code>
                          </TableCell>
                          <TableCell>
                            {row.role === 'outline' ? '3:1 (UI)' : textTarget}
                          </TableCell>
                          <TableCell>
                            {lc ? (
                              <Tag type={lc.passes ? 'green' : 'red'} size="sm">
                                {lc.ratio.toFixed(2)}:1{' '}
                                {lc.passes ? 'pass' : 'fail'}
                              </Tag>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                          <TableCell>
                            {dc ? (
                              <Tag type={dc.passes ? 'green' : 'red'} size="sm">
                                {dc.ratio.toFixed(2)}:1{' '}
                                {dc.passes ? 'pass' : 'fail'}
                              </Tag>
                            ) : (
                              '—'
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              <h3 className="doc-subheading">What the system does not guarantee</h3>
              <p className="docpage__body">
                The guarantee covers <strong>defined pairings only</strong>.
                Everything outside that list is your responsibility.
              </p>
              <ul className="doc-list">
                <li>
                  <code>onSurfaceVariant</code> on <code>surface</code> is not a
                  checked pairing. Secondary text on a default surface is common
                  and usually fine, but verify it.
                </li>
                <li>
                  Any cross-pairing you invent is unchecked and likely to
                  fail: <code>onPrimaryContainer</code> on <code>surface</code>,{' '}
                  <code>primary</code> as body text, <code>outline</code> as
                  text.
                </li>
                <li>
                  Text over images, gradients, or generated patterns. No token
                  can guarantee contrast against variable content; use a solid
                  surface behind the text.
                </li>
                <li>Disabled states, which are exempt by design.</li>
              </ul>

              <h3 className="doc-subheading">Focus indicators</h3>
              <p className="docpage__body">
                Every interactive element needs a visible focus indicator. Use
                the focus ring token, which is generated per theme specifically
                to stay visible against both grounds. Never remove focus outlines,
                and never let the hover treatment double as the focus state;
                keyboard users never trigger hover.
              </p>

              <h3 className="doc-subheading">Do not rely on color alone</h3>
              <p className="docpage__body">
                This applies with unusual force here, for two system-specific
                reasons. <strong>The source color is user-chosen.</strong> You
                cannot assume the accent is blue, or warm, or dark, so any
                meaning attached to a specific hue will be wrong for some
                sources. And <strong>status hue can collide with the source</strong>:
                because status hues are fixed, a source color sitting on one of
                them resolves <code>primary</code> and that status to nearly the
                same value. A red brand makes <code>primary</code> and{' '}
                <code>danger</code> near-identical. Always pair color with a
                second signal: an icon, a label, a change of weight, a position,
                or a border.
              </p>

              <h3 className="doc-subheading">Light and dark parity</h3>
              <p className="docpage__body">
                Both themes are generated from the same ramps against the same
                targets, so a design that passes in one passes in the other. But
                check both before shipping. Anything built outside the token
                system (illustrations, screenshots, images with baked-in
                backgrounds, hard-coded hexes) will not follow the theme, and
                dark mode is where that shows up first.
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="usage">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 12, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Usage</h2>
              <div className="doc-rules">
                <div className="doc-rules__col doc-rules__col--do">
                  <p className="doc-rules__label">
                    <Checkmark size={16} /> Do
                  </p>
                  <ul>
                    {DOS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="doc-rules__col doc-rules__col--dont">
                  <p className="doc-rules__label">
                    <Close size={16} /> Don&rsquo;t
                  </p>
                  <ul>
                    {DONTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </Column>
        </Grid>
      </section>

      {/* ---------------------------------------------------------------- */}
      <section className="section" id="tokens">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Tokens</h2>
              <InShort>
                How to find the right named color for what you are building.
              </InShort>

              <h3 className="doc-subheading">Naming</h3>
              <p className="docpage__body">
                Tokens use camelCase in JSON and JS (
                <code>onSurfaceVariant</code>), kebab-case in CSS with the{' '}
                <code>--cts-</code> prefix (
                <code>--cts-on-surface-variant</code>). Every token also emits
                its provenance: <code>--cts-on-surface-variant-ramp</code> and{' '}
                <code>--cts-on-surface-variant-tone</code>.
              </p>

              <h3 className="doc-subheading">Choosing a token</h3>
              <p className="docpage__body">
                Work down this order and stop at the first match.
              </p>
              <ol className="doc-ordered">
                {SELECTION_ORDER.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>

              <h3 className="doc-subheading">Complete reference</h3>
              <p className="doc-reference-label">Semantic roles: 27 per theme</p>
              <p className="doc-chips">
                {[
                  'primary',
                  'onPrimary',
                  'primaryContainer',
                  'onPrimaryContainer',
                  'surface',
                  'onSurface',
                  'surfaceVariant',
                  'onSurfaceVariant',
                  'outline',
                  'background',
                  'onBackground',
                  'danger',
                  'onDanger',
                  'dangerContainer',
                  'onDangerContainer',
                  'warning',
                  'onWarning',
                  'warningContainer',
                  'onWarningContainer',
                  'success',
                  'onSuccess',
                  'successContainer',
                  'onSuccessContainer',
                  'info',
                  'onInfo',
                  'infoContainer',
                  'onInfoContainer',
                ].map((name) => (
                  <code key={name}>{name}</code>
                ))}
              </p>
              <p className="doc-reference-label">
                Interaction states: 6 per theme
              </p>
              <p className="doc-chips">
                {[
                  'primary',
                  'primary-hover',
                  'primary-pressed',
                  'primary-selected',
                  'primary-disabled',
                  'focus-ring',
                ].map((name) => (
                  <code key={name}>{name}</code>
                ))}
              </p>
              <p className="doc-reference-label">
                Primitives: 7 ramps × 10 stops
              </p>
              <p className="docpage__body">
                Exported for reference and tooling. Available to inspect and
                copy; not for direct use in designs.
              </p>

              <h3 className="doc-subheading">Using tokens in Figma</h3>
              <p className="docpage__body">
                The engine&rsquo;s output is CSS and JSON. There is no published
                Figma library shipping with it today, so the Figma side is a
                workflow you set up rather than a fact of the system. The
                recommended approach:
              </p>
              <ul className="doc-list">
                <li>
                  Create Figma variables that mirror the semantic role names
                  exactly, so a design file and a code file name the same thing
                  the same way.
                </li>
                <li>
                  Use a variable mode per theme (Light / Dark) so a single
                  design switches themes the way the product does.
                </li>
                <li>
                  Import primitives as a separate, locked collection: visible
                  for reference, hidden from the picker, so designers select
                  roles rather than stops.
                </li>
                <li>
                  Regenerate rather than edit. If the source color changes,
                  re-import from the JSON export instead of hand-adjusting
                  values, or the file will drift from the product.
                </li>
              </ul>

            </Reveal>
          </Column>
        </Grid>
      </section>

    </article>
  )
}

/**
 * The glossary closes the docs page, after Pattern reference, so it is a
 * separate export rather than the last section of ColorDocs.
 */
export function ColorGlossary() {
  return (
    <article className="docpage">
      <section className="section" id="glossary">
        <Grid>
          <Column sm={4} md={8} lg={{ span: 10, offset: 1 }}>
            <Reveal>
              <h2 className="doc-heading">Glossary</h2>
              <dl className="doc-glossary">
                {GLOSSARY.map((entry) => (
                  <div key={entry.term} className="doc-glossary__item">
                    <dt>{entry.term}</dt>
                    <dd>{entry.plain}</dd>
                  </div>
                ))}
              </dl>

              <p className="doc-footer-link">
                <a href="/#system">
                  Explore the live system on the home page
                  <ArrowRight size={16} />
                </a>
              </p>
            </Reveal>
          </Column>
        </Grid>
      </section>
    </article>
  )
}
