import type { ComponentDocConfig } from '../types'
import styles from './notification.module.scss'
import { NotificationPreview, NotificationStill } from './notification-preview'
import type { DemoMessage, Variant } from './notification-preview'

const MESSAGES: Record<Variant, DemoMessage> = {
  info: {
    title: 'Contract updated',
    body: 'Tabs moved to a new minor version. Nothing in your code needs to change.',
  },
  success: {
    title: 'Snapshot matches',
    body: 'Every component page agrees with the kit snapshot.',
  },
  warning: {
    title: 'Snapshot may be stale',
    body: 'Re-extract it from Figma before trusting a drift result.',
  },
  danger: {
    title: 'Drift check failed',
    body: 'Two component pages name a set the kit no longer has.',
  },
}

const cell = (
  variant: Variant,
  props: { kind?: 'inline' | 'callout'; highContrast?: boolean; action?: string; closable?: boolean; short?: boolean } = {},
) => (
  <div className={styles.measure}>
    <NotificationStill
      variant={variant}
      title={MESSAGES[variant].title}
      body={props.short ? 'Saved.' : MESSAGES[variant].body}
      kind={props.kind}
      highContrast={props.highContrast}
      action={props.action}
      closable={props.closable ?? props.kind !== 'callout'}
    />
  </div>
)

export function notificationDoc(): ComponentDocConfig {
  return {
    slug: 'notification',
    name: 'Notification',
    kitTitle: 'Notification',
    figmaNode: '4179:105911',
    lede: 'An inline message about the state of the page or a task, in one of four statuses. It stays until the condition changes; for a message that should come and go on its own, this is the wrong component.',
    description:
      'An inline status message in info, success, warning and danger, with a high-contrast style, an action, and a callout form. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Used inline on the Create page’s cards. Deliberately not a toast: it has no timing at all. Not an overlay either: it sits in the page flow.',
    livePreview: <NotificationPreview messages={MESSAGES} />,
    install: "import { Notification } from '@/components/ui/notification'",
    anatomy: cell('info'),
    anatomyLede:
      'Only the body is required. The status icon comes with the variant, in its status colour, but it is decorative and hidden from assistive tech, so the title or body has to say the status in words. Title and message share a line while they fit and the message wraps under the title when they do not. Pass onClose for the 48px close in the top right.',
    variantsLede:
      'Four statuses, each bound to a generated status role: its container for the fill, its base role for the edge, stripe and icon. Status hue is pinned per status and chroma follows the source, so danger still reads as danger whatever colour the header is set to. High contrast inverts the fill; Actionable adds an outlined action; Callout is the kit’s closeless form.',
    variants: [
      { label: 'Status: Info', node: cell('info') },
      { label: 'Status: Success', node: cell('success') },
      { label: 'Status: Warning', node: cell('warning') },
      { label: 'Status: Danger', node: cell('danger') },
      { label: 'Short message', node: cell('success', { short: true }) },
      { label: 'High contrast: Info', node: cell('info', { highContrast: true }) },
      { label: 'High contrast: Danger', node: cell('danger', { highContrast: true }) },
      { label: 'Actionable', node: cell('warning', { action: 'Re-extract' }) },
      { label: 'Callout: Info', node: cell('info', { kind: 'callout' }) },
      { label: 'Callout: Warning', node: cell('warning', { kind: 'callout' }) },
    ],
    dos: [
      'Place it next to what it is about, in the flow of the page, and leave it there while the condition holds.',
      'Say the status in the title, in words: “Payment failed”, not just “Error”. A red source colour can make danger and primary look alike.',
      'Save danger for what the reader must act on now. It is announced as an alert and interrupts a screen reader mid-sentence.',
      'Stop rendering it when the condition changes, so a stale success message never outlives the thing it confirmed. Pass onClose when the reader may also dismiss it.',
    ],
    donts: [
      'Use it as a toast that fades on a timer. The kit’s Toast is a separate set with its own timing.',
      'Hand-pick a status colour or restyle the container. Each variant uses its generated container role, the same rule as Tag.',
      'Let the icon or the colour be the only place the status appears.',
      'Stack several notifications about one problem. One per condition, near where it happens.',
    ],
    a11y: [
      ['Roles', <>Danger renders with <code>role=&quot;alert&quot;</code>, which interrupts. Info, success and warning render with <code>role=&quot;status&quot;</code>, which waits for a pause.</>],
      ['Icon', <>The status icon is wrapped in <code>aria-hidden</code> and coloured with the variant’s status role. It decorates the message and never carries it.</>],
      ['Keyboard', <>Without <code>onClose</code> or <code>action</code>, nothing takes focus. The action and the close are each one tab stop; the close is named “Dismiss notification”. Both take Button’s ghost focus ring, which is background on the high-contrast fill. Enter or Space dismisses. Escape does nothing: this is inline content, not an overlay, so there is no focus to trap or return. Once it closes, the button that held focus is gone, so move focus somewhere sensible in onClose.</>],
      ['Contrast', 'Text, the action label and the close glyph are on-surface on each status container, as the kit binds them: swept across 288 sources in both modes, the worst pair is 9.77:1, clear of AAA. High contrast is background on on-background, with the action label in on-primary (13.22:1 at worst).'],
      ['Colour', 'Status is shown three ways: the container with its edge and stripe, the icon, and the words. Colour is never the only signal.'],
      ['Motion', <>With <code>appear</code>, for one shown in answer to something the reader did, it opens its height and fades in at the base step; without it, it is simply there. Closing it reverses that at fast before onClose is called. Under reduced motion only the fade plays, since a growing height pushes the page.</>],
    ],
    parityLede:
      'The kit files Inline, Callout and Toast as three sets on one page, plus a set for the action button. The code covers Inline and Callout on every axis; Toast is its own component.',
    parity: [
      ['Status', 'Success · Error · Warning · Info', 'variant', 'One to one, except that the kit’s Error is danger in code, the name every status role uses.'],
      ['High contrast', 'True · False', 'highContrast', 'on-background fill, background text, no edge. The kit’s inverse stripe and icon stops are not engine roles; the status containers stand in, swept at 3:1 or better. The info icon is info-container and the close glyph background, as drawn.'],
      ['Long message', 'False · True', '—', 'Layout, not a variant. Title and message share a line while they fit and wrap when they do not, which is what the kit’s two variants show.'],
      ['Actionable', 'False · True', 'action', 'The kit’s action button item: a small button in Body/3 with a 1px edge, centred in the top 48 row and butting the close. On-surface on an on-background edge; on-primary on a primary-disabled edge in high contrast. Hover fills surface-variant, or underlines on the high-contrast fill.'],
      ['Close', 'Boolean', 'onClose', 'A 48px ghost icon button flush in the top right, glyph in on-surface (background in high contrast). The kit’s glyph is a plus, a slip; built as a cross.'],
      ['Status icon', 'Built in', 'variant (icon overrides)', 'The Failed, Succeeded and Informative status icons at 16, and Caution minor, the warning triangle, at 20, as Inline, Callout and Toast all draw them.'],
      ['Callout', 'Separate set', 'kind="callout"', 'Info and Warning, High contrast and Long message; no close and no action.'],
      ['Toast', 'Separate set', '—', 'Its own component, with its own timing; carried on the plan for the remaining sets.'],
    ],
    related: [
      { href: '/docs/components/tag', title: 'Tag', why: 'the same status roles, at label size' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when the reader must stop and decide' },
      { href: '/docs/components/progress-bar', title: 'Progress bar', why: 'when the status is progress' },
    ],
  }
}
