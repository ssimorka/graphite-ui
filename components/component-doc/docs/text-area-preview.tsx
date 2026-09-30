'use client'

import { useState } from 'react'
import { TextArea } from '@/components/ui/text-area'
import type { FieldSize } from '@/components/ui/text-input'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Resize = 'vertical' | 'none'
type DemoState = 'default' | 'disabled' | 'error'

const LABEL = 'What went wrong?'
const HELP = 'Steps to reproduce help us most.'
const ERROR = 'Tell us a little about what happened.'

function codeFor(size: FieldSize, resize: Resize, state: DemoState) {
  const lines = [`  label="${LABEL}"`]
  if (size !== 'md') lines.push(`  size="${size}"`)
  if (resize !== 'vertical') lines.push(`  resize="${resize}"`)
  if (state === 'disabled') lines.push('  state="disabled"')
  lines.push(`  helpText="${HELP}"`)
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  return `<TextArea\n${lines.join('\n')}\n/>`
}

/**
 * Size and State as Text input has them, plus resize, the one prop Text area
 * adds. Drag the corner with resize on vertical to see growth stop at the
 * max-height and hand over to a scrollbar.
 */
export function TextAreaPreview() {
  const [size, setSize] = useState<FieldSize>('md')
  const [resize, setResize] = useState<Resize>('vertical')
  const [state, setState] = useState<DemoState>('default')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Size"
            size="sm"
            value={size}
            onChange={(v) => setSize(v as FieldSize)}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Medium' },
              { value: 'lg', label: 'Large' },
            ]}
          />
          <Select
            label="Resize"
            size="sm"
            value={resize}
            onChange={(v) => setResize(v as Resize)}
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'none', label: 'None' },
            ]}
          />
          <Select
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as DemoState)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </>
      }
      preview={
        <TextArea
          label={LABEL}
          size={size}
          resize={resize}
          state={state === 'disabled' ? 'disabled' : 'default'}
          helpText={HELP}
          errorText={state === 'error' ? ERROR : undefined}
        />
      }
      code={codeFor(size, resize, state)}
    />
  )
}
