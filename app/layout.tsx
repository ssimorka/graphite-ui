import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { ThemeProvider } from '@/components/theme-provider'
import { SiteHeader } from '@/components/site-header'
import './globals.scss'

export const metadata: Metadata = {
  // Required so the Open Graph image below resolves to an absolute production
  // URL; without it Next falls back to localhost and link previews break.
  metadataBase: new URL('https://www.graphite-ui.com'),
  title: 'Graphite UI: One color. A whole design system.',
  description:
    'Graphite UI is a structured design system built from one input: a source color. It generates the color foundations first — perceptual ramps, semantic tokens, contrast-checked pairings, and a pattern library — with layout, components, and typography built to follow the same system as it grows.',
  // Carried over from the previous graphite-ui.com build so the live domain
  // keeps its existing favicon and touch icon after the framework swap.
  icons: {
    icon: [
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'Graphite UI: One color. A whole design system.',
    images: ['/graphite/cover.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#161616',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="cds--g100" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SiteHeader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
