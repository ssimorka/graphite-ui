'use client'

import { useState } from 'react'
import { ChevronUp, Download, Shuffle } from '@carbon/icons-react'
import { Button } from '@/components/ui/button'
import { useOverlay } from '@/components/ui/overlay'
import { BODY_FONTS, CODE_FONTS, HEADING_FONTS, useBuilder } from './builder'
import { DERIVED_ROLES, openSourcePicker, useControls } from './controls-model'
import type { Control, ControlId } from './controls-model'
import { GetCodeDialog } from './get-code'
import styles from './controls.module.scss'

const FONT_SETS: Partial<Record<ControlId, typeof HEADING_FONTS>> = {
  headings: HEADING_FONTS,
  body: BODY_FONTS,
  code: CODE_FONTS,
}

/** What sits at the trailing edge of a picker: a swatch, an Aa specimen or a caret. */
function Indicator({ control }: { control: Control }) {
  if (control.id === 'source') {
    return <span className={styles.dot} style={{ background: control.value }} />
  }
  if (control.id === 'theme') {
    // The surface role of the theme being previewed, so it reads light or dark.
    return <span className={styles.dot} style={{ background: 'var(--graphite-surface-variant)' }} />
  }
  const fonts = FONT_SETS[control.id]
  if (fonts) {
    const stack = fonts.find((f) => f.key === control.selected)?.stack
    return <span style={{ fontFamily: stack }}>Aa</span>
  }
  return <ChevronUp size={16} />
}

/**
 * The bottom sheet a picker opens: a list of the control's options with the
 * current one ticked (Graphite UI Site 13316:5853). Site chrome on the Overlay
 * base, so Escape and an outside tap dismiss it and focus returns to the
 * picker that opened it.
 */
function OptionSheet({
  control,
  onClose,
}: {
  control: Control
  onClose: () => void
}) {
  const ref = useOverlay<HTMLDivElement>({ open: true, onDismiss: onClose, trapFocus: true })

  return (
    <>
      <div className={styles.scrim} aria-hidden="true" />
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-label={control.heading}
        tabIndex={-1}
        className={styles.sheet}
      >
        <span className={styles.grabber} aria-hidden="true" />
        <h2 className={styles.sheetTitle}>{control.heading}</h2>

        {control.id === 'derived' ? (
          <>
            {DERIVED_ROLES.map((r) => (
              <div key={r} className={styles.option}>
                <span className={styles.optionSwatch} style={{ background: `var(--graphite-${r})` }} aria-hidden="true" />
                <span className={styles.optionLabel}>{r}</span>
              </div>
            ))}
            <p className={styles.proposed} style={{ padding: '0.75rem 1.25rem 0' }}>
              Override a single role · PROPOSED, needs an engine change
            </p>
          </>
        ) : (
          <>
            {control.options.map((o) => (
              <button
                key={o.key}
                type="button"
                className={styles.option}
                onClick={() => {
                  control.select(o.key)
                  onClose()
                }}
              >
                {o.swatch ? (
                  <span className={styles.optionSwatch} style={{ background: o.swatch }} aria-hidden="true" />
                ) : null}
                <span className={styles.optionLabel}>{o.label}</span>
                {control.selected === o.key ? <span aria-label="Selected">✓</span> : null}
              </button>
            ))}
            {control.id === 'source' ? (
              <button
                type="button"
                className={styles.option}
                onClick={() => {
                  onClose()
                  openSourcePicker()
                }}
              >
                <span className={styles.optionLabel}>Custom hex…</span>
              </button>
            ) : null}
          </>
        )}
      </div>
    </>
  )
}

/**
 * The compact controls below xl: a horizontally scrolling rail of pickers, and a
 * footer of Shuffle and Get the code. The kit omits the Lock at these sizes, so
 * shuffling here randomises everything not already locked on the desktop panel.
 */
export function ControlsBar() {
  const controls = useControls()
  const b = useBuilder()
  const [sheet, setSheet] = useState<ControlId | null>(null)
  const [codeOpen, setCodeOpen] = useState(false)
  const active = controls.find((c) => c.id === sheet)

  return (
    <div className={styles.bar}>
      <div className={styles.rail}>
        {controls.map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.picker}
            aria-haspopup="dialog"
            onClick={() => setSheet(c.id)}
          >
            <span className={styles.pickerText}>
              <span className={styles.pickerLabel}>{c.label}</span>
              <span className={styles.pickerValue}>{c.value}</span>
            </span>
            <span className={styles.indicator}>
              <Indicator control={c} />
            </span>
          </button>
        ))}
      </div>
      <div className={styles.barFooter}>
        <Button variant="ghost" className={`${styles.outlined} ${styles.barButton}`} onClick={b.shuffle}>
          Shuffle
          <Shuffle />
        </Button>
        <Button variant="primary" className={styles.barButtonCode} onClick={() => setCodeOpen(true)}>
          Get the code
          <Download />
        </Button>
      </div>
      {active ? <OptionSheet control={active} onClose={() => setSheet(null)} /> : null}
      <GetCodeDialog open={codeOpen} onClose={() => setCodeOpen(false)} />
    </div>
  )
}
