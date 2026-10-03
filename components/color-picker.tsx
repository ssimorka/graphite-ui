'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import type { CSSProperties } from 'react'
import { hexToHsv, hsvToHex, normalizeHex } from '@/lib/color.js'
import { useTheme, type ContrastLevel } from '@/components/theme-provider'
import { Shuffle } from '@carbon/icons-react'
import { Select } from '@/components/ui/select'
import styles from './color-picker.module.scss'

const HUE_GRADIENT =
  'linear-gradient(to right, hsl(0,100%,50%), hsl(60,100%,50%), hsl(120,100%,50%), hsl(180,100%,50%), hsl(240,100%,50%), hsl(300,100%,50%), hsl(360,100%,50%))'

const HEX_RE = /^#?[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/

// Curated palette for Surprise me — varied hues, mid-saturation so WCAG works in both modes
const SURPRISE_PALETTE = [
  '#0f62fe',
  '#8a3ffc',
  '#d12771',
  '#ff832b',
  '#198038',
  '#00539a',
  '#9f1853',
  '#005d5d',
  '#6929c4',
  '#b28600',
]

let surpriseIdx = Math.floor(Math.random() * SURPRISE_PALETTE.length)

/** The next Surprise me colour. Shared, so the Create page's Pick and the
 *  header popover step through one sequence rather than repeating each other. */
export function nextSurpriseHex() {
  surpriseIdx = (surpriseIdx + 1) % SURPRISE_PALETTE.length
  return SURPRISE_PALETTE[surpriseIdx]
}

function clamp01(n: number) {
  return Math.min(1, Math.max(0, n))
}

// --- HSV picker (SV pad + hue strip) ---

function HsvPicker({
  hex,
  onChange,
}: {
  hex: string
  onChange: (h: string) => void
}) {
  const [hsv, setHsv] = useState(() => hexToHsv(hex))
  const svRef = useRef<HTMLDivElement>(null)
  const hueRef = useRef<HTMLDivElement>(null)
  const dragging = useRef(false)

  useEffect(() => {
    if (!dragging.current) setHsv(hexToHsv(hex))
  }, [hex])

  const fromSv = useCallback(
    (clientX: number, clientY: number) => {
      if (!svRef.current) return
      const r = svRef.current.getBoundingClientRect()
      const s = clamp01((clientX - r.left) / r.width)
      const v = 1 - clamp01((clientY - r.top) / r.height)
      const next = { h: hsv.h, s, v }
      setHsv(next)
      onChange(hsvToHex(next))
    },
    [hsv.h, onChange],
  )

  const fromHue = useCallback(
    (clientX: number) => {
      if (!hueRef.current) return
      const r = hueRef.current.getBoundingClientRect()
      const h = clamp01((clientX - r.left) / r.width) * 360
      const next = { ...hsv, h }
      setHsv(next)
      onChange(hsvToHex(next))
    },
    [hsv, onChange],
  )

  const capture = (e: React.PointerEvent) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId)
    } catch {}
    dragging.current = true
  }
  const release = () => {
    dragging.current = false
  }

  const hueHex = hsvToHex({ h: hsv.h, s: 1, v: 1 })

  return (
    <div>
      {/* SV pad */}
      <div
        ref={svRef}
        className={styles.pad}
        onPointerDown={(e) => {
          capture(e)
          fromSv(e.clientX, e.clientY)
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return
          fromSv(e.clientX, e.clientY)
        }}
        onPointerUp={release}
        onPointerCancel={release}
        style={{
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hueHex}`,
        }}
      >
        <div
          className={styles.marker}
          style={{
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            background: hex,
          }}
        />
      </div>

      {/* Hue strip */}
      <div
        ref={hueRef}
        className={styles.hue}
        onPointerDown={(e) => {
          capture(e)
          fromHue(e.clientX)
        }}
        onPointerMove={(e) => {
          if (e.buttons !== 1) return
          fromHue(e.clientX)
        }}
        onPointerUp={release}
        onPointerCancel={release}
        style={{ background: HUE_GRADIENT }}
      >
        <div
          className={styles.marker}
          style={{
            left: `${(hsv.h / 360) * 100}%`,
            top: '50%',
            background: hueHex,
          }}
        />
      </div>
    </div>
  )
}

// --- Popover ---

/** The header's source-color trigger, so other sections can open it. */
export const SOURCE_TRIGGER_ID = 'source-color-trigger'

export function ColorPickerPopover({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  // Was Avatar's internal state before Avatar was removed.
  const [input, setInput] = useState(value || '#0f62fe')
  const { level, setLevel, lightBundle, darkBundle } = useTheme()
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Both themes are checked on every generation; report the combined result
  // rather than asking the visitor to trust it.
  const contrastChecks = [lightBundle, darkBundle].flatMap((b) =>
    b ? Object.values(b.contrast) : [],
  )
  const checkedPairs = contrastChecks.length
  const failingPairs = contrastChecks.filter((c) => !c.passes).length

  const activeHex = HEX_RE.test(input.trim())
    ? normalizeHex(input)
    : value || '#0f62fe'

  // Sync input field when value prop changes externally
  useEffect(() => {
    if ((value && !HEX_RE.test(input)) || (value && value !== activeHex)) {
      setInput(value)
    }
  }, [value])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    const handler = (e: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  const handleHsvChange = (hex: string) => {
    setInput(hex)
    onChange(hex)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInput(raw)
    if (HEX_RE.test(raw.trim())) onChange(normalizeHex(raw))
  }

  const swatchColor = value || '#0f62fe'

  return (
    <div className="site-header__source-wrap">
      {/* The whole chip opens the popover, not just the swatch, so the click
          target matches the visible control. Named so the Create page's
          "Custom hex…" can open it. */}
      <button
        ref={buttonRef}
        id={SOURCE_TRIGGER_ID}
        type="button"
        className="site-header__source-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Source color"
        onClick={() => setOpen((o) => !o)}
      >
        {/* The kit's chip is a swatch and the hex, not a label and an avatar.
            The eye image the avatar carried moved to the header's brand mark,
            which is where the kit puts it. */}
        <span
          aria-hidden="true"
          className="site-header__source-swatch"
          style={{ background: swatchColor }}
        />
        <span className="site-header__source-hex">{value.toUpperCase()}</span>
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          className={styles.panel}
          // The caret sits on the chip's centre, and the panel is right-aligned
          // to the chip, so the chip's width is all it needs.
          style={{ '--trigger-w': `${buttonRef.current?.offsetWidth ?? 0}px` } as CSSProperties}
        >
          <div className={styles.section}>
            <HsvPicker hex={activeHex} onChange={handleHsvChange} />
          </div>

          {/* Hex input + swatch preview */}
          <div className={`${styles.section} ${styles.hexRow}`}>
            <div
              className={styles.preview}
              style={{ background: activeHex }}
            />
            <input
              className={styles.hexInput}
              value={input}
              onChange={handleInputChange}
              spellCheck={false}
              aria-label="Source color hex"
            />
          </div>

          {/* Generation controls. They shape what the engine emits from this
              color, so they belong with the color rather than in one view. */}
          <div className={`${styles.section} source-controls`}>
            <Select
              id="level-select"
              size="sm"
              label="Target level"
              options={[
                { value: 'AA', label: 'AA' },
                { value: 'AAA', label: 'AAA' },
              ]}
              value={level}
              onChange={(v) => setLevel(v as ContrastLevel)}
            />
            {/* Was an "Auto-fix on-colors" toggle. The fix is real but has
                never been observed to fire — a sweep of 96 hues across both
                themes and both levels produced no failing pairing — so the
                control read as a choice the visitor didn't have. Reporting the
                verified result says the true thing and is worth more. */}
            <p className="source-contrast">
              <span aria-hidden="true">{failingPairs === 0 ? '\u2713' : '\u26a0'}</span>
              {failingPairs === 0
                ? `Contrast verified \u00b7 ${checkedPairs} pairings pass ${level}`
                : `${failingPairs} of ${checkedPairs} pairings below ${level}`}
            </p>
          </div>

          {/* Surprise me: the popover's primary action, as the kit's filled
              footer block in the bottom-right corner. */}
          <div className={`${styles.section} ${styles.footer}`}>
            <button
              type="button"
              className={styles.footerAction}
              onClick={() => {
                const hex = nextSurpriseHex()
                setInput(hex)
                onChange(hex)
              }}
            >
              Surprise me
              <Shuffle size={16} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
