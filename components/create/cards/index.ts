import type { ComponentType } from 'react'
import { PaletteCard } from './palette'
import { AlertsPromptCard } from './alerts-prompt'
import { TypographyCard } from './typography'
import { BrowserShareCard } from './browser-share'
import { FileUploadCard } from './file-upload'
import { TabsCard } from './tabs'
import { InviteTeamCard } from './invite-team'
import { EmptyStateCard } from './empty-state'
import { VisitorsCard } from './visitors'
import { ShippingAddressCard } from './shipping-address'
import { AgentCard } from './agent'
import { ContributorsCard } from './contributors'
import { NotFoundCard } from './not-found'
import { IconsCard } from './icons'
import { EnvironmentVariablesCard } from './environment-variables'
import { SkeletonCard } from './skeleton'
import { FeedbackFormCard } from './feedback-form'
import { WeeklyFitnessCard } from './weekly-fitness'
import { KitchenSinkCard } from './kitchen-sink'
import { TrafficChannelsCard } from './traffic-channels'
import { BookAppointmentCard } from './book-appointment'
import { LiveAudioWaveformCard } from './live-audio-waveform'
import { PromoCard } from './promo'
import { SleepReportCard } from './sleep-report'
import { AnalyticsCard } from './analytics'
import { InvoiceCard } from './invoice'
import { ReportBugCard } from './report-bug'
import { ProfileCard } from './profile'
import { UsageCard } from './usage'
import { ContributionsCard } from './contributions'
import { ShortcutsCard } from './shortcuts'

export type CardEntry = {
  id: string
  title: string
  /** Which of the two desktop columns it sits in, in the kit's order. */
  column: 1 | 2
  /**
   * Below xl the kit shows 24 of the 31 examples: the seven that are wide,
   * chart-heavy views are desktop-only.
   */
  desktopOnly?: boolean
  /** The kit node it is drawn from, for whoever next edits it. */
  node: string
  Component: ComponentType
}

// Order is the kit's: the desktop frame's two columns, top to bottom.
export const CARDS: CardEntry[] = [
  { id: 'palette', title: 'Palette', column: 1, node: '13561:10061', Component: PaletteCard },
  { id: 'alerts-prompt', title: 'Alerts prompt', column: 1, node: '13561:10102', Component: AlertsPromptCard },
  { id: 'typography', title: 'Typography', column: 1, node: '13561:10111', Component: TypographyCard },
  { id: 'browser-share', title: 'Browser share', column: 1, desktopOnly: true, node: '13561:10121', Component: BrowserShareCard },
  { id: 'file-upload', title: 'File upload', column: 1, node: '13561:10167', Component: FileUploadCard },
  { id: 'tabs', title: 'Tabs', column: 1, node: '13561:10185', Component: TabsCard },
  { id: 'invite-team', title: 'Invite team', column: 1, node: '13561:10248', Component: InviteTeamCard },
  { id: 'empty-state', title: 'Empty state', column: 1, node: '13561:10378', Component: EmptyStateCard },
  { id: 'visitors', title: 'Visitors', column: 1, desktopOnly: true, node: '13561:10400', Component: VisitorsCard },
  { id: 'shipping-address', title: 'Shipping address', column: 1, node: '13561:10418', Component: ShippingAddressCard },
  { id: 'agent', title: 'Agent', column: 1, node: '13561:10571', Component: AgentCard },
  { id: 'contributors', title: 'Contributors', column: 1, node: '13561:10629', Component: ContributorsCard },
  { id: 'not-found', title: 'Not found', column: 1, node: '13561:10712', Component: NotFoundCard },
  { id: 'icons', title: 'Icons', column: 2, node: '13561:10743', Component: IconsCard },
  { id: 'environment-variables', title: 'Environment variables', column: 2, node: '13561:10814', Component: EnvironmentVariablesCard },
  { id: 'skeleton', title: 'Skeleton', column: 2, node: '13561:10844', Component: SkeletonCard },
  { id: 'feedback-form', title: 'Feedback form', column: 2, node: '13561:10863', Component: FeedbackFormCard },
  { id: 'weekly-fitness', title: 'Weekly fitness', column: 2, node: '13561:10915', Component: WeeklyFitnessCard },
  { id: 'kitchen-sink', title: 'Kitchen sink', column: 2, node: '13561:10954', Component: KitchenSinkCard },
  { id: 'traffic-channels', title: 'Traffic channels', column: 2, desktopOnly: true, node: '13561:11159', Component: TrafficChannelsCard },
  { id: 'book-appointment', title: 'Book appointment', column: 2, node: '13561:11208', Component: BookAppointmentCard },
  { id: 'live-audio-waveform', title: 'Live audio waveform', column: 2, desktopOnly: true, node: '13561:11242', Component: LiveAudioWaveformCard },
  { id: 'promo', title: 'Promo', column: 2, node: '13561:11311', Component: PromoCard },
  { id: 'sleep-report', title: 'Sleep report', column: 2, desktopOnly: true, node: '13561:11337', Component: SleepReportCard },
  { id: 'analytics', title: 'Analytics', column: 2, desktopOnly: true, node: '13561:11394', Component: AnalyticsCard },
  { id: 'invoice', title: 'Invoice', column: 2, desktopOnly: true, node: '13561:11408', Component: InvoiceCard },
  { id: 'report-bug', title: 'Report bug', column: 2, node: '13561:11471', Component: ReportBugCard },
  { id: 'profile', title: 'Profile', column: 2, node: '13561:11578', Component: ProfileCard },
  { id: 'usage', title: 'Usage', column: 2, node: '13561:11655', Component: UsageCard },
  { id: 'contributions', title: 'Contributions', column: 2, node: '13561:11700', Component: ContributionsCard },
  { id: 'shortcuts', title: 'Shortcuts', column: 2, node: '13561:11721', Component: ShortcutsCard },
]
