import type { ComponentDocConfig } from '../types'
import { TimePickerPreview, TimePickerStill } from './time-picker-preview'

export function timePickerDoc(): ComponentDocConfig {
  return {
    slug: 'time-picker',
    name: 'Time picker',
    kitTitle: 'Date picker',
    figmaNode: '17544:268301',
    lede: 'Takes a time of day: typed as hh:mm, with AM or PM and, where it matters, a timezone. Pair it with a Date picker for a date and time, or use it on its own.',
    description:
      'A time field with AM or PM and an optional timezone, in Default at three sizes and in Fluid. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave, from the Date picker page of the kit. Built from Text input and Select.',
    livePreview: <TimePickerPreview />,
    install:
      "import { TimePicker } from '@/components/ui/time-picker'\nimport type { TimeValue } from '@/components/ui/time-picker'",
    anatomy: <TimePickerStill filled />,
    anatomyLede:
      'The label over a row of three, 1 apart: the time typed as hh:mm, a Select for AM or PM, and a Select for the timezone. Each keeps its own name for assistive tech; the label names the group.',
    variantsLede:
      'Default sets the row at 48, 40 or 32. Fluid is one 64px row of boxes with a label inside each and a rule between. Without timezones it is the kit’s two-input form.',
    variants: [
      { label: 'Default: Large', node: <TimePickerStill /> },
      { label: 'Default: Medium', node: <TimePickerStill size="md" /> },
      { label: 'Default: Small', node: <TimePickerStill size="sm" /> },
      { label: 'Default: no timezone', node: <TimePickerStill zones={false} /> },
      { label: 'Fluid', node: <TimePickerStill layout="fluid" /> },
      { label: 'Fluid: 2 inputs', node: <TimePickerStill layout="fluid" zones={false} /> },
    ],
    statesLede:
      'Error and warning flag the time alone, with its status glyph, and put the message under the row; the Selects keep their rest state, as the kit draws them. Disabled and Read-only reach all three.',
    states: [
      { label: 'Enabled', node: <TimePickerStill /> },
      { label: 'Filled', node: <TimePickerStill filled /> },
      { label: 'Error', node: <TimePickerStill status="error" /> },
      { label: 'Warning', node: <TimePickerStill status="warning" filled /> },
      { label: 'Disabled', node: <TimePickerStill status="disabled" /> },
      { label: 'Read-only', node: <TimePickerStill status="read-only" filled /> },
      { label: 'Fluid: Error', node: <TimePickerStill layout="fluid" status="error" /> },
    ],
    dos: [
      'Check the typed time on the page and say what is wrong with errorText.',
      'Offer timezones where the reader and the event may not share one.',
      'Pair it with a Date picker when a date and a time belong together.',
      'Keep the label to what the time is for, such as “Meeting starts”.',
    ],
    donts: [
      'Correct a typed time silently. Say what was wrong.',
      'Offer a timezone that makes no difference.',
      'Restyle the field or the Selects. They are the governed Text input and Select.',
      'Use it for a duration. That is a number, not a time of day.',
    ],
    a11y: [
      ['Roles', 'A labelled group of a text input and one or two native selects, each with its own name (Time, Clock, Timezone).'],
      ['Keyboard', 'Tab moves through the three. The selects open with the keyboard as any native select does.'],
      ['Messages', <>Error and warning text are linked to the time with <code>aria-describedby</code>; an error is announced as it appears.</>],
      ['Focus', 'Each field takes its own focus ring, Text input’s and Select’s.'],
    ],
    parityLede:
      'The kit draws Time picker on its Date picker page: two public sets, Default and Fluid, built from three item sets. The code is one component with a layout.',
    parity: [
      ['Set', 'Time picker - Default · Fluid', 'layout', 'fixed and fluid.'],
      ['Size', 'Large · Medium · Small', 'size', 'Default only: 48, 40 and 32.'],
      ['Inputs', '3 · 2', 'timezones', 'With timezones, three; without, two.'],
      ['State', 'Enabled · Error · Warning · Disabled · Read-only', 'errorText, warningText, disabled, readOnly', 'Error and warning flag the time alone; the time grows from 76 to 101 for its glyph.'],
      ['State', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Items', 'Fixed · Clock · Timezone', '—', 'Text input and two Selects. Their Hover and Focus are the fields’ own.'],
      ['Clock', 'AM · True · False', 'value.period', 'AM or PM.'],
      ['Fluid label', 'Tooltip trigger', '—', 'Not drawn: Text input’s and Select’s Fluid labels stand alone.'],
    ],
    related: [
      { href: '/docs/components/date-picker', title: 'Date picker', why: 'for the date' },
      { href: '/docs/components/text-input', title: 'Text input', why: 'the time field' },
      { href: '/docs/components/select', title: 'Select', why: 'AM or PM and the timezone' },
    ],
  }
}
