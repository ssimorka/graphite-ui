'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover } from '@/components/ui/popover'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './popover.module.scss'

type Placement = 'top' | 'bottom' | 'left' | 'right'

const TRIGGER = 'Filter themes'

function codeFor(placement: Placement, modal: boolean) {
  const props = [
    ...(placement === 'bottom' ? [] : [`  placement="${placement}"`]),
    ...(modal ? ['  modal'] : []),
    `  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}`,
  ]
  return `<Popover\n${props.join('\n')}\n>\n  <div className={styles.options}>\n    <Checkbox label="Light" checked={light} onChange={setLight} />\n    <Checkbox label="Dark" checked={dark} onChange={setDark} />\n  </div>\n</Popover>`
}

/**
 * Placement and Modal, the two props that change what a reader sees or can do.
 * The checkboxes are there because interactive content is what separates a
 * Popover from a Tooltip; their state lives outside the Popover, since the
 * content unmounts on close.
 */
export function PopoverPreview() {
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [modal, setModal] = useState(false)
  const [light, setLight] = useState(true)
  const [dark, setDark] = useState(false)

  return (
    <DemoFrame
      controls={
        <>
          <Select
            label="Placement"
            size="sm"
            value={placement}
            onChange={(v) => setPlacement(v as Placement)}
            options={[
              { value: 'top', label: 'Top' },
              { value: 'bottom', label: 'Bottom' },
              { value: 'left', label: 'Left' },
              { value: 'right', label: 'Right' },
            ]}
          />
          <Select
            label="Modal"
            size="sm"
            value={modal ? 'on' : 'off'}
            onChange={(v) => setModal(v === 'on')}
            options={[
              { value: 'off', label: 'Off' },
              { value: 'on', label: 'On' },
            ]}
          />
        </>
      }
      preview={
        <div className={styles.center}>
          <Popover
            placement={placement}
            modal={modal}
            trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
          >
            <div className={styles.options}>
              <Checkbox label="Light" checked={light} onChange={setLight} />
              <Checkbox label="Dark" checked={dark} onChange={setDark} />
            </div>
          </Popover>
        </div>
      }
      code={codeFor(placement, modal)}
    />
  )
}

/**
 * An open Popover for the anatomy and variants, through the contract's own
 * defaultOpen. It is the real component, so it dismisses like one: click
 * outside or press Escape and it closes, and its trigger opens it again.
 */
export function PopoverStill({ placement = 'bottom' }: { placement?: Placement }) {
  const [light, setLight] = useState(true)
  const [dark, setDark] = useState(false)
  return (
    <Popover
      defaultOpen
      placement={placement}
      trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
    >
      <div className={styles.options}>
        <Checkbox label="Light" checked={light} onChange={setLight} />
        <Checkbox label="Dark" checked={dark} onChange={setDark} />
      </div>
    </Popover>
  )
}
