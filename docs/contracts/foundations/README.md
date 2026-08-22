# Foundation contracts

The files beside this one are contracts for the four foundations that came out
of the Figma sync (#67): spacing, radius, breakpoint and typography. They are
separated from the component contracts one directory up for two reasons.

**They are not components.** A component contract answers "what is this thing,
what may it be composed with, what may it never do". A foundation contract
answers "where do these numbers come from, in what unit, and what may not be
built on them". There are no slots and no props to describe.

**They have a different checker.** `scripts/drift-check.mjs` reads the
component contracts and verifies each component's code against the roles its
contract declares; it reads only the top level of `docs/contracts/`, so nothing
here changes its output. These are checked by `scripts/token-drift.mjs`
instead, which diffs the declared values against
`docs/tokens/figma-snapshot.json`. Both run per foundation:

```bash
npm run token-drift
```

Governance rules 1–5 in the parent README apply unchanged, with one
substitution: where they say "component" read "foundation", and where rule 4
names the drift check read `token-drift.mjs`.

## Why a contract at all, for a number

Because the numbers now have a source and a set of decisions attached, and
neither survives in a stylesheet comment alone. `--graphite-radius-full` is
`999px` and not `9999px` for a reason; spacing is `rem` and radius is `px` for
a reason; `lg` and `xl` are two tokens rather than one for a reason. Those are
exactly the facts a later reader would otherwise "clean up".
