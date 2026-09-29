'use client'

import { useState } from 'react'
import { Search, ChevronDown } from '@carbon/icons-react'
import { CardShell } from '../card-shell'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioButtonGroup } from '@/components/ui/radio-button-group'
import { Tag } from '@/components/ui/tag'
import { TextArea } from '@/components/ui/text-area'
import { TextInput } from '@/components/ui/text-input'
import { Toggle } from '@/components/ui/toggle'
import styles from './kitchen-sink.module.scss'

/** Graphite UI Site 13561:10954. */
export function KitchenSinkCard() {
  const [level, setLevel] = useState(40)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [plan, setPlan] = useState('monthly')
  const [terms, setTerms] = useState(true)
  const [notify, setNotify] = useState(true)

  const clamp = (n: number) => Math.min(100, Math.max(0, n))

  return (
    <CardShell id="kitchen-sink">
      <div className={styles.row}>
        <Button variant="primary">Button</Button>
        <Button>Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="danger" className={styles.delete}>
          Delete
        </Button>
      </div>

      <div className={styles.item}>
        <div className={styles.itemText}>
          <p className={styles.itemTitle}>Two-factor authentication</p>
          <p className={styles.itemBody}>Verify via email or phone number.</p>
        </div>
        <Button>Enable</Button>
      </div>

      <div className={styles.slider}>
        <span className={styles.sliderLabel} id="ks-slider-label">
          Label
        </span>
        <div className={styles.sliderRow}>
          <div className={styles.rail}>
            <span>0</span>
            <input
              type="range"
              min={0}
              max={100}
              value={level}
              aria-labelledby="ks-slider-label"
              className={styles.range}
              style={{ ['--fill' as string]: `${level}%` }}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
            <span>100</span>
          </div>
          <input
            type="number"
            min={0}
            max={100}
            value={level}
            aria-label="Slider value"
            className={styles.number}
            onChange={(e) => setLevel(clamp(Number(e.target.value)))}
          />
        </div>
      </div>

      <TextInput
        label="Name"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        trailing={<Search size={16} aria-hidden="true" />}
      />

      <TextArea
        label="Message"
        placeholder="Message"
        rows={4}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <div className={styles.row}>
        <Tag variant="primary">Badge</Tag>
        <Tag>Secondary</Tag>
        <span className={styles.outlineTag}>Outline</span>
      </div>

      <div className={styles.choices}>
        <RadioButtonGroup
          name="ks-plan"
          label="Plan"
          value={plan}
          onChange={setPlan}
          options={[
            { value: 'monthly', label: 'Monthly' },
            { value: 'yearly', label: 'Yearly' },
          ]}
        />
        <Checkbox label="Accept terms" checked={terms} onChange={setTerms} />
      </div>

      <div className={styles.actions}>
        <Button>Alert Dialog</Button>
        <ButtonGroup>
          <Button className={styles.groupMain}>Button Group</Button>
          <Button size="icon" aria-label="More options">
            <ChevronDown aria-hidden="true" />
          </Button>
        </ButtonGroup>
        <span className={styles.spacer} />
        <Toggle label="Notifications" checked={notify} onChange={setNotify} />
      </div>
    </CardShell>
  )
}
