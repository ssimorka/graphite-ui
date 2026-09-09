'use client'

import { Grid, Column } from '@carbon/react'
import { CARBON_VAR_COUNT } from '@/components/theme-provider'
import styles from './site-footer.module.scss'

// The kit's four link columns. Targets point at what exists today: the docs
// routes the site actually serves, the gallery, and the repo. Entries the kit
// names but the site has no route for yet resolve to the nearest real page
// rather than to a 404.
const REPO = 'https://github.com/ssimorka/graphite-ui'

const COLUMNS: { heading: string; links: { label: string; href: string }[] }[] = [
  {
    heading: 'Docs',
    links: [
      { label: 'Introduction', href: '/docs' },
      { label: 'Installation', href: '/docs/installation' },
      { label: 'Quick start', href: '/docs/installation' },
      { label: 'Theming', href: '/docs' },
      { label: 'Accessibility', href: '/docs' },
    ],
  },
  {
    heading: 'Components',
    links: [
      { label: 'Overview', href: '/gallery' },
      { label: 'Governed', href: `${REPO}/tree/main/docs/contracts` },
      { label: 'Ungoverned', href: `${REPO}/blob/main/docs/contracts/kit/figma-only.md` },
      { label: 'Changelog', href: `${REPO}/releases` },
    ],
  },
  {
    heading: 'Foundations',
    links: [
      { label: 'Color', href: `${REPO}/blob/main/docs/color.md` },
      { label: 'Typography', href: `${REPO}/blob/main/docs/contracts/foundations/typography.md` },
      { label: 'Spacing', href: `${REPO}/tree/main/docs/contracts/foundations` },
      { label: 'Radius', href: `${REPO}/tree/main/docs/contracts/foundations` },
      { label: 'Layout & grid', href: `${REPO}/tree/main/docs/contracts/foundations` },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'GitHub', href: REPO },
      { label: 'Governance rules', href: `${REPO}/blob/main/docs/contracts/README.md` },
      { label: 'Licence', href: `${REPO}/blob/main/LICENSE` },
    ],
  },
]

const isExternal = (href: string) => href.startsWith('http')

/** Kit section "07 Footer" (11865:3294). */
export function SiteFooter() {
  return (
    <footer className={styles.footer} aria-label="Footer">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className={styles.columns}>
            <div className={styles.brandBlock}>
              <div className={styles.brand}>
                <span className={styles.mark} aria-hidden="true" />
                <span className={styles.wordmark}>Graphite UI</span>
              </div>
              <p className={styles.tagline}>
                A design system that derives itself from one decision, and
                proves it.
              </p>
            </div>

            <nav className={styles.links} aria-label="Footer links">
              {COLUMNS.map((column) => (
                <div key={column.heading} className={styles.linkColumn}>
                  <h2 className={styles.linkHeading}>{column.heading}</h2>
                  <ul className={styles.linkList}>
                    {column.links.map((link) => (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          {...(isExternal(link.href)
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </div>

          <div className={styles.bar}>
            <p className={styles.stats}>
              8 ramps · 32 roles · {CARBON_VAR_COUNT} variables · WCAG AA/AAA
            </p>
            <div className={styles.credit}>
              <span className={styles.creditLabel}>Built by</span>
              <a
                href="https://simorkadesigns.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/graphite/sd-system-logo.png"
                  alt="SD System"
                  className={styles.creditLogo}
                />
              </a>
            </div>
          </div>
        </Column>
      </Grid>
    </footer>
  )
}
