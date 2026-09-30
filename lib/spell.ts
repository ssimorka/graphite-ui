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
function words(n: number): string {
  if (n < 20) return UNDER_TWENTY[n]
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? `-${UNDER_TWENTY[n % 10]}` : '')
  if (n < 1000) {
    const rest = n % 100
    return `${UNDER_TWENTY[Math.floor(n / 100)]} hundred${rest ? ` and ${words(rest)}` : ''}`
  }
  // Past the hundreds, a written-out number stops reading as a count.
  return n.toLocaleString('en-US')
}

export function spell(n: number): string {
  // Negative or fractional counts have no written form here; show the digits.
  if (!Number.isInteger(n) || n < 0) return String(n)
  const s = words(n)
  return s.charAt(0).toUpperCase() + s.slice(1)
}
