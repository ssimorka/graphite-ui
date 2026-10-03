'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { NavigationMenu, type NavItem } from '@/components/ui/navigation-menu'
import { MeshGradient } from '@/components/mesh-gradient'
import { useTheme } from '@/components/theme-provider'
import styles from './docs-shell.module.scss'

export type DocsNavGroup = {
  label: string
  items: [NavItem, ...NavItem[]]
}

export type TocItem = {
  /** In-page anchor, `#`-prefixed. The id it names has to exist in the page. */
  href: string
  label: string
}

// A stable identity for "this page has no TOC". An inline `?? []` would be a
// fresh array on every render, which would re-run the effect below forever.
const NO_TOC: TocItem[] = []

/**
 * Marks the section currently under the top of the viewport.
 *
 * rootMargin pins the observation band just under the fixed 64px header and
 * well above the fold, so "current" means the heading you have most recently
 * scrolled past rather than whatever happens to be centred. Without the
 * negative bottom the last few short sections would all qualify at once.
 *
 * Written in px, not rem: IntersectionObserver rejects any other unit at
 * construction time. 64px is the header height that site-header.module.scss
 * sets and .page-main offsets by, so all three have to agree. (This said 48
 * while the header was 64, which put the band under the header's lower edge.)
 */
// How strong the header wash may be, by the visitor's contrast target and the
// mode. Swept 2026-10-03 over 288 sources (96 hues at three saturations)
// through makeRamps / buildTheme, with onSurface, onSurfaceVariant and primary
// measured against the wash at its worst point (the glow at full strength,
// ignoring the fade): these are the strongest steps that keep every case
// above the target with room to spare.
//   AA:  light 0.3 -> 5.29:1 worst, dark 0.4 -> 5.11:1 worst
//   AAA: light 0.1 -> 7.16:1 worst, dark 0.2 -> 7.32:1 worst
// Full strength in dark measured 1.66:1, which is why it is capped at all.
const WASH_OPACITY = {
  AA: { white: 0.3, g100: 0.4 },
  AAA: { white: 0.1, g100: 0.2 },
} as const

function useScrollSpy(items: TocItem[]) {
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const ids = items.map((i) => i.href.slice(1))
    if (!ids.length) return

    const seen = new Map<string, boolean>()

    // At the foot of the page the last section can be physically unable to
    // reach the band — there is no scroll left to give it — so first-wins
    // would strand the highlight one item short of the end. Measured: on
    // /docs/installation the page bottoms out with #checks still 220px below
    // the band. Within a pixel of the bottom, last-wins instead.
    const atBottom = () =>
      Math.ceil(window.scrollY + window.innerHeight) >=
      document.documentElement.scrollHeight - 1

    const pick = () => {
      // Document order, so the highlight walks down the list as you scroll
      // rather than jumping to whichever entry happened to fire last.
      const hits = ids.filter((id) => seen.get(id))
      // Nothing in the band means the reader is outside every section. Above
      // the first, at the page head, the first entry is what they are about
      // to read, so it takes the highlight rather than leaving the list blank.
      // Anywhere else it clears rather than holding the last value: a stale
      // highlight names a section the reader has scrolled away from.
      if (!hits.length) {
        const first = document.getElementById(ids[0])
        const aboveFirst = !!first && first.getBoundingClientRect().top > 64
        setActive(aboveFirst ? ids[0] : null)
        return
      }
      setActive(atBottom() ? hits[hits.length - 1] : hits[0])
    }

    const observer = new IntersectionObserver((entries) => {
      for (const e of entries) seen.set(e.target.id, e.isIntersecting)
      pick()
    }, { rootMargin: '-64px 0px -70% 0px' })

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((n): n is HTMLElement => n !== null)
    nodes.forEach((n) => observer.observe(n))

    // The observer alone cannot see the bottom case: once scrolling stops
    // crossing boundaries it has nothing to report, so nothing re-evaluates.
    window.addEventListener('scroll', pick, { passive: true })
    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', pick)
    }
  }, [items])

  return active
}

/**
 * The docs shell: a left sidebar, the page, and an on-this-page rail.
 *
 * Site chrome, not a system component, for the reason
 * `docs/contracts/navigation-menu.md` (2.0.0) gives — a collapsible side panel
 * is chrome. The sidebar's link lists are NavigationMenu; the rails, the group
 * headings and the scroll-spy belong to the shell.
 *
 * Step 2 of the build order in `docs/SHADCN-MIGRATION.md`. It knows nothing
 * about its content, which is what lets `/docs/components/[slug]` reuse it
 * unchanged in S2.
 */
export function DocsShell({
  nav,
  toc,
  tocFooter,
  wash = true,
  children,
}: {
  nav: DocsNavGroup[]
  toc?: TocItem[]
  /** Sits under the on-this-page list: the kit's "Contract footnote". */
  tocFooter?: ReactNode
  /**
   * The accent mesh behind the top of the page. Off for a page that brings its
   * own ground, as the Components index does with its grid.
   */
  wash?: boolean
  children: ReactNode
}) {
  const pathname = usePathname()
  const active = useScrollSpy(toc ?? NO_TOC)
  const { theme, level } = useTheme()

  return (
    <div className={`${styles.shell} ${toc?.length ? styles.withToc : ''}`}>
      {/* The home band's accent mesh, washed behind the top of every docs
          page and faded out before the reading starts. On the shell rather
          than the content column, so it runs under the on-this-page rail to
          the window's edge instead of stopping where the rail begins. */}
      {wash ? (
        <div
          className={styles.wash}
          aria-hidden="true"
          style={{ opacity: WASH_OPACITY[level][theme] }}
        >
          <MeshGradient family="accent" className={styles.washMesh} />
        </div>
      ) : null}
      <aside className={`${styles.rail} ${styles.sidebar}`}>
        {nav.map((group) => (
          <div key={group.label} className={styles.group}>
            <p className={styles.groupLabel}>{group.label}</p>
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
        ))}
      </aside>

      <div className={styles.content}>
        {children}
      </div>

      {/* Rendered only when the page offers one. A component page with three
          short sections is better off without a rail than with a stub. */}
      {toc?.length ? (
        <nav className={`${styles.rail} ${styles.toc}`} aria-label="On this page">
          <p className={styles.tocLabel}>On this page</p>
          <ul className={styles.tocList}>
            {toc.map((item) => {
              const current = active === item.href.slice(1)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className={`${styles.tocLink} ${current ? styles.tocCurrent : ''}`}
                    aria-current={current ? 'true' : undefined}
                  >
                    {item.label}
                  </a>
                </li>
              )
            })}
          </ul>
          {tocFooter}
        </nav>
      ) : null}
    </div>
  )
}
