'use client'

import { useState } from 'react'
import { TextArea } from '@/components/ui/text-area'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'

type Resize = 'vertical' | 'none'
type DemoState = 'default' | 'disabled' | 'error' | 'warning'
type Layout = 'fixed' | 'fluid'

const LABEL = 'What went wrong?'
const HELP = 'Steps to reproduce help us most.'
const ERROR = 'Tell us a little about what happened.'
const WARNING = 'Avoid pasting passwords or keys.'

function codeFor(layout: Layout, resize: Resize, state: DemoState) {
  const lines = [`  label="${LABEL}"`]
  if (layout !== 'fixed') lines.push(`  layout="${layout}"`)
  lines.push('  maxLength={300}')
  if (resize !== 'vertical') lines.push(`  resize="${resize}"`)
  if (state === 'disabled') lines.push('  state="disabled"')
  lines.push(`  helpText="${HELP}"`)
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  if (state === 'warning') lines.push(`  warningText="${WARNING}"`)
  return `<TextArea\n${lines.join('\n')}\n/>`
}

/**
 * Layout and State as the kit draws them, plus resize. There is no Size: the
 * kit draws one height. Drag the corner with resize on vertical to see growth stop at the
 * max-height and hand over to a scrollbar.
 */
export function TextAreaPreview() {
  const [layout, setLayout] = useState<Layout>('fixed')
  const [resize, setResize] = useState<Resize>('vertical')
  const [state, setState] = useState<DemoState>('default')

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Layout"
            size="sm"
            value={layout}
            onChange={(v) => setLayout(v as Layout)}
            options={[
              { value: 'fixed', label: 'Fixed' },
              { value: 'fluid', label: 'Fluid' },
            ]}
          />
          <Dropdown
            label="Resize"
            size="sm"
            value={resize}
            onChange={(v) => setResize(v as Resize)}
            options={[
              { value: 'vertical', label: 'Vertical' },
              { value: 'none', label: 'None' },
            ]}
          />
          <Dropdown
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as DemoState)}
            options={[
              { value: 'default', label: 'Default' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
              { value: 'warning', label: 'Warning' },
            ]}
          />
        </>
      }
      preview={
        <TextArea
          label={LABEL}
          layout={layout}
          maxLength={300}
          resize={resize}
          state={state === 'disabled' ? 'disabled' : 'default'}
          helpText={HELP}
          errorText={state === 'error' ? ERROR : undefined}
          warningText={state === 'warning' ? WARNING : undefined}
        />
      }
      code={codeFor(layout, resize, state)}
    />
  )
}
