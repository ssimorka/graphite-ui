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
]

const PIPELINE = [
  {
    step: 'Source color',
    detail: 'One hex. The engine reads its hue, chroma, and tone in OKLab.',
  },
  {
    step: 'Primitives',
    detail:
      'Three tonal ramps from the source — accent, neutral, neutral variant — plus four status ramps at fixed hues, ten stops each.',
  },
  {
    step: 'Semantic tokens',
    detail:
      'Twenty-seven roles per theme, each mapped to a ramp tone and verified against its contrast target.',
  },
  {
    step: 'Interaction states',
    detail:
      'Hover, pressed, selected, and disabled as tone shifts along the same ramp, plus a focus ring.',
  },
  {
    step: 'Component bindings',
    detail:
      `${CARBON_VAR_COUNT} CSS variables the component library consumes, so a token change repaints real UI.`,
  },
]

const RAMPS = [
  {
    name: 'Accent',
    chroma: 'Full source chroma',
    use: 'Brand color, interactive elements, focus',
  },
  {
    name: 'Neutral variant',
    chroma: '12% of source',
    use: 'Secondary surfaces, borders, supporting text',
  },
  {
    name: 'Neutral',
    chroma: '4% of source',
    use: 'Page backgrounds, primary surfaces, primary text',
  },
  {
    name: 'Error / Warning / Success / Info',
    chroma: 'Source chroma, clamped 0.10–0.20',
    use: 'Status and feedback. Hue is fixed per status, not derived',
  },
]

const ROLE_GROUPS = [
  {
    title: 'Surfaces and backgrounds',
    note: 'background and surface resolve to the same value in both themes. Layers are separated by borders and surface variants, not by shading.',
    roles: [
      { name: 'background', purpose: 'The page itself' },
      { name: 'surface', purpose: 'Default container — cards, panels, sheets' },
      {
        name: 'surfaceVariant',
        purpose: 'Secondary surface — fields, hover fills, selected rows, tags',
      },
    ],
  },
  {
    title: 'Content — text and icons',
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
        purpose: 'Low-emphasis accent fill — selected rows, tags',
      },
      { name: 'onPrimaryContainer', purpose: 'Content on primaryContainer' },
    ],
  },
  {
    title: 'Status and feedback',
    note: 'Hue is fixed per status so red still reads as error whatever the source is; chroma tracks the source so statuses carry the same intensity as the rest of the system. Containers work exactly like primaryContainer — a low-emphasis fill for banners, rows, and tags.',
    roles: [
      { name: 'error', purpose: 'Errors, destructive actions, invalid input' },
      { name: 'onError', purpose: 'Content on an error fill' },
      { name: 'errorContainer', purpose: 'Low-emphasis error fill — banners, rows' },
      { name: 'onErrorContainer', purpose: 'Content on errorContainer' },
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
  { role: 'onError', against: 'error' },
  { role: 'onErrorContainer', against: 'errorContainer' },
  { role: 'onWarning', against: 'warning' },
  { role: 'onWarningContainer', against: 'warningContainer' },
  { role: 'onSuccess', against: 'success' },
  { role: 'onSuccessContainer', against: 'successContainer' },
  { role: 'onInfo', against: 'info' },
  { role: 'onInfoContainer', against: 'infoContainer' },
]

const DOS = [
  'Assign roles, not values — reach for primary or onSurfaceVariant, never the hex they currently resolve to.',
  'Respect on pairings. onSurface belongs on surface; onPrimary belongs on primary.',
  'Use outline and surfaceVariant for depth, since the system has no elevation shading.',
  'Check the contrast table when you change the source color, especially at AAA.',
  'Pair color with a second signal for any state or status meaning — status hue can collide with the source.',
  'Design in both themes before handing off.',
]

const DONTS = [
  'Don’t apply raw hex values to components. A hex is a snapshot of one source color in one theme.',
  'Don’t reference primitives directly. accent 40 is a color without meaning.',
  'Don’t invent status colors from the accent or neutral ramps — use the status roles.',
  'Don’t use primaryContainer as a general surface — it makes everything look selected.',
  'Don’t nest three or more surface levels. There is no third value to resolve to.',
  'Don’t build hover or selected states by changing opacity. States are tone shifts on the ramp.',
]

const SELECTION_ORDER = [
  'What is the element? A ground, a container, content, a border, or an action.',
  'Ground or container? background for the page, surface for a container, surfaceVariant for a field or distinct region.',
  'Content? onX, matching whatever it sits on.',
  'Border? outline — or primary and the focus ring if it indicates interaction.',
  'Action? primary + onPrimary for full emphasis, primaryContainer + onPrimaryContainer for low emphasis.',
  'Communicating status? error, warning, success, or info — with their containers for low-emphasis fills.',
  'Interactive state? The state token for that role, never a manually adjusted value.',
  'No match? The role is missing from the system. Flag it rather than working around it.',
]

function toneLabel(tone: number) {
  return weightLabelFor(tone) ?? String(Math.round(tone))
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
                Graphite UI&rsquo;s color system turns a single source color into
                a complete, accessible interface palette — three tonal ramps
                plus four status ramps, twenty-seven semantic roles per theme, a
                full set of interaction states, and the component bindings that
                connect them to real UI.
              </p>
              <p className="docpage__body">
                Designers do not pick colors one at a time. They pick a source
                color, and the system derives everything else. That has a
                practical consequence for how you work:{' '}
                <strong>you assign roles, not values.</strong> A component
                references <code>primary</code> or <code>onSurfaceVariant</code>;
                the engine decides what hex that resolves to in the current
                theme. Change the source color and the entire interface
                repaints, coherently, without a single component being edited.
              </p>
              <p className="doc-note">
                Every value on this page is live. It reflects the source color
                set in the header right now — change it and these tables
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
              <p className="docpage__body">
                Color moves through five layers. Each takes the one above it and
                adds a decision.
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

              <h3 className="doc-subheading">Why OKLab</h3>
              <p className="docpage__body">
                The engine works in OKLab because it is perceptually uniform: a
                step of 10 tone looks like the same size step at the dark end of
                a ramp as at the light end. Ramps built in HSL or raw RGB do not
                behave that way, which is why hand-built palettes tend to bunch
                up in the midtones and flatten out at the extremes.
              </p>

              <h3 className="doc-subheading">Primitives — three ramps</h3>
              <p className="docpage__body">
                The source color&rsquo;s hue is held constant while lightness
                sweeps from dark to light. Chroma is scaled to produce three
                parallel ramps:
              </p>
              <div className="doc-table">
                <Table size="lg">
                  <TableHead>
                    <TableRow>
                      <TableHeader>Ramp</TableHeader>
                      <TableHeader>Chroma</TableHeader>
                      <TableHeader>Role in the system</TableHeader>
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
                The neutrals are not gray — they carry a trace of the source
                hue, which is what makes a generated theme read as one family
                rather than a brand color applied to a gray UI. Each ramp
                exposes ten stops at tones 10 through 98, labelled 900 (darkest)
                through 050 (lightest).
              </p>
              <p className="docpage__body">
                Two behaviors are worth knowing.{' '}
                <strong>The ramp is continuous</strong> — the ten stops are what
                the primitives grid shows, but the underlying function resolves
                any tone from 0 to 100, and semantic roles routinely land
                between named stops.{' '}
                <strong>The source color is pinned</strong> — your exact hex
                appears in the accent ramp at its true tone, replacing the
                nearest stop rather than being added alongside it, so the ramp
                stays ten stops wide and your brand color survives generation
                unchanged.
              </p>
              <p className="doc-callout">
                Primitives carry no meaning. <code>accent 40</code>{' '}
                is a color, not &ldquo;the button color.&rdquo; Never reference
                a primitive directly in a design.
              </p>

              <h3 className="doc-subheading">Export</h3>
              <p className="docpage__body">
                The system exports CSS custom properties prefixed{' '}
                <code>--cts-</code> in kebab-case, scoped to{' '}
                <code>:root, [data-theme=&quot;light&quot;]</code> and{' '}
                <code>[data-theme=&quot;dark&quot;]</code>, plus JSON containing
                the source, all three ramps, and both themes. Every token ships
                with two companion variables recording where it came from —{' '}
                <code>--cts-primary-ramp</code> and{' '}
                <code>--cts-primary-tone</code>{' '}
                — so &ldquo;why is this color this color&rdquo; always has an
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
              <p className="docpage__body">
                Twenty-seven roles, generated per theme. The <code>on</code>{' '}
                prefix is the system&rsquo;s core convention:{' '}
                <strong>
                  <code>onX</code> is the content color guaranteed to be legible
                  on <code>X</code>
                </strong>
                . That pairing is not a suggestion — it is verified by contrast
                check at generation time.
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
                levels</strong> — with one surface value and one variant, a
                third level has nothing to resolve to.{' '}
                <strong><code>primaryContainer</code> is not a surface</strong> —
                it signals accent state, so a card using it reads as selected,
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
              <p className="docpage__body">
                Light and dark are generated simultaneously from the same source
                color. They are not two palettes maintained in parallel — they
                are two mappings of the same ramps. The role name is the
                constant; only the tone it resolves to changes.
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
                with them. Hierarchy survives because the relationships survive —
                secondary content stays one perceptual step from primary content
                in both themes, even though the absolute values are opposite.
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
              <p className="docpage__body">
                States are <strong>tone shifts along the same ramp as the base
                token</strong>, not opacity overlays or separate color values.
                This keeps a hovered button in the same color family as a
                resting one, and keeps its contrast intact. Direction depends on
                theme: states go darker in light mode and lighter in dark mode —
                always away from the background, so emphasis increases rather
                than washes out.
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
                  persistence and supporting affordances — a check, a bold
                  label, a left border — not by color alone.
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
                  contrast-checked — it is exempt under WCAG, and it must never
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
                Error, warning, and success are roles, not states. A field that
                fails validation takes <code>error</code> for its border and
                message; it does not get an &ldquo;error hover.&rdquo; Status
                roles and interaction states compose — a destructive button
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
              <p className="docpage__body">
                Accessibility is enforced at generation time, not checked
                afterward. Fourteen pairings are verified in both themes before
                a theme is emitted. If one were to miss its target, the auto-fix
                walks the same ramp to the nearest tone that clears it —
                preserving hue while correcting lightness.
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
                  Any cross-pairing you invent — <code>onPrimaryContainer</code>{' '}
                  on <code>surface</code>, <code>primary</code> as body text,{' '}
                  <code>outline</code> as text — is unchecked and likely to fail.
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
                the focus ring token — it is generated per theme specifically to
                stay visible against both grounds. Never remove focus outlines,
                and never let the hover treatment double as the focus state;
                keyboard users never trigger hover.
              </p>

              <h3 className="doc-subheading">Do not rely on color alone</h3>
              <p className="docpage__body">
                This applies with unusual force here, for two system-specific
                reasons. <strong>The source color is user-chosen</strong> — you
                cannot assume the accent is blue, or warm, or dark, so any
                meaning attached to a specific hue will be wrong for some
                sources. And <strong>status hue can collide with the source</strong>:
                because status hues are fixed, a source color sitting on one of
                them resolves <code>primary</code> and that status to nearly the
                same value. A red brand makes <code>primary</code> and{' '}
                <code>error</code> near-identical. Always pair color with a
                second signal: an icon, a label, a change of weight, a position,
                or a border.
              </p>

              <h3 className="doc-subheading">Light and dark parity</h3>
              <p className="docpage__body">
                Both themes are generated from the same ramps against the same
                targets, so a design that passes in one passes in the other. But
                check both before shipping — anything built outside the token
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
              <p className="doc-reference-label">Semantic roles — 27 per theme</p>
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
                  'error',
                  'onError',
                  'errorContainer',
                  'onErrorContainer',
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
                Interaction states — 6 per theme
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
                Primitives — 7 ramps × 10 stops
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
                  Import primitives as a separate, locked collection — visible
                  for reference, hidden from the picker, so designers select
                  roles rather than stops.
                </li>
                <li>
                  Regenerate rather than edit. If the source color changes,
                  re-import from the JSON export instead of hand-adjusting
                  values, or the file will drift from the product.
                </li>
              </ul>

              <p className="doc-footer-link">
                <a href="/#system">
                  Explore the live system
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
