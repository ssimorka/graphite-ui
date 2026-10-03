'use client'

import type { ReactNode } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { Menu } from './menu'
import styles from './breadcrumb.module.scss'

export type Crumb = {
  label: string
  href?: string
}

/** Contract: docs/contracts/breadcrumb.md (1.3.0) */
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
  /**
   * The kit's Show Icon slot: a 16px glyph before the first crumb (the kit
   * draws fi-rs-bread-slice). Decorative, so it carries no name of its own.
   */
  icon?: ReactNode
}

export function Breadcrumb({ items, maxItems = 4, icon }: BreadcrumbProps) {
  // Keep the first and the tail; the middle goes behind one overflow button
  // that opens a Menu of the hidden crumbs, as the kit's Overflow item does.
  const collapsed = items.length > maxItems
  // At least the current page stays in the tail, however small maxItems is.
  const tail = collapsed ? items.slice(items.length - Math.max(1, maxItems - 2)) : []
  const hiddenCrumbs = collapsed ? items.slice(1, items.length - tail.length) : []
  const shown: (Crumb | null)[] = collapsed ? [items[0], null, ...tail] : items

  return (
    <nav aria-label="Breadcrumb" className={styles.nav}>
      {icon ? (
        <span className={styles.icon} aria-hidden="true">
          {icon}
        </span>
      ) : null}
      <ol className={styles.list}>
        {shown.map((crumb, i) => {
          const isLast = i === shown.length - 1
          return (
            <li key={crumb ? `${crumb.label}-${i}` : 'overflow'} className={styles.crumb}>
              {crumb === null ? (
                <Menu
                  items={
                    hiddenCrumbs.map((c) => ({
                      label: c.label,
                      // Crumbs are page links, and the site's links are full
                      // loads, so selecting one navigates the same way.
                      onSelect: () => {
                        if (c.href) window.location.assign(c.href)
                      },
                    })) as [{ label: string; onSelect: () => void }, ...{ label: string; onSelect: () => void }[]]
                  }
                  trigger={(props) => (
                    <button
                      type="button"
                      className={styles.overflow}
                      aria-label={`Show ${hiddenCrumbs.length} more breadcrumbs`}
                      {...props}
                    >
                      <KitIcon name="menu-dots" size={12} />
                    </button>
                  )}
                />
              ) : isLast ? (
                // "Here", not a link: non-interactive and visually distinct.
                <span className={styles.current} aria-current="page">
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
