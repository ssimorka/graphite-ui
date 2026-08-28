/**
 * Supporting-text resolution for form components.
 *
 * This was Field's job. Field is gone — the kit has no field wrapper, it builds
 * label and supporting text into each form component — so the one piece of
 * Field worth keeping is the rule that error text and error state are derived
 * from the same value, and therefore cannot be shown apart.
 *
 * A plain function in lib/ rather than a component: it renders nothing, so it
 * needs no contract, the same reasoning that keeps `cn` here.
 */
export type FieldMessage = {
  /** True when errorText was supplied. */
  errored: boolean
  /** Id for the message element, for the control's aria-describedby. */
  messageId: string
  /** The text to render, error taking precedence over help. */
  message: string | undefined
  /** Whether a message element should be rendered at all. */
  describedBy: string | undefined
}

export function fieldMessage(
  id: string,
  helpText?: string,
  errorText?: string,
): FieldMessage {
  const errored = Boolean(errorText)
  const message = errorText ?? helpText
  const messageId = `${id}-message`
  return {
    errored,
    messageId,
    message,
    describedBy: message ? messageId : undefined,
  }
}
