import { CheckmarkFilled, ErrorFilled, InformationFilled, WarningFilled } from '@carbon/icons-react'
import type { ReactNode } from 'react'
import { Notification } from '@/components/ui/notification'
import type { ComponentDocConfig } from '../types'
import styles from './notification.module.scss'
import { NotificationPreview } from './notification-preview'
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

const ICONS: Record<Variant, ReactNode> = {
  info: <InformationFilled size={20} />,
  success: <CheckmarkFilled size={20} />,
  warning: <WarningFilled size={20} />,
  danger: <ErrorFilled size={20} />,
}

const cell = (variant: Variant) => (
  <div className={styles.measure}>
    <Notification
      variant={variant}
      icon={ICONS[variant]}
      title={MESSAGES[variant].title}
      body={MESSAGES[variant].body}
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
      'An inline status message in info, success, warning and danger variants. Anatomy, variants, API, tokens and accessibility, generated from the contract.',
    tocNote: 'Used inline on the Create page’s cards. Deliberately not a toast: it has no timing at all. Not an overlay either: it sits in the page flow.',
    livePreview: <NotificationPreview messages={MESSAGES} />,
    install: "import { Notification } from '@/components/ui/notification'",
    anatomy: cell('info'),
    anatomyLede:
      'Only the body is required. The icon takes its variant’s status colour but is decorative and hidden from assistive tech, so the title or body has to say the status in words. Pass onClose to add a close button at the trailing edge.',
    variantsLede:
      'Four variants, each bound to a generated status role. Status hue is pinned per status and chroma follows the source, so danger still reads as danger whatever colour the header is set to.',
    variants: [
      { label: 'Variant: Info', node: cell('info') },
      { label: 'Variant: Success', node: cell('success') },
      { label: 'Variant: Warning', node: cell('warning') },
      { label: 'Variant: Danger', node: cell('danger') },
    ],
    dos: [
      'Place it next to what it is about, in the flow of the page, and leave it there while the condition holds.',
      'Say the status in the title, in words: “Payment failed”, not just “Error”. A red source colour can make danger and primary look alike.',
      'Save danger for what the reader must act on now. It is announced as an alert and interrupts a screen reader mid-sentence.',
      'Stop rendering it when the condition changes, so a stale success message never outlives the thing it confirmed. Pass onClose when the reader may also dismiss it.',
    ],
    donts: [
      'Use it as a toast that fades on a timer. That is a separate component with its own timing contract.',
      'Hand-pick a status colour or restyle the container. Each variant uses its generated container role, the same rule as Tag.',
      'Let the icon or the colour be the only place the status appears.',
      'Stack several notifications about one problem. One per condition, near where it happens.',
    ],
    a11y: [
      ['Roles', <>Danger renders with <code>role=&quot;alert&quot;</code>, which interrupts. Info, success and warning render with <code>role=&quot;status&quot;</code>, which waits for a pause.</>],
      ['Icon', <>The icon slot is wrapped in <code>aria-hidden</code> and coloured with the variant’s status role. It decorates the message and never carries it.</>],
      ['Keyboard', <>Without <code>onClose</code>, nothing takes focus. With it, the close button is one tab stop, named “Dismiss notification”, drawing the <code>--graphite-focus</code> ring. Enter or Space dismisses. Escape does nothing: this is inline content, not an overlay, so there is no focus to trap or return. Once it closes, the button that held focus is gone, so move focus somewhere sensible in onClose.</>],
      ['Contrast', 'Each status variant sets text in its on-container role on its container role, a generated pair measured at the theme’s target, AA or AAA.'],
      ['Colour', 'Status is shown three ways: the container tone, the status-coloured edge and the words. Colour is never the only signal.'],
      ['Motion', 'Nothing animates on entry or exit, so there is nothing for reduced motion to switch off.'],
    ],
    parityLede:
      'The kit files Inline, Callout and Toast as three sets on one page, plus a set for the action button. The code is Inline alone, with two props: variant and an optional onClose.',
    parity: [
      ['Status', 'Success · Error · Warning · Info', 'variant', 'One to one, except that the kit’s Error is danger in code, the name every status role uses.'],
      ['High contrast', 'True · False', '—', 'The code draws one style: a tinted container with a status edge, closest to High contrast False.'],
      ['Long message', 'False · True', '—', 'Layout, not a variant. Title and body wrap and the height follows the text.'],
      ['Actionable', 'False · True', '—', 'No action slot. The action button set has no counterpart.'],
      ['Close button', 'Not an axis', 'onClose', 'The code renders one only when onClose is set, labelled “Dismiss notification”. Without it the message lasts as long as the caller renders it.'],
      ['Callout', 'Separate set', '—', 'Drawn for Info and Warning only. The code does not tell it apart from Inline; the same component and variants cover it.'],
      ['Toast', 'Separate set', '—', 'Not this component. Toast is Tier 2, with its own timing contract.'],
    ],
    related: [
      { href: '/docs/components/tag', title: 'Tag', why: 'the same status roles, at label size' },
      { href: '/docs/components/modal', title: 'Modal', why: 'when the reader must stop and decide' },
      { href: '/docs/components/progress-bar', title: 'Progress bar', why: 'when the status is progress' },
    ],
  }
}
