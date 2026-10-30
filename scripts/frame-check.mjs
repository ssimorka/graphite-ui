// Frame check: simorkadesigns.com can embed the site, and nobody else can.
//
// simorkadesigns.com/graphite-ui shows the site in an iframe. #407 added
// X-Frame-Options: SAMEORIGIN and frame-ancestors 'self' as baseline security
// headers, and the embed went blank with nothing in this repo going red. This
// check makes that a failure.
//
// Two modes, one rule:
//
//   node scripts/frame-check.mjs           reads headers() in next.config.mjs.
//                                          Offline, runs in governance.
//   node scripts/frame-check.mjs --live    fetches the production site and
//                                          reads what it actually sends. Runs
//                                          after every production deploy (see
//                                          .github/workflows/live-headers.yml).
//
// The rule: no X-Frame-Options (it has no allow-list, so any value it can
// take blocks the embed), every Content-Security-Policy's frame-ancestors
// allows 'self' and both simorkadesigns.com origins and nothing wider, and
// the rest of #407's headers are still sent.
//
// Before checking, the rule is run against known good and bad header sets:
// a check that silently stopped failing would pass forever.

import path from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const LIVE_URLS = ['https://www.graphite-ui.com/', 'https://www.graphite-ui.com/docs']

// The embedders, and 'self'. All must be allowed.
const ANCESTORS = ["'self'", 'https://simorkadesigns.com', 'https://www.simorkadesigns.com']

// Sources that would let anyone frame the site.
const TOO_WIDE = ['*', 'https:', 'http:', 'https://*', 'http://*']

// The rest of #407's baseline, which loosening the framing rule must not drop.
const REQUIRED = ['strict-transport-security', 'x-content-type-options', 'referrer-policy', 'permissions-policy']

// headers: a Map of lower-cased name -> array of values (a header can repeat).
function problems(headers) {
  const out = []
  if (headers.has('x-frame-options')) {
    out.push(`X-Frame-Options is sent (${headers.get('x-frame-options').join(', ')}); it blocks the embed whatever its value`)
  }
  // Repeated CSP headers, or one joined with commas, are separate policies,
  // and the browser enforces every one.
  const policies = (headers.get('content-security-policy') ?? []).flatMap((v) => v.split(','))
  const ancestors = policies
    .map((p) => p.split(';').map((d) => d.trim().split(/\s+/)).find(([name]) => name.toLowerCase() === 'frame-ancestors'))
    .filter(Boolean)
    .map(([, ...sources]) => sources)
  if (ancestors.length === 0) out.push('no Content-Security-Policy sets frame-ancestors')
  for (const sources of ancestors) {
    const missing = ANCESTORS.filter((a) => !sources.includes(a))
    if (missing.length) out.push(`frame-ancestors ${sources.join(' ')} does not allow ${missing.join(', ')}`)
    const wide = sources.filter((s) => TOO_WIDE.includes(s))
    if (wide.length) out.push(`frame-ancestors allows ${wide.join(', ')}, which lets any site frame this one`)
  }
  for (const name of REQUIRED) if (!headers.has(name)) out.push(`${name} is no longer sent`)
  return out
}

function headerMap(pairs) {
  const m = new Map()
  for (const [k, v] of pairs) {
    const key = k.toLowerCase()
    m.set(key, [...(m.get(key) ?? []), v])
  }
  return m
}

// ---------------------------------------------------------------- self-test

const BASE = [
  ['Strict-Transport-Security', 'max-age=63072000'],
  ['X-Content-Type-Options', 'nosniff'],
  ['Referrer-Policy', 'strict-origin-when-cross-origin'],
  ['Permissions-Policy', 'camera=()'],
]
const GOOD = `frame-ancestors ${ANCESTORS.join(' ')}`

const CASES = [
  { name: 'the intended headers', pairs: [...BASE, ['Content-Security-Policy', GOOD]], ok: true },
  { name: 'frame-ancestors among other directives', pairs: [...BASE, ['Content-Security-Policy', `default-src 'self'; ${GOOD}`]], ok: true },
  { name: "#407's SAMEORIGIN", pairs: [...BASE, ['X-Frame-Options', 'SAMEORIGIN'], ['Content-Security-Policy', GOOD]], ok: false },
  { name: "#407's frame-ancestors 'self'", pairs: [...BASE, ['Content-Security-Policy', "frame-ancestors 'self'"]], ok: false },
  { name: 'only the apex embedder', pairs: [...BASE, ['Content-Security-Policy', "frame-ancestors 'self' https://simorkadesigns.com"]], ok: false },
  { name: 'no CSP', pairs: BASE, ok: false },
  { name: 'a second, stricter policy', pairs: [...BASE, ['Content-Security-Policy', GOOD], ['Content-Security-Policy', "frame-ancestors 'none'"]], ok: false },
  { name: 'a wildcard', pairs: [...BASE, ['Content-Security-Policy', `${GOOD} *`]], ok: false },
  { name: 'HSTS dropped', pairs: [...BASE.slice(1), ['Content-Security-Policy', GOOD]], ok: false },
]

let failed = false
for (const c of CASES) {
  if ((problems(headerMap(c.pairs)).length === 0) !== c.ok) {
    console.error(`self-test: ${c.name} should ${c.ok ? 'pass' : 'fail'} and does not`)
    failed = true
  }
}
if (failed) process.exit(1)

// ---------------------------------------------------------------- check

const live = process.argv.includes('--live')
const targets = []

if (live) {
  for (const url of LIVE_URLS) {
    const res = await fetch(url, { redirect: 'follow', headers: { 'cache-control': 'no-cache' } })
    if (!res.ok) {
      targets.push({ where: url, found: [`responded ${res.status}`] })
      continue
    }
    // fetch joins repeats with ", "; problems() splits CSP on commas, and a
    // present X-Frame-Options fails whatever it holds.
    targets.push({ where: `${url} (${res.url})`, found: problems(headerMap(res.headers.entries())) })
  }
} else {
  const { default: config } = await import(pathToFileURL(path.join(ROOT, 'next.config.mjs')).href)
  const rules = (await config.headers?.()) ?? []
  // Every route the site serves, the registry included, falls under the
  // catch-all, so that is the rule that has to hold.
  const all = rules.find((r) => r.source === '/:path*')
  if (!all) targets.push({ where: 'next.config.mjs', found: ["headers() has no '/:path*' rule"] })
  else {
    targets.push({ where: "next.config.mjs headers() '/:path*'", found: problems(headerMap(all.headers.map((h) => [h.key, h.value]))) })
    // A narrower rule sending X-Frame-Options or its own CSP would override it
    // for those routes.
    for (const r of rules.filter((x) => x !== all)) {
      const found = problems(headerMap([...all.headers.map((h) => [h.key, h.value]), ...r.headers.map((h) => [h.key, h.value])]))
      if (found.length) targets.push({ where: `next.config.mjs headers() '${r.source}'`, found })
    }
  }
}

for (const t of targets) {
  if (t.found.length === 0) console.log(`ok  ${t.where}`)
  else {
    failed = true
    console.error(`FAIL ${t.where}`)
    for (const f of t.found) console.error(`     ${f}`)
  }
}
if (failed) {
  console.error('\nsimorkadesigns.com/graphite-ui embeds this site. See the header comment in scripts/frame-check.mjs.')
  process.exit(1)
}
console.log(`\nFraming allowed for ${ANCESTORS.join(', ')}; ${CASES.length} self-test cases behave.`)
