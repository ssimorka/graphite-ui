import { Button } from '@/components/ui/button'
import { ButtonGroup } from '@/components/ui/button-group'
import type { ComponentDocConfig } from '../types'
import styles from './button-group.module.scss'
import { ButtonGroupPreview } from './button-group-preview'

export function buttonGroupDoc(): ComponentDocConfig {
  return {
    slug: 'button-group',
    name: 'Button Group',
    kitTitle: null,
    lede: 'A row of related actions that allows at most one primary. A single button needs no group, and a set of choices between values is a radio button group, not this.',
    description:
      'A row of related actions that allows at most one primary. Anatomy, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Contracted in #93, after three other contracts already named it as the thing that enforces one primary. Modal wraps its footer in it.',
    livePreview: <ButtonGroupPreview />,
    install: "import { ButtonGroup } from '@/components/ui/button-group'",
    anatomy: (
      <div className={styles.scroll}>
        <ButtonGroup>
          <Button variant="ghost">Cancel</Button>
          <Button variant="primary">Save changes</Button>
        </ButtonGroup>
      </div>
    ),
    anatomyLede:
      'One slot, two or more Buttons. The group adds a gap from the spacing scale and no colour of its own: every visual decision belongs to the buttons inside it.',
    dos: [
      'Wrap every footer or toolbar in a group, so the one-primary rule is checked instead of remembered.',
      'Pass the Buttons as direct children. The check reads direct children only.',
      'Leave the group with no primary when no action is clearly the main one.',
      'Stack actions vertically in the container’s own layout when a narrow space needs it.',
    ],
    donts: [
      'Add a second primary. It throws at render, naming the count, and that is the intended outcome.',
      'Wrap a primary Button in another element to get past the check. It will get past it, and the rule will still be broken.',
      'Override the gap on one instance. Two footers in one product should not disagree about spacing.',
      'Use a group for a single button. A group of one is just a Button.',
    ],
    a11y: [
      ['Roles', 'A plain div with no role. When the actions need a shared name, pass role="group" and an aria-label: both spread to the element.'],
      ['Keyboard', 'Each Button stays a separate tab stop in source order. The group adds no arrow-key navigation and traps nothing.'],
      ['Order', 'The row never reverses, so the order a screen reader announces is the order a sighted reader sees.'],
      ['Focus', 'Each Button draws its own focus ring. The group draws nothing and clips nothing.'],
      ['Emphasis', 'With at most one primary, a reader scanning by visual weight finds one main action, not two competing ones.'],
    ],
    related: [
      { href: '/docs/components/button', title: 'Button', why: 'what goes inside' },
      { href: '/docs/components/modal', title: 'Modal', why: 'wraps its footer in one' },
      { href: '/docs/components/menu', title: 'Menu', why: 'when there are too many actions for a row' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'when the choice is a value, not an action' },
    ],
  }
}
