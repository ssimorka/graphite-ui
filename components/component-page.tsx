import type { ReactNode } from 'react'
import styles from './component-page.module.scss'

// The parts every component page shares, from the kit's Site pages (Graphite UI
// Site 11814:17). Server components: they take data, and the data comes from the
// contract and the kit snapshot rather than being typed into a page.

export type Column = {
  label: string
  /** How the column's cells are set: `name` and `type` in mono, `type` in the
   *  primary role, `muted` in mono at the quieter role, `text` in the body face. */
  tone: 'name' | 'type' | 'muted' | 'text'
}

/**
 * A reference table: the kit's "Table row", used for the API, parity and slot
 * tables. Below md it stacks, per "Table row · Small": the first cell on its own
 * line, the middle cells as one wrapping meta line, the last cell full width.
 */
export function RefTable({
  columns,
  rows,
  caption,
}: {
  columns: Column[]
  rows: ReactNode[][]
  caption: string
}) {
  return (
    <table className={styles.table}>
      <caption className={styles.srOnly}>{caption}</caption>
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.label} scope="col" className={styles[c.tone]}>
              {c.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((cells, i) => (
          <tr key={i}>
            {cells.map((cell, j) =>
              j === 0 ? (
                <th key={j} scope="row" className={styles.rowHead}>
                  {cell}
                </th>
              ) : (
                <td key={j} className={styles[columns[j].tone]}>
                  {cell}
                </td>
              ),
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** One row of the token table: a live swatch, the role, what the component uses it for. */
export function TokenTable({
  rows,
}: {
  rows: { name: string; usage: string; swatch: string | null; note?: string }[]
}) {
  return (
    <ul className={styles.tokens}>
      {rows.map((r) => (
        <li key={r.name} className={styles.token}>
          {/* A role paints its own swatch, so the table recolours with the
              source colour. A foundation with no colour (spacing, type, motion)
              gets a dashed empty one rather than a made-up fill. */}
          <span
            aria-hidden="true"
            className={r.swatch ? styles.swatch : `${styles.swatch} ${styles.swatchNone}`}
            style={r.swatch ? { background: `var(${r.swatch})` } : undefined}
          />
          <code className={styles.tokenName}>{r.name}</code>
          <span className={styles.tokenUsage}>{r.usage}</span>
        </li>
      ))}
    </ul>
  )
}

/** Two columns of short rules. Each side is a list, so a reader can count them. */
export function DoDont({ dos, donts }: { dos: string[]; donts: string[] }) {
  const side = (label: string, items: string[], tone: 'do' | 'dont') => (
    <section className={`${styles.side} ${styles[tone]}`}>
      <h3 className={styles.sideLabel}>{label}</h3>
      <ul className={styles.sideList}>
        {items.map((t) => (
          <li key={t}>{t}</li>
        ))}
      </ul>
    </section>
  )
  return (
    <div className={styles.doDont}>
      {side('Do', dos, 'do')}
      {side('Don’t', donts, 'dont')}
    </div>
  )
}

/** A label and a sentence per row: the accessibility notes. */
export function NotesList({ rows }: { rows: [string, ReactNode][] }) {
  return (
    <dl className={styles.notes}>
      {rows.map(([label, body]) => (
        <div key={label} className={styles.note}>
          <dt>{label}</dt>
          <dd>{body}</dd>
        </div>
      ))}
    </dl>
  )
}

export function RelatedChips({
  items,
}: {
  items: { href: string; title: string; why: string }[]
}) {
  return (
    <ul className={styles.related}>
      {items.map((r) => (
        <li key={r.title}>
          <a className={styles.relatedLink} href={r.href}>
            <span className={styles.relatedTitle}>{r.title}</span>
            <span className={styles.relatedWhy}>{r.why}</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/** A captioned bordered field for showing a component in one condition. */
export function Surface({
  label,
  children,
}: {
  label?: string
  children: ReactNode
}) {
  return (
    <figure className={styles.surfaceWrap}>
      {label ? <figcaption className={styles.surfaceLabel}>{label}</figcaption> : null}
      <div className={styles.surface}>{children}</div>
    </figure>
  )
}
