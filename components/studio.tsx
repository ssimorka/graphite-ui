'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from '@carbon/react'
import { contrastRatio, TONE_STOPS, STATUS_NAMES } from '@/lib/color.js'

// Display-only weight labels for the primitives grid, dark to light, in step
// order rather than by value, so they line up with each ramp's ten stops
// regardless of the actual OKLab tone at that position. The real tone stays
// available in each swatch's tooltip.
const WEIGHT_LABELS = [
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

const STATE_LABELS: Record<string, string> = {
  base: 'Base',
  hover: 'Hover',
  pressed: 'Pressed',
  selected: 'Selected',
  disabled: 'Disabled',
}

// Tones that land on a primitives stop get that stop's label, so semantic and
// state rows alias the swatch the user can actually see. State deltas and the
// pinned dark surface tone have no matching primitive, so they show the number.
export function weightLabelFor(tone: number): string | null {
  const i = (TONE_STOPS as number[]).findIndex((t) => Math.abs(t - tone) < 0.05)
  return i === -1 ? null : WEIGHT_LABELS[i]
}

function toneLabel(tone: number) {
  return weightLabelFor(tone) ?? String(Math.round(tone))
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
    <div className="studio-toast" role="status">
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
}: {
  name: string
  ramp: { stops: Stop[] }
  copiedKey: string | null
  onCopy: (key: string, hex: string) => void
}) {
  const columns = ramp.stops.length
  const cols = { gridTemplateColumns: `repeat(${columns}, 1fr)` }
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
              {stop.source ? ' · source' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

type Token = { hex: string; ramp: string; tone: number }
type Check = { ratio: number; passes: boolean; level: string; fixed?: boolean }

// The engine emits sixteen status roles alongside the eleven core ones. This
// table is the landing page's proof that pairings are checked, not a reference
// — the full set is documented at /docs — so status is filtered out
// here rather than tripling the table's height with four more hue families.
const STATUS_ROLE_NAMES = new Set(
  (STATUS_NAMES as string[]).flatMap((name) => {
    const Cap = name[0].toUpperCase() + name.slice(1)
    return [name, `on${Cap}`, `${name}Container`, `on${Cap}Container`]
  }),
)

export function SemanticTable({
  theme,
}: {
  theme: { tokens: Record<string, Token>; contrast: Record<string, Check> }
}) {
  const rows = Object.entries(theme.tokens).filter(
    ([role]) => !STATUS_ROLE_NAMES.has(role),
  )
  return (
    <div className="studio-table">
      <Table size="lg">
        <TableHead>
          <TableRow>
            <TableHeader>Token</TableHeader>
            <TableHeader>Swatch</TableHeader>
            <TableHeader>Hex</TableHeader>
            <TableHeader>Ramp / tone</TableHeader>
            <TableHeader>Contrast</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(([role, t]) => {
            const c = theme.contrast[role]
            return (
              <TableRow key={role}>
                <TableCell>{role}</TableCell>
                <TableCell>
                  <span
                    className="studio-swatch"
                    style={{ background: t.hex }}
                  />
                </TableCell>
                <TableCell>{t.hex}</TableCell>
                <TableCell>
                  {t.ramp} {toneLabel(t.tone)}
                </TableCell>
                <TableCell>
                  {c ? (
                    <Tag type={c.passes ? 'green' : 'red'} size="sm">
                      {c.ratio.toFixed(2)}:1 {c.passes ? 'pass' : 'fail'} (
                      {c.level}){c.fixed ? ', auto-fixed' : ''}
                    </Tag>
                  ) : (
                    <Tag type="gray" size="sm">
                      not checked
                    </Tag>
                  )}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

type StateEntry = { hex: string; ramp: string; tone: number }

export function StatesMatrix({
  states,
}: {
  states: { primary: Record<string, StateEntry>; focus: StateEntry }
}) {
  const rows = ['base', 'hover', 'pressed', 'selected', 'disabled']
  return (
    <div className="states-matrix">
      {rows.map((state) => {
        const entry = states.primary[state]
        if (!entry) return null
        return (
          <div key={state} className="states-matrix__item">
            <span
              className="states-matrix__chip"
              style={{ background: entry.hex }}
            />
            <span className="states-matrix__name">{STATE_LABELS[state]}</span>
            <span className="states-matrix__tone">
              {entry.ramp} {toneLabel(entry.tone)}
            </span>
          </div>
        )
      })}
      <div className="states-matrix__item">
        <span
          className="states-matrix__chip"
          style={{
            background: 'var(--cds-layer)',
            border: `3px solid ${states.focus.hex}`,
          }}
        />
        <span className="states-matrix__name">Focus ring</span>
        <span className="states-matrix__tone">
          {states.focus.ramp} {toneLabel(states.focus.tone)}
        </span>
      </div>
    </div>
  )
}
