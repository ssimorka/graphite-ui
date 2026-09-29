'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Asleep, Light, Menu, Close, LogoGithub, Search } from '@carbon/icons-react'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { ColorPickerPopover } from '@/components/color-picker'
import { Brand } from '@/components/brand'
import { NavigationMenu, type NavItem } from '@/components/ui/navigation-menu'
import { Modal } from '@/components/ui/modal'
import { DOCS_NAV } from '@/components/docs-nav'
import { SearchPalette } from '@/components/search/search-palette'
import styles from './site-header.module.scss'

// The kit's header nav, with every label pointed at something that exists:
// `#patterns` is a real section of the color docs, and Create is the theme
// builder.
//
// Root-relative throughout: the header is shared between / and /docs, so a
// bare `#patterns` would resolve against whichever page you are on.
const NAV_ITEMS: [NavItem, ...NavItem[]] = [
  { href: '/docs', label: 'Docs' },
  { href: '/gallery', label: 'Components' },
  { href: '/docs#patterns', label: 'Patterns' },
  { href: '/create', label: 'Create' },
]

// Only route items can be "current". An item carrying a hash lives on a page
// it shares with another entry, so matching on pathname alone would mark two
// current at once and emit two aria-current="page" on one nav.
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
 * NavigationMenu.
 *
 * The desktop bar renders its own nav items rather than composing
 * NavigationMenu: the kit calls its "Site nav item" chrome outside the
 * governed set, and its underline indicator is not the inset side bar
 * NavigationMenu's contract specifies. The mobile panel still composes the
 * component, vertically, which is where that indicator reads correctly.
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
  const [searchOpen, setSearchOpen] = useState(false)
  // Stable, because the Overlay hook re-runs on a new onDismiss and would send
  // focus back to the trigger while someone is typing.
  const closeSearch = useCallback(() => setSearchOpen(false), [])
  const pathname = usePathname()
  const items = withCurrent(pathname)

  // The hint names the key the reader has. Set after mount, so the server and
  // the first client render agree on ⌘K.
  const [searchKey, setSearchKey] = useState('⌘K')
  useEffect(() => {
    if (!/Mac|iPhone|iPad/.test(navigator.platform)) setSearchKey('Ctrl K')
  }, [])

  // ⌘K or Ctrl K anywhere, and "/" when not already typing into something.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null
      const typing =
        !!t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setSearchOpen((v) => !v)
      } else if (e.key === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <header className={styles.header}>
      <a className={styles.skip} href="#main-content">
        Skip to main content
      </a>
      <div className={styles.inner}>
        {/* First in the DOM, not just visually: below lg the kit puts this at
            the far left, and reordering with CSS alone would leave the tab
            order disagreeing with what is on screen. */}
        <button
          type="button"
          className={`${styles.action} ${styles.menuButton}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <Close size={20} /> : <Menu size={20} />}
        </button>

        <a className={styles.brand} href="/">
          <Brand />
        </a>

        <nav className={styles.nav} aria-label="Main">
          <ul className={styles.navList}>
            {items.map((item) => (
              <li key={item.href}>
                <a
                  className={styles.navLink}
                  href={item.href}
                  aria-current={item.current ? 'page' : undefined}
                >
                  {item.label}
                  <span className={styles.navIndicator} aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className={styles.actions}>
          {/* The kit's 232px field, as a button: it opens the search dialog
              rather than taking input itself, so the results have room. Below
              lg the kit hides the field; the icon button stands in for it. */}
          <button
            type="button"
            className={styles.search}
            aria-haspopup="dialog"
            aria-keyshortcuts="Control+K Meta+K /"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={16} className={styles.searchIcon} aria-hidden="true" />
            <span className={styles.searchPlaceholder}>Search docs</span>
            <kbd className={styles.searchKey} aria-hidden="true">
              {searchKey}
            </kbd>
          </button>
          <button
            type="button"
            className={`${styles.action} ${styles.searchButton}`}
            aria-label="Search documentation"
            aria-haspopup="dialog"
            onClick={() => setSearchOpen(true)}
          >
            <Search size={18} />
          </button>

          <a
            className={`${styles.action} ${styles.repo}`}
            href="https://github.com/ssimorka/graphite-ui"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Graphite UI on GitHub"
          >
            <LogoGithub size={18} />
          </a>

          {/* The kit pairs a filled square theme toggle with the source chip
              as one unit, so they sit in a shared group with no gap. */}
          <div className={styles.controlGroup}>
            <button
              type="button"
              className={styles.themeToggle}
              aria-label={
                isDark ? 'Switch to light theme' : 'Switch to dark theme'
              }
              onClick={toggleTheme}
            >
              {isDark ? <Light size={16} /> : <Asleep size={16} />}
            </button>
            <ColorPickerPopover
              value={sourceHex || COVER_SOURCE_HEX}
              onChange={setSourceHex}
            />
          </div>

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
            {/* The docs sidebar is hidden below lg, as in the kit's Medium and
                Small frames, so its links live here instead. */}
            {pathname.startsWith('/docs')
              ? DOCS_NAV.map((group) => (
                  <div key={group.label} className={styles.mobileGroup}>
                    <p className={styles.mobileGroupLabel}>{group.label}</p>
                    <NavigationMenu
                      label={group.label}
                      orientation="vertical"
                      items={
                        group.items.map((item) => ({
                          ...item,
                          current: pathname === item.href,
                        })) as [NavItem, ...NavItem[]]
                      }
                    />
                  </div>
                ))
              : null}
          </div>
        }
      />
      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </header>
  )
}
