'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { contrastRatio, TONE_STOPS } from '@/lib/color.js'

// Display-only weight labels for the primitives grid, dark to light, in step
// order rather than by value, so they line up with each ramp's ten stops
// regardless of the actual OKLab tone at that position. The real tone stays
// available in each swatch's tooltip.
export const WEIGHT_LABELS = [
  '900',
  '800',
  '700',
  '600',
  '500',
  '400',
  '300',
  '200',
  '100',
  '050',
]

const RAMP_LABELS: Record<string, string> = {
  accent: 'Accent',
  secondary: 'Secondary',
  neutral: 'Neutral',
  neutralVariant: 'Neutral variant',
}

// Tones that land on a primitives stop get that stop's label, so semantic and
// state rows alias the swatch the user can actually see. State deltas and the
// pinned dark surface tone have no matching primitive, so they show the number.
export function weightLabelFor(tone: number): string | null {
  const i = (TONE_STOPS as number[]).findIndex((t) => Math.abs(t - tone) < 0.05)
  return i === -1 ? null : WEIGHT_LABELS[i]
}

// Picks whichever of black or white reads better on this background, so the hex
// label can sit directly on the swatch instead of below it.
function textColorFor(hex: string) {
  return contrastRatio(hex, '#ffffff') >= contrastRatio(hex, '#000000')
    ? '#ffffff'
    : '#000000'
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text)
      return
    } catch {
      // fall through to the legacy path
    }
  }
  const input = document.createElement('textarea')
  input.value = text
  input.style.position = 'fixed'
  input.style.opacity = '0'
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
}

/** Click-to-copy with a transient confirmation, shared by every swatch grid. */
export function useCopy() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const copy = useCallback((key: string, hex: string) => {
    setCopiedKey(key)
    copyToClipboard(hex)
    setToast(`Copied ${hex}`)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(''), 1600)
  }, [])

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current)
    },
    [],
  )

  return { copiedKey, toast, copy }
}

export function Toast({ message }: { message: string }) {
  if (!message) return null
  return (
    <div className="token-toast" role="status">
      {message}
    </div>
  )
}

type Stop = { hex: string; tone: number; source?: boolean }

function RampSwatch({
  hex,
  tone,
  source,
  selected,
  onClick,
}: Stop & { selected: boolean; onClick: () => void }) {
  const textColor = textColorFor(hex)
  return (
    <button
      type="button"
      onClick={onClick}
      title={`${hex}, tone ${Math.round(tone)}, click to copy`}
      className="ramp-swatch"
      style={{
        background: hex,
        color: textColor,
        border: source
          ? '2px solid var(--cds-focus)'
          : selected
            ? `2px solid ${textColor}`
            : '1px solid var(--cds-border-subtle)',
      }}
    >
      <span style={{ fontWeight: source ? 600 : 400 }}>{hex}</span>
    </button>
  )
}

export function RampRow({
  name,
  ramp,
  copiedKey,
  onCopy,
  scrollHint = 'Scroll for more',
}: {
  name: string
  ramp: { stops: Stop[] }
  copiedKey: string | null
  onCopy: (key: string, hex: string) => void
  /** The kit words this differently on the home page and the docs pages. */
  scrollHint?: string
}) {
  // Only the count comes from here; the track size lives in the stylesheet,
  // which is what keeps the stops and the weights on identical tracks.
  const cols = { ['--ramp-cols' as string]: ramp.stops.length }
  return (
    <div className="ramp">
      <p className="ramp__label">{RAMP_LABELS[name] ?? name}</p>
      <div className="ramp__scroll">
        <div className="ramp__grid" style={cols}>
          {ramp.stops.map((stop, i) => {
            const key = `${name}-${i}`
            return (
              <RampSwatch
                key={key}
                {...stop}
                selected={copiedKey === key}
                onClick={() => onCopy(key, stop.hex)}
              />
            )
          })}
        </div>
        <div className="ramp__weights" style={cols}>
          {ramp.stops.map((stop, i) => (
            <span key={i} title={`OKLab tone ${Math.round(stop.tone)}`}>
              {WEIGHT_LABELS[i]}
              {stop.source ? (
                <span className="ramp__source">source</span>
              ) : null}
            </span>
          ))}
        </div>
      </div>
      {/* The kit gives each ramp a scroll affordance below lg, where ten stops
          are wider than the strip. Hidden by CSS at X-Large, where they fit.
          aria-hidden because it describes a pointer gesture: the row is a list
          of buttons and reachable by tab regardless. */}
      <p className="ramp__scroll-hint" aria-hidden="true">
        {scrollHint}
      </p>
    </div>
  )
}
