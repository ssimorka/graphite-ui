// How the source color was last set, for the `theme_created` event's `method`.
//
// The theme provider's setSourceHex takes only a hex, and changing its
// signature would change the provider the registry ships. So each control that
// sets the color notes how, just before it sets it, and Create's tracker
// (components/create/kit-cta.tsx) takes the note when it sees the color
// change. The color itself is never recorded.

export type ColorMethod =
  /** Dragging the header picker's pad or hue slider. */
  | 'picker'
  /** Typing a hex, in the header picker or in Create's source field. */
  | 'hex'
  /** Surprise me, in the header or in Create, and Create's Pick. */
  | 'surprise'
  /** Back to the default color. Not a choice, so it is never reported. */
  | 'reset'

let pending: ColorMethod | null = null

export function noteColorMethod(method: ColorMethod) {
  pending = method
}

/** The last note, cleared on read. Null when nothing noted the change. */
export function takeColorMethod(): ColorMethod | null {
  const method = pending
  pending = null
  return method
}
