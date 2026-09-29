'use client'

import { useRef, useState } from 'react'
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
  return `<Popover\n${props.join('\n')}\n>\n  {/* Owns its checkbox state, so the Popover does not re-render while open. */}\n  <ThemeOptions store={store} />\n</Popover>`
}

type Store = { current: { light: boolean; dark: boolean } }

/**
 * The checkboxes keep their state here, inside the content, and write it back
 * to a ref the parent holds so it survives the content unmounting on close.
 * Keeping it out of the parent is deliberate: useOverlay's effect depends on
 * onDismiss, which Popover creates inline, so a parent re-render while the
 * panel is open re-runs the effect, and its cleanup sends focus back to the
 * trigger mid-interaction.
 */
export function ThemeOptions({ store }: { store: Store }) {
  const [value, setValue] = useState(store.current)
  const set = (next: Store['current']) => {
    store.current = next
    setValue(next)
  }
  return (
    <div className={styles.options}>
      <Checkbox label="Light" checked={value.light} onChange={(light) => set({ ...value, light })} />
      <Checkbox label="Dark" checked={value.dark} onChange={(dark) => set({ ...value, dark })} />
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
  const store = useRef({ light: true, dark: false })

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
            <ThemeOptions store={store} />
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
  const store = useRef({ light: true, dark: false })
  return (
    <Popover
      defaultOpen
      placement={placement}
      trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
    >
      <ThemeOptions store={store} />
    </Popover>
  )
}
