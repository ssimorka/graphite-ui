import type { ComponentDocConfig } from './types'
import { accordionDoc } from './docs/accordion'
import { breadcrumbDoc } from './docs/breadcrumb'
import { buttonDoc } from './docs/button'
import { buttonGroupDoc } from './docs/button-group'
import { checkboxDoc } from './docs/checkbox'
import { checkboxGroupDoc } from './docs/checkbox-group'
import { containedListDoc } from './docs/contained-list'
import { dataTableDoc } from './docs/data-table'
import { datePickerDoc } from './docs/date-picker'
import { fileUploaderDoc } from './docs/file-uploader'
import { linkDoc } from './docs/link'
import { menuDoc } from './docs/menu'
import { menuButtonDoc } from './docs/menu-button'
import { modalDoc } from './docs/modal'
import { navigationMenuDoc } from './docs/navigation-menu'
import { notificationDoc } from './docs/notification'
import { numberInputDoc } from './docs/number-input'
import { overlayDoc } from './docs/overlay'
import { paginationDoc } from './docs/pagination'
import { passwordInputDoc } from './docs/password-input'
import { popoverDoc } from './docs/popover'
import { progressBarDoc } from './docs/progress-bar'
import { radioButtonGroupDoc } from './docs/radio-button-group'
import { searchDoc } from './docs/search'
import { selectDoc } from './docs/select'
import { sliderDoc } from './docs/slider'
import { tabsDoc } from './docs/tabs'
import { tagDoc } from './docs/tag'
import { textAreaDoc } from './docs/text-area'
import { textInputDoc } from './docs/text-input'
import { timePickerDoc } from './docs/time-picker'
import { toastDoc } from './docs/toast'
import { toggleDoc } from './docs/toggle'
import { tooltipDoc } from './docs/tooltip'
import { typographyDoc } from './docs/typography'

/**
 * Every governed component's page, by contract slug. A config is a function so
 * it can read the repo (kit stats, the contract) at build time; the route calls
 * it on the server. Adding a component page is one line here and one file in
 * ./docs.
 */
export const COMPONENT_DOCS: Record<string, () => ComponentDocConfig> = {
  'accordion': accordionDoc,
  'breadcrumb': breadcrumbDoc,
  'button': buttonDoc,
  'button-group': buttonGroupDoc,
  'checkbox': checkboxDoc,
  'checkbox-group': checkboxGroupDoc,
  'contained-list': containedListDoc,
  'data-table': dataTableDoc,
  'date-picker': datePickerDoc,
  'file-uploader': fileUploaderDoc,
  'link': linkDoc,
  'menu': menuDoc,
  'menu-button': menuButtonDoc,
  'modal': modalDoc,
  'navigation-menu': navigationMenuDoc,
  'notification': notificationDoc,
  'number-input': numberInputDoc,
  'overlay': overlayDoc,
  'pagination': paginationDoc,
  'password-input': passwordInputDoc,
  'popover': popoverDoc,
  'progress-bar': progressBarDoc,
  'radio-button-group': radioButtonGroupDoc,
  'search': searchDoc,
  'select': selectDoc,
  'slider': sliderDoc,
  'tabs': tabsDoc,
  'tag': tagDoc,
  'text-area': textAreaDoc,
  'text-input': textInputDoc,
  'time-picker': timePickerDoc,
  'toast': toastDoc,
  'toggle': toggleDoc,
  'tooltip': tooltipDoc,
  'typography': typographyDoc,
}
