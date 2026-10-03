import { Accordion, AccordionItem } from '@/components/ui/accordion'
import { readContractDoc } from '@/lib/contract-doc'
import { readKitPage } from '@/lib/kit-page'
import { readKitStats } from '@/lib/kit-stats'
import { spell } from '@/lib/spell'
import type { ComponentDocConfig } from '../types'
import shared from '../component-doc.module.scss'
import styles from './accordion.module.scss'
import { AccordionPreview } from './accordion-preview'

const cell = (props: { disabled?: boolean }) => (
  <Accordion className={styles.full}>
    <AccordionItem title="Section title" disabled={props.disabled}>
      Panel content.
    </AccordionItem>
  </Accordion>
)

export function accordionDoc(): ComponentDocConfig {
  const governed = readKitStats().governed
  const kit = readKitPage('Accordion')
  const props = readContractDoc('accordion').props.length

  const items = [
    {
      value: 'ready',
      title: 'Is Graphite UI production ready?',
      body: `${spell(governed)} components carry a versioned contract and are checked against the Figma kit on every build.`,
    },
    {
      value: 'carbon',
      title: 'Does it require Carbon?',
      body: 'Not for the components. The site still leans on Carbon for a few pieces of chrome, and moving off it is a tracked migration.',
    },
    {
      value: 'theming',
      title: 'How does theming work?',
      body: 'One source color becomes the ramps and the roles. Change it in the header and the page repaints.',
    },
  ]

  return {
    slug: 'accordion',
    name: 'Accordion',
    kitTitle: 'Accordion',
    figmaNode: '2154:8478',
    lede: 'A vertically stacked set of headings that each reveal a section of content. Use it to shorten a long page, never to hide information a reader needs to complete the task in front of them.',
    description:
      'A vertically stacked set of headings that each reveal a section of content. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Adopted for the docs site. It replaces Carbon’s Accordion on the home page’s FAQ.',
    livePreview: <AccordionPreview items={items} />,
    install:
      "import {\n  Accordion,\n  AccordionItem,\n  AccordionTrigger,\n  AccordionContent,\n} from '@/components/ui/accordion'",
    anatomy: (
      <>
        <span className={`${shared.marker} ${styles.markTrigger}`} aria-hidden="true">1</span>
        <span className={`${shared.marker} ${styles.markIndicator}`} aria-hidden="true">2</span>
        <span className={`${shared.marker} ${styles.markPanel}`} aria-hidden="true">3</span>
        <Accordion type="single" defaultValue="anatomy">
          <AccordionItem value="anatomy" title="Trigger label">
            The panel. It is labelled by its own trigger, so a screen reader
            announces the pair rather than an orphaned region.
          </AccordionItem>
        </Accordion>
      </>
    ),
    variantsLede:
      'Three axes travel from the kit into the code as props. Size, alignment and flush are all one-word choices; everything else about an accordion is composition.',
    variants: [
      {
        label: 'Size: Small',
        node: (
          <Accordion size="sm">
            <AccordionItem title="Section title">Panel content.</AccordionItem>
          </Accordion>
        ),
      },
      {
        label: 'Size: Large',
        node: (
          <Accordion size="lg">
            <AccordionItem title="Section title">Panel content.</AccordionItem>
          </Accordion>
        ),
      },
      {
        label: 'Alignment: Left',
        node: (
          <Accordion align="left">
            <AccordionItem title="Section title">Panel content.</AccordionItem>
          </Accordion>
        ),
      },
      {
        label: 'Flush: True',
        node: (
          <Accordion flush>
            <AccordionItem title="Section title">Panel content.</AccordionItem>
          </Accordion>
        ),
      },
    ],
    states: [
      { label: 'Enabled', node: cell({}) },
      { label: 'Hover', node: cell({}), className: styles.forceHover },
      { label: 'Focus', node: cell({}), className: styles.forceFocus },
      { label: 'Disabled', node: cell({ disabled: true }) },
    ],
    // The focus ring is reached through `--graphite-focus`, not a role variable
    // of its own, so the primary token shows the colour it resolves to there.
    swatches: { primary: '--graphite-focus' },
    dos: [
      'Let a reader open more than one panel when the panels are independent.',
      'Keep the trigger a real button, so Enter and Space both work.',
      'Use flush when the list already sits inside something with a border.',
      'Pair the indicator with a change the reader can also feel in layout.',
    ],
    donts: [
      'Hide anything the reader needs to finish the task in front of them.',
      'Nest an accordion inside an accordion. Two levels of disclosure is a navigation problem wearing a component.',
      'Animate the panel on a hardcoded duration. The motion tokens exist, so bind them.',
      'Let the indicator carry the open state on its own.',
    ],
    a11y: [
      ['Keyboard', 'Tab moves between triggers. Enter and Space both toggle the panel the focus is on. Nothing traps focus inside a panel.'],
      ['Roles', 'Each trigger is a button carrying aria-expanded and aria-controls; each panel is labelled by its own trigger.'],
      ['Focus', <>The focus ring is <code>--graphite-focus</code> and is never removed, only moved.</>],
      ['Contrast', 'Trigger label against surface is measured at the theme’s target, AA or AAA, and the pairing is checked rather than reviewed.'],
      ['Motion', 'The open transition respects prefers-reduced-motion and falls back to an instant change.'],
    ],
    parityLede: `The kit's Accordion page ships ${kit?.variants ?? 'many'} variants across ${kit?.sets ?? 'several'} sets, and 120 of them are the one Accordion item set. The code exposes ${props} props. This table is where those two facts are reconciled instead of quietly diverging.`,
    parity: [
      ['Size', 'Small · Medium · Large', 'size', 'One to one.'],
      ['Alignment', 'Right · Left', 'align', 'One to one.'],
      ['Flush', 'False · True', 'flush', 'One to one.'],
      ['Expanded', 'False · True', '—', 'Runtime state, not a prop. The kit draws it because Figma has no other way to show it.'],
      ['State', 'Enabled → Skeleton', '—', 'Pseudo-classes in code. Governance rule 7: a State=Hover variant is not an instruction to add a hover prop. Hover fills elevation-02, the kit’s layer-hover-01. Disabled dims the title, copy and chevron; the kit leaves the chevron at full strength, which the code treats as a slip. Skeleton has no counterpart: nothing in an accordion loads asynchronously.'],
      ['Slot', 'Boolean + swap', 'children', 'Composition. The caller passes content instead of choosing from a fixed pair.'],
    ],
    related: [
      { href: '/docs/components/tabs', title: 'Tabs', why: 'the other disclosure' },
      { href: '/docs/components/contained-list', title: 'Contained list', why: 'when nothing should be hidden' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when it should interrupt' },
      { href: '/docs/components/typography', title: 'Typography', why: 'the trigger label’s type' },
    ],
  }
}
