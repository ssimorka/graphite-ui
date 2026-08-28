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

When a component's migration lands in SHADCN-MIGRATION.md, flag its file here for regen. No tooling enforces this yet — it's a manual checklist item for now.
