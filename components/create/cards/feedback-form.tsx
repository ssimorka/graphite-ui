'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { TextArea } from '@/components/ui/text-area'
import { CardShell } from '../card-shell'
import styles from './feedback-form.module.scss'

export function FeedbackFormCard() {
  const [topic, setTopic] = useState('')
  const [feedback, setFeedback] = useState('')
  return (
    <CardShell id="feedback-form">
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault()
          setTopic('')
          setFeedback('')
        }}
      >
        <Select
          label="Topic"
          value={topic}
          onChange={setTopic}
          options={[
            { value: '', label: '' },
            { value: 'bug', label: 'Bug' },
            { value: 'idea', label: 'Idea' },
            { value: 'other', label: 'Other' },
          ]}
        />
        <TextArea
          label="Feedback"
          placeholder="Your feedback helps us improve..."
          rows={6}
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
        <Button variant="primary" type="submit" className={styles.submit}>
          Submit
        </Button>
      </form>
    </CardShell>
  )
}
