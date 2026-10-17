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
  outlined: styles.isOutlined,
  ghost: styles.isGhost,
  secondary: styles.isSecondary,
  'secondary-outlined': styles.isSecondaryOutlined,
  'secondary-ghost': styles.isSecondaryGhost,
  danger: styles.isDanger,
  'danger-ghost': styles.isDangerGhost,
}

const NAME: Record<ButtonVariant, string> = {
  primary: 'Primary',
  outlined: 'Outlined',
  ghost: 'Ghost',
  secondary: 'Secondary',
  'secondary-outlined': 'Secondary outlined',
  'secondary-ghost': 'Secondary ghost',
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
    tocNote: 'The reference implementation for the API conventions. Two colour families, violet and green, each filled, outlined and text.',
    livePreview: <ButtonPreview />,
    install: "import { Button, buttonVariants } from '@/components/ui/button'",
    anatomy: <Button variant="primary">Button label</Button>,
    anatomyLede:
      'One slot. The label and any icons are children, so a caller composes them instead of picking from a fixed leading and trailing pair. The wide right inset is the kit’s: it reserves room for a trailing icon.',
    variantsLede:
      'Two props carry the kit’s axes. Variant says how much the action matters and which colour family it belongs to: violet primary, outlined and ghost, or green secondary, secondary-outlined and secondary-ghost. Size sets the height, and the icon sizes make the button square, at each size the kit draws one. On the filled and outlined styles a trailing icon sits in the slot the wide right inset reserves, 16px from the edge; on the ghost styles it follows the label.',
    variants: [
      { label: 'Variant: Primary', node: <Button variant="primary">Save changes<Add /></Button> },
      { label: 'Variant: Outlined', node: <Button variant="outlined">Back<Add /></Button> },
      { label: 'Variant: Ghost', node: <Button variant="ghost">Cancel<Add /></Button> },
      { label: 'Variant: Secondary (default)', node: <Button>Export<Add /></Button> },
      { label: 'Variant: Secondary outlined', node: <Button variant="secondary-outlined">Preview<Add /></Button> },
      { label: 'Variant: Secondary ghost', node: <Button variant="secondary-ghost">Skip<Add /></Button> },
      { label: 'Variant: Danger', node: <Button variant="danger">Delete project<Add /></Button> },
      { label: 'Variant: Danger ghost', node: <Button variant="danger-ghost">Remove<Add /></Button> },
      { label: 'Size: Small', node: <Button size="sm">Export<Add /></Button> },
      { label: 'Size: Medium (default)', node: <Button size="md">Export<Add /></Button> },
      { label: 'Size: Large', node: <Button size="lg">Export<Add /></Button> },
      { label: 'Size: Extra large', node: <Button size="xl">Export<Add /></Button> },
      { label: 'Size: 2x large', node: <Button size="2xl">Export<Add /></Button> },
      { label: 'Size: Expressive', node: <Button size="expressive">Export<Add /></Button> },
      {
        label: 'Icon only: Small · Medium · Large · Extra large · Expressive',
        node: (
          <div className={styles.row}>
            {(['icon-sm', 'icon', 'icon-lg', 'icon-xl', 'icon-expressive'] as const).map((s) => (
              <Button key={s} size={s} aria-label="Add">
                <Add />
              </Button>
            ))}
          </div>
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
      'Give each group one filled button, and make it the action the screen exists for. Put it last.',
      'Pair a filled button with outlined or ghost from its own family: primary with outlined or ghost, secondary with secondary-outlined or secondary-ghost.',
      'Use outlined for a real alternative (Back, Cancel, Not now) and ghost for skipping a step or a tool (Skip, Learn more).',
      'Put a destructive action on danger, even when it is the main action in a confirmation dialog.',
      'Use asChild to render onto a link when the button navigates, so it keeps link semantics.',
      'Give an icon-only button an aria-label that names the action, not the glyph.',
    ],
    donts: [
      'Place two filled buttons side by side, of either family. Decide which one the group is for.',
      'Mix families in one group, such as a green secondary beside a violet ghost.',
      'Style a delete as primary because it is the expected next step. Danger is what tells a reader it cannot be undone.',
      'Shrink a button below its touch target with a className. The minimum holds at every size on purpose.',
      'Invent a hover colour. Hover and press are tone steps on the fill’s own ramp.',
    ],
    a11y: [
      ['Keyboard', 'A native button element, so Enter and Space both activate it. The type defaults to button, so it will not submit a form unless you ask it to.'],
      ['Focus', <>The kit’s ring, on <code>:focus-visible</code>: 2px inside the edge in <code>--graphite-primary-focus</code> on every style except the danger ones, which take <code>--graphite-danger-focus</code>, with a 1px line of the page background inside it on the filled styles. On the outlined styles the ring replaces the border. A mouse click does not show it; a keyboard does. In forced-colours mode a system ring replaces it.</>],
      ['Labels', 'The icon size changes the shape, never the naming requirement. The component does not check for an aria-label, so the caller must pass one.'],
      ['Disabled', 'Uses the native disabled attribute, which removes the button from the tab order. If a reader needs to learn why an action is unavailable, say so in text nearby.'],
      ['Contrast', 'Every filled style puts on-primary on its fill, and the outlined and ghost styles put primary or secondary on the page. All of those pairs are measured at the theme’s target, AA or AAA.'],
      ['Motion', 'Colour transitions and the 1px press displacement both switch off under prefers-reduced-motion.'],
    ],
    parityLede: `The kit's Button page ships ${kit?.variants ?? 'many'} variants in ${kit?.sets ?? 'one'} set. The code exposes ${props} props. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Style', 'Primary · Outlined · Ghost · Secondary · Secondary outlined · Secondary ghost · Danger primary · Danger ghost', 'variant', 'All eight. Secondary outlined is secondary-outlined, Secondary ghost is secondary-ghost, Danger primary is danger and Danger ghost is danger-ghost. Every style but the danger ones takes primary’s focus ring, as the kit binds it.'],
      ['Size', 'Small · Medium · Large · Extra large · 2x large · Expressive', 'size', 'All six: sm, md, lg, xl, 2xl and expressive at the kit’s 32, 42, 50, 66, 82 and 50px. Extra large and 2x large top-align the label and icon; Expressive sets its label at 16/24. The kit draws 2x large without the danger styles; the code allows them.'],
      ['Type', 'Text + Icon · Icon only', 'size="icon-*"', 'Icon only is a size: icon-sm, icon, icon-lg, icon-xl and icon-expressive, the kit’s 32, 40, 48, 64 and 44px squares. The kit draws no danger icon-only button; the code allows one.'],
      ['State', 'Enabled · Hover · Active · Focus · Disabled · Skeleton', '—', 'Pseudo-classes in code, per governance rule 7. Disabled is the native attribute. Skeleton has no counterpart.'],
      ['Icon', 'Boolean + swap', 'children', 'Composition. The caller passes the icon as a child instead of choosing one from the kit’s list.'],
    ],
    related: [
      { href: '/docs/components/button-group', title: 'Button Group', why: 'enforces one filled button' },
      { href: '/docs/components/modal', title: 'Modal', why: 'where the footer lives' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when one button hides several actions' },
      { href: '/docs/components/tag', title: 'Tag', why: 'a label that does nothing when clicked' },
    ],
  }
}
