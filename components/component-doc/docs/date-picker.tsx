import type { ComponentDocConfig } from '../types'
import { DatePickerPreview, DatePickerStill } from './date-picker-preview'

export function datePickerDoc(): ComponentDocConfig {
  return {
    slug: 'date-picker',
    name: 'Date picker',
    kitTitle: 'Date picker',
    figmaNode: '17544:267504',
    lede: 'Takes a date, or a range of dates, typed as mm/dd/yyyy or picked from a calendar. Use Simple date where the reader knows the date already, and a calendar where they need to browse for it.',
    description:
      'Simple date, Single calendar and Range calendar, in Default and Fluid, at three sizes, with a keyboard-driven calendar. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. The fields are the governed Text input; Time picker follows as its own component.',
    livePreview: <DatePickerPreview />,
    install: "import { DatePicker } from '@/components/ui/date-picker'",
    anatomy: <DatePickerStill filled />,
    anatomyLede:
      'The label, then the field with the date typed as mm/dd/yyyy and the calendar button at its end. The button opens the calendar under the field: the month with previous and next, the weekdays, and six weeks of days, today marked with a dot.',
    variantsLede:
      'Simple date is the field alone. Single calendar adds the calendar. Range calendar has a start and an end field over one calendar. Each comes in Default, at 48, 40 or 32, and in Fluid, a 64px box with the label inside.',
    variants: [
      { label: 'Simple date', node: <DatePickerStill mode="simple" /> },
      { label: 'Single calendar', node: <DatePickerStill /> },
      { label: 'Range calendar', node: <DatePickerStill mode="range" filled /> },
      { label: 'Single calendar: Medium', node: <DatePickerStill size="md" /> },
      { label: 'Single calendar: Small', node: <DatePickerStill size="sm" /> },
      { label: 'Single calendar: Fluid', node: <DatePickerStill layout="fluid" /> },
      { label: 'Range calendar: Fluid', node: <DatePickerStill mode="range" layout="fluid" /> },
      { label: 'Simple date: Fluid', node: <DatePickerStill mode="simple" layout="fluid" /> },
    ],
    statesLede:
      'The field’s states are Text input’s: a 2px ring on focus, the danger ring and glyph for an error, the warning glyph, the disabled and read-only shells. Error and warning take the calendar button’s place with the status glyph, as the kit draws them.',
    states: [
      { label: 'Enabled', node: <DatePickerStill /> },
      { label: 'Filled', node: <DatePickerStill filled /> },
      { label: 'Error', node: <DatePickerStill status="error" /> },
      { label: 'Warning', node: <DatePickerStill status="warning" filled /> },
      { label: 'Disabled', node: <DatePickerStill status="disabled" /> },
      { label: 'Read-only', node: <DatePickerStill status="read-only" filled /> },
      { label: 'Range: Error', node: <DatePickerStill mode="range" status="error" /> },
    ],
    dos: [
      'Show the format: the placeholder does until the reader types, so put it in the label for Simple date.',
      'Use a calendar where the day of the week or the month around it matters.',
      'Use Range calendar for a start and an end, so the two share one calendar.',
      'Set minDate and maxDate to keep the reader inside the dates that are allowed.',
    ],
    donts: [
      'Build a range from two single pickers.',
      'Use a calendar for a date of birth. The reader knows it; Simple date is faster.',
      'Hide the field. Typing is often quicker than the calendar.',
      'Restyle the fields. They are the governed Text input.',
    ],
    a11y: [
      ['Roles', <>The field is a labelled text input; the calendar button has <code>aria-haspopup=&quot;dialog&quot;</code> and <code>aria-expanded</code>. The calendar is a dialog holding a <code>grid</code>, each day a button named in full (“Wednesday, October 14, 2026”), today with <code>aria-current=&quot;date&quot;</code>.</>],
      ['Keyboard', 'Arrow Down in the field, or the button, opens the calendar on the selected day. Arrows move by day and week, Home and End to the week’s ends, Page Up and Page Down by month, with Shift by year. Enter picks; Escape closes and returns to the button.'],
      ['Typing', 'Enter or leaving the field commits a date typed as mm/dd/yyyy. Anything else stays as typed, for the page to flag with errorText.'],
      ['Focus', <>Days and the month buttons take a 2px <code>--graphite-primary-focus</code> ring inside; the field takes Text input’s.</>],
      ['Range', 'The two fields form a labelled group. The calendar picks the start, then the end; an end before the start swaps them.'],
    ],
    parityLede:
      'The kit’s Date picker page has eleven public sets. Six are the date pickers, Default and Fluid for each of three kinds; the code is one component with a mode and a layout. The Time picker sets on the same page are their own component.',
    parity: [
      ['Set', 'Simple date · Single calendar · Range calendar', 'mode', 'simple, single, range.'],
      ['Set', 'Default · Fluid', 'layout', 'Text input’s fixed and fluid layouts.'],
      ['Size', 'Large · Medium · Small', 'size', '48, 40 and 32, the Text input heights. The kit’s Simple date also lists Fluid Input as a size; that is the Fluid layout.'],
      ['State', 'Enabled · Hover · Focus · Active', '—', 'Focus is the field’s; the kit draws Hover as Enabled. Active is the field with the calendar in use.'],
      ['State', 'Open · Focus + Open · Active + Open', '—', 'The calendar is open.'],
      ['State', 'Error · Warning · Disabled · Read-only', 'errorText, warningText, disabled, readOnly', 'Error and Warning swap the calendar glyph for the status glyph.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Day item', 'Enabled · Hover · Focus · Selected · Today · Day in range · End range hover · Prev/Next month · Disabled', '—', 'Drawn from the date, the selection and the pointer.'],
      ['Placeholder', 'text-helper · text-placeholder', '—', 'The kit uses two colours across the sets; the code uses the field shell’s one.'],
      ['Fluid label', 'Tooltip trigger', '—', 'Not drawn: Text input’s Fluid label stands alone.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the fields' },
      { href: '/docs/components/popover', title: 'Popover', why: 'the overlay surface the calendar shares' },
      { href: '/docs/components/select', title: 'Select', why: 'for a short list of fixed dates' },
    ],
  }
}
