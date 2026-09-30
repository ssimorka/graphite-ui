'use client'

import { useEffect, useRef, useState } from 'react'
import type { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from '@/components/ui/menu'
import type { MenuItem } from '@/components/ui/menu'
import { Select } from '@/components/ui/select'
import { DemoFrame } from '../demo-frame'
import styles from './menu.module.scss'

type Placement = 'bottom' | 'top'

const TRIGGER = 'Theme actions'

function codeFor(placement: Placement) {
  const placementProp = placement === 'bottom' ? '' : `\n  placement="${placement}"`
  return `<Menu${placementProp}
  trigger={(props) => <Button {...props}>${TRIGGER}</Button>}
  items={[
    { label: 'Rename', onSelect: rename },
    { label: 'Duplicate', onSelect: duplicate },
    { label: 'Export', onSelect: exportTheme, disabled: true },
    { kind: 'separator' },
    { label: 'Delete', onSelect: remove, destructive: true },
  ]}
/>`
}

/**
 * Placement is the contract's one prop. The readout under the trigger shows
 * that choosing an item runs its onSelect and then closes the menu.
 */
export function MenuPreview() {
  const [placement, setPlacement] = useState<Placement>('bottom')
  const [chosen, setChosen] = useState<string | null>(null)

  const items: [MenuItem, ...MenuItem[]] = [
    { label: 'Rename', onSelect: () => setChosen('Rename') },
    { label: 'Duplicate', onSelect: () => setChosen('Duplicate') },
    { label: 'Export', onSelect: () => setChosen('Export'), disabled: true },
    { kind: 'separator' },
    { label: 'Delete', onSelect: () => setChosen('Delete'), destructive: true },
  ]

  return (
    <DemoFrame
      controls={
        <Select
          label="Placement"
          size="sm"
          value={placement}
          onChange={(v) => setPlacement(v as Placement)}
          options={[
            { value: 'bottom', label: 'Bottom' },
            { value: 'top', label: 'Top' },
          ]}
        />
      }
      preview={
        <div className={`${styles.center} ${placement === 'top' ? styles.roomAbove : styles.roomBelow}`}>
          <Menu
            placement={placement}
            trigger={(props) => <Button {...props}>{TRIGGER}</Button>}
            items={items}
          />
          <p className={styles.readout}>
            {chosen ? `Last chosen: ${chosen}` : 'Nothing chosen yet'}
          </p>
        </div>
      }
      code={codeFor(placement)}
    />
  )
}

type TriggerProps = Parameters<ComponentProps<typeof Menu>['trigger']>[0]

/**
 * Menu has no defaultOpen, so a still opens itself once on mount by calling
 * the same onClick its trigger would. Called without an event, that open does
 * not move focus into the list, which is what keeps eight stills from fighting
 * over focus on load. The ref guard stops Strict Mode's double-run from
 * toggling it shut again. After that it is the real Menu: a press outside or
 * Escape closes it, and the trigger opens it again.
 */
function OpenOnMount(props: TriggerProps) {
  const opened = useRef(false)
  const { onClick } = props
  useEffect(() => {
    if (opened.current) return
    opened.current = true
    onClick()
  }, [onClick])
  return <Button {...props}>{TRIGGER}</Button>
}

const noop = () => {}

const STILL_ITEMS: [MenuItem, ...MenuItem[]] = [
  { label: 'Rename', onSelect: noop },
  { label: 'Duplicate', onSelect: noop },
  { label: 'Export', onSelect: noop, disabled: true },
  { kind: 'separator' },
  { label: 'Delete', onSelect: noop, destructive: true },
]

export function MenuStill({
  placement = 'bottom',
  item,
}: {
  placement?: Placement
  /** One item instead of the full list, for the states matrix. */
  item?: 'enabled' | 'disabled' | 'destructive'
}) {
  const items: [MenuItem, ...MenuItem[]] = item
    ? [
        item === 'destructive'
          ? { label: 'Delete', onSelect: noop, destructive: true }
          : { label: 'Rename', onSelect: noop, disabled: item === 'disabled' },
      ]
    : STILL_ITEMS
  return (
    <Menu placement={placement} trigger={(props) => <OpenOnMount {...props} />} items={items} />
  )
}
