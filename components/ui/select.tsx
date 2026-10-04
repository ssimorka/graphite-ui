'use client'

import { useId, useState } from 'react'
import type { RefObject } from 'react'
import type { FieldLayout, FieldSize } from './text-input'
import { fieldMessage } from '@/lib/field-message'
import { KitIcon } from '@/components/kit-icon'
import { FieldStatusIcon } from './field-status'
import { OptionList, useSelectOnly } from './dropdown'
import styles from './select.module.scss'

export type SelectOption = {
  value: string
  label: string
  disabled?: boolean
}

/** Contract: docs/contracts/select.md (3.0.0) */
type SelectProps = {
  /** Generated when omitted, so the label and message can always associate. */
  id?: string
  /** Required. With Field gone there is no wrapper left to supply one. */
  label: string
  /**
   * The tuple shape enforces the contract's two-option minimum at compile
   * time: a Select with one choice is a statement, not a choice.
   */
  options: [SelectOption, SelectOption, ...SelectOption[]]
  value?: string
  size?: FieldSize
  /** The kit's Style axis (Default, Inline) and its Select - Fluid set. */
  layout?: FieldLayout
  state?: 'default' | 'disabled' | 'error' | 'warning'
  /**
   * The kit's Read-only: focusable and announced as read-only, refusing to
   * open or change. The value can be reached and read, not edited.
   */
  readOnly?: boolean
  /**
   * Keeps the label as the trigger's accessible name and drops it from view,
   * for the kit's bare Select menu (Pagination's page picker draws only the
   * value). The label is still required.
   */
  hideLabel?: boolean
  onChange?: (value: string) => void
  name?: string
  helpText?: string
  /** Its presence forces the error state. The two cannot be separated. */
  errorText?: string
  /** Its presence forces the warning state, unless an error outranks it. */
  warningText?: string
}

export function Select({
  id,
  label,
  options,
  value,
  size = 'md',
  layout = 'fixed',
  state = 'default',
  readOnly = false,
  hideLabel = false,
  onChange,
  name,
  helpText,
  errorText,
  warningText,
}: SelectProps) {
  const auto = useId()
  const selectId = id ?? auto
  const labelId = `${selectId}-label`
  const valueId = `${selectId}-value`
  const listId = `${selectId}-list`
  // Uncontrolled when no value is passed, as the native select was: it starts
  // on the first option and keeps its own choice.
  const [own, setOwn] = useState(options[0].value)
  const current = value ?? own
  const { errored: hasError, warned, tone, messageId, message, describedBy } = fieldMessage(
    selectId,
    helpText,
    errorText,
    warningText,
  )

  // Error text and error state resolve from the same value, so neither can be
  // shown without the other. Field used to guarantee this. Warning likewise.
  const errored = hasError || state === 'error'
  const warning = !errored && (warned || state === 'warning')
  const disabled = state === 'disabled'
  const fluid = layout === 'fluid'

  const { root, anchor, listRef, open, active, setActive, selected, choose, onKeyDown, toggle } = useSelectOnly<HTMLSpanElement>({
    options,
    value: current,
    onChange: (v) => {
      setOwn(v)
      onChange?.(v)
    },
    disabled,
    readOnly,
    listId,
  })

  // A span, since the trigger is not a labelable element; a click on it moves
  // focus to the trigger, as a label's would.
  const labelEl = (
    <span
      id={labelId}
      className={hideLabel ? styles.hiddenLabel : styles.label}
      onClick={() => document.getElementById(selectId)?.focus()}
    >
      {label}
    </span>
  )

  return (
    <span ref={root} className={[styles.field, styles[layout], disabled ? styles.isDisabled : ''].join(' ')}>
      {fluid ? null : labelEl}
      <span
        ref={anchor as RefObject<HTMLSpanElement>}
        className={[
          styles.wrap,
          fluid ? '' : styles[size],
          errored ? styles.errored : '',
          warning ? styles.warning : '',
          readOnly ? styles.readOnly : '',
        ].join(' ')}
      >
        {fluid ? labelEl : null}
        {/* The kit's own list, on the overlay surface, under the field's own
            trigger: the select-only combobox Dropdown also is. It replaced a
            native select in 3.0.0, whose platform list could not take the
            kit's look in either theme. */}
        <div
          id={selectId}
          className={[
            styles.select,
            errored || warning ? styles.withStatus : '',
            disabled ? styles.selectDisabled : '',
          ].join(' ')}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-labelledby={`${labelId} ${valueId}`}
          aria-activedescendant={open && active >= 0 ? `${listId}-${active}` : undefined}
          aria-invalid={errored || undefined}
          aria-disabled={disabled || undefined}
          aria-readonly={readOnly || undefined}
          aria-describedby={describedBy}
          onClick={toggle}
          onKeyDown={onKeyDown}
        >
          <span id={valueId} className={styles.value}>
            {selected >= 0 ? options[selected].label : ''}
          </span>
        </div>
        {name ? <input type="hidden" name={name} value={current} /> : null}
        {open ? (
          <OptionList
            anchor={anchor}
            listRef={listRef}
            id={listId}
            labelledBy={labelId}
            size={fluid ? 'lg' : size}
            options={options}
            indexes={options.map((_, i) => i)}
            active={active}
            isSelected={(i) => i === selected}
            onActive={setActive}
            onChoose={choose}
          />
        ) : null}
        <span className={styles.icons} aria-hidden="true">
          {errored || warning ? <FieldStatusIcon className={styles.status} /> : null}
          <KitIcon name="angle-small-down" size={16} className={styles.chevron} set="regular" />
        </span>
      </span>
      {message ? (
        <span
          id={messageId}
          className={tone === 'error' ? styles.error : tone === 'warning' ? styles.warningText : styles.help}
          role={tone === 'error' ? 'alert' : undefined}
        >
          {message}
        </span>
      ) : null}
    </span>
  )
}
