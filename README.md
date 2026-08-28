# Graphite UI

A design system and the site that documents it. One hex source color resolves
through a perceptual color engine into a complete themed palette, and every
component answers to a written contract that CI checks the code against.

## How it works

**Source-derived theming.** One hex input, resolved in OKLab and sampled at
fixed tone stops into perceptual ramps. Each theme pass emits 45
`--graphite-*` color variables (the canonical surface) plus 56 `--cds-*`
variables as a Carbon compatibility layer. A further 101 variables (spacing,
density, radius, breakpoints, typography, motion, scrim) are declared
statically in `app/globals.scss`, because they do not vary by theme.

**Contract-first components.** Every component has exactly one contract file in
`docs/contracts/`. The contract is canonical: code and Figma both implement it,
neither one defines it. No component code changes without a matching contract
update first, and contracts are versioned with semver.

**Drift checks that gate the build.** `drift-check.mjs` verifies that each
component's code references exactly the token variables its contract declares,
nothing else. `token-drift.mjs` verifies the four foundations (spacing, radius,
breakpoint, typography) against the Figma snapshot. Both run in CI.

## Status

27 component contracts, 27 implementations. Every contract in `docs/contracts/`
has a matching implementation in `components/ui/`.

## Getting started

Requires Node 24 and pnpm 10, the versions CI pins.

```bash
pnpm install
pnpm dev
```

The dev server runs on port 3000 and must run under webpack. Turbopack breaks
on this project's Sass, so `--webpack` is baked into both the `dev` and `build`
scripts. Leave it there.

## Scripts

| Script | What it does |
|---|---|
| `pnpm dev` | Dev server, port 3000, webpack |
| `pnpm build` | Production build, webpack |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm drift-check` | Components against their contracts |
| `pnpm token-drift` | Foundations against the Figma snapshot |
| `pnpm token-drift:test` | Self-test for the token drift checker |
| `pnpm figma-snapshot` | Regenerate `docs/tokens/figma-snapshot.json` |

## Layout

```
app/
  docs/                  # Color essay, pattern guide, glossary
  gallery/               # Each contract's version beside its implementation
  globals.scss           # The 101 static, theme-invariant variables
components/
  ui/                    # The 27 contracted components
  sections/              # Landing page sections
  theme-provider.tsx     # Source of truth for source color, theme, contrast level
  studio.tsx             # Ramp rows, semantic table, states matrix
lib/
  color.js               # The color engine
docs/
  contracts/             # Canonical component contracts, plus foundations/
  components/            # Descriptive snapshots of the Figma kit
  tokens/                # figma-snapshot.json
scripts/                 # Drift checks and Figma extraction
```

## Documentation

- [docs/contracts/README.md](docs/contracts/README.md): governance model, token
  structure reference, and build order. Start here.
- [docs/components/README.md](docs/components/README.md): why the Figma kit docs
  are not the same thing as the contracts.
- [docs/CORE-CONCEPTS.md](docs/CORE-CONCEPTS.md), [docs/color.md](docs/color.md),
  [docs/guidelines.md](docs/guidelines.md),
  [docs/SITE-FUNCTIONS.md](docs/SITE-FUNCTIONS.md).

Note that `docs/contracts/` and `docs/components/` share several filenames and
answer different questions. Contracts define a component's behavior, props and
token dependencies. The component docs describe what the Figma kit currently
renders. If you are writing code, start with the contract.

## CI

[.github/workflows/checks.yml](.github/workflows/checks.yml) runs on every pull
request and every push to `main`: typecheck, drift check, token drift, and the
token drift self-test. Each step runs even if an earlier one failed, because a
contract change typically trips more than one. It deliberately does not run
`next build`, since the Vercel deployment already does that on every PR.

## License

MIT. See [LICENSE](LICENSE). Commercial use included.
