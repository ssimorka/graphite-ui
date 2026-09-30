import type { SearchEntry } from '@/lib/search-index'

export type SearchHit = {
  entry: SearchEntry
  snippet: string
  /** How well it matched, per query word, so matches on different queries compare. */
  score?: number
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

/** How well one query word fits one field: whole, prefix, start of a word, anywhere. */
function fit(field: string, word: string, whole: number, prefix: number, wordStart: number, inside: number) {
  if (!field) return 0
  if (field === word) return whole
  if (field.startsWith(word)) return prefix
  if (field.includes(` ${word}`) || field.includes(`-${word}`)) return wordStart
  // Mid-word matches only for longer words: "aria" should not find vARIAnts.
  if (word.length >= 5 && field.includes(word)) return inside
  return 0
}

function snippetOf(text: string, words: string[]) {
  if (!text) return ''
  const lower = norm(text)
  const at = words.map((w) => lower.indexOf(w)).filter((i) => i >= 0).sort((a, b) => a - b)[0]
  if (at === undefined || at < 60) return text.length > 140 ? `${text.slice(0, 140).trimEnd()}…` : text
  const start = text.lastIndexOf(' ', at - 40) + 1
  const out = text.slice(start, start + 140).trimEnd()
  return `…${out}${start + 140 < text.length ? '…' : ''}`
}

/**
 * Rank the index for a query. Every word has to land somewhere; a word in the
 * page's name counts most, then the section's name, then an exact prop, slot or
 * token name, then the prose. A section is filed under its page, so its page's
 * name counts for less there: "button" should find the Button page first, not
 * eleven of its sections.
 */
export function search(entries: SearchEntry[], query: string, limit = 12): SearchHit[] {
  const words = norm(query).split(/\s+/).filter(Boolean)
  if (!words.length) return []

  const scored: { entry: SearchEntry; score: number }[] = []
  for (const entry of entries) {
    const page = norm(entry.page)
    const section = norm(entry.section)
    const keywords = entry.keywords.map(norm)
    const text = norm(entry.text)
    const isPage = !entry.section

    let score = 0
    let all = true
    for (const w of words) {
      const onPage = fit(page, w, 40, 25, 15, 8) * (isPage ? 1 : 0.3)
      const onSection = fit(section, w, 20, 14, 10, 5)
      const onKeyword = Math.max(0, ...keywords.map((k) => fit(k, w, 12, 8, 6, 3)))
      const onText = fit(text, w, 2, 2, 2, 1)
      const best = onPage + onSection + onKeyword + onText
      if (best === 0) {
        all = false
        break
      }
      score += best
    }
    if (all) scored.push({ entry, score: score + (isPage ? 3 : 0) })
  }

  return scored
    .sort((a, b) => b.score - a.score || a.entry.page.localeCompare(b.entry.page))
    .slice(0, limit)
    .map(({ entry, score }) => {
      // Jump the snippet to a match only for words the title did not already
      // show. A hit on "Color ramps" should open on its first line, not on
      // wherever "color" next appears in the prose.
      const named = norm(`${entry.page} ${entry.section}`)
      const rest = words.filter((w) => !named.includes(w))
      return { entry, snippet: snippetOf(entry.text, rest), score: score / words.length }
    })
}
