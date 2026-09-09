'use client'

import { useCallback, useEffect, useRef } from 'react'
import { Grid, Column, Tag } from '@carbon/react'
import { Gem, ArrowRight, Grid as GridIcon } from '@carbon/icons-react'
import { Button } from '@/components/ui/button'
import { RampRow, Toast, useCopy } from '@/components/studio'
import { useTheme, COVER_SOURCE_HEX } from '@/components/theme-provider'
import { makeRamps } from '@/lib/color.js'

// The four ramps the source strip shows. The engine emits eight; the four
// status ramps are pinned to their status hue rather than derived from the
// source, so they prove nothing about the input and would pad the strip to
// twice its height. The carousel below carries the full set.
const STRIP_RAMPS = ['accent', 'secondary', 'neutral', 'neutralVariant'] as const

export function Hero() {
  const heroRef = useRef<HTMLDivElement | null>(null)
  const pointerFrame = useRef<number | null>(null)
  const scrollFrame = useRef<number | null>(null)
  const { copiedKey, toast, copy } = useCopy()
  const { sourceHex } = useTheme()
  const ramps = makeRamps(sourceHex || COVER_SOURCE_HEX)

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
            <Tag type="purple" size="md" className="hero__eyebrow">
              <Gem size={16} className="hero__eyebrow-icon" /> Wave 4 · 22
              governed components
            </Tag>
            <h1 className="hero__title" id="hero-title">
              One color.{' '}
              <br className="hero__title-break" />
              A whole design system.
            </h1>
            <p className="hero__subtitle">
              Pick a color. Graphite resolves eight ramps, thirty-two semantic
              roles and both themes from it, measures every pairing as it goes,
              and keeps the Figma kit and the code provably in step.
            </p>
            <div className="hero__ctas">
              <Button variant="primary" size="lg" asChild>
                <a href="/docs">
                  Get started
                  <ArrowRight />
                </a>
              </Button>
              <Button variant="ghost" size="lg" asChild>
                <a href="/gallery">
                  Browse components
                  <GridIcon />
                </a>
              </Button>
            </div>
          </div>
        </Column>
      </Grid>

      {/* The source strip is the hero's product shot: the four source-derived
          ramps, always visible rather than behind a switcher, so the claim in
          the subtitle is answered on the same screen that makes it. */}
      <Grid>
        <Column sm={4} md={8} lg={{ span: 12, offset: 2 }}>
          <div className="hero__source-strip">
            <div className="ramp-stack">
              {STRIP_RAMPS.map((name) => (
                <RampRow
                  key={name}
                  name={name}
                  ramp={ramps[name]}
                  copiedKey={copiedKey}
                  onCopy={copy}
                />
              ))}
              <p className="ramp-stack__hint">
                Select any swatch to copy its hex. The outlined stop is where
                your source color landed.
              </p>
            </div>
          </div>
        </Column>
      </Grid>

      <Toast message={toast} />
    </section>
  )
}
