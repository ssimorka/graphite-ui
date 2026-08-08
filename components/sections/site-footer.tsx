'use client'

import { Grid, Column } from '@carbon/react'
import { CARBON_VAR_COUNT } from '@/components/theme-provider'

export function SiteFooter() {
  return (
    <footer className="footer" aria-label="Footer">
      <Grid>
        <Column sm={4} md={8} lg={16}>
          <div className="footer__bar">
            <p className="footer__stats">
              3 ramps · {CARBON_VAR_COUNT} variables · WCAG AA/AAA · 20 patterns
            </p>
            <div className="footer__credit">
              <span className="footer__credit-label">Built by</span>
              <a href="https://simorkadesigns.com/" target="_blank" rel="noopener noreferrer">
                <img
                  src="/graphite/sd-system-logo.png"
                  alt="SD System"
                  className="footer__credit-logo"
                />
              </a>
            </div>
          </div>
        </Column>
      </Grid>
    </footer>
  )
}
