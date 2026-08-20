import styles from './breadcrumb.module.scss'

export type Crumb = {
  label: string
  href?: string
}

/** Contract: docs/contracts/breadcrumb.md (1.1.0) */
type BreadcrumbProps = {
  /**
   * At least one, and the last is always the current page. The tuple enforces
   * the minimum; the render enforces that the last one is not a link.
   */
  items: [Crumb, ...Crumb[]]
  /**
   * Trails longer than this collapse their middle rather than wrapping onto a
   * second line, which the contract rules out.
   */
  maxItems?: number
}

const ELLIPSIS = { label: '…' } as const

export function Breadcrumb({ items, maxItems = 4 }: BreadcrumbProps) {
  // Keep the first and the tail; the middle goes behind a single ellipsis.
  const shown =
    items.length > maxItems
      ? [items[0], ELLIPSIS as Crumb, ...items.slice(items.length - (maxItems - 2))]
      : items

  return (
    <nav aria-label="Breadcrumb">
      <ol className={styles.list}>
        {shown.map((crumb, i) => {
          const isLast = i === shown.length - 1
          const collapsed = crumb === (ELLIPSIS as Crumb)
          return (
            <li key={`${crumb.label}-${i}`} className={styles.crumb}>
              {isLast ? (
                // "Here", not a link: non-interactive and visually distinct.
                <span className={styles.current} aria-current="page">
                  {crumb.label}
                </span>
              ) : collapsed ? (
                <span className={styles.link} aria-hidden="true">
                  {crumb.label}
                </span>
              ) : (
                <a className={styles.link} href={crumb.href}>
                  {crumb.label}
                </a>
              )}
              {isLast ? null : (
                <span className={styles.separator} aria-hidden="true">
                  /
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
