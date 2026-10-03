'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, Download, Reset, Shuffle } from '@carbon/icons-react'
import { nextSurpriseHex } from '@/components/color-picker'
import { Toast, useCopy } from '@/components/studio'
import { Button } from '@/components/ui/button'
import { normalizeHex } from '@/lib/color.js'
import { useBuilder } from './builder'
import type { LockKey } from './builder'
import { DERIVED_ROLES, useControls } from './controls-model'
import type { Control } from './controls-model'
import { GetCodeDialog } from './get-code'
import styles from './controls.module.scss'

// The kit's own words for what each control means (Graphite UI Site 13294:*).
const CAPTIONS: Record<string, string> = {
  source: 'The only free input; any hex works. The swatches are your ramps at tone 500: click one to copy its hex.',
  contrast: 'Every pairing is measured against this as the theme resolves.',
  radius: 'The kit’s eight steps. The components are square-cornered by default because the kit is.',
  typeface:
    'font-1 and font-2 are two roles that happen to hold the same family today. The kit says they may diverge, so the builder lets them.',
  derived:
    'Secondary is the source hue minus 120°, chroma × 0.585. Background, foreground and borders come off the neutral ramp. These are outputs, not inputs.',
}

function Chip({
  selected,
  onClick,
  children,
  grow,
}: {
  selected: boolean
  onClick: () => void
  children: string
  grow?: boolean
}) {
  return (
    <button
      type="button"
      className={`${styles.chip} ${grow ? styles.chipGrow : ''}`}
      aria-pressed={selected}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function ChipRow({ control, grow }: { control: Control; grow?: boolean }) {
  return (
    <div className={styles.chips}>
      {control.options.map((o) => (
        <Chip
          key={o.key}
          grow={grow}
          selected={control.selected === o.key}
          onClick={() => control.select(o.key)}
        >
          {o.label}
        </Chip>
      ))}
    </div>
  )
}

/**
 * One collapsible section. The header is a real button that toggles the body,
 * and the Lock is its own button beside it: the kit draws them as one row, but
 * a button inside a button is not valid, so they are two siblings in one row.
 */
function Section({
  label,
  open,
  onToggle,
  lock,
  children,
}: {
  label: string
  open: boolean
  onToggle: () => void
  lock?: { key: LockKey; on: boolean; toggle: () => void }
  children: React.ReactNode
}) {
  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          onClick={onToggle}
        >
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          <span className={styles.label}>{label}</span>
        </button>
        {lock ? (
          <button
            type="button"
            className={styles.lock}
            aria-pressed={lock.on}
            onClick={lock.toggle}
          >
            {lock.on ? 'Locked' : 'Lock'}
            <span className={styles.srOnly}> {label}</span>
          </button>
        ) : null}
      </div>
      {open ? <div className={styles.body}>{children}</div> : null}
    </section>
  )
}

/**
 * The desktop controls panel: seven collapsible sections and the three actions
 * (Graphite UI Site 11835:286491). Source colour starts open, as the kit draws
 * it; the rest start collapsed.
 */
const HEX_RE = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i

/**
 * The source field. The hex is typed straight in: six digits apply as soon as
 * they are complete, three apply on Enter or blur (applying them live would
 * repaint the page on the way to typing six), and anything else snaps back to
 * the current source on blur. Escape cancels. Pick steps the same Surprise me sequence as the
 * header popover, so the two buttons agree.
 */
function HexField({ value, onChange }: { value: string; onChange: (hex: string) => void }) {
  const [draft, setDraft] = useState(value)
  const [editing, setEditing] = useState(false)

  // Follow the source when something else changes it (a preset, Shuffle, the
  // header picker), but never overwrite what is being typed.
  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  const valid = HEX_RE.test(draft.trim())
  const commit = (raw: string) => {
    const hex = normalizeHex(raw.trim().startsWith('#') ? raw.trim() : `#${raw.trim()}`)
    if (hex.toUpperCase() !== value.toUpperCase()) onChange(hex)
  }

  return (
    <div className={styles.field} data-invalid={!valid || undefined}>
      <span
        className={styles.current}
        style={{ background: valid ? normalizeHex(draft.startsWith('#') ? draft : `#${draft}`) : value }}
        aria-hidden="true"
      />
      <input
        className={styles.hex}
        value={draft}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        aria-label="Source color hex"
        aria-invalid={!valid || undefined}
        onFocus={() => setEditing(true)}
        onChange={(e) => {
          const next = e.target.value.toUpperCase()
          setDraft(next)
          if (/^#?[0-9A-F]{6}$/.test(next.trim())) commit(next)
        }}
        onBlur={(e) => {
          if (HEX_RE.test(e.currentTarget.value.trim())) commit(e.currentTarget.value)
          setEditing(false)
          setDraft(value)
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.currentTarget.blur()
          if (e.key === 'Escape') {
            e.currentTarget.value = value
            setDraft(value)
            e.currentTarget.blur()
          }
        }}
      />
      <button type="button" className={styles.pick} onClick={() => onChange(nextSurpriseHex())}>
        Pick
      </button>
    </div>
  )
}

export function ControlsPanel() {
  const controls = useControls()
  const b = useBuilder()
  const [open, setOpen] = useState<Record<string, boolean>>({ source: true })
  const [codeOpen, setCodeOpen] = useState(false)
  const { toast, copy } = useCopy()

  const by = (id: Control['id']) => controls.find((c) => c.id === id)!
  const flip = (id: string) => setOpen((o) => ({ ...o, [id]: !o[id] }))
  const lockOf = (c: Control) =>
    c.lock
      ? { key: c.lock, on: b.locks[c.lock], toggle: () => b.toggleLock(c.lock!) }
      : undefined

  const source = by('source')
  const theme = by('theme')
  const contrast = by('contrast')
  const radius = by('radius')
  const density = by('density')

  const faces = [
    { c: by('headings'), name: 'Headings', role: 'font-1' },
    { c: by('body'), name: 'Body', role: 'font-2' },
    { c: by('code'), name: 'Code', role: 'font-mono' },
  ]

  return (
    <div className={styles.panel}>
      <Section
        label="Source color"
        open={!!open.source}
        onToggle={() => flip('source')}
        lock={lockOf(source)}
      >
        <p className={styles.caption}>{CAPTIONS.source}</p>
        <HexField value={source.value} onChange={(hex) => source.select(hex)} />
        {/* Copy, not choose. Each swatch is derived from the current source,
            so choosing one rebuilt every ramp and replaced all eight swatches,
            which read as the row inventing colours. Copying leaves the source
            alone. The ring still marks the source's own swatch. */}
        <div className={styles.presets} role="group" aria-label="Ramp swatches">
          {source.options.map((o) => (
            <button
              key={o.key}
              type="button"
              className={styles.preset}
              data-source={source.selected === o.key ? '' : undefined}
              aria-label={`Copy ${o.label}, ${o.key.toUpperCase()}`}
              title={`${o.label} · ${o.key.toUpperCase()} · click to copy`}
              style={{ background: o.swatch }}
              onClick={() => copy(o.key, o.key.toUpperCase())}
            />
          ))}
        </div>
        <Toast message={toast} />
      </Section>

      <Section label="Theme" open={!!open.theme} onToggle={() => flip('theme')} lock={lockOf(theme)}>
        <ChipRow control={theme} />
      </Section>

      <Section label="Contrast target" open={!!open.contrast} onToggle={() => flip('contrast')} lock={lockOf(contrast)}>
        <p className={styles.caption}>{CAPTIONS.contrast}</p>
        <ChipRow control={contrast} />
      </Section>

      <Section label="Radius" open={!!open.radius} onToggle={() => flip('radius')} lock={lockOf(radius)}>
        <p className={styles.caption}>{CAPTIONS.radius}</p>
        <div className={styles.radii}>
          {radius.options.map((o) => (
            <Chip key={o.key} grow selected={radius.selected === o.key} onClick={() => radius.select(o.key)}>
              {o.label}
            </Chip>
          ))}
        </div>
      </Section>

      <Section label="Density" open={!!open.density} onToggle={() => flip('density')}>
        <ChipRow control={density} />
      </Section>

      <Section label="Typeface" open={!!open.typeface} onToggle={() => flip('typeface')}>
        <p className={styles.caption}>{CAPTIONS.typeface}</p>
        {faces.map(({ c, name, role }) => (
          <label key={c.id} className={styles.face}>
            <span className={styles.faceLabel}>
              {name} <span className={styles.faceRole}>{role}</span>
            </span>
            <select
              className={styles.select}
              value={c.selected}
              onChange={(e) => c.select(e.target.value)}
              aria-label={`${name} typeface`}
            >
              {c.options.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        ))}
      </Section>

      <Section label="Derived roles" open={!!open.derived} onToggle={() => flip('derived')}>
        <p className={styles.caption}>{CAPTIONS.derived}</p>
        <div className={styles.roles}>
          {DERIVED_ROLES.map((r) => (
            <div key={r} className={styles.role}>
              <span className={styles.roleSwatch} style={{ background: `var(--graphite-${r})` }} aria-hidden="true" />
              <span className={styles.roleName}>{r}</span>
            </div>
          ))}
        </div>
        {/* Named as proposed in the kit: overriding one role would mean the
            engine accepting a role that is not derived, which it cannot do
            today. It is shown so the gap is visible, and is not a control. */}
        <p className={styles.proposed}>
          Override a single role · PROPOSED, needs an engine change
        </p>
      </Section>

      <div className={styles.actions}>
        <div className={styles.actionRow}>
          <Button variant="ghost" className={styles.outlined} onClick={b.shuffle}>
            Shuffle
            <Shuffle />
          </Button>
          <Button variant="ghost" className={styles.outlined} onClick={b.reset}>
            Reset
            <Reset />
          </Button>
        </div>
        <Button variant="primary" onClick={() => setCodeOpen(true)}>
          Get the code
          <Download />
        </Button>
      </div>
      <GetCodeDialog open={codeOpen} onClose={() => setCodeOpen(false)} />
    </div>
  )
}
