'use client'

import { useState } from 'react'
import { Checkbox } from '@/components/ui/checkbox'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import { ERROR, exampleFor, LABEL, WARNING } from './checkbox-code'
import type { Selection, State } from './checkbox-code'

/**
 * Selection and State are the kit's two axes on the Checkbox set, cut down to
 * every value but Skeleton. Clicking the box moves Selection too, so the
 * control and the preview never disagree.
 */
export function CheckboxPreview() {
  const [selection, setSelection] = useState<Selection>('checked')
  const [state, setState] = useState<State>('enabled')

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
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
          <Dropdown
            label="State"
            size="sm"
            value={state}
            onChange={(v) => setState(v as State)}
            options={[
              { value: 'enabled', label: 'Enabled' },
              { value: 'disabled', label: 'Disabled' },
              { value: 'read-only', label: 'Read-only' },
              { value: 'warning', label: 'Warning' },
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
          readOnly={state === 'read-only'}
          warningText={state === 'warning' ? WARNING : undefined}
          errorText={state === 'error' ? ERROR : undefined}
          onChange={(c) => setSelection(c ? 'checked' : 'unchecked')}
        />
      }
      example={exampleFor({ selection, state })}
    />
  )
}
