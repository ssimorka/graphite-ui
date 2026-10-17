'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './button-group.module.scss'

type Count = '2' | '3'
type Primary = 'last' | 'none'

type Action = { label: string; variant: 'primary' | 'outlined' | 'ghost' }

function actionsFor(count: Count, primary: Primary): Action[] {
  const all: Action[] = [
    { label: 'Cancel', variant: 'ghost' },
    { label: 'Save draft', variant: 'outlined' },
    // With no primary, nothing in the group is filled: Publish drops to the
    // same outlined rank as Save draft rather than to a filled secondary,
    // which would mix the green family into a violet group.
    { label: 'Publish', variant: primary === 'last' ? 'primary' : 'outlined' },
  ]
  // Two actions drop the middle one, so the primary (if any) stays last.
  return count === '2' ? [all[0], all[2]] : all
}

function codeFor(actions: Action[]) {
  const body = actions
    .map((a) => `  <Button variant="${a.variant}">${a.label}</Button>`)
    .join('\n')
  return `<ButtonGroup>\n${body}\n</ButtonGroup>`
}

/**
 * The group has no props of its own beyond className, so the controls are over
 * its one slot: how many actions, and whether one of them is primary. There is
 * no "two filled buttons" option, because that configuration throws rather
 * than renders, and a demo that crashes teaches nothing.
 */
export function ButtonGroupPreview() {
  const [count, setCount] = useState<Count>('3')
  const [primary, setPrimary] = useState<Primary>('last')
  const actions = actionsFor(count, primary)

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
            label="Actions"
            size="sm"
            value={count}
            onChange={(v) => setCount(v as Count)}
            options={[
              { value: '2', label: 'Two' },
              { value: '3', label: 'Three' },
            ]}
          />
          <Dropdown
            label="Primary"
            size="sm"
            value={primary}
            onChange={(v) => setPrimary(v as Primary)}
            options={[
              { value: 'last', label: 'Last action' },
              { value: 'none', label: 'None' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.scroll}>
          <ButtonGroup>
            {actions.map((a) => (
              <Button key={a.label} variant={a.variant}>
                {a.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      }
      code={codeFor(actions)}
    />
  )
}
