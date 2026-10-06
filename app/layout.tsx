import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import { SiteTheme } from '@/components/site-theme'
import { SiteHeader } from '@/components/site-header'
import { THEME_RESTORE_SCRIPT } from '@/lib/theme-storage'
import './globals.scss'

export const metadata: Metadata = {
  // Required so the Open Graph image below resolves to an absolute production
  // URL; without it Next falls back to localhost and link previews break.
  metadataBase: new URL('https://www.graphite-ui.com'),
  title: 'Graphite UI: One color. A whole theme.',
  description:
    'Graphite UI builds a whole theme from one color: color scales, named roles, and light and dark themes, with contrast checked. Radius, density and type are choices in Create. Checks in CI hold the governed components and tokens to the Figma kit.',
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
    title: 'Graphite UI: One color. A whole theme.',
    description:
      'A whole theme from one color, with contrast checked. Governed components and tokens are held to the Figma kit in CI.',
    images: ['/graphite/cover.jpg'],
  },
}

export const viewport: Viewport = {
  themeColor: '#161616',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="cds--g100" data-theme="dark" style={{ colorScheme: 'dark' }} suppressHydrationWarning>
      <head>
        {/* Puts the visitor's last colors back before first paint. */}
        <script dangerouslySetInnerHTML={{ __html: THEME_RESTORE_SCRIPT }} />
      </head>
      <body>
        <SiteTheme>
          <SiteHeader />
          {children}
        </SiteTheme>
      </body>
    </html>
  )
}
