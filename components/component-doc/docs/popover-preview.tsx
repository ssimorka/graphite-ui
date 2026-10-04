'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { KitIcon } from '@/components/kit-icon'
import { Checkbox } from '@/components/ui/checkbox'
import { Popover } from '@/components/ui/popover'
import { Dropdown } from '@/components/ui/dropdown'
import { DemoFrame } from '../demo-frame'
import styles from './popover.module.scss'

type Placement = 'top' | 'bottom' | 'left' | 'right'
type Align = 'start' | 'center' | 'end'
type Variant = 'default' | 'tab-tip'

const TRIGGER = 'Filter themes'

function codeFor(placement: Placement, align: Align, variant: Variant, modal: boolean) {
  const tabTip = variant === 'tab-tip'
  const props = [
    ...(tabTip ? ['  variant="tab-tip"'] : placement === 'bottom' ? [] : [`  placement="${placement}"`]),
    ...(align === 'center' ? [] : [`  align="${align}"`]),
    ...(modal ? ['  modal', '  label="Theme filter"'] : []),
    tabTip
      ? `  trigger={(props) => (
    <Button {...props} variant="ghost" size="icon-lg" aria-label="${TRIGGER}">
      <KitIcon name="settings" />
    </Button>
  )}`
      : `  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}`,
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

/** The Tab tip's trigger: the kit's 48px ghost icon-only button. */
export const tabTipTrigger = (props: { onClick: () => void; 'aria-expanded': boolean; 'aria-controls': string }) => (
  <Button {...props} variant="ghost" size="icon-lg" aria-label={TRIGGER}>
    <KitIcon name="settings" />
  </Button>
)

/**
 * Placement, Alignment, the set and Modal: the props that change what a
 * reader sees or can do.
 * The checkboxes are there because interactive content is what separates a
 * Popover from a Tooltip.
 */
export function PopoverPreview() {
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [align, setAlign] = useState<Align>('center')
  const [variant, setVariant] = useState<Variant>('default')
  const [modal, setModal] = useState(false)
  const tabTip = variant === 'tab-tip'
  const [themes, setThemes] = useState<Themes>({ light: true, dark: false })

  return (
    <DemoFrame
      controls={
        <>
          <Dropdown
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
          <Dropdown
            label="Alignment"
            size="sm"
            value={align}
            onChange={(v) => setAlign(v as Align)}
            options={[
              { value: 'start', label: 'Start' },
              { value: 'center', label: 'Center', disabled: tabTip },
              { value: 'end', label: 'End' },
            ]}
          />
          <Dropdown
            label="Set"
            size="sm"
            value={variant}
            onChange={(v) => {
              setVariant(v as Variant)
              if (v === 'tab-tip' && align === 'center') setAlign('start')
            }}
            options={[
              { value: 'default', label: 'Popover' },
              { value: 'tab-tip', label: 'Tab tip' },
            ]}
          />
          <Dropdown
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
            align={align}
            variant={variant}
            modal={modal}
            label={modal ? 'Theme filter' : undefined}
            trigger={tabTip ? tabTipTrigger : (props) => <Button {...props}>{TRIGGER}</Button>}
          >
            <ThemeOptions value={themes} onChange={setThemes} />
          </Popover>
        </div>
      }
      code={codeFor(placement, align, variant, modal)}
    />
  )
}

/**
 * An open Popover for the anatomy and variants, through the contract's own
 * defaultOpen. It is the real component, so it dismisses like one: click
 * outside, press its trigger or press Escape and it closes, and its trigger
 * opens it again.
 */
export function PopoverStill({
  placement = 'bottom',
  align = 'center',
  variant = 'default',
}: {
  placement?: Placement
  align?: Align
  variant?: Variant
}) {
  const [themes, setThemes] = useState<Themes>({ light: true, dark: false })
  return (
    <Popover
      defaultOpen
      placement={placement}
      align={align}
      variant={variant}
      trigger={variant === 'tab-tip' ? tabTipTrigger : (props) => <Button {...props}>{TRIGGER}</Button>}
    >
      <ThemeOptions value={themes} onChange={setThemes} />
    </Popover>
  )
}
