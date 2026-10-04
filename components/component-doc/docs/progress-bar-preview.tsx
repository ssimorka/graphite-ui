'use client'

import { useState } from 'react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'

type Variant = 'determinate' | 'indeterminate'
type Status = 'active' | 'success' | 'error'
type Size = 'sm' | 'lg'
type Alignment = 'default' | 'inline' | 'indent'

const TASK = 'Uploading report.pdf'
const HELP = 'About a minute left'
const SUCCESS = 'Upload complete'
const ERROR = 'The upload failed. Try again.'

function codeFor(variant: Variant, value: number, status: Status, size: Size, alignment: Alignment) {
  const props = [
    `  label="${TASK}"`,
    ...(status === 'active'
      ? variant === 'determinate'
        ? [`  value={${value}}`]
        : ['  variant="indeterminate"']
      : [`  status="${status}"`]),
    ...(size === 'sm' ? [] : [`  size="${size}"`]),
    ...(alignment === 'default' ? [] : [`  alignment="${alignment}"`]),
    ...(alignment === 'inline' ? [] : [`  helperText="${HELP}"`]),
    ...(status === 'success' ? [`  successText="${SUCCESS}"`] : []),
    ...(status === 'error' ? [`  errorText="${ERROR}"`] : []),
  ]
  return `<ProgressBar\n${props.join('\n')}\n/>`
}

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
      code={codeFor(variant, value, status, size, alignment)}
    />
  )
}
