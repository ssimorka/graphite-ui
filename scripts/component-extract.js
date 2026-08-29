// Figma component-page extraction — the Figma-side half of the component
// snapshot pipeline, and the sibling of scripts/figma-extract.js.
//
// Like that file, this is not executed by node. It is the body passed to the
// Figma MCP `use_figma` tool, which evaluates it inside the Figma file with
// the Plugin API available as `figma`. It is checked in so the extraction is
// reviewable and re-runnable rather than living in a chat transcript.
//
//   file  https://www.figma.com/design/p2jyUgkFhJd6A5M7L39Ixo
//
// Where figma-extract.js captures the variable collections, this captures the
// component pages: every COMPONENT_SET and every top-level COMPONENT, with its
// variant count and node id. scripts/component-doc-drift.mjs checks
// docs/components/*.md against the result.
//
// Run it once per entry in CHUNKS, hand each returned payload to
// scripts/component-snapshot.mjs, and it merges them into
// docs/tokens/figma-components.json.
//
// Two notes on how this reads pages, both of which cost a rewrite to learn:
//
//   `page.loadAsync()` is what makes the chunking cheap. Pages load
//   incrementally, and the obvious approach — `setCurrentPageAsync` per page —
//   is capped at one page per `use_figma` call, which would make this 45
//   calls. loadAsync carries no such limit, so a chunk can cover a dozen-plus
//   pages. `figma.loadAllPagesAsync()` would be simpler still and is not
//   supported by the MCP tool.
//
//   Variants of a COMPONENT_SET are COMPONENT nodes, so an unfiltered
//   findAllWithCriteria double-counts every set. The parent check below is
//   what keeps a 258-variant Button from arriving as 259 rows.

// The kit's 45 component pages, split into chunks that survive the MCP
// transport intact. The split is by size, not meaning: chunk 1 is the 18
// pages a contract governs and chunks 2-3 are the 27 it does not, which
// happens to be a convenient boundary but is not a load-bearing one. The
// merge is order-independent.
const CHUNKS = [
  // Governed — one contract each.
  ['0:1', '17:0', '435:1', '467:0', '395:4', '5564:279849', '443:23',
   '136:10048', '464:14848', '31107:3280', '505:0', '8930:400384', '500:0',
   '8705:400369', '410:13792', '24:0', '16193:269966', '481:0'],
  // Ungoverned — see docs/contracts/kit/figma-only.md.
  ['31107:3281', '366:0', '351:58', '3556:37675', '453:14562', '14032:290630',
   '60:0', '346:0', '456:14680', '474:15004', '490:11', '11800:284738',
   '68:3091', '2258:13866'],
  ['539:0', '2258:13915', '370:0', '521:16785', '8996:400548', '494:0',
   '369:0', '404:0', '31:2385', '35:2542', '51447:1896', '51447:122450',
   '57561:170'],
]

// Set CHUNK to the index being extracted, then run.
const CHUNK = 0

const out = []
for (const id of CHUNKS[CHUNK]) {
  const page = await figma.getNodeByIdAsync(id)
  if (!page) {
    out.push({ id, error: 'missing' })
    continue
  }
  await page.loadAsync()
  const sets = []
  for (const n of page.findAllWithCriteria({ types: ['COMPONENT_SET', 'COMPONENT'] })) {
    if (n.type === 'COMPONENT_SET') sets.push([n.name, n.children.length, n.id])
    // A COMPONENT whose parent is a COMPONENT_SET is one of its variants, and
    // is already counted above.
    else if (!n.parent || n.parent.type !== 'COMPONENT_SET') sets.push([n.name, 1, n.id])
  }
  out.push({ id, page: page.name, sets })
}
return out
