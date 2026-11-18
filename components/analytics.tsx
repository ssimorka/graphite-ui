'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { initAnalytics, track } from '@/lib/analytics'
import type { KitDestination, KitEdition, KitPlacement } from '@/lib/kit-links'

/**
 * Pageviews and kit-link clicks. Renders nothing, and does nothing at all
 * without NEXT_PUBLIC_POSTHOG_KEY (lib/analytics.ts).
 *
 * Kit links carry their event in data attributes (`kitLink` in
 * lib/kit-links.ts), read here by one delegated listener, so server and
 * client components link the same way and no link needs its own handler.
 */
export function Analytics() {
  const pathname = usePathname()

  // The last URL sent, so a repeated effect (StrictMode in development, a
  // re-render on the same route) never counts one view twice.
  const lastView = useRef<string | null>(null)

  useEffect(() => {
    if (!initAnalytics()) return
    if (lastView.current === window.location.href) return
    lastView.current = window.location.href
    // Read from location rather than useSearchParams, which would opt every
    // page out of static rendering for the sake of a query string.
    track('$pageview', { $current_url: window.location.href })
  }, [pathname])

  useEffect(() => {
    if (!initAnalytics()) return
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[data-kit-edition]')
      if (!(a instanceof HTMLAnchorElement)) return
      track('kit_link_clicked', {
        edition: a.dataset.kitEdition as KitEdition,
        destination: a.dataset.kitDestination as KitDestination,
        placement: a.dataset.kitPlacement as KitPlacement,
      })
    }
    // Capture phase, and auxclick for a middle-click into a new tab.
    document.addEventListener('click', onClick, true)
    document.addEventListener('auxclick', onClick, true)
    return () => {
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('auxclick', onClick, true)
    }
  }, [])

  return null
}
