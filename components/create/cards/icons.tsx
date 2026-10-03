import { KitIcon } from '@/components/kit-icon'
import type { KitIconName } from '@/lib/kit-icons'
import { CardShell } from '../card-shell'
import styles from './icons.module.scss'

// The kit's icons card (fi-rs in the kit), in the same order. The family
// follows the builder's Icons control.
const ICONS: [string, KitIconName][] = [
  ['Copy', 'copy'],
  ['Exclamation', 'exclamation'],
  ['Trash', 'trash'],
  ['Share', 'share'],
  ['Shopping bag', 'shopping-bag'],
  ['Menu dots', 'menu-dots'],
  ['Spinner', 'spinner'],
  ['Plus', 'plus'],
  ['Minus', 'minus'],
  ['Arrow left', 'arrow-left'],
  ['Arrow right', 'arrow-right'],
  ['Check', 'check'],
  ['Angle down', 'angle-small-down'],
  ['Angle right', 'angle-small-right'],
  ['Search', 'search'],
  ['Settings', 'settings'],
]

export function IconsCard() {
  return (
    <CardShell id="icons">
      <div className={styles.grid}>
        {ICONS.map(([name, icon]) => (
          <span key={name} className={styles.cell} title={name}>
            <KitIcon name={icon} size={16} aria-label={name} />
          </span>
        ))}
      </div>
    </CardShell>
  )
}
