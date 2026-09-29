import {
  Copy,
  WarningAlt,
  TrashCan,
  Share,
  ShoppingBag,
  OverflowMenuHorizontal,
  Renew,
  Add,
  Subtract,
  ArrowLeft,
  ArrowRight,
  Checkmark,
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
} from '@carbon/icons-react'
import { CardShell } from '../card-shell'
import styles from './icons.module.scss'

// Carbon glyphs stand in for the kit's fi-rs set, in the same order.
const ICONS = [
  ['Copy', Copy],
  ['Exclamation', WarningAlt],
  ['Trash', TrashCan],
  ['Share', Share],
  ['Shopping bag', ShoppingBag],
  ['Menu dots', OverflowMenuHorizontal],
  ['Spinner', Renew],
  ['Plus', Add],
  ['Minus', Subtract],
  ['Arrow left', ArrowLeft],
  ['Arrow right', ArrowRight],
  ['Check', Checkmark],
  ['Angle down', ChevronDown],
  ['Angle right', ChevronRight],
  ['Search', Search],
  ['Settings', Settings],
] as const

export function IconsCard() {
  return (
    <CardShell id="icons">
      <div className={styles.grid}>
        {ICONS.map(([name, Icon]) => (
          <span key={name} className={styles.cell} title={name}>
            <Icon size={16} aria-label={name} />
          </span>
        ))}
      </div>
    </CardShell>
  )
}
