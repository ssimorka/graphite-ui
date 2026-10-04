'use client'

import { useId, useState } from 'react'
import type { CSSProperties } from 'react'
import { fieldMessage } from '@/lib/field-message'
import { TextInput } from './text-input'
import styles from './slider.module.scss'

/**
 * Contract: docs/contracts/slider.md (1.0.0)
 *
 * The kit's Slider (3673:40574) and Slider - Range (41061:1531). Each handle is
 * a native input[type=range], so the keyboard, the value announcements and the
 * pointer all come from the platform; the rail, the fill, the handles and the
 * midpoint tick are drawn over it. The value inputs are the governed Text input.
 */

type Common = {
  /** Required: names the group, and each handle and input through it. */
  label: string
  min?: number
  max?: number
  step?: number
  /** The kit's value inputs: one for a single slider, Min and Max for a range. On by default, as both sets draw them. */
  showInputs?: boolean
  helpText?: string
  /** Its presence forces the error state on the value inputs. */
  errorText?: string
  /** Its presence forces the warning state, unless an error outranks it. */
  warningText?: string
  disabled?: boolean
  /** The value shows without a handle and cannot be changed. */
  readOnly?: boolean
  id?: string
}

type SingleProps = Common & { value: number; onChange: (value: number) => void }
type RangeProps = Common & { value: [number, number]; onChange: (value: [number, number]) => void }
export type SliderProps = SingleProps | RangeProps

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v))

/** Snaps to the step grid from min, then clamps, as the native range does. */
function settle(v: number, min: number, max: number, step: number) {
  const snapped = min + Math.round((v - min) / step) * step
  return clamp(Number(snapped.toFixed(10)), min, max)
}

/**
 * A governed Text input holding one value. Typing commits as soon as the text
 * is a value in range; leaving the field snaps whatever is there to the nearest
 * allowed value, so the input and the handle never disagree for long.
 */
function ValueInput({
  label,
  value,
  placeholder,
  min,
  max,
  step,
  onCommit,
  state,
  disabled,
  readOnly,
  describedBy,
}: {
  label: string
  value: number
  placeholder?: string
  min: number
  max: number
  step: number
  onCommit: (v: number) => void
  state: 'default' | 'error' | 'warning'
  disabled?: boolean
  readOnly?: boolean
  describedBy?: string
}) {
  const [draft, setDraft] = useState<string | null>(null)
  return (
    <span className={styles.input}>
      <TextInput
        label={label}
        hideLabel
        size="md"
        inputMode="decimal"
        placeholder={placeholder}
        state={state}
        disabled={disabled}
        readOnly={readOnly}
        aria-describedby={describedBy}
        value={draft ?? String(value)}
        onChange={(e) => {
          setDraft(e.target.value)
          const n = Number(e.target.value)
          if (e.target.value.trim() !== '' && Number.isFinite(n) && n >= min && n <= max) onCommit(n)
        }}
        onBlur={() => {
          if (draft !== null) {
            const n = Number(draft)
            if (draft.trim() !== '' && Number.isFinite(n)) onCommit(settle(n, min, max, step))
            setDraft(null)
          }
        }}
      />
    </span>
  )
}

/** The kit's range handle, fi-rs-play in its 13 × 16 box, pointing into the rail. */
function RangeGlyph() {
  return (
    <svg width={13} height={16} viewBox="0 0 13 16" aria-hidden="true" focusable="false">
      <path
        transform="translate(1.32 0)"
        fillRule="evenodd"
        d="M9.857 6.293L0 0L0 16L9.853 9.685C10.14 9.504 10.376 9.254 10.54 8.958C10.704 8.662 10.79 8.329 10.791 7.99C10.791 7.651 10.706 7.318 10.542 7.021C10.379 6.724 10.143 6.474 9.857 6.293ZM9.137 8.556L1.337 13.556L1.337 2.439L9.141 7.421C9.238 7.482 9.317 7.565 9.372 7.665C9.426 7.764 9.455 7.876 9.454 7.989C9.454 8.103 9.425 8.214 9.369 8.313C9.313 8.412 9.233 8.495 9.137 8.555Z"
      />
    </svg>
  )
}

export function Slider(props: SliderProps) {
  const {
    label,
    min = 0,
    max = 100,
    step = 1,
    showInputs = true,
    helpText,
    errorText,
    warningText,
    disabled = false,
    readOnly = false,
    id,
  } = props
  const auto = useId()
  const baseId = id ?? auto
  const labelId = `${baseId}-label`
  const { tone, messageId, message, describedBy } = fieldMessage(baseId, helpText, errorText, warningText)
  const inputState = tone === 'error' ? 'error' : tone === 'warning' ? 'warning' : 'default'
  const pct = (v: number) => ((clamp(v, min, max) - min) / (max - min || 1)) * 100

  const range = Array.isArray(props.value)
  const lo = range ? (props.value as [number, number])[0] : min
  const hi = range ? (props.value as [number, number])[1] : (props.value as number)
  const setSingle = (v: number) => {
    if (!readOnly) (props as SingleProps).onChange(clamp(v, min, max))
  }
  const setLo = (v: number) => {
    if (!readOnly) (props as RangeProps).onChange([clamp(v, min, hi), hi])
  }
  const setHi = (v: number) => {
    if (!readOnly) (props as RangeProps).onChange([lo, clamp(v, lo, max)])
  }

  const native = {
    min,
    max,
    step,
    disabled,
    'aria-readonly': readOnly || undefined,
    'aria-describedby': describedBy,
  }

  const track = range ? (
    <span
      className={styles.rangeTrack}
      style={{ '--lo': pct(lo) / 100, '--hi': pct(hi) / 100 } as CSSProperties}
    >
      <span className={styles.rangeRail} aria-hidden="true" />
      <span className={styles.rangeFill} aria-hidden="true" />
      <span className={styles.tick} aria-hidden="true" />
      <input
        type="range"
        className={`${styles.native} ${styles.nativeLo}`}
        aria-label={`${label}, minimum`}
        value={lo}
        onChange={(e) => setLo(Number(e.target.value))}
        {...native}
      />
      <input
        type="range"
        className={`${styles.native} ${styles.nativeHi}`}
        aria-label={`${label}, maximum`}
        value={hi}
        onChange={(e) => setHi(Number(e.target.value))}
        {...native}
      />
      <span className={`${styles.glyph} ${styles.glyphLo}`} aria-hidden="true">
        <RangeGlyph />
        {showInputs ? null : <span className={styles.tip}>{lo}</span>}
      </span>
      <span className={`${styles.glyph} ${styles.glyphHi}`} aria-hidden="true">
        <RangeGlyph />
        {showInputs ? null : <span className={styles.tip}>{hi}</span>}
      </span>
    </span>
  ) : (
    <span className={styles.track} style={{ '--at': pct(hi) / 100 } as CSSProperties}>
      <span className={styles.rail} aria-hidden="true" />
      <span className={styles.fill} data-part="fill" aria-hidden="true" />
      <span className={styles.tick} aria-hidden="true" />
      <input
        type="range"
        className={styles.native}
        aria-labelledby={labelId}
        value={hi}
        onChange={(e) => setSingle(Number(e.target.value))}
        {...native}
      />
      <span className={styles.handle} data-part="handle" aria-hidden="true" />
    </span>
  )

  return (
    <div
      className={[
        styles.slider,
        range ? styles.isRange : '',
        disabled ? styles.isDisabled : '',
        readOnly ? styles.isReadOnly : '',
      ].join(' ')}
      role="group"
      aria-labelledby={labelId}
    >
      <span id={labelId} className={styles.label}>
        {label}
      </span>
      <div className={styles.row}>
        {range && showInputs ? (
          <ValueInput
            label={`${label}, minimum`}
            placeholder="Min"
            value={lo}
            min={min}
            max={hi}
            step={step}
            onCommit={setLo}
            state={inputState}
            disabled={disabled}
            readOnly={readOnly}
            describedBy={describedBy}
          />
        ) : null}
        <span className={styles.values}>
          <span className={styles.bound} aria-hidden="true">
            {min}
          </span>
          {track}
          <span className={styles.bound} aria-hidden="true">
            {max}
          </span>
        </span>
        {showInputs ? (
          <ValueInput
            label={range ? `${label}, maximum` : label}
            placeholder={range ? 'Max' : undefined}
            value={hi}
            min={range ? lo : min}
            max={max}
            step={step}
            onCommit={range ? setHi : setSingle}
            state={inputState}
            disabled={disabled}
            readOnly={readOnly}
            describedBy={describedBy}
          />
        ) : null}
      </div>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </div>
  )
}
