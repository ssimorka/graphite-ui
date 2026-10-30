'use client'

import { useState } from 'react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, HELP, SUCCESS, TASK } from './progress-bar-code'
import type { Alignment, Size, Status, Variant } from './progress-bar-code'

/**
 * Every kit axis: Progress (variant and value), State, Size and Alignment.
 * Value is ignored while indeterminate or finished, as the component ignores
 * it.
 */
export function ProgressBarPreview() {
  const [variant, setVariant] = useState<Variant>('determinate')
  const [value, setValue] = useState(50)
  const [status, setStatus] = useState<Status>('active')
  const [size, setSize] = useState<Size>('sm')
  const [alignment, setAlignment] = useState<Alignment>('default')
  const determinate = variant === 'determinate'

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'determinate', label: 'Determinate' },
              { value: 'indeterminate', label: 'Indeterminate' },
            ]}
          />
          <Dropdown
            label="Value"
            size="sm"
            value={String(value)}
            disabled={!(determinate && status === 'active')}
            onChange={(v) => setValue(Number(v))}
            options={[
              { value: '0', label: '0%' },
              { value: '25', label: '25%' },
              { value: '50', label: '50%' },
              { value: '75', label: '75%' },
              { value: '100', label: '100%' },
            ]}
          />
          <Dropdown
            label="State"
            size="sm"
            value={status}
            onChange={(v) => setStatus(v as Status)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'success', label: 'Success' },
              { value: 'error', label: 'Error' },
            ]}
          />
          <Dropdown
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as Size)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'lg', label: 'Big' },
            ]}
          />
          <Dropdown
            label="Alignment"
            size="sm"
            value={alignment}
            onChange={(v) => setAlignment(v as Alignment)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'inline', label: 'Inline' },
              { value: 'indent', label: 'Indent' },
            ]}
          />
        </>
      }
      preview={
        <ProgressBar
          label={TASK}
          variant={variant}
          value={value}
          status={status}
          size={size}
          alignment={alignment}
          helperText={HELP}
          successText={SUCCESS}
          errorText={ERROR}
        />
      }
      example={exampleFor({ variant, value, status, size, alignment })}
    />
  )
}
