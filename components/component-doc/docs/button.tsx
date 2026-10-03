import { Add } from '@carbon/icons-react'
import { Button } from '@/components/ui/button'
import type { ButtonVariant } from '@/components/ui/button'
import { readContractDoc } from '@/lib/contract-doc'
import { readKitPage } from '@/lib/kit-page'
import type { ComponentDocConfig } from '../types'
import styles from './button.module.scss'
import { ButtonPreview } from './button-preview'

const HOOK: Record<ButtonVariant, string> = {
  primary: styles.isPrimary,
  secondary: styles.isSecondary,
  ghost: styles.isGhost,
  danger: styles.isDanger,
  'danger-ghost': styles.isDangerGhost,
}

const NAME: Record<ButtonVariant, string> = {
  primary: 'Primary',
  secondary: 'Secondary',
  ghost: 'Ghost',
  danger: 'Danger',
  'danger-ghost': 'Danger ghost',
}

// One row of the state matrix: every variant in the same state, so a reader
// compares the tone steps across variants rather than one button at a time.
// Each carries the kit's trailing icon, as the kit's Text + Icon type does.
const row = (props: { disabled?: boolean }) => (
  <div className={styles.row}>
    {(Object.keys(NAME) as ButtonVariant[]).map((v) => (
      <Button key={v} variant={v} className={HOOK[v]} disabled={props.disabled}>
        {NAME[v]}
        <Add />
      </Button>
    ))}
  </div>
)

export function buttonDoc(): ComponentDocConfig {
  const kit = readKitPage('Button')
  const props = readContractDoc('button').props.length

  return {
    slug: 'button',
    name: 'Button',
    kitTitle: 'Button',
    figmaNode: '1854:1776',
    lede: 'Starts an action: saving, sending, opening a dialog. When the result is going somewhere else, use a link, even if it looks like a button.',
    description:
      'Starts an action: saving, sending, opening a dialog. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'The reference implementation for the API conventions. Secondary became a fill when the kit was made canonical.',
    livePreview: <ButtonPreview />,
    install: "import { Button, buttonVariants } from '@/components/ui/button'",
    anatomy: <Button variant="primary">Button label</Button>,
    anatomyLede:
      'One slot. The label and any icons are children, so a caller composes them instead of picking from a fixed leading and trailing pair. The wide right inset is the kit’s: it reserves room for a trailing icon.',
    variantsLede:
      'Two props carry the kit’s axes. Variant says how much the action matters; size sets the height, and the icon size makes the button square. On the filled styles a trailing icon sits in the slot the wide right inset reserves, 16px from the edge; on the ghost styles it follows the label.',
    variants: [
      { label: 'Variant: Primary', node: <Button variant="primary">Save changes<Add /></Button> },
      { label: 'Variant: Secondary (default)', node: <Button>Export<Add /></Button> },
      { label: 'Variant: Ghost', node: <Button variant="ghost">Cancel<Add /></Button> },
      { label: 'Variant: Danger', node: <Button variant="danger">Delete project<Add /></Button> },
      { label: 'Variant: Danger ghost', node: <Button variant="danger-ghost">Remove<Add /></Button> },
      { label: 'Size: Small', node: <Button size="sm">Export</Button> },
      { label: 'Size: Medium (default)', node: <Button size="md">Export</Button> },
      { label: 'Size: Large', node: <Button size="lg">Export</Button> },
      {
        label: 'Size: Icon',
        node: (
          <Button size="icon" aria-label="Add">
            <Add />
          </Button>
        ),
      },
    ],
    states: [
      { label: 'Enabled', node: row({}) },
      { label: 'Hover', node: row({}), className: styles.forceHover },
      { label: 'Active', node: row({}), className: styles.forcePressed },
      { label: 'Focus', node: row({}), className: styles.forceFocus },
      { label: 'Disabled', node: row({ disabled: true }) },
    ],
    dos: [
      'Give each group one primary action, and make it the one the screen exists for.',
      'Put a destructive action on danger, even when it is the main action in a confirmation dialog.',
      'Use asChild to render onto a link when the button navigates, so it keeps link semantics.',
      'Give an icon-only button an aria-label that names the action, not the glyph.',
    ],
    donts: [
      'Place two primary buttons side by side. Decide which one the group is for.',
      'Style a delete as primary because it is the expected next step. Danger is what tells a reader it cannot be undone.',
      'Shrink a button below its touch target with a className. The minimum holds at every size on purpose.',
      'Invent a hover colour. Hover and press are tone steps on the fill’s own ramp.',
    ],
    a11y: [
      ['Keyboard', 'A native button element, so Enter and Space both activate it. The type defaults to button, so it will not submit a form unless you ask it to.'],
      ['Focus', <>The kit’s ring, on <code>:focus-visible</code>: 2px inside the edge in the style’s own focus colour (<code>--graphite-primary-focus</code>, <code>-secondary-focus</code> or <code>-danger-focus</code>), with a 1px line of the page background inside it on the filled styles. A mouse click does not show it; a keyboard does. In forced-colours mode a system ring replaces it.</>],
      ['Labels', 'The icon size changes the shape, never the naming requirement. The component does not check for an aria-label, so the caller must pass one.'],
      ['Disabled', 'Uses the native disabled attribute, which removes the button from the tab order. If a reader needs to learn why an action is unavailable, say so in text nearby.'],
      ['Contrast', 'Every filled style puts on-primary on its fill, and those pairs are measured at the theme’s target, AA or AAA.'],
      ['Motion', 'Colour transitions and the 1px press displacement both switch off under prefers-reduced-motion.'],
    ],
    parityLede: `The kit's Button page ships ${kit?.variants ?? 'many'} variants in ${kit?.sets ?? 'one'} set. The code exposes ${props} props. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Style', 'Primary · Secondary · Ghost · Danger primary · Danger ghost', 'variant', 'All five. Danger primary is danger; Danger ghost is danger-ghost. The kit binds Secondary’s focus ring to success’s, which the code reads as a slip and draws in secondary’s.'],
      ['Size', 'Small · Medium · Large · Extra large · 2x large · Expressive', 'size', 'Small, Medium and Large map to sm, md and lg at the kit’s 32, 42 and 50px. The three larger sizes have no counterpart.'],
      ['Type', 'Text + Icon · Icon only', 'size="icon"', 'Icon only is the icon size. The kit sizes it per Size; the code has one square, 40px.'],
      ['State', 'Enabled · Hover · Active · Focus · Disabled · Skeleton', '—', 'Pseudo-classes in code, per governance rule 7. Disabled is the native attribute. Skeleton has no counterpart.'],
      ['Icon', 'Boolean + swap', 'children', 'Composition. The caller passes the icon as a child instead of choosing one from the kit’s list.'],
    ],
    related: [
      { href: '/docs/components/button-group', title: 'Button Group', why: 'enforces one primary' },
      { href: '/docs/components/modal', title: 'Modal', why: 'where the footer lives' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when one button hides several actions' },
      { href: '/docs/components/tag', title: 'Tag', why: 'a label that does nothing when clicked' },
    ],
  }
}
