'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Grid, Column, Tag } from '@carbon/react'
import { FlashFilled } from '@carbon/icons-react'
import { SystemExplorer } from '@/components/sections/system-explorer'

export function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const pointerFrame = useRef<number | null>(null)
  const scrollFrame = useRef<number | null>(null)

  // Pointer-driven depth + spotlight position.
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const el = heroRef.current
    if (!el) return
    if (pointerFrame.current) cancelAnimationFrame(pointerFrame.current)
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    // Normalized -0.5..0.5 offset from the hero center for parallax depth.
    const nx = x / rect.width - 0.5
    const ny = y / rect.height - 0.5
    pointerFrame.current = requestAnimationFrame(() => {
      el.style.setProperty('--mx', `${x}px`)
      el.style.setProperty('--my', `${y}px`)
      el.style.setProperty('--px', nx.toFixed(4))
      el.style.setProperty('--py', ny.toFixed(4))
    })
  }, [])

  // Scroll-driven parallax: layers translate at different rates.
  useEffect(() => {
    const el = heroRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const onScroll = () => {
      if (scrollFrame.current) cancelAnimationFrame(scrollFrame.current)
      scrollFrame.current = requestAnimationFrame(() => {
        const rect = el.getBoundingClientRect()
        // Progress: 0 when hero top hits viewport top, grows as we scroll past.
        const progress = Math.max(0, -rect.top)
        el.style.setProperty('--sy', `${progress}`)
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
    <section
      className="hero"
      ref={heroRef}
      onPointerMove={handlePointerMove}
      aria-labelledby="hero-title"
    >
      <div className="hero__spotlight" aria-hidden="true" />
      <div className="hero__grid-lines" aria-hidden="true" />

      <Grid className="hero__content">
        <Column sm={4} md={8} lg={{ span: 10, offset: 3 }}>
          <div className="hero__center">
            <Tag type="blue" size="md" className="hero__eyebrow">
              <FlashFilled size={11} className="hero__eyebrow-icon" /> New: Patterns module
            </Tag>
            <h1 className="hero__title" id="hero-title">
              One color. A whole design system.
            </h1>
            <p className="hero__subtitle">
              Pick a color and watch it become every shade, token, and pattern
              on this page, live.
            </p>
          </div>
        </Column>
      </Grid>

      {/* The live system explorer is the hero's product shot. It carries the
          original tool's controls plus the ramp and contrast views, so there is
          one interactive demo on the page rather than two competing canvases. */}
      <Grid>
        <Column sm={4} md={8} lg={{ span: 12, offset: 2 }}>
          <div className="hero__preview">
            <SystemExplorer embedded />
          </div>
        </Column>
      </Grid>
    </section>
  )
}
