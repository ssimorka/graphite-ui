'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  type CSSProperties,
} from 'react'
import { Dropdown, Toggle } from '@carbon/react'
import { hexToHsv, hsvToHex, normalizeHex } from '@/lib/color.js'
import { useTheme, type ContrastLevel } from '@/components/theme-provider'

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
  const dot: CSSProperties = {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: '50%',
    border: '2px solid #fff',
    boxShadow: '0 0 0 1px rgba(0,0,0,0.4)',
    transform: 'translate(-50%,-50%)',
    pointerEvents: 'none',
  }

  return (
    <div>
      {/* SV pad */}
      <div
        ref={svRef}
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
          position: 'relative',
          width: '100%',
          height: 128,
          borderRadius: 3,
          cursor: 'crosshair',
          background: `linear-gradient(to top, #000, transparent), linear-gradient(to right, #fff, transparent), ${hueHex}`,
        }}
      >
        <div
          style={{
            ...dot,
            left: `${hsv.s * 100}%`,
            top: `${(1 - hsv.v) * 100}%`,
            background: hex,
          }}
        />
      </div>

      {/* Hue strip */}
      <div
        ref={hueRef}
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
        style={{
          position: 'relative',
          width: '100%',
          height: 14,
          marginTop: 10,
          borderRadius: 7,
          cursor: 'pointer',
          background: HUE_GRADIENT,
        }}
      >
        <div
          style={{
            ...dot,
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

export function ColorPickerPopover({
  value,
  onChange,
}: {
  value: string
  onChange: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState(value || '#0f62fe')
  const { level, setLevel, autoFix, setAutoFix } = useTheme()
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

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
      {/* The whole trigger — label and swatch — opens the popover, not just
          the swatch, so the click target matches the visible primary block. */}
      <button
        ref={buttonRef}
        type="button"
        className="site-header__source-trigger"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Source color"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="site-header__source-label">Pick a color</span>
        <span
          aria-hidden="true"
          className="site-header__source-swatch"
          style={{ background: swatchColor }}
        />
      </button>

      {/* Popover */}
      {open && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: 'calc(100% + 10px)',
            right: 0,
            width: 220,
            background: 'var(--cds-layer-01, #262626)',
            border: '1px solid var(--cds-border-subtle, #393939)',
            borderRadius: 4,
            padding: '12px 14px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            zIndex: 9999,
          }}
        >
          <HsvPicker hex={activeHex} onChange={handleHsvChange} />

          {/* Hex input + swatch preview */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              marginTop: 10,
            }}
          >
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 3,
                background: activeHex,
                flexShrink: 0,
                border: '1px solid var(--cds-border-subtle, #393939)',
              }}
            />
            <input
              value={input}
              onChange={handleInputChange}
              spellCheck={false}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--cds-border-subtle, #393939)',
                color: 'var(--cds-text-primary, #f4f4f4)',
                fontFamily: 'inherit',
                fontSize: 12,
                padding: '2px 0',
                outline: 'none',
              }}
            />
          </div>

          {/* Generation controls. They shape what the engine emits from this
              color, so they belong with the color rather than in one view. */}
          <div className="source-controls">
            <Dropdown
              id="level-select"
              size="sm"
              titleText="Target level"
              label="Target level"
              items={['AA', 'AAA']}
              selectedItem={level}
              onChange={({ selectedItem }) =>
                setLevel((selectedItem as ContrastLevel) ?? 'AA')
              }
            />
            <Toggle
              id="autofix-toggle"
              size="sm"
              labelText="Auto-fix on-colors"
              toggled={autoFix}
              onToggle={(checked) => setAutoFix(checked)}
            />
          </div>

          {/* Surprise me — the primary action of the popover, so it closes
              out the panel rather than sitting above the controls it affects. */}
          <button
            onClick={() => {
              surpriseIdx = (surpriseIdx + 1) % SURPRISE_PALETTE.length
              const hex = SURPRISE_PALETTE[surpriseIdx]
              setInput(hex)
              onChange(hex)
            }}
            style={{
              display: 'block',
              width: '100%',
              marginTop: 12,
              padding: '7px 0',
              background: 'var(--cds-button-primary)',
              border: 'none',
              borderRadius: 3,
              color: 'var(--cds-text-on-color, #fff)',
              fontSize: 11,
              fontWeight: 600,
              cursor: 'pointer',
              letterSpacing: '0.04em',
            }}
          >
            ✦ Surprise me
          </button>
        </div>
      )}
    </div>
  )
}
