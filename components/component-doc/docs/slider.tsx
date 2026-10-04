import type { ComponentDocConfig } from '../types'
import styles from './slider.module.scss'
import { SliderPreview, SliderStill } from './slider-preview'

export function sliderDoc(): ComponentDocConfig {
  return {
    slug: 'slider',
    name: 'Slider',
    kitTitle: 'Slider',
    figmaNode: '3673:40574',
    lede: 'Sets a value, or a range of values, by moving a handle along a track, with an input beside it for an exact number. Use it where the position in the range matters as much as the number.',
    description:
      'A single-value slider and a two-handle range, with value inputs, bounds and a middle tick. Anatomy, variants, states, API, tokens and accessibility, generated from the contract.',
    tocNote: 'New in #240’s first wave. The value inputs are the governed Text input.',
    livePreview: <SliderPreview />,
    install: "import { Slider } from '@/components/ui/slider'",
    anatomy: <SliderStill />,
    anatomyLede:
      'The label, then the minimum, the track and the maximum, and a Text input for the exact value, 16 from the track. The track is a 2px rail with the part below the value filled, a small tick at the middle and a round handle.',
    variantsLede:
      'Slider - Range has a handle each side, pointing in, and an input for each value. Without inputs, a range shows each value in a bubble over its handle while it is hovered, focused or pressed.',
    variants: [
      { label: 'Slider', node: <SliderStill /> },
      { label: 'Slider: no input', node: <SliderStill inputs={false} /> },
      { label: 'Slider - Range', node: <SliderStill kind="range" /> },
      { label: 'Slider - Range: no inputs', node: <SliderStill kind="range" inputs={false} /> },
    ],
    statesLede:
      'Hover grows the handle from 14 to 20. Focus turns the handle and the fill primary; pressing adds a ring. Error and warning reach the value inputs and put their message under the row. Read-only drops the handle and the tick.',
    states: [
      { label: 'Enabled', node: <SliderStill /> },
      { label: 'Hover', node: <SliderStill />, className: styles.forceHover },
      { label: 'Focus', node: <SliderStill />, className: styles.forceFocus },
      { label: 'Error', node: <SliderStill status="error" /> },
      { label: 'Warning', node: <SliderStill status="warning" /> },
      { label: 'Disabled', node: <SliderStill status="disabled" /> },
      { label: 'Read-only', node: <SliderStill status="read-only" /> },
      { label: 'Range: Disabled', node: <SliderStill kind="range" status="disabled" /> },
      { label: 'Range: Read-only', node: <SliderStill kind="range" status="read-only" /> },
    ],
    dos: [
      'Give it a label that names the value, such as “Opacity” or “Price range”.',
      'Keep the value inputs where an exact number matters; they are on by default.',
      'Use the range form to choose a band between two values.',
      'Say in the error text what the allowed range is.',
    ],
    donts: [
      'Use a slider for a few discrete options. That is a Radio button group.',
      'Hide the bounds. They tell the reader what the ends of the track mean.',
      'Use it where only the exact number matters. That is a Text input.',
      'Restyle the value inputs. They are the governed Text input.',
    ],
    a11y: [
      ['Roles', <>A labelled group. Each handle is a native <code>input type=&quot;range&quot;</code>, so its role, value and range are announced by the platform. A range names its handles “minimum” and “maximum” from the label.</>],
      ['Keyboard', 'Arrow keys step by step; Page Up and Page Down by larger steps; Home and End go to the ends. The two range handles cannot cross.'],
      ['Inputs', 'Each value input is named from the label, with the label hidden. Typing commits a value in range; leaving the field snaps to the nearest allowed value.'],
      ['Focus', <>The handle grows and turns <code>--graphite-primary</code>, with the fill; a range handle takes a 1px <code>--graphite-primary-focus</code> ring.</>],
      ['Read-only', <>The handles stay focusable and report <code>aria-readonly</code>, but do not move.</>],
    ],
    parityLede:
      'The kit’s Slider page has two public sets, Slider and Slider - Range. The code is one component: a number is a Slider, a tuple is a range.',
    parity: [
      ['Set', 'Slider · Slider - Range', 'value', 'A number or a two-item tuple.'],
      ['Inputs', 'True · False', 'showInputs', 'Range only in the kit; the code lets a single slider drop its input too. Off, a range shows its values in bubbles.'],
      ['Status', 'Enabled · Hover · Focus · Active', '—', 'Pseudo-classes of the native input (governance rule 7).'],
      ['Status', 'Error · Warning', 'errorText, warningText', 'The value inputs take the state; the message goes under the row.'],
      ['Status', 'Disabled · Read-only', 'disabled, readOnly', 'Read-only drops the handle and the tick, as the kit draws it.'],
      ['Status', 'Skeleton', '—', 'No counterpart by rule.'],
      ['Handle', 'None · Left · Right', '—', 'Which range handle is in play: the one under the pointer or focus.'],
      ['Width', '288 input, 61 rail', '—', 'The Slider set’s input hugs at 288 and squeezes its rail. The code uses the Range set’s 96 for every value input.'],
    ],
    related: [
      { href: '/docs/components/text-input', title: 'Text input', why: 'the value inputs' },
      { href: '/docs/components/radio-button-group', title: 'Radio button group', why: 'for a few discrete options' },
      { href: '/docs/components/tooltip', title: 'Tooltip', why: 'the value bubble’s look' },
    ],
  }
}
