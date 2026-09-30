'use client'

import { useEffect, useRef, useState } from 'react'
import styles from './breadcrumb.module.scss'

export type Crumb = {
  label: string
  href?: string
}

/** Contract: docs/contracts/breadcrumb.md (1.2.0) */
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

export function Breadcrumb({ items, maxItems = 4 }: BreadcrumbProps) {
  // Expansion belongs to one trail. Keyed on the labels, so navigating to a
  // page with a different trail starts collapsed again even when the component
  // instance survives the navigation.
  const trailKey = items.map((c) => c.label).join('/')
  const [expandedFor, setExpandedFor] = useState<string | null>(null)
  const expanded = expandedFor === trailKey
  // The first crumb the overflow was hiding. Expanding removes the button that
  // had focus, so focus moves here instead of falling back to the page.
  const revealed = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    if (expanded) revealed.current?.focus()
  }, [expanded])

  // Keep the first and the tail; the middle goes behind a single overflow
  // button that expands the trail in place.
  const collapsed = !expanded && items.length > maxItems
  // At least the current page stays in the tail, however small maxItems is.
  const tail = collapsed ? items.slice(items.length - Math.max(1, maxItems - 2)) : []
  const hidden = collapsed ? items.length - 1 - tail.length : 0
  const shown: (Crumb | null)[] = collapsed ? [items[0], null, ...tail] : items

  return (
    <nav aria-label="Breadcrumb">
      <ol className={`${styles.list} ${expanded ? styles.expanded : ''}`}>
        {shown.map((crumb, i) => {
          const isLast = i === shown.length - 1
          return (
            <li key={crumb ? `${crumb.label}-${i}` : 'overflow'} className={styles.crumb}>
              {crumb === null ? (
                <button
                  type="button"
                  className={`${styles.link} ${styles.overflow}`}
                  aria-label={`Show ${hidden} more breadcrumbs`}
                  onClick={() => setExpandedFor(trailKey)}
                >
                  …
                </button>
              ) : isLast ? (
                // "Here", not a link: non-interactive and visually distinct.
                <span className={styles.current} aria-current="page">
                  {crumb.label}
                </span>
              ) : (
                <a
                  className={styles.link}
                  href={crumb.href}
                  ref={expanded && i === 1 ? revealed : undefined}
                >
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
