import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './menu.module.scss'
import { MenuPreview, MenuStill } from './menu-preview'

const cell = (item: 'enabled' | 'disabled' | 'destructive') => (
  <div className={styles.cell}>
    <MenuStill item={item} />
  </div>
)

const sized = (size: 'lg' | 'md' | 'sm' | 'xs') => (
  <div className={styles.stage}>
    <MenuStill size={size} list="short" />
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
      'Placement opens the list below or above the trigger, aligned to its start edge; it does not flip on its own. Size sets the row height, from 50 down to 26. The kit’s Complex function is what the items hold: a trailing shortcut, and a leading check that indents every row.',
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
      { label: 'Size: Large', node: sized('lg') },
      { label: 'Size: Medium', node: sized('md') },
      { label: 'Size: Small', node: sized('sm') },
      { label: 'Size: Extra small', node: sized('xs') },
      {
        label: 'Function: Complex',
        node: (
          <div className={styles.stage}>
            <MenuStill list="complex" />
          </div>
        ),
      },
    ],
    statesLede:
      'Item states, the ones the kit draws on its private menu list item. Hover steps the row to elevation-02, the same tone-step move Button makes, and lifts the label to on-surface. Focus is a 2px ring inside the row; with hover it keeps the hover fill. A destructive row is neutral at rest, set apart by its delete icon, and fills with danger on hover.',
    states: [
      { label: 'Enabled', node: cell('enabled') },
      { label: 'Hover', node: cell('enabled'), className: styles.forceHover },
      { label: 'Focus', node: cell('enabled'), className: styles.forceFocus },
      { label: 'Focus + Hover', node: cell('enabled'), className: `${styles.forceHover} ${styles.forceFocus}` },
      { label: 'Disabled', node: cell('disabled') },
      { label: 'Destructive', node: cell('destructive') },
      { label: 'Danger hover', node: cell('destructive'), className: styles.forceDanger },
      { label: 'Danger hover + Focus', node: cell('destructive'), className: `${styles.forceDanger} ${styles.forceFocus}` },
    ],
    dos: [
      'Keep a Menu to actions on one object, such as rename, duplicate and delete for one theme.',
      'Mark delete and remove as destructive, and let the label say what goes. The icon and the hover fill set it apart; the words still have to say it.',
      'Group related items with a separator, and put the destructive ones last.',
      'Disable an item that does not apply right now instead of removing it, so the list keeps its shape.',
    ],
    donts: [
      'Style a destructive item like a neutral one. It must never read as a harmless choice.',
      'Use a Menu to pick a value that stays chosen. That is a Select.',
      'Put fields in the list. Items are labels, a shortcut or a check, and handlers; richer content belongs in a Popover.',
      'Rely on hover to reveal items. Everything the Menu can do is in the list when it opens.',
    ],
    a11y: [
      ['Keyboard', 'Enter, Space or Down Arrow on the trigger opens the menu on its first item, and Up Arrow opens it on its last. Down and Up move between items and wrap at the ends; Home and End jump to the first and last. Enter or Space chooses an item. Escape closes the menu, and so does Tab, which then carries on to whatever follows the trigger.'],
      ['Roles', <>The list is <code>role=&quot;menu&quot;</code> and each item <code>role=&quot;menuitem&quot;</code>, or <code>menuitemcheckbox</code> with <code>aria-checked</code> when it carries selected. The trigger gets <code>aria-haspopup=&quot;menu&quot;</code> and <code>aria-expanded</code>.</>],
      ['Focus', <>Opening the menu moves focus to an item. Every item is <code>tabindex=&quot;-1&quot;</code>, so the whole menu is one Tab stop and the arrow keys do the rest. A focused item takes a 2px <code>primary-focus</code> ring inside its edge. When the menu closes, focus goes back to the trigger.</>],
      ['Choosing', 'Choosing an item runs its onSelect and closes the menu. Disabled items are real disabled buttons, so the arrow keys skip them and they cannot be chosen.'],
      ['Contrast', <>Labels are <code>on-surface-variant</code> at rest and <code>on-surface</code> on hover, on <code>elevation-01</code>, lifted by <code>shadow-overlay</code> with no edge. A destructive row on hover is <code>on-danger</code> on <code>danger</code>.</>],
      ['Motion', 'The list fades in on the fast motion step and appears at once under prefers-reduced-motion.'],
    ],
    parityLede:
      'The kit’s Menu page has one public set, Menu, built from a private menu list item that carries the item states shown above. Size is a prop; Function is what the items hold.',
    parity: [
      ['Function', 'Simple · Complex', 'items', 'No switch. How much the list holds comes from the items you pass, separators included.'],
      ['Size', 'Large · Medium · Small · Extra small', 'size', 'lg, md, sm and xs: rows of 50, 42, 34 and 26. Two over Carbon’s, because the kit kept Carbon’s padding around Body/3; built as drawn.'],
      ['Delete', 'True · False', 'destructive', 'The trailing delete icon at rest and the danger fill on hover. The kit’s label there is text-on-color (onPrimary); the code uses on-danger, the right role on a danger fill.'],
      ['Item: Shortcuts or Trigger', 'Shortcut combo · Caret', 'shortcut', 'The shortcut is text in the trailing slot; the kit draws a modifier glyph and a letter. Caret is a sub-menu trigger, which is not built.'],
      ['Item: Selected · Indented', 'True · False', 'selected', 'A leading check. Setting selected on any item indents every row, so the labels align.'],
      ['Item: Divider', 'True · False', '{ kind: separator }', 'A 1px outline-subtle line on the next row’s top edge, then 4.'],
      ['Item state', 'Enabled → Danger hover + Focus (private set)', '—', 'Pseudo-classes in code, plus disabled and destructive on each item. Governance rule 7: a State=Hover variant is not an instruction to add a hover prop. The private set names one state Focus twice; the one with the hover fill is Focus + Hover.'],
    ],
    related: [
      { href: '/docs/components/popover', title: 'Popover', why: 'when the content is more than a list' },
      { href: '/docs/components/select', title: 'Select', why: 'when the reader is choosing a value' },
      { href: '/docs/components/button', title: 'Button', why: 'the trigger, and the hover step items share' },
      { href: '/docs/components/modal', title: 'Modal', why: 'to confirm what a destructive item does' },
    ],
  }
}
