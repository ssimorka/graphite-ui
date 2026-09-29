'use client'

import { useState } from 'react'
import { ProgressBar } from '@/components/ui/progress-bar'
import { Typography } from '@/components/ui/typography'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './progress-bar.module.scss'

type Variant = 'determinate' | 'indeterminate'

const TASK = 'Uploading report.pdf'

function codeFor(variant: Variant, value: number) {
  const caption = variant === 'determinate' ? `${TASK}, ${value}%` : TASK
  const bar =
    variant === 'determinate'
      ? `<ProgressBar value={${value}} label="${TASK}" />`
      : `<ProgressBar variant="indeterminate" label="${TASK}" />`
  return `<Typography variant="caption">${caption}</Typography>\n${bar}`
}

/**
 * Variant and Value, the contract's two props. The caption is Typography on
 * purpose: the contract bans text inside the bar, and this is the pairing it
 * names instead. Value is ignored while indeterminate, as the component
 * ignores it.
 */
export function ProgressBarPreview() {
  const [variant, setVariant] = useState<Variant>('determinate')
  const [value, setValue] = useState(50)
  const determinate = variant === 'determinate'

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Variant"
            size="sm"
            value={variant}
            onChange={(v) => setVariant(v as Variant)}
            options={[
              { value: 'determinate', label: 'Determinate' },
              { value: 'indeterminate', label: 'Indeterminate' },
            ]}
          />
          <Select
            label="Value"
            size="sm"
            value={String(value)}
            state={determinate ? 'default' : 'disabled'}
            onChange={(v) => setValue(Number(v))}
            options={[
              { value: '0', label: '0%' },
              { value: '25', label: '25%' },
              { value: '50', label: '50%' },
              { value: '75', label: '75%' },
              { value: '100', label: '100%' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.stack}>
          <Typography variant="caption">
            {determinate ? `${TASK}, ${value}%` : TASK}
          </Typography>
          <ProgressBar variant={variant} value={value} label={TASK} />
        </div>
      }
      code={codeFor(variant, value)}
    />
  )
}
