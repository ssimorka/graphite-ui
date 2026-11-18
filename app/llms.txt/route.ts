import { DOCS_NAV } from '@/components/docs-nav'

/**
 * /llms.txt, the llmstxt.org format: what Graphite UI is, how to install it
 * and where each docs page is, for AI assistants answering a developer.
 * Built from the docs sidebar, so a page added to the nav is listed here
 * without a second edit, as the sitemap is.
 */
const ORIGIN = 'https://www.graphite-ui.com'

export const dynamic = 'force-static'

export function GET() {
  const sections = DOCS_NAV.map(
    (group) =>
      `## ${group.label}\n\n` +
      group.items
        .filter((i) => i.href.startsWith('/'))
        .map((i) => `- [${i.label}](${ORIGIN}${i.href})`)
        .join('\n'),
  ).join('\n\n')

  const body = `# Graphite UI

> One color, a whole theme. Pick a source color and Graphite builds the color scales, the named roles and both light and dark themes, checking contrast as it goes. React components read those roles, each held by CI to a written contract and to the Figma kit. MIT licensed.

Components install as source files you own, through a shadcn-compatible registry, the way shadcn/ui works. There is no npm package.

Set up a Next.js project with Tailwind, then add the init item, a theme for your source color (any 6-digit hex, here 0f766e) and the Tailwind bridge:

\`\`\`bash
npx shadcn@latest add ${ORIGIN}/r/init.json ${ORIGIN}/r/theme/0f766e.json ${ORIGIN}/r/tailwind.json
\`\`\`

Then add components by name:

\`\`\`bash
npx shadcn@latest add ${ORIGIN}/r/button.json
\`\`\`

Build a theme visually in [Create](${ORIGIN}/create) and take the code. Source: [GitHub](https://github.com/ssimorka/graphite-ui).

${sections}

## Optional

- [Create: theme builder](${ORIGIN}/create)
- [Component gallery](${ORIGIN}/gallery)
- [Sitemap](${ORIGIN}/sitemap.xml)
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
