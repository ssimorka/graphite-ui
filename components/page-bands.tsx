'use client'

import { useCallback, useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

/**
 * The backdrop the middle of the page sits on, and the listeners that drift it.
 *
 * The kit parents "Grid lines — full bleed" (11896:292490) and a second "Hero
 * spotlight" (13400:6405) to Main content rather than to the hero, spanning
 * sections 02 through 05. This owns both, plus the custom properties the
 * grid's transform reads.
 *
 * The motion is the hero's, not a variation on it: same scroll coefficient,
 * same pointer sway, same rAF batching, same reduced-motion bail-out. A client
 * component only because of the listeners — app/page.tsx is a server component
 * and cannot hold one.
 */
export function PageBands({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const pointerFrame = useRef<number | null>(null)
  const scrollFrame = useRef<number | null>(null)

  // Pointer sway. The grid reads --px/--py only; the hero also writes --mx/--my
  // for its spotlight, and nothing here consumes those, so they are left out.
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const el = ref.current
    if (!el) return
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current)
    const rect = el.getBoundingClientRect()
    // Normalized -0.5..0.5 offset from the region's center.
    const nx = (e.clientX - rect.left) / rect.width - 0.5
    const ny = (e.clientY - rect.top) / rect.height - 0.5
    pointerFrame.current = requestAnimationFrame(() => {
      el.style.setProperty('--px', nx.toFixed(4))
      el.style.setProperty('--py', ny.toFixed(4))
    })
  }, [])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    // Same bail-out as the hero: under reduced motion the listener never
    // attaches, so --sy stays at its 0 default and the grid sits still. No CSS
    // rule is needed to undo it.
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        // Pixels scrolled past the region's top. Zero while the top edge is
        // still below the viewport top, which is what keeps the drift from
        // being visible at the boundary — by the time it is large, the edge it
        // would expose has long since scrolled away.
        el.style.setProperty('--sy', String(Math.max(0, -rect.top)))
      })
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current)
    }
  }, [])

  return (
    <div className="page-bands" ref={ref} onPointerMove={handlePointerMove}>
      <div className="page-bands__grid" aria-hidden="true" />
      <div className="page-bands__glow" aria-hidden="true" />
      {children}
    </div>
  )
}
