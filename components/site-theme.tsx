'use client'

import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { CarbonTheme, carbonExtension } from '@/components/carbon-compat'

/**
 * The theme provider as this site configures it. The visitor picks the source,
 * so it persists across page loads (most links are plain anchors and every
 * click is a full load), it starts dark, and Carbon's layer rides along for the
 * Carbon components the site still renders.
 *
 * A client component of its own because `extend` is a function, which cannot
 * cross from the server layout into a client component as a prop.
 */
export function SiteTheme({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider defaultTheme="dark" persist extend={carbonExtension}>
      <CarbonTheme>{children}</CarbonTheme>
    </ThemeProvider>
  )
}
