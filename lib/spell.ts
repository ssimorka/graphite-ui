const UNDER_TWENTY = [
  'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
  'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen',
  'seventeen', 'eighteen', 'nineteen',
]
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']

/**
 * A count written out, capitalised, for copy that says "Twenty-three components".
 * Copy that quotes a count is derived from the repo, not typed, because the
 * count moves (it went from 22 to 23 with Accordion) and a typed number is the
 * first thing to go stale.
 */
export function spell(n: number): string {
  const s =
    n < 20
      ? UNDER_TWENTY[n]
      : TENS[Math.floor(n / 10)] + (n % 10 ? `-${UNDER_TWENTY[n % 10]}` : '')
  return s.charAt(0).toUpperCase() + s.slice(1)
}
