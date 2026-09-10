'use client'

import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * The backdrop the middle of the page sits on, and the scroll listener that
 * drifts it.
 *
 * The kit parents "Grid lines — full bleed" (11896:292490) and a second "Hero
 * spotlight" (13400:6405) to Main content rather than to the hero, spanning
 * sections 02 through 05. This owns both, plus the `--sy` the grid's transform
 * reads.
 *
 * A client component only because of that listener: app/page.tsx is a server
 * component and cannot hold one. The hero runs the same pattern for its own
 * pair, which are a separate layer — masked by an ellipse and pointer-tracked,
 * where these are flat and scroll-only.
 */
export function PageBands({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const frame = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Same bail-out as the hero: under reduced motion the listener never
    // attaches, so --sy stays at its 0 default and the grid sits still. The
    // stylesheet does not need a second rule to undo it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        // Pixels scrolled past the band region's top, floored at 0 so the
        // grid is at rest until the region is reached.
        el.style.setProperty('--sy', String(Math.max(0, -rect.top)))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame.current) cancelAnimationFrame(frame.current)
    }
  }, [])

  return (
    <div className="page-bands" ref={ref}>
      <div className="page-bands__grid" aria-hidden="true" />
      <div className="page-bands__glow" aria-hidden="true" />
      {children}
    </div>
  )
}
