# docs/components/

This folder documents Graphite UI components as they exist in the **Figma kit**. Each file is pulled from that component's Read Me frame in Figma and reflects variants, tokens, and states as of the date it was generated.

## This is not the same thing as docs/contracts/

You'll see matching filenames in both folders (button.md, tabs.md, checkbox.md, popover.md, and others). They answer different questions.

- **docs/contracts/** is canonical. It defines a component's behavior, slots, props, token dependencies, and prohibitions. Code and Figma both implement it. If contracts and Figma ever disagree, contracts win.
- **docs/components/** is descriptive. It's a snapshot of what the Figma kit currently shows: variant names, states, tokens in use. It does not describe the component's public code API.

If you're implementing or consuming a component in code, start with docs/contracts/. If you're working in Figma or checking what the kit currently renders, start here.

## A note on staleness

Files here are regenerated manually, not synced automatically. Two things can make a file in this folder go stale:

1. **Figma changes.** If a component's variants or tokens change in the kit after a doc was generated, the doc won't reflect it until it's regenerated.
2. **Code API changes.** SHADCN-MIGRATION.md tracks components being restructured from slot props to composed children. That's a code-side API change and it is not reflected here. A component doc in this folder can be fully accurate about Figma's current state while describing an API shape the code no longer uses.

When a component's migration lands in SHADCN-MIGRATION.md, flag its file here for regen. No tooling enforces this yet — it's a manual checklist item for now.
