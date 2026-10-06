'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  buildCss,
  buildJson,
  buildLadders,
  graphiteVarName,
  scrimFor,
  STATE_FAMILIES,
} from '@/lib/color.js'
import type { ExportBundle, StateEntry, Token } from '@/lib/color.js'
import { useTheme } from '@/components/theme-provider'
import { CARBON_VAR_COUNT } from '@/components/carbon-compat'
import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { DocSnippet } from '@/components/doc-snippet'
import { StatusBadge } from '@/components/doc-blocks'
import styles from './tokens-page.module.scss'

// Everything here is the engine's output for the source in the header, so the
// page repaints when the source or the theme changes. Light and dark are both
// computed by ThemeProvider (lightBundle / darkBundle); only one of them is
// stamped onto <html> at a time, so the swatches paint from the bundles rather
// than from var(), which would show the active theme twice.

type Cell = { hex: string; ramp?: string; tone?: number }
type Row = { name: string; role?: string; light: Cell; dark: Cell }

const round1 = (n: number) => Math.round(n * 10) / 10

function Swatch({ cell, active }: { cell: Cell; active: boolean }) {
  return (
    <span className={`${styles.cell} ${active ? styles.cellActive : ''}`}>
      <span aria-hidden="true" className={styles.swatch} style={{ background: cell.hex }} />
      <span className={styles.cellText}>
        <span className={styles.hex}>{cell.hex.startsWith('#') ? cell.hex.toUpperCase() : cell.hex}</span>
        {cell.ramp ? (
          <span className={styles.origin}>
            {cell.ramp} {cell.tone !== undefined ? round1(cell.tone) : ''}
          </span>
        ) : null}
      </span>
    </span>
  )
}

function LiveTable({ rows, caption }: { rows: Row[]; caption: string }) {
  const { theme } = useTheme()
  const lightActive = theme === 'light'
  return (
    <div role="table" aria-label={caption} className={styles.live}>
      <div role="row" className={`${styles.liveRow} ${styles.liveHead}`}>
        <span role="columnheader">Variable</span>
        <span role="columnheader">Light{lightActive ? ' · active' : ''}</span>
        <span role="columnheader">Dark{lightActive ? '' : ' · active'}</span>
      </div>
      {rows.map((r) => (
        <div role="row" key={r.name} className={styles.liveRow}>
          <span role="rowheader" className={styles.varName}>
            <code>{r.name}</code>
            {r.role ? <span className={styles.roleKey}>{r.role}</span> : null}
          </span>
          <span role="cell">
            <Swatch cell={r.light} active={lightActive} />
          </span>
          <span role="cell">
            <Swatch cell={r.dark} active={!lightActive} />
          </span>
        </div>
      ))}
    </div>
  )
}

const fromToken = (t: Token | StateEntry): Cell => ({ hex: t.hex, ramp: t.ramp, tone: t.tone })

/** The 32 generated roles, named the way ThemeProvider names them. */
export function RoleTable() {
  const { lightBundle, darkBundle } = useTheme()
  if (!lightBundle || !darkBundle) return null
  const rows: Row[] = Object.keys(lightBundle.tokens).map((role) => ({
    name: graphiteVarName(role),
    role,
    light: fromToken(lightBundle.tokens[role]),
    dark: fromToken(darkBundle.tokens[role]),
  }))
  return <LiveTable rows={rows} caption="Generated color roles, light and dark" />
}

export function RoleCount() {
  const { lightBundle } = useTheme()
  const n = lightBundle ? Object.keys(lightBundle.tokens).length : 0
  return <StatusBadge tone="primary">{`${n} roles`}</StatusBadge>
}

// The state keys each family carries, as ThemeProvider emits them: every key
// but `base` (which is the role itself), with disabled's content as its own
// variable.
function stateRows(
  light: NonNullable<ReturnType<typeof useTheme>['lightBundle']>,
  dark: NonNullable<ReturnType<typeof useTheme>['darkBundle']>,
  ramps: NonNullable<ReturnType<typeof useTheme>['ramps']>,
): Row[] {
  const rows: Row[] = []
  for (const family of STATE_FAMILIES) {
    const l = light.states[family]
    const d = dark.states[family]
    for (const state of Object.keys(l).filter((k) => k !== 'base')) {
      const ls = l[state]
      const ds = d[state]
      rows.push({ name: `--graphite-${family}-${state}`, light: fromToken(ls), dark: fromToken(ds) })
      if ('content' in ls && 'content' in ds) {
        rows.push({
          name: `--graphite-${family}-${state}-content`,
          light: fromToken(ls.content),
          dark: fromToken(ds.content),
        })
      }
    }
  }
  rows.push({
    name: '--graphite-focus',
    light: fromToken(light.states.focus),
    dark: fromToken(dark.states.focus),
  })
  rows.push({
    name: '--graphite-scrim',
    light: { hex: scrimFor(ramps, 'light') },
    dark: { hex: scrimFor(ramps, 'dark') },
  })
  return rows
}

export function StateTable() {
  const { lightBundle, darkBundle, ramps } = useTheme()
  if (!lightBundle || !darkBundle || !ramps) return null
  return (
    <LiveTable
      rows={stateRows(lightBundle, darkBundle, ramps)}
      caption="Interaction state variables, light and dark"
    />
  )
}

/** The elevation and outline ladders, read from the engine's LADDERS. */
export function LadderTable() {
  const { ramps } = useTheme()
  if (!ramps) return null
  const light = buildLadders(ramps, 'light')
  const dark = buildLadders(ramps, 'dark')
  const rows: Row[] = (Object.keys(light) as (keyof typeof light)[]).map((name) => ({
    name: `--graphite-${name}`,
    light: fromToken(light[name]),
    dark: fromToken(dark[name]),
  }))
  return <LiveTable rows={rows} caption="Elevation and outline ladders, light and dark" />
}

/** The families that carry states, read from the engine's STATE_FAMILIES. */
export function StateFamilies() {
  return <>{STATE_FAMILIES.join(', ')}</>
}

/**
 * What ThemeProvider actually stamped on <html>, read back from the element.
 * A MutationObserver rather than an effect keyed on the theme, because the
 * provider's effect runs after its children's: reading on our own effect would
 * see the previous values.
 */
function useStamped() {
  const [vars, setVars] = useState<[string, string][]>([])
  useEffect(() => {
    const root = document.documentElement
    const read = () => {
      const out: [string, string][] = []
      for (let i = 0; i < root.style.length; i += 1) {
        const p = root.style[i]
        if (p.startsWith('--')) out.push([p, root.style.getPropertyValue(p).trim()])
      }
      setVars(out)
    }
    read()
    const mo = new MutationObserver(read)
    mo.observe(root, { attributes: true, attributeFilter: ['style'] })
    return () => mo.disconnect()
  }, [])
  return vars
}

/** Counts of both namespaces as stamped, plus a check that this page's list is the same set. */
export function StampedSummary() {
  const stamped = useStamped()
  const { lightBundle, darkBundle, ramps } = useTheme()
  const graphite = stamped.filter(([n]) => n.startsWith('--graphite-')).map(([n]) => n)
  const listed = useMemo(() => {
    if (!lightBundle || !darkBundle || !ramps) return []
    return [
      ...Object.keys(lightBundle.tokens).map(graphiteVarName),
      ...stateRows(lightBundle, darkBundle, ramps).map((r) => r.name),
    ]
  }, [lightBundle, darkBundle, ramps])
  if (!stamped.length) return <p className={styles.note}>Reading the variables on the page root…</p>
  const missing = graphite.filter((n) => !listed.includes(n))
  const extra = listed.filter((n) => !graphite.includes(n))
  return (
    <p className={styles.note}>
      ThemeProvider has stamped <strong>{graphite.length}</strong>{' '}
      <code>--graphite-*</code> variables on this page&rsquo;s root.{' '}
      {missing.length || extra.length
        ? `This page lists ${listed.length}; they differ by ${[...missing, ...extra].join(', ')}.`
        : `The ${listed.length} listed on this page are exactly that set, read back from the element rather than counted by hand.`}
    </p>
  )
}

/** The --cds-* compatibility layer, read back from <html>. */
export function CarbonLayer() {
  const stamped = useStamped()
  const cds = stamped.filter(([n]) => n.startsWith('--cds-'))
  return (
    <>
      <p className={styles.note}>
        The binding table maps <strong>{CARBON_VAR_COUNT}</strong> Carbon
        variables; {cds.length ? <strong>{cds.length}</strong> : 'the page is still reading how many'}{' '}
        are on this page&rsquo;s root now, with the values the active theme
        resolved.
      </p>
      <Accordion type="single" collapsible>
        <AccordionItem title={`Show the ${cds.length || CARBON_VAR_COUNT} --cds-* variables`}>
          <ul className={styles.cdsList}>
            {cds.map(([name, value]) => (
              <li key={name}>
                <span aria-hidden="true" className={styles.swatchSmall} style={{ background: value }} />
                <code>{name}</code>
                <span className={styles.hex}>{value.toUpperCase()}</span>
              </li>
            ))}
          </ul>
        </AccordionItem>
      </Accordion>
    </>
  )
}

/** A live excerpt of what Create's Get the code emits, from the same exporter. */
export function ExportExcerpt() {
  const { sourceHex, ramps, lightBundle, darkBundle } = useTheme()
  const out = useMemo(() => {
    if (!ramps || !lightBundle || !darkBundle) return null
    const bundle: ExportBundle = {
      hex: sourceHex,
      ramps,
      light: lightBundle,
      lightStates: lightBundle.states,
      dark: darkBundle,
      darkStates: darkBundle.states,
    }
    const css = buildCss(bundle)
    const lines = css.split('\n')
    const selectors = lines
      .filter((l) => l.endsWith('{') && !l.startsWith('@media'))
      .map((l) => l.slice(0, -1).trim())
    const firstBlock = lines.slice(0, lines.indexOf('}') + 1)
    const isDecl = (l: string) => l.trim().startsWith('--graphite-')
    // The primary family in full: the role, then its states.
    const excerpt = [
      firstBlock[0],
      ...firstBlock.filter((l) =>
        /--graphite-primary(-(hover|pressed|selected|disabled|disabled-content|focus))?:/.test(l),
      ),
      '  …',
      '}',
    ].join('\n')
    const json = buildJson(bundle)
    return {
      selectors,
      perBlock: firstBlock.filter(isDecl).length,
      excerpt,
      jsonKeys: Object.keys(json),
      semanticKeys: Object.keys((json.semantic?.light ?? {}) as object),
    }
  }, [sourceHex, ramps, lightBundle, darkBundle])
  if (!out) return null
  return (
    <>
      <DocSnippet code={out.excerpt} />
      <p className={styles.note}>
        The colors come in {out.selectors.length} blocks (
        {out.selectors.map((s, i) => (
          <span key={s}>
            {i ? (i === out.selectors.length - 1 ? ' and ' : ', ') : ''}
            <code>{s}</code>
          </span>
        ))}
        ), {out.perBlock} declarations each: every role, state, ladder step and
        the scrim, under the same <code>--graphite-*</code> names the
        components read. The middle block sits inside{' '}
        <code>@media (prefers-color-scheme: dark)</code>, so a page that sets
        no <code>data-theme</code> follows the visitor&rsquo;s OS. The JSON
        carries the same values, with the ramp and tone each one came from,
        under{' '}
        {out.jsonKeys.map((k, i) => (
          <span key={k}>
            {i ? (i === out.jsonKeys.length - 1 ? ' and ' : ', ') : ''}
            <code>{k}</code>
          </span>
        ))}
        , with each theme split into{' '}
        {out.semanticKeys.map((k, i) => (
          <span key={k}>
            {i ? (i === out.semanticKeys.length - 1 ? ' and ' : ', ') : ''}
            <code>{k}</code>
          </span>
        ))}
        .
      </p>
    </>
  )
}
