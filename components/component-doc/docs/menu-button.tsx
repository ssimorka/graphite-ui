import type { ComponentDocConfig } from '../types'
import { MenuButtonPreview, MenuButtonStill } from './menu-button-preview'

export function menuButtonDoc(): ComponentDocConfig {
  return {
    slug: 'menu-button',
    name: 'Menu buttons',
    kitTitle: 'Menu buttons',
    figmaNode: '31420:317548',
    lede: 'Buttons that open a menu of actions: a labelled Menu button, a Combo button that pairs the main action with related ones, and the Overflow button that tucks secondary actions behind three dots.',
    description:
      'Menu button, Combo button and Overflow, at three sizes, opening a Menu below or above. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s G2 wave, split from Button composed with Menu.',
    livePreview: <MenuButtonPreview />,
    install: "import { ComboButton, MenuButton, OverflowMenu } from '@/components/ui/menu-button'",
    anatomy: <MenuButtonStill form="combo" />,
    anatomyLede:
      'The trigger is the governed Button and the menu the governed Menu, flush under it (or over it). A Combo button is the primary action and a chevron button 1 apart; only the chevron opens the menu, which lines up with the pair’s start.',
    variantsLede:
      'Menu button is a labelled primary Button with a chevron that turns over while open. Combo button keeps one action in reach and the rest in the menu. Overflow is a ghost icon button with the menu dots; its menu lines up with the trigger’s start or end.',
    variants: [
      { label: 'Menu button', node: <MenuButtonStill /> },
      { label: 'Combo button', node: <MenuButtonStill form="combo" /> },
      { label: 'Overflow', node: <MenuButtonStill form="overflow" /> },
      { label: 'Menu button: Medium', node: <MenuButtonStill size="md" /> },
      { label: 'Menu button: Small', node: <MenuButtonStill size="sm" /> },
      { label: 'Overflow: Small', node: <MenuButtonStill form="overflow" size="sm" /> },
    ],
    statesLede:
      'Hover, Focus and Active are Button’s own. Open is the menu showing, with the chevron turned over. Disabled disables the whole trigger.',
    states: [
      { label: 'Enabled', node: <MenuButtonStill /> },
      { label: 'Disabled', node: <MenuButtonStill disabled /> },
      { label: 'Combo: Disabled', node: <MenuButtonStill form="combo" disabled /> },
      { label: 'Overflow: Disabled', node: <MenuButtonStill form="overflow" disabled /> },
    ],
    dos: [
      'Name a Menu button for what is in the menu: “Actions”, “Export”.',
      'Use a Combo button where one action is the usual one and the rest are its variants.',
      'Use Overflow for secondary actions on a row or a card, aligned to the end at the right edge.',
      'Keep destructive items last, after a separator.',
    ],
    donts: [
      'Open a menu of one item. That is a Button.',
      'Put the only route to an action behind Overflow when there is room to show it.',
      'Leave an icon-only trigger unnamed.',
      'Restyle the trigger or the menu. They are the governed Button and Menu.',
    ],
    a11y: [
      ['Roles', <>Each trigger is a button with <code>aria-haspopup=&quot;menu&quot;</code> and <code>aria-expanded</code>; the menu is a <code>menu</code> of <code>menuitem</code>s, as Menu draws it.</>],
      ['Keyboard', 'Enter, Space or Arrow Down opens the menu on its first item; Arrow Up on its last. Arrows move, Escape closes and returns focus to the trigger, Tab leaves.'],
      ['Names', 'A Menu button is named by its label. Combo button’s chevron is “More actions”, Overflow is “Options” by default; both can be renamed.'],
      ['Focus', 'Each trigger takes Button’s focus ring; the items take Menu’s.'],
    ],
    parityLede:
      'The kit’s Menu buttons page has three public sets. The code has one component for each, over Button and Menu.',
    parity: [
      ['Set', 'Menu button · Combo button · Overflow', '—', 'Three components, one contract.'],
      ['Size', 'Large · Medium · Small', 'size', 'The trigger at 48, 40 or 32 and the menu’s rows with it.'],
      ['Position', 'Bottom · Top', 'placement', 'Menu’s placement, flush on the trigger.'],
      ['Alignment', 'Start · End', 'align', 'Overflow only: Menu’s align.'],
      ['State', 'Enabled · Hover · Focus · Active · Disabled', 'disabled', 'Hover, Focus and Active are Button’s pseudo-classes.'],
      ['Open', 'False · True', '—', 'The menu showing; the chevron turns over (the kit draws no open glyph).'],
      ['Glyph', 'fi-rs-plus-small', '—', 'All three sets draw Button’s default plus, never swapped. The code draws the chevron and the menu dots.'],
    ],
    related: [
      { href: '/docs/components/menu', title: 'Menu', why: 'the menu, and its trigger contract' },
      { href: '/docs/components/button', title: 'Button', why: 'the triggers' },
      { href: '/docs/components/button-group', title: 'Button group', why: 'for actions shown side by side' },
    ],
  }
}
