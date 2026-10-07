# Contributing

Thanks for your interest in contributing to Graphite UI.

Please read this before opening your first pull request, and check the open issues and pull requests to see whether someone is already working on the same thing. If you have a question rather than a change, start a thread in [Discussions](https://github.com/ssimorka/graphite-ui/discussions).

Graphite is governed. Every component answers to a written contract, the Figma kit is the reference those contracts describe, and CI checks the code against both. Most of this guide is about working with that, because it is what makes a contribution here different from most component libraries.

## About this repository

This is one Next.js 16 app: the documentation site, the theme builder and the shadcn registry that installs Graphite into other projects.

- We use [pnpm](https://pnpm.io) 10 and Node 24, the versions CI pins.
- The dev server and the build run under webpack. Turbopack breaks on this project's Sass, so `--webpack` is baked into the `dev` and `build` scripts. Leave it there.
- There is no npm package. Adopters install components as source through the registry served from `app/r`.

## Structure

```
app/
  docs/                  # Docs pages: Use, Foundations, Contribute
    components/[slug]/   # One route renders every component page
  gallery/               # The Components index
  create/                # The theme builder
  r/                     # The shadcn registry (items, themes, index)
  globals.scss           # The static, theme-invariant variables
components/
  ui/                    # The contracted components and the Overlay hook
  component-doc/         # Component page template and per-component configs
  sections/              # Landing page sections
  theme-provider.tsx     # Source of truth for source color, theme and contrast level
lib/
  color.js               # The color engine
  registry.ts            # Builds registry items from the repo on request
docs/
  contracts/             # Component contracts, plus foundations/ and kit/
  components/            # Descriptive snapshots of the Figma kit
  tokens/                # Committed snapshots of the kit's variables and sets
scripts/                 # Governance checks and Figma extraction
```

| Path | Description |
| --- | --- |
| `components/ui` | The components adopters install. One file per contract. |
| `docs/contracts` | One contract per component: props, slots, the roles it may read, its version. |
| `docs/components` | What the Figma kit currently draws. Not the same thing as a contract. |
| `docs/tokens` | Snapshots the checks read, so CI never needs the network. |
| `lib/color.js` | The engine: one hex in, ramps, roles, states and both themes out. |

## Development

### Fork this repo

Fork it with the button in the top right corner of this page.

### Clone on your local machine

```bash
git clone https://github.com/your-username/graphite-ui.git
cd graphite-ui
```

### Create a new branch

```bash
git checkout -b my-new-branch
```

### Install dependencies

```bash
pnpm install
```

### Run the site

```bash
pnpm dev
```

It starts on port 3000, or on the next free port if another checkout already holds 3000. Read the address it prints before you trust what the browser shows you.

## How changes are governed

### Contract first

No component code changes without its contract changing first. A contract in `docs/contracts/` declares the component's props, slots and the `--graphite-*` roles it may read, and carries a semver version. `drift-check` fails if the code reads a role the contract does not declare, or if the component's docblock names a different version.

So a change to a component is usually two edits in one pull request: the contract (with its version bumped) and the code that now matches it.

### The kit wins

Where the Figma kit and a contract disagree, the kit wins and the contract is corrected. Where the kit has no opinion, the code keeps its own. The full rules, including what happens when the kit contradicts itself, are in [docs/contracts/README.md](docs/contracts/README.md).

### One variable prefix

Governed code reads only `--graphite-*` variables. `naming-check` fails on any other prefix anywhere in the repo.

## Checks

`main` is protected. Every change lands through a pull request, and the `governance` job in [.github/workflows/checks.yml](.github/workflows/checks.yml) must pass. Run the same checks locally before you push:

| Script | What it checks |
| --- | --- |
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm drift-check` | Components against their contracts |
| `pnpm token-drift` | Foundations against the Figma snapshot |
| `pnpm token-drift:test` | That the token drift check catches what it claims to |
| `pnpm component-doc-drift` | Kit component sets against `docs/components/` |
| `pnpm component-doc-drift:test` | That the component doc check fails when it should |
| `pnpm naming-check` | That `--graphite-` is the only variable prefix |
| `pnpm registry-check` | That every registry item builds and its dependencies resolve |

Each check reads a committed snapshot, so they run offline. Updating a snapshot from Figma is a manual step for the maintainer; if your change needs one, say so in the pull request.

## Commit convention

Pull requests are squash-merged, so the pull request title becomes the commit. Write it as `Area: what changed`, in sentence case:

- `Button: add a loading state`
- `Docs: fold Get started into the Introduction`
- `Registry: serve the theme at AAA`

Keep one change per pull request. A contract change and the code that follows it are one change.

## Requests for new components

Open a [component request](https://github.com/ssimorka/graphite-ui/issues/new?template=component_request.yml). Graphite decides whether a component should exist with three questions, in order:

1. Does the Figma kit have a counterpart? Then it is built from the kit.
2. Does the kit meet the same need inside something it already governs? Then it is absorbed there rather than added.
3. Does the kit say nothing at all? Then it needs a real use on the site or in an adopter's project to be built.

The request form asks these up front. See "When the kit has nothing" in [docs/contracts/README.md](docs/contracts/README.md).

## Writing copy

User-facing copy uses no em dashes: a colon where the second half explains the first, a comma or full stop where it joins clauses, parentheses for an aside. Code comments are exempt.

## Further reading

- [docs/contracts/README.md](docs/contracts/README.md): the governance rules, the token structure and the build order. Start here.
- [docs/components/README.md](docs/components/README.md): why the kit snapshots in `docs/components/` are not contracts. The two folders share filenames and answer different questions: a contract says what a component may do, a component doc says what the kit draws.
- [docs/CORE-CONCEPTS.md](docs/CORE-CONCEPTS.md), [docs/color.md](docs/color.md), [docs/guidelines.md](docs/guidelines.md) and [docs/SITE-FUNCTIONS.md](docs/SITE-FUNCTIONS.md).
- The [Contribute](https://www.graphite-ui.com/docs/contribute/run-locally) pages on the site cover the same ground with live tables.

## License

By contributing, you agree that your contributions are licensed under the [MIT license](LICENSE).
