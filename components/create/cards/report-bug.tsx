'use client'

import { useState } from 'react'
import { CardShell, CardHeader } from '../card-shell'
import { Button } from '@/components/ui/button'
import { TextInput } from '@/components/ui/text-input'
import { TextArea } from '@/components/ui/text-area'
import { Select } from '@/components/ui/select'
import styles from './report-bug.module.scss'

const SEVERITY = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
] as [
  { value: string; label: string },
  { value: string; label: string },
  ...{ value: string; label: string }[],
]
const COMPONENT = [
  { value: 'button', label: 'Button' },
  { value: 'form', label: 'Form' },
  { value: 'navigation', label: 'Navigation' },
  { value: 'other', label: 'Other' },
] as typeof SEVERITY

export function ReportBugCard() {
  const [severity, setSeverity] = useState('medium')
  const [component, setComponent] = useState('button')

  return (
    <CardShell id="report-bug">
      <CardHeader title="Report Bug" description="Help us fix issues faster." />
      <TextInput label="Title" placeholder="Brief description of the issue" size="lg" />
      <div className={styles.row}>
        <Select label="Severity" options={SEVERITY} value={severity} onChange={setSeverity} size="lg" />
        <Select label="Component" options={COMPONENT} value={component} onChange={setComponent} size="lg" />
      </div>
      <TextArea
        label="Steps to reproduce"
        placeholder={'1. Go to\n2. Click on\n3. Observe...'}
        rows={5}
      />
      <div className={styles.foot}>
        <Button size="lg">Attach File</Button>
        <Button variant="primary" size="lg">
          Submit Bug
        </Button>
      </div>
    </CardShell>
  )
}
