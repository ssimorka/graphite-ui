'use client'

import { useEffect, useState } from 'react'
import styles from './layout.module.scss'

export type BreakpointRow = {
  name: string
  suffix: string
  px: number
  /** The kit mode that holds this width, e.g. `LG (1056px)`. */
  kitMode: string
  /** What Carbon's `$grid-breakpoints` map calls the same stop. */
  carbon: string
}

/**
 * The breakpoints with the reader's own viewport marked. The rows come from
 * the server (globals.scss and the kit snapshot); the only thing this adds is
 * `window.innerWidth`, read on mount and on resize. Before hydration nothing is
 * marked, rather than guessing a width the server cannot know.
 */
export function BreakpointTable({ rows }: { rows: BreakpointRow[] }) {
  const [width, setWidth] = useState<number | null>(null)

  useEffect(() => {
    const measure = () => setWidth(window.innerWidth)
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  // The widest stop at or below the viewport is the band you are in.
  const current =
    width === null ? null : [...rows].reverse().find((r) => width >= r.px) ?? null

  return (
    <div className={styles.bpWrap}>
      <p className={styles.here} aria-live="polite">
        {width === null
          ? 'Measuring your viewport…'
          : current
            ? `Your viewport is ${width}px wide, which puts you at ${current.suffix}.`
            : `Your viewport is ${width}px wide, below the smallest stop.`}
      </p>
      <table className={`${styles.table} ${styles.bp}`}>
        <caption className={styles.srOnly}>Breakpoints</caption>
        <thead>
          <tr>
            <th scope="col">Token</th>
            <th scope="col">Width</th>
            <th scope="col">Range</th>
            <th scope="col" className={styles.wide}>
              Kit mode
            </th>
            <th scope="col" className={styles.wide}>
              Carbon
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => {
            const next = rows[i + 1]
            const isHere = current?.name === r.name
            return (
              <tr key={r.name} className={isHere ? styles.hereRow : undefined}>
                <th scope="row">
                  <code>{r.name}</code>
                  {isHere ? <span className={styles.hereTag}>You are here</span> : null}
                </th>
                <td className={styles.value}>{r.px}px</td>
                <td>{next ? `${r.px} to ${next.px - 1}` : `${r.px} and up`}</td>
                <td className={styles.wide}>{r.kitMode}</td>
                <td className={styles.wide}>
                  <code>{r.carbon}</code>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
