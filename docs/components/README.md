# docs/components/

This folder documents Graphite UI components as they exist in the **Figma kit**. Each file is pulled from that component's Read Me frame in Figma and reflects variants, tokens, and states as of the date it was generated.

## This is not the same thing as docs/contracts/

You'll see matching filenames in both folders (button.md, tabs.md, checkbox.md, popover.md, and others). They answer different questions.

- **The Figma kit is canonical.** If contracts and Figma ever disagree, **Figma wins**, and the contract is corrected to match. (This reversed on 2026-08-28; it previously read "contracts win".)
- **docs/contracts/** defines a component's behavior, slots, props, token dependencies, and prohibitions, and is what the code is checked against by `drift-check`. It is the written spec for the code — but it answers to the kit, not the other way round.
- **docs/components/** is descriptive. It's a snapshot of what the Figma kit currently shows: variant names, geometry, tokens in use. Since the kit is canonical, a disagreement between this folder and a contract means the contract needs correcting.

If you're implementing or consuming a component in code, start with docs/contracts/ for the API. If the two folders disagree about what a component *is*, this folder is closer to the truth, because it is generated from the thing that now decides.

## A note on staleness

Files here are regenerated manually, not synced automatically. Two things can make a file in this folder go stale:

1. **Figma changes.** If a component's variants or tokens change in the kit after a doc was generated, the doc won't reflect it until it's regenerated.
2. **Code API changes.** SHADCN-MIGRATION.md tracks components being restructured from slot props to composed children. That's a code-side API change and it is not reflected here. A component doc in this folder can be fully accurate about Figma's current state while describing an API shape the code no longer uses.

When a component's migration lands in SHADCN-MIGRATION.md, flag its file here for regen.

### What is enforced now

Cause 1 is checked. `scripts/component-doc-drift.mjs` runs in CI and fails the
build when a doc no longer matches the kit:

- every Figma node id a doc cites still resolves to a page or component set,
- every **public** set on a page a doc covers is either named or cited in it,
- every component page in the kit has a doc.

It found eight undocumented sets the day it landed, across `ai-label.md`,
`ai-layer.md`, `ai-explainability-popover.md`, `data-table.md` and
`date-picker.md` — none of which anyone had noticed.

It reads `docs/tokens/figma-components.json`, not Figma, so it runs offline.
That snapshot is the manual half: re-extract with `scripts/component-extract.js`
through the Figma MCP, then merge with `pnpm component-snapshot`. The split is
the same one `token-drift` makes — the snapshot is the reviewable record of the
kit, and a kit change shows up as a diff on it.

Private, underscore-prefixed sets are exempt from the coverage rule. They carry
"Do not edit this component" rather than a spec; see
`docs/contracts/kit/figma-only.md`.

**Cause 2 is still manual.** Nothing compares these docs against the code's API
shape, and this check will not catch a doc that describes props the component
no longer has.
