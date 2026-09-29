'use client'

import { useTheme, type ContrastLevel } from '@/components/theme-provider'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import styles from './accessibility.module.scss'

const kebab = (s: string) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()

/**
 * Every pairing the engine measures, for the source in the header, in both
 * modes. Read from the theme provider's bundles, which are the same objects the
 * CSS variables are stamped from, so a ratio here is the ratio on the page.
 *
 * The level switch is the provider's `level`, not local state: it changes what
 * the engine generates site-wide, the same control the header's source popover
 * carries.
 */
export function Pairings() {
  const { lightBundle, darkBundle, level, setLevel } = useTheme()

  if (!lightBundle || !darkBundle) {
    return <p className={styles.note}>Resolving the theme…</p>
  }

  const roles = Object.keys(lightBundle.contrast)
  const repaired = roles.filter(
    (r) => lightBundle.contrast[r].fixed || darkBundle.contrast[r].fixed,
  ).length

  const cell = (mode: 'light' | 'dark', role: string) => {
    const bundle = mode === 'light' ? lightBundle : darkBundle
    const c = bundle.contrast[role]
    const fg = bundle.tokens[role].hex
    const bg = bundle.tokens[c.against].hex
    return (
      <td className={styles.ratioCell}>
        <span
          className={styles.sample}
          style={{ color: fg, background: bg }}
          aria-hidden="true"
        >
          Aa
        </span>
        <span className={styles.ratio}>{c.ratio.toFixed(1)}:1</span>
        <span className={c.passes ? styles.pass : styles.fail}>
          {c.passes ? (c.fixed ? 'Repaired' : 'Pass') : 'Fail'}
        </span>
      </td>
    )
  }

  return (
    <div className={styles.pairings}>
      <RadioButtonGroup
        name="contrast-level"
        label="Target level"
        orientation="horizontal"
        value={level}
        onChange={(v) => setLevel(v as ContrastLevel)}
        options={[
          { value: 'AA', label: 'AA' },
          { value: 'AAA', label: 'AAA' },
        ]}
      />
      <div className={styles.scroll}>
        <table className={`${styles.table} ${styles.pairTable}`}>
          <caption className={styles.srOnly}>
            Contrast pairings at {level}, light and dark
          </caption>
          <thead>
            <tr>
              <th scope="col">Role</th>
              <th scope="col">Against</th>
              <th scope="col">Target</th>
              <th scope="col">Light</th>
              <th scope="col">Dark</th>
            </tr>
          </thead>
          <tbody>
            {roles.map((role) => {
              const c = lightBundle.contrast[role]
              return (
                <tr key={role}>
                  <th scope="row">
                    <code>{kebab(role)}</code>
                  </th>
                  <td>
                    <code>{kebab(c.against)}</code>
                  </td>
                  <td className={styles.target}>
                    {c.target}:1{c.kind === 'UI' ? ' (UI)' : ''}
                  </td>
                  {cell('light', role)}
                  {cell('dark', role)}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className={styles.note}>
        {roles.length} pairings per mode at {level}.{' '}
        {repaired === 0
          ? 'Auto-fix moved none of them: every pair clears its target as generated.'
          : `Auto-fix moved ${repaired} of them to the nearest passing tone on the same ramp.`}
      </p>
    </div>
  )
}
