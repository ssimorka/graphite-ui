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
    ...(modal ? ['  modal', '  label="Theme filter"'] : []),
    `  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}`,
  ]
  return `const [themes, setThemes] = useState({ light: true, dark: false })\n\n<Popover\n${props.join('\n')}\n>\n  <ThemeOptions value={themes} onChange={setThemes} />\n</Popover>`
}

export type Themes = { light: boolean; dark: boolean }

/**
 * Controlled from outside, so ticking a box re-renders the component that owns
 * the open Popover. That is the ordinary way to write it, and it is safe: the
 * Overlay base does not re-run on a re-render, so focus stays on the box.
 */
export function ThemeOptions({ value, onChange }: { value: Themes; onChange: (next: Themes) => void }) {
  return (
    <div className={styles.options}>
      <Checkbox label="Light" checked={value.light} onChange={(light) => onChange({ ...value, light })} />
      <Checkbox label="Dark" checked={value.dark} onChange={(dark) => onChange({ ...value, dark })} />
    </div>
  )
}

/**
 * Placement and Modal, the two props that change what a reader sees or can do.
 * The checkboxes are there because interactive content is what separates a
 * Popover from a Tooltip.
 */
export function PopoverPreview() {
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [modal, setModal] = useState(false)
  const [themes, setThemes] = useState<Themes>({ light: true, dark: false })

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
            label={modal ? 'Theme filter' : undefined}
            trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
          >
            <ThemeOptions value={themes} onChange={setThemes} />
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
 * outside, press its trigger or press Escape and it closes, and its trigger
 * opens it again.
 */
export function PopoverStill({ placement = 'bottom' }: { placement?: Placement }) {
  const [themes, setThemes] = useState<Themes>({ light: true, dark: false })
  return (
    <Popover
      defaultOpen
      placement={placement}
      trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
    >
      <ThemeOptions value={themes} onChange={setThemes} />
    </Popover>
  )
}
