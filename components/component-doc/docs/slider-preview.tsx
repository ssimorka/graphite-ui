'use client'

import { useState } from 'react'
import { Dropdown } from '@/components/ui/dropdown'
import { Slider } from '@/components/ui/slider'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, WARNING } from './slider-code'
import type { Kind, Status } from './slider-code'
import styles from './slider.module.scss'

/** Both sets, the Inputs property and the status states, all live. */
export function SliderPreview() {
  const [kind, setKind] = useState<Kind>('single')
  const [inputs, setInputs] = useState(true)
  const [status, setStatus] = useState<Status>('enabled')
  const [single, setSingle] = useState(40)
  const [range, setRange] = useState<[number, number]>([20, 60])

  const common = {
    showInputs: inputs,
    errorText: status === 'error' ? ERROR : undefined,
    warningText: status === 'warning' ? WARNING : undefined,
    disabled: status === 'disabled',
    readOnly: status === 'read-only',
  }

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Set"
            size="sm"
            value={kind}
            onChange={(v) => setKind(v as Kind)}
            options={[
              { value: 'single', label: 'Slider' },
              { value: 'range', label: 'Slider - Range' },
            ]}
          />
          <Dropdown
            label="Inputs"
            size="sm"
            value={inputs ? 'true' : 'false'}
            onChange={(v) => setInputs(v === 'true')}
            options={[
              { value: 'true', label: 'True' },
              { value: 'false', label: 'False' },
            ]}
          />
          <Dropdown
            label="Status"
            size="sm"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'error', label: 'Error' },
              { value: 'warning', label: 'Warning' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.measure}>
          {kind === 'range' ? (
            <Slider label="Price range" value={range} onChange={setRange} {...common} />
          ) : (
            <Slider label="Opacity" value={single} onChange={setSingle} {...common} />
          )}
        </div>
      }
      example={exampleFor({ kind, inputs, status })}
    />
  )
}

/** A still the server-rendered page can place: it owns its own value. */
export function SliderStill({
  kind = 'single',
  inputs = true,
  status = 'enabled',
}: {
  kind?: Kind
  inputs?: boolean
  status?: Status
}) {
  const [single, setSingle] = useState(40)
  const [range, setRange] = useState<[number, number]>([20, 60])
  const common = {
    showInputs: inputs,
    errorText: status === 'error' ? ERROR : undefined,
    warningText: status === 'warning' ? WARNING : undefined,
    disabled: status === 'disabled',
    readOnly: status === 'read-only',
  }
  return (
    <div className={styles.measure}>
      {kind === 'range' ? (
        <Slider label="Price range" value={range} onChange={setRange} {...common} />
      ) : (
        <Slider label="Opacity" value={single} onChange={setSingle} {...common} />
      )}
    </div>
  )
}
