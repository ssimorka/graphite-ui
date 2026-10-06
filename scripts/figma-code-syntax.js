// Figma code syntax extraction — what Dev Mode shows a developer.
//
// Like scripts/figma-extract.js, this is not executed by node. It is the body
// passed to the Figma MCP `use_figma` tool against the kit:
//
//   file  https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo
//
// It returns every in-scope variable's WEB code syntax, the snippet Dev Mode
// prints when someone inspects a node bound to that variable. Save the result
// as docs/tokens/figma-code-syntax.json (it is already in that file's shape,
// sorted, so a re-run against an unchanged kit is byte-identical).
//
// Kept apart from figma-snapshot.json on purpose: that snapshot is ten chunks
// wide and its pipeline is tuned to the transport limit, while this is one
// small call. token-drift checks every entry names a variable the code really
// declares, and naming-check scans the file like any other.
//
// Why this exists: on 2026-10-06 the kit's Graphite Semantic variables still
// showed Dev Mode the engine's retired export prefix, which the repo had
// removed, with nine names that differed from the code outright (error where
// the code says danger). Nothing in CI could see it, because the variable
// snapshot does not record code syntax.

const IN_SCOPE = [
  'Graphite Theme',
  'Graphite Semantic',
  'Graphite Primitives',
  'Graphite Typography',
  'Graphite Layer',
  'Breakpoint',
  'Breakpoint LG–XL',
  'Radius',
  'Spacing',
]

const byCodeUnit = (a, b) => (a < b ? -1 : a > b ? 1 : 0)

const collections = {}
for (const c of await figma.variables.getLocalVariableCollectionsAsync()) {
  if (!IN_SCOPE.includes(c.name)) continue
  const entries = []
  for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id)
    const web = v && v.codeSyntax && v.codeSyntax.WEB
    if (web) entries.push([v.name, web])
  }
  if (entries.length) {
    entries.sort((a, b) => byCodeUnit(a[0], b[0]))
    collections[c.name] = Object.fromEntries(entries)
  }
}

const sorted = Object.fromEntries(
  Object.keys(collections)
    .sort(byCodeUnit)
    .map((k) => [k, collections[k]]),
)

return {
  source: {
    fileKey: 'p2jyUgkFhJd6A5M7L39Ixo',
    file: 'https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo',
  },
  platform: 'WEB',
  collections: sorted,
}
