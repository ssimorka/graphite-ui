/**
 * Where the registry lives, for copy that shows an install command. A plain
 * module, so client components (Create's Get the code) can import it too.
 */
export const REGISTRY_URL = 'https://www.graphite-ui.com/r'

/** The command that installs registry items, by name or theme path. */
export const shadcnAdd = (...items: string[]) =>
  `npx shadcn@latest add ${items.map((i) => `${REGISTRY_URL}/${i}.json`).join(' ')}`
