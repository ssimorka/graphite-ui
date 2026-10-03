'use client'

import { useCallback, useEffect, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import { Asleep, Light, Menu, Close, LogoGithub, Search } from '@carbon/icons-react'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { ColorPickerPopover } from '@/components/color-picker'
import { Brand } from '@/components/brand'
import { NavigationMenu, type NavItem } from '@/components/ui/navigation-menu'
import { useOverlay } from '@/components/ui/overlay'
import { DOCS_NAV } from '@/components/docs-nav'
import { SearchPalette } from '@/components/search/search-palette'
import styles from './site-header.module.scss'

// The kit's header nav, with every label pointed at something that exists:
// Create is the theme builder.
const NAV_ITEMS: [NavItem, ...NavItem[]] = [
  { href: '/docs', label: 'Docs' },
  { href: '/gallery', label: 'Components' },
  { href: '/create', label: 'Create' },
]

function withCurrent(pathname: string): [NavItem, ...NavItem[]] {
  return NAV_ITEMS.map((item) => ({
    ...item,
    current: pathname === item.href || pathname.startsWith(`${item.href}/`),
  })) as [NavItem, ...NavItem[]]
}

/**
 * The mobile nav tray: slides in from the left under the bar, so the menu
 * button stays in view as its close control.
 *
 * Dismissal and the focus trap come from the shared Overlay base, as they did
 * when this was a Modal. What differs is the exit: Overlays unmount on close
 * with no exit motion, because Popover's nesting throw depends on it. The tray
 * has no such throw, so it stays mounted (and inert) through its slide-out.
 */
function Tray({
  open,
  onClose,
  children,
}: {
  open: boolean
  onClose: () => void
  children: ReactNode
}) {
  const [mounted, setMounted] = useState(open)
  if (open && !mounted) setMounted(true)

  // A timer rather than animationend, which a background tab may never fire.
  // Just past the 220ms slide-out in site-header.module.scss.
  useEffect(() => {
    if (open || !mounted) return
    const t = setTimeout(() => setMounted(false), 260)
    return () => clearTimeout(t)
  }, [open, mounted])

  const ref = useOverlay<HTMLDivElement>({
    open,
    onDismiss: () => onClose(),
    trapFocus: true,
  })

  if (!mounted) return null

  return (
    <div className={styles.tray} data-state={open ? 'open' : 'closed'} inert={!open}>
      <div className={styles.trayScrim} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        tabIndex={-1}
        className={styles.trayPanel}
      >
        {children}
      </div>
    </div>
  )
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
  const [menuToggled, setMenuToggled] = useState(false)
  // The menu button goes away at lg, so an open tray would be left with no
  // way to close it but Escape.
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 1056px)')
    const close = () => lg.matches && setMenuOpen(false)
    lg.addEventListener('change', close)
    return () => lg.removeEventListener('change', close)
  }, [])
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
          onClick={() => {
            setMenuToggled(true)
            setMenuOpen((v) => !v)
          }}
        >
          {/* Keyed, so each swap remounts and spins the new glyph in. Not on
              first paint: only once the button has been used. */}
          <span
            key={menuOpen ? 'close' : 'menu'}
            className={menuToggled ? styles.menuIconSpin : styles.menuIcon}
          >
            {menuOpen ? <Close size={20} /> : <Menu size={20} />}
          </span>
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
      {/* Mobile nav is a tray, not a Modal and not a Sheet: a collapsible side
          panel is site chrome by navigation-menu.md's own prohibition, so it
          lives here and costs no new contract. Dismissal on link click is
          delegated here rather than added to NavigationMenu as a prop, which
          would be a contract change for a concern that belongs to the shell. */}
      <Tray open={menuOpen} onClose={() => setMenuOpen(false)}>
        <div
          className={styles.mobileNav}
          onClick={(e) => {
            if ((e.target as HTMLElement).closest('a')) setMenuOpen(false)
          }}
        >
          <div className={styles.trayGroup} style={{ '--g': 0 } as CSSProperties}>
            <NavigationMenu items={items} orientation="vertical" label="Main" />
          </div>
          {/* The docs sidebar is hidden below lg, as in the kit's Medium and
              Small frames, so its links live here instead. */}
          {pathname.startsWith('/docs')
            ? DOCS_NAV.map((group, i) => (
                <div
                  key={group.label}
                  className={`${styles.mobileGroup} ${styles.trayGroup}`}
                  style={{ '--g': i + 1 } as CSSProperties}
                >
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
      </Tray>
      <SearchPalette open={searchOpen} onClose={closeSearch} />
    </header>
  )
}
