import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './menu.module.scss'
import { MenuPreview, MenuStill } from './menu-preview'

const cell = (item: 'enabled' | 'disabled' | 'destructive') => (
  <div className={styles.cell}>
    <MenuStill item={item} />
  </div>
)

export function menuDoc(): ComponentDocConfig {
  return {
    slug: 'menu',
    name: 'Menu',
    kitTitle: 'Menu',
    figmaNode: '31131:96397',
    lede: 'A list of actions that opens from a trigger. Use it to gather commands that act on one thing; use a Select when the reader is choosing a value, and a Popover when the content is more than a list.',
    description:
      'A list of actions that opens from a trigger. Anatomy, placements, item states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Menu has no defaultOpen, so the lists on this page open themselves once through their own trigger, without taking focus. Click away and they close like any other.',
    livePreview: <MenuPreview />,
    install: "import { Menu } from '@/components/ui/menu'\nimport type { MenuItem } from '@/components/ui/menu'",
    anatomyLede:
      'A trigger you render, then items and separators passed as data. Spread the props the trigger receives onto it, so it gets the click, the arrow keys and the ARIA state. Items are buttons the Menu draws for you, so every one of them has the same padding, hover and focus. The contract also lists sub-menus as an optional slot; they are not built yet, so an item cannot open a nested list.',
    anatomy: (
      <div className={styles.anatomy}>
        <span className={`${shared.marker} ${styles.markTrigger}`} aria-hidden="true">1</span>
        <span className={`${shared.marker} ${styles.markItems}`} aria-hidden="true">2</span>
        <span className={`${shared.marker} ${styles.markSeparator}`} aria-hidden="true">3</span>
        <MenuStill />
      </div>
    ),
    variantsLede:
      'Placement is the contract’s one prop. The list opens below or above the trigger, aligned to its start edge, and does not flip on its own.',
    variants: [
      {
        label: 'Placement: Bottom',
        node: (
          <div className={styles.stage}>
            <MenuStill placement="bottom" />
          </div>
        ),
      },
      {
        label: 'Placement: Top',
        node: (
          <div className={`${styles.stage} ${styles.stageTop}`}>
            <MenuStill placement="top" />
          </div>
        ),
      },
    ],
    statesLede:
      'Item states, the ones the kit draws on its private menu list item. Hover and focus are the same surface-variant step Button uses, so focus is a change of fill rather than a ring. A destructive item stays in danger through every state.',
    states: [
      { label: 'Enabled', node: cell('enabled') },
      { label: 'Hover', node: cell('enabled'), className: styles.forceHover },
      { label: 'Focus', node: cell('enabled'), className: styles.forceFocus },
      { label: 'Disabled', node: cell('disabled') },
      { label: 'Danger hover', node: cell('destructive'), className: styles.forceHover },
    ],
    dos: [
      'Keep a Menu to actions on one object, such as rename, duplicate and delete for one theme.',
      'Mark delete and remove as destructive, and let the label say what goes. The colour alone cannot carry it.',
      'Group related items with a separator, and put the destructive ones last.',
      'Disable an item that does not apply right now instead of removing it, so the list keeps its shape.',
    ],
    donts: [
      'Style a destructive item like a neutral one. It must never read as a harmless choice.',
      'Use a Menu to pick a value that stays chosen. That is a Select.',
      'Put fields or checkboxes in the list. Items are labels and handlers only, and richer content belongs in a Popover.',
      'Rely on hover to reveal items. Everything the Menu can do is in the list when it opens.',
    ],
    a11y: [
      ['Keyboard', 'Enter, Space or Down Arrow on the trigger opens the menu on its first item, and Up Arrow opens it on its last. Down and Up move between items and wrap at the ends; Home and End jump to the first and last. Enter or Space chooses an item. Escape closes the menu, and so does Tab, which then carries on to whatever follows the trigger.'],
      ['Roles', <>The list is <code>role=&quot;menu&quot;</code> and each item <code>role=&quot;menuitem&quot;</code>. The trigger gets <code>aria-haspopup=&quot;menu&quot;</code> and <code>aria-expanded</code>.</>],
      ['Focus', <>Opening the menu moves focus to an item. Every item is <code>tabindex=&quot;-1&quot;</code>, so the whole menu is one Tab stop and the arrow keys do the rest. A focused item fills with <code>surface-variant</code>, the same step as hover, with no ring. When the menu closes, focus goes back to the trigger.</>],
      ['Choosing', 'Choosing an item runs its onSelect and closes the menu. Disabled items are real disabled buttons, so the arrow keys skip them and they cannot be chosen.'],
      ['Contrast', <>Labels are <code>on-surface</code> and destructive labels <code>danger</code>, on <code>surface-elevated</code>, with an <code>outline</code> edge.</>],
      ['Motion', 'The list fades in on the fast motion step and appears at once under prefers-reduced-motion.'],
    ],
    parityLede:
      'The kit’s Menu page has one public set, Menu, built from a private menu list item that carries the item states shown above. The code exposes one prop, because nearly everything the kit varies is composition.',
    parity: [
      ['Function', 'Simple · Complex', 'items', 'No switch. How much the list holds comes from the items you pass, separators included.'],
      ['Size', 'Large · Medium · Small · Extra small', '—', 'No counterpart. Items have one size, set on the spacing scale.'],
      ['Item state', 'Enabled → Danger hover + Focus (private set)', '—', 'Pseudo-classes in code, plus disabled and destructive on each item. Governance rule 7: a State=Hover variant is not an instruction to add a hover prop.'],
    ],
    related: [
      { href: '/docs/components/popover', title: 'Popover', why: 'when the content is more than a list' },
      { href: '/docs/components/select', title: 'Select', why: 'when the reader is choosing a value' },
      { href: '/docs/components/button', title: 'Button', why: 'the trigger, and the hover step items share' },
      { href: '/docs/components/modal', title: 'Modal', why: 'to confirm what a destructive item does' },
    ],
  }
}
