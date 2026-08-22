// Figma variable extraction — the Figma-side half of the snapshot pipeline.
//
// This file is not executed by node. It is the body passed to the Figma MCP
// `use_figma` tool, which evaluates it inside the Figma file with the Plugin
// API available as `figma`. It is checked in so the extraction is reviewable
// and re-runnable rather than living in a chat transcript.
//
//   file  https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo
//
// The REST route (`GET /v1/files/:key/variables/local`) would be simpler, but
// it is gated to Enterprise plans and this file lives on a Pro plan. The
// Plugin API exposes the same data with no plan gate.
//
// Run it once per entry in CHUNKS, hand each returned payload to
// scripts/figma-snapshot.mjs, and it merges them into
// docs/tokens/figma-snapshot.json. Chunking is not optional: the MCP
// transport truncates a large response mid-string, and Graphite Theme alone
// is several times over the limit. The chunk sizes below are the ones
// observed to survive intact, not a round number — a slice that returns
// roughly 20kb or more comes back unparseable. The merge is
// order-independent, so chunk boundaries do not matter as long as every
// chunk lands, and figma-snapshot.mjs fails loudly if one does not.

// Collections in scope, sliced to fit the transport. Everything else in the
// file (Modal, AI, AI presence, AI revert, Data table size, Content switcher)
// is component-level state rather than a foundation token layer, and is
// deliberately excluded.
const CHUNKS = [
  { only: ['Graphite Theme'], offset: 0, limit: 61 },
  { only: ['Graphite Theme'], offset: 61, limit: 61 },
  { only: ['Graphite Theme'], offset: 122, limit: 31 },
  { only: ['Graphite Theme'], offset: 153, limit: 15 },
  { only: ['Graphite Theme'], offset: 168, limit: 15 },
  { only: ['Graphite Semantic'], offset: 0, limit: 44 },
  { only: ['Graphite Semantic'], offset: 44, limit: 43 },
  { only: ['Graphite Primitives'], offset: 0, limit: 80 },
  { only: ['Graphite Typography'], offset: 0, limit: 65 },
  {
    only: [
      'Graphite Layer',
      'Breakpoint',
      'Breakpoint LG–XL',
      'Radius',
      'Spacing',
    ],
    offset: 0,
    limit: 40,
  },
]

// Set to one CHUNKS entry per run.
const { only: ONLY, offset: OFFSET, limit: LIMIT } = CHUNKS[0]

const wanted = new Set(ONLY)

const collections = await figma.variables.getLocalVariableCollectionsAsync()
const variables = await figma.variables.getLocalVariablesAsync()

const collById = new Map(collections.map((c) => [c.id, c]))
const varById = new Map(variables.map((v) => [v.id, v]))

// One variable name in this file contains a literal U+2028 LINE SEPARATOR
// (`Content switcher (low contrast)/content-switcher-<U+2028>background`).
// U+2028 is valid in a JSON string but terminates a line in the MCP's SSE
// transport, so any response carrying it arrives truncated mid-string and
// fails to parse. Escape everything outside printable ASCII on the wire and
// let scripts/figma-snapshot.mjs decode it back, so the snapshot still
// records the true name rather than a sanitised one. Backslash is escaped
// first so decoding is unambiguous.
const safe = (s) =>
  typeof s === 'string'
    ? s
        .replace(/\\/g, '\\\\')
        .replace(
          /[^\x20-\x7E]/g,
          (ch) => '\\u' + ch.charCodeAt(0).toString(16).padStart(4, '0'),
        )
    : s

const hex = (n) =>
  Math.round(n * 255)
    .toString(16)
    .padStart(2, '0')

// Figma stores colour channels as 0-1 floats. Round to 8-bit hex, which is
// what the CSS side consumes; keep the alpha byte only when it is not opaque
// so fully-opaque colours read as plain #rrggbb.
const encodeColor = (c) => {
  const base = '#' + hex(c.r) + hex(c.g) + hex(c.b)
  return c.a === undefined || c.a >= 1 ? base : base + hex(c.a)
}

const encodeRaw = (value, type) =>
  type === 'COLOR' ? encodeColor(value) : safe(value)

// Wire format is deliberately terse — short keys, no repeated boilerplate —
// because the 20kb cap is the binding constraint. scripts/figma-snapshot.mjs
// expands it back into readable long-form keys on disk. A plain value is
// emitted bare; only an alias becomes an object, so `typeof entry === 'object'`
// distinguishes the two without a tag field.
//
//   bare        "#f8f8fc" | 16 | true
//   alias       { a: 'Collection/name', m: <mode>, x: <resolved> }
//   unresolved  { a: 'Collection/name', u: <reason> }
//
// Figma resolves an alias against whichever mode the consuming node sits in,
// which is a property of the node and not of the variable, so there is no
// single correct answer here: match the mode by name across collections when
// the names line up (Light -> Light, Desktop -> Desktop) and fall back to the
// target collection's default mode when they do not. `m` records the fallback
// whenever the target has more than one mode to choose between, so a guessed
// mode is visible in the diff rather than silently baked into a value. A
// single-mode target has no decision to record and omits it.
const resolve = (value, type, modeName, seen) => {
  if (!value || value.type !== 'VARIABLE_ALIAS') return encodeRaw(value, type)

  const target = varById.get(value.id)
  if (!target) return { a: null, u: 'target is not a local variable' }

  const targetColl = collById.get(target.variableCollectionId)
  const a = safe(targetColl.name + '/' + target.name)

  if (seen.has(target.id)) return { a, u: 'alias cycle' }
  seen.add(target.id)

  const mode =
    targetColl.modes.find((m) => m.name === modeName) ||
    targetColl.modes.find((m) => m.modeId === targetColl.defaultModeId)

  const x = resolve(
    target.valuesByMode[mode.modeId],
    target.resolvedType,
    mode.name,
    seen,
  )
  const out = { a, x }
  if (targetColl.modes.length > 1) out.m = mode.name
  return out
}

const payload = collections
  .filter((c) => wanted.has(c.name))
  .map((c) => ({
    n: safe(c.name),
    m: c.modes.map((m) => safe(m.name)),
    d: safe((c.modes.find((m) => m.modeId === c.defaultModeId) || {}).name),
    total: c.variableIds.length,
    o: OFFSET,
    v: c.variableIds
      .slice(OFFSET, OFFSET + LIMIT)
      .map((id) => varById.get(id))
      .filter(Boolean)
      .map((v) => {
        const values = {}
        for (const m of c.modes) {
          values[m.name] = resolve(
            v.valuesByMode[m.modeId],
            v.resolvedType,
            m.name,
            new Set([v.id]),
          )
        }
        return { n: safe(v.name), t: v.resolvedType, v: values }
      }),
  }))

const missing = [...wanted].filter((n) => !payload.some((c) => c.n === n))

return { c: payload, missing }
