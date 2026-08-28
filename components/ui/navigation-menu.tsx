import styles from './navigation-menu.module.scss'

/** A second-level item. Note it has no children of its own — see below. */
export type NavChild = {
  label: string
  href: string
  current?: boolean
}

export type NavItem = {
  label: string
  href: string
  current?: boolean
  /**
   * One level of nesting, and only one. `NavChild` has no `items` of its own,
   * so a third level is not expressible — the contract says it should become a
   * dedicated page rather than a deeper flyout.
   */
  items?: NavChild[]
}

/**
 * Contract: docs/contracts/navigation-menu.md (2.0.0)
 *
 * A list of links, and only that. The kit's counterpart is Carbon's six UI
 * shell sets, which rule 6 places out of scope as application shells, so the
 * kit is silent here and this geometry is the code's own (#113). The de-Carbon
 * pass in docs/SHADCN-MIGRATION.md replaces `site-header.tsx`, and the shell it
 * builds may compose this component but must not be folded into it — a header
 * bar, a global action rail or a collapsible side panel is site chrome.
 */
type NavigationMenuProps = {
  items: [NavItem, ...NavItem[]]
  orientation?: 'horizontal' | 'vertical'
  label?: string
}

export function NavigationMenu({
  items,
  orientation = 'horizontal',
  label = 'Main',
}: NavigationMenuProps) {
  return (
    <nav aria-label={label} className={styles.nav}>
      <ul className={`${styles.list} ${styles[orientation]}`}>
        {/* Keyed on the index alongside the href: nothing stops two items from
            pointing at the same destination, and a repeated href alone would
            collide. */}
        {items.map((item, i) => (
          <li key={`${item.href}-${i}`} className={styles.item}>
            <a
              className={`${styles.link} ${item.current ? styles.current : ''}`}
              href={item.href}
              aria-current={item.current ? 'page' : undefined}
            >
              {item.label}
            </a>
            {/* Nested items render inline. Flyout presentation waits on the
                Wave 5 overlay surface — the same soft dependency Select has. */}
            {item.items?.length ? (
              <ul className={styles.sublist}>
                {item.items.map((child, i) => (
                  <li key={`${child.href}-${i}`}>
                    <a
                      className={`${styles.link} ${child.current ? styles.current : ''}`}
                      href={child.href}
                      aria-current={child.current ? 'page' : undefined}
                    >
                      {child.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ul>
    </nav>
  )
}
