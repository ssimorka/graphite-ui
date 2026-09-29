'use client'

import { useTheme } from '@/components/theme-provider'
import { RefTable } from '@/components/component-page'
import type { ContrastSweep } from '@/lib/contrast-sweep'
import styles from './contrast-report.module.scss'

// The six pairings the kit lists, as [role, name it is checked against]. The
// "against" side comes from the engine's own check, so a change to what a role
// is measured against shows up here without an edit.
const PAIRINGS = [
  'onSurface',
  'onPrimary',
  'onSurfaceVariant',
  'onSecondary',
  'onDanger',
  'outline',
] as const

const ratio = (n: number) => `${n.toFixed(2)} : 1`

/**
 * The contrast report under the preview (Graphite UI Site 11838:56137). It
 * measures the theme currently showing against the target chosen in the
 * controls, so both the theme switch and the AA/AAA chips change what it says.
 */
export function ContrastReport({ sweep }: { sweep: ContrastSweep }) {
  const { theme, lightBundle, darkBundle } = useTheme()
  const bundle = theme === 'white' ? lightBundle : darkBundle
  if (!bundle) return null

  const rows = PAIRINGS.map((role) => {
    const c = bundle.contrast[role]
    if (!c) return null
    return [
      `${role} on ${c.against}`,
      ratio(c.ratio),
      // UI components are held to 3:1 whatever the text target is.
      c.kind === 'UI' ? `${c.target.toFixed(1)} UI` : c.target.toFixed(1),
      <span key="r" className={c.passes ? styles.pass : styles.fail}>
        {c.passes ? 'Pass' : 'Fail'}
      </span>,
    ]
  }).filter((r): r is NonNullable<typeof r> => r !== null)

  return (
    <section className={styles.report} aria-labelledby="contrast-report">
      <h2 id="contrast-report" className={styles.heading}>
        Contrast report
      </h2>
      <RefTable
        caption="Contrast of the generated pairings against the chosen target"
        columns={[
          { label: 'Pairing', tone: 'name' },
          { label: 'Ratio', tone: 'type' },
          { label: 'Target', tone: 'muted' },
          { label: 'Result', tone: 'text' },
        ]}
        rows={rows}
      />
      <p className={styles.note}>
        Sweeping {sweep.hues} hues across both themes and both targets produces{' '}
        {sweep.pairings.toLocaleString('en-US')} pairings and{' '}
        {sweep.failures === 0 ? 'zero' : sweep.failures.toLocaleString('en-US')}{' '}
        failures.{' '}
        {sweep.failures === 0
          ? 'That is why there is no auto-fix switch here: it would have nothing to repair. The measurement is the feature.'
          : 'Auto-fix would have something to repair, and this report is where it would say so.'}
      </p>
    </section>
  )
}
