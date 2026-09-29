'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'

type Selection = 'unchecked' | 'checked' | 'indeterminate'
type State = 'enabled' | 'disabled' | 'error'

const LABEL = 'Save as default address'
const ERROR = 'Choose whether to keep this address.'

function codeFor(selection: Selection, state: State) {
  const lines = [`  label="${LABEL}"`]
  if (selection === 'checked') lines.push('  checked')
  if (selection === 'indeterminate') lines.push('  indeterminate')
  if (state === 'disabled') lines.push('  disabled')
  if (state === 'error') lines.push(`  errorText="${ERROR}"`)
  lines.push('  onChange={setChecked}')
  return `<Checkbox\n${lines.join('\n')}\n/>`
}

/**
 * Selection and State are the kit's two axes on the Checkbox set, cut down to
 * the values the code has. Clicking the box moves Selection too, so the
 * control and the preview never disagree.
 */
export function CheckboxPreview() {
  const [selection, setSelection] = useState<Selection>('checked')
  const [state, setState] = useState<State>('enabled')

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Selection"
            size="sm"
            value={selection}
            onChange={(v) => setSelection(v as Selection)}
            options={[
              { value: 'unchecked', label: 'Unchecked' },
              { value: 'checked', label: 'Checked' },
              { value: 'indeterminate', label: 'Indeterminate' },
            ]}
          />
          <Select
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </>
      }
      preview={
        <Checkbox
          label={LABEL}
          checked={selection === 'checked'}
          indeterminate={selection === 'indeterminate'}
          disabled={state === 'disabled'}
          errorText={state === 'error' ? ERROR : undefined}
          onChange={(c) => setSelection(c ? 'checked' : 'unchecked')}
        />
      }
      code={codeFor(selection, state)}
    />
  )
}
