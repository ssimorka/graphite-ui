'use client'

import { RefTable } from '@/components/component-page'
import { PatternSpecimen, PATTERN_NAMES } from '@/components/generative-art'
import { useTheme } from '@/components/theme-provider'
import { CARBON_VAR_COUNT } from '@/components/carbon-compat'
import { weightLabelFor } from '@/components/token-panels'
import { Tag } from '@/components/ui/tag'
import { STATE_DELTAS, STATE_FAMILIES } from '@/lib/color.js'
import { spell } from '@/lib/spell'
import styles from './theming.module.scss'

// The parts of the Theming page that read the live bundles. Everything here
// re-resolves when the source color in the header changes, which is the
// argument the page makes, shown rather than asserted. The prose around them
// is a server component and reads the engine at the seed.

type Entry = { hex: string; ramp: string; tone: number }

const toneLabel = (tone: number) => weightLabelFor(tone) ?? String(Math.round(tone))

/** A swatch, its hex, and where it came from: the ramp and the step. */
function Value({ entry }: { entry?: Entry }) {
  if (!entry) return <span className={styles.meta}>—</span>
  return (
    <span className={styles.value}>
      <span className={styles.swatch} style={{ background: entry.hex }} aria-hidden="true" />
      <span className={styles.valueText}>
        <code>{entry.hex}</code>
        <span className={styles.meta}>
          {entry.ramp} {toneLabel(entry.tone)}
        </span>
      </span>
    </span>
  )
}

/** One group of roles: what each is for, and what it resolves to in each theme. */
export function RoleTable({ caption, roles }: { caption: string; roles: [string, string][] }) {
  const { lightBundle, darkBundle } = useTheme()
  const light = lightBundle?.tokens as Record<string, Entry> | undefined
  const dark = darkBundle?.tokens as Record<string, Entry> | undefined
  return (
    <div className={styles.scroll}>
      <RefTable
        caption={caption}
        columns={[
          { label: 'Role', tone: 'name' },
          { label: 'Purpose', tone: 'text' },
          { label: 'Light', tone: 'text' },
          { label: 'Dark', tone: 'text' },
        ]}
        rows={roles.map(([name, purpose]) => [
          <code key="n">{name}</code>,
          purpose,
          <Value key="l" entry={light?.[name]} />,
          <Value key="d" entry={dark?.[name]} />,
        ])}
      />
    </div>
  )
}

/** The same role in both themes, and which way it moved. */
export function ThemePairs({ rows }: { rows: [string, string][] }) {
  const { lightBundle, darkBundle } = useTheme()
  const light = lightBundle?.tokens as Record<string, Entry> | undefined
  const dark = darkBundle?.tokens as Record<string, Entry> | undefined
  return (
    <div className={styles.scroll}>
      <RefTable
        caption="One role, two themes"
        columns={[
          { label: 'Role', tone: 'name' },
          { label: 'Light', tone: 'text' },
          { label: 'Dark', tone: 'text' },
          { label: 'Direction', tone: 'text' },
        ]}
        rows={rows.map(([name, direction]) => [
          <code key="n">{name}</code>,
          <Value key="l" entry={light?.[name]} />,
          <Value key="d" entry={dark?.[name]} />,
          direction,
        ])}
      />
    </div>
  )
}

/**
 * Primary's state set, live. The derivations are read from the engine's own
 * deltas, so a changed step changes the table rather than contradicting it.
 */
export function StatesTable() {
  const { lightBundle, darkBundle } = useTheme()
  type Family = Record<string, Entry & { content?: Entry }>
  const light = (lightBundle as unknown as { states?: Record<string, Family> } | null)?.states
  const dark = (darkBundle as unknown as { states?: Record<string, Family> } | null)?.states
  const rows: [string, string, Entry | undefined, Entry | undefined][] = [
    ['Default', 'The role itself', light?.primary?.base, dark?.primary?.base],
    ['Hover', `${STATE_DELTAS.hover} tone steps`, light?.primary?.hover, dark?.primary?.hover],
    ['Pressed', `${STATE_DELTAS.pressed} tone steps`, light?.primary?.pressed, dark?.primary?.pressed],
    ['Selected', `${STATE_DELTAS.selected} tone steps`, light?.primary?.selected, dark?.primary?.selected],
    ['Disabled', 'Neutral ramp', light?.primary?.disabled, dark?.primary?.disabled],
    ['Disabled content', 'Neutral ramp', light?.primary?.disabled?.content, dark?.primary?.disabled?.content],
    ['Focus', 'A ring on the same ramp', light?.primary?.focus, dark?.primary?.focus],
  ]
  return (
    <div className={styles.scroll}>
      <RefTable
        caption={`Interaction states of ${STATE_FAMILIES[0]}`}
        columns={[
          { label: 'State', tone: 'name' },
          { label: 'Derivation', tone: 'muted' },
          { label: 'Light', tone: 'text' },
          { label: 'Dark', tone: 'text' },
        ]}
        rows={rows.map(([label, how, l, d]) => [
          label,
          how,
          <Value key="l" entry={l} />,
          <Value key="d" entry={d} />,
        ])}
      />
    </div>
  )
}

/** Every pairing the engine measures, at the level the site is generating at. */
export function ContrastTable() {
  const { lightBundle, darkBundle } = useTheme()
  const light = lightBundle?.contrast
  const dark = darkBundle?.contrast
  if (!light || !dark) return null
  const verdict = (c?: { ratio: number; passes: boolean }) =>
    c ? (
      <span className={styles.verdict}>
        <code>{c.ratio.toFixed(1)}:1</code>
        {/* The word carries the result; the tag's color only repeats it. */}
        <Tag variant={c.passes ? 'neutral' : 'danger'}>{c.passes ? 'Pass' : 'Fail'}</Tag>
      </span>
    ) : (
      '—'
    )
  return (
    <div className={styles.scroll}>
      <RefTable
        caption="Contrast pairings in both themes"
        columns={[
          { label: 'Pairing', tone: 'name' },
          { label: 'Target', tone: 'muted' },
          { label: 'Light', tone: 'text' },
          { label: 'Dark', tone: 'text' },
        ]}
        rows={Object.entries(light).map(([role, c]) => [
          <span key="p">
            <code>{role}</code> on <code>{c.against}</code>
          </span>,
          `${c.target}:1${c.kind === 'UI' ? ' (UI)' : ''}`,
          verdict(c),
          verdict(dark[role]),
        ])}
      />
    </div>
  )
}

/** The level the whole site is generating at right now. */
export function CurrentLevel() {
  const { level } = useTheme()
  return <strong>{level}</strong>
}

/** The 60/30/10 rhythm, with the tenth painted from the live secondary role. */
export function RatioBar() {
  const { theme, lightBundle, darkBundle } = useTheme()
  const tokens = (theme === 'dark' ? darkBundle : lightBundle)?.tokens as
    | Record<string, Entry>
    | undefined
  return (
    <div
      className={styles.ratio}
      role="img"
      aria-label="Sixty percent neutral, thirty percent accent, ten percent secondary"
    >
      <span className={styles.ratioNeutral}>60% Neutral</span>
      <span className={styles.ratioAccent}>30% Accent</span>
      <span
        className={styles.ratioPop}
        style={
          tokens
            ? { background: tokens.secondary.hex, color: tokens.onSecondary.hex }
            : undefined
        }
      >
        10%
      </span>
    </div>
  )
}

/** All twenty tiles, drawn from the live source color. */
export function TileLibrary() {
  return (
    <ol className={styles.tiles}>
      {PATTERN_NAMES.map((name, i) => (
        <li key={name} className={styles.tile}>
          <div className={styles.tileCanvas}>
            <PatternSpecimen index={i} size={140} />
          </div>
          <p className={styles.tileLabel}>
            <span className={styles.tileNum}>{String(i + 1).padStart(2, '0')}</span>
            {name}
          </p>
        </li>
      ))}
    </ol>
  )
}

// Counts that live in client modules. A server component importing a value
// from a 'use client' file gets a reference, not the value, so the page asks
// for them here.
export function CarbonVarCount() {
  return <>{CARBON_VAR_COUNT}</>
}

export function PatternCount({ capital = false }: { capital?: boolean }) {
  const s = spell(PATTERN_NAMES.length)
  return <>{capital ? s : s.toLowerCase()}</>
}
