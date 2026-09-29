'use client'

import { useState } from 'react'
import type { CSSProperties } from 'react'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { Tag } from '@/components/ui/tag'
import styles from './radius.module.scss'

/**
 * The Create page's Radius control, reduced to its mechanism: the chosen step
 * is bound to `--graphite-radius-none` on this box only. Components that read
 * `none` for their corners round; Tag reads `full` and does not move. Nothing
 * outside the box changes, which is the same scoping Create uses.
 */
export function RadiusPreview({ steps }: { steps: string[] }) {
  const [step, setStep] = useState(steps[0])
  // Binding `none` to itself would be a cycle, so the default sets nothing.
  const style = (
    step === 'none' ? {} : { '--graphite-radius-none': `var(--graphite-radius-${step})` }
  ) as CSSProperties

  return (
    <div className={styles.preview}>
      <RadioButtonGroup
        name="radius-preview"
        label="Bind --graphite-radius-none to"
        orientation="horizontal"
        options={steps.map((s) => ({ value: s, label: s }))}
        value={step}
        onChange={setStep}
      />
      <div className={styles.previewStage} style={style}>
        <div className={styles.previewRow}>
          <Button variant="primary">Save changes</Button>
          <Button>Cancel</Button>
          <Tag variant="primary">Pill</Tag>
        </div>
        <TextInput label="Project name" placeholder="Graphite" />
      </div>
      <p className={styles.previewCaption}>
        {step === steps[0]
          ? 'The kit default. Every corner in this box is square except the tag.'
          : `--graphite-radius-none now resolves to --graphite-radius-${step} inside this box. The tag keeps its own step.`}
      </p>
    </div>
  )
}
