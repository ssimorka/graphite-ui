'use client'

import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { Asleep, Light, Menu, Close } from '@carbon/icons-react'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { ColorPickerPopover } from '@/components/color-picker'
import { NavigationMenu, type NavItem } from '@/components/ui/navigation-menu'
import { Modal } from '@/components/ui/modal'
import styles from './site-header.module.scss'

// Root-relative hrefs throughout: the header is shared between / and /docs,
// so a bare `#system` would resolve against whichever page you are on and
// scroll nowhere.
//
// Docs sits last, after the in-page anchors: the first two scroll the landing
// page, this one leaves it. Patterns is not listed separately because it lives
// inside the docs page.
const NAV_ITEMS: [NavItem, ...NavItem[]] = [
  { href: '/#system', label: 'System' },
  { href: '/#faq', label: 'FAQ' },
  { href: '/docs', label: 'Docs' },
  { href: '/gallery', label: 'Components' },
]

// Only route items can be "current". The two in-page anchors both live on `/`,
// so matching on pathname alone would mark them current together and emit two
// aria-current="page" on one nav, which is worse than marking neither.
function withCurrent(pathname: string): [NavItem, ...NavItem[]] {
  return NAV_ITEMS.map((item) => ({
    ...item,
    current:
      !item.href.includes('#') &&
      (pathname === item.href || pathname.startsWith(`${item.href}/`)),
  })) as [NavItem, ...NavItem[]]
}

/**
 * The app shell's header bar: site chrome, deliberately not a system
 * component. `docs/contracts/navigation-menu.md` (2.0.0) prohibits folding a
 * header bar, a global action rail or a collapsible side panel into
 * NavigationMenu, so this composes that component for the link list and keeps
 * the bar, the actions and the mobile panel to itself.
 *
 * Replaces @carbon/react's UI shell — `Header`, `HeaderName`,
 * `HeaderNavigation`, `HeaderMenuItem`, `HeaderMenuButton`, `HeaderGlobalBar`,
 * `HeaderGlobalAction`, `SkipToContent`, `SideNav` — which is step 1 of the
 * build order in `docs/SHADCN-MIGRATION.md`.
 */
export function SiteHeader() {
  const { theme, toggleTheme, sourceHex, setSourceHex } = useTheme()
  const isDark = theme === 'g100'
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const items = withCurrent(pathname)

  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main-content">
        Skip to main content
      </a>
      <div className={styles.inner}>
        <a className={styles.brand} href="/">
          Graphite UI
        </a>
        <div className={styles.nav}>
          <NavigationMenu items={items} label="Main" />
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.action}
            aria-label={
              isDark ? 'Switch to light theme' : 'Switch to dark theme'
            }
            onClick={toggleTheme}
          >
            {isDark ? <Light size={20} /> : <Asleep size={20} />}
          </button>
          {/* The source color is the product's single input, so it lives in
              the action rail as a persistent control rather than inside one
              section. */}
          <div className="site-header__source">
            <ColorPickerPopover
              value={sourceHex || COVER_SOURCE_HEX}
              onChange={setSourceHex}
            />
          </div>
          <button
            type="button"
            className={`${styles.action} ${styles.menuButton}`}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <Close size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
      {/* Mobile nav is a Modal, not a Sheet: the migration plan spends its one
          new-contract budget on Accordion, so this reuses what already has a
          contract. Dismissal on link click is delegated here rather than added
          to NavigationMenu as a prop, which would be a contract change for a
          concern that belongs to the shell — and the same-page anchors are the
          case that needs it, since they navigate without a page load. */}
      <Modal
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        title="Menu"
        body={
          <div
            className={styles.mobileNav}
            onClick={(e) => {
              if ((e.target as HTMLElement).closest('a')) setMenuOpen(false)
            }}
          >
            <NavigationMenu items={items} orientation="vertical" label="Main" />
          </div>
        }
      />
    </header>
  )
}
