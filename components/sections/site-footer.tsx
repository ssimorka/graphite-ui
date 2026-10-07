'use client'

import { Grid, Column } from '@carbon/react'
import { Brand } from '@/components/brand'
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
      { label: 'Quick start', href: '/docs/quick-start' },
      { label: 'Theming', href: '/docs/theming' },
      { label: 'Accessibility', href: '/docs/accessibility' },
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
      { label: 'Color', href: '/docs/foundations/color' },
      { label: 'Typography', href: '/docs/foundations/typography' },
      { label: 'Spacing', href: '/docs/foundations/spacing' },
      { label: 'Radius', href: '/docs/foundations/radius' },
      { label: 'Layout & grid', href: '/docs/foundations/layout' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'GitHub', href: REPO },
      { label: 'Governance rules', href: '/docs/contribute/governance' },
      { label: 'Licence', href: `${REPO}/blob/main/LICENSE` },
      // The kit's icons are Flaticon's UIcons; their free licence asks for this.
      { label: 'Icons: UIcons by Flaticon', href: 'https://www.flaticon.com/uicons' },
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
              <Brand />
              <p className={styles.tagline}>
                A design system built from one color. Automated checks compare
                its components and tokens to the Figma kit.
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
              8 color scales · 32 roles · WCAG AA and AAA
            </p>
            <div className={styles.credit}>
              <span className={styles.creditLabel}>Built by Simorka Designs</span>
              <a
                href="https://simorkadesigns.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Simorka Designs"
              >
                <img
                  src="/graphite/sd-system-logo.png"
                  alt=""
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
