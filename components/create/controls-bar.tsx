'use client'

import { useState } from 'react'
import { ChevronUp, Download, Reset, Shuffle } from '@carbon/icons-react'
import { useOverlay } from '@/components/ui/overlay'
import { KitIcon } from '@/components/kit-icon'
import type { IconSet } from '@/lib/kit-icons'
import { BODY_FONTS, CODE_FONTS, HEADING_FONTS, useBuilder } from './builder'
import { DERIVED_ROLES, openSourcePicker, useControls } from './controls-model'
import type { Control, ControlId } from './controls-model'
import { GetCodeDialog } from './get-code'
import { Toast, useCopy } from '@/components/token-panels'
import styles from './controls.module.scss'

const FONT_SETS: Partial<Record<ControlId, typeof HEADING_FONTS>> = {
  headings: HEADING_FONTS,
  body: BODY_FONTS,
  code: CODE_FONTS,
}

/** What sits at the trailing edge of a picker: a swatch, an Aa specimen, an icon or a caret. */
function Indicator({ control }: { control: Control }) {
  if (control.id === 'source') {
    return <span className={styles.dot} style={{ background: control.value }} />
  }
  if (control.id === 'theme') {
    // The surface role of the theme being previewed, so it reads light or dark.
    return <span className={styles.dot} style={{ background: 'var(--graphite-surface-variant)' }} />
  }
  if (control.id === 'icons') {
    // The family itself, as the fonts show their face.
    return <KitIcon name="settings" set={control.selected as IconSet} />
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
  const { toast, copy } = useCopy()
  // The source's swatches copy rather than choose, as on the desktop panel:
  // each is derived from the source, so choosing one rebuilt every ramp and
  // replaced the whole list. The sheet stays open, so several can be copied.
  const copies = control.id === 'source'

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
            {copies ? (
              <p className={styles.sheetCaption}>Select a stop to copy its hex</p>
            ) : null}
            {control.options.map((o) => (
              <button
                key={o.key}
                type="button"
                className={styles.option}
                aria-label={copies ? `Copy ${o.label}, ${o.key.toUpperCase()}` : undefined}
                onClick={() => {
                  if (copies) return copy(o.key, o.key.toUpperCase())
                  control.select(o.key)
                  onClose()
                }}
              >
                {o.swatch ? (
                  <span className={styles.optionSwatch} style={{ background: o.swatch }} aria-hidden="true" />
                ) : null}
                <span className={styles.optionLabel}>{o.label}</span>
                {copies ? (
                  <span className={styles.optionHex} aria-hidden="true">
                    {o.key.toUpperCase()}
                  </span>
                ) : control.selected === o.key ? (
                  <span aria-label="Selected">✓</span>
                ) : null}
              </button>
            ))}
            {/* Picking a source is the sheet's one real choice, so it closes
                the list as the filled action. The stops above only copy. */}
            {copies ? (
              <button
                type="button"
                className={styles.customHex}
                onClick={() => {
                  onClose()
                  openSourcePicker()
                }}
              >
                <span className={styles.optionSwatch} style={{ background: control.value }} aria-hidden="true" />
                <span className={styles.optionLabel}>Pick color</span>
                <span className={styles.customHexValue}>{control.value.toUpperCase()}</span>
                <span aria-hidden="true">→</span>
              </button>
            ) : null}
            <Toast message={toast} />
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
        {/* Below md the footer is too narrow for three labels, so Reset and
            Shuffle drop to icons there. The label stays in the DOM as their
            accessible name, and the title shows it on hover. */}
        <button
          type="button"
          className={`${styles.barQuiet} ${styles.barReset}`}
          title="Reset"
          onClick={b.reset}
        >
          <Reset size={16} aria-hidden="true" />
          <span className={styles.barLabel}>Reset</span>
        </button>
        <button
          type="button"
          className={`${styles.barQuiet} ${styles.barShuffle}`}
          title="Shuffle"
          onClick={b.shuffle}
        >
          <Shuffle size={16} aria-hidden="true" />
          <span className={styles.barLabel}>Shuffle</span>
        </button>
        <button type="button" className={styles.barCode} onClick={() => setCodeOpen(true)}>
          Get the code
          <Download size={16} aria-hidden="true" />
        </button>
      </div>
      {active ? <OptionSheet control={active} onClose={() => setSheet(null)} /> : null}
      <GetCodeDialog open={codeOpen} onClose={() => setCodeOpen(false)} />
    </div>
  )
}
