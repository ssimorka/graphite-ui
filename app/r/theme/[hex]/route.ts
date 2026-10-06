import { themeItem } from '@/lib/registry'

/**
 * GET /r/theme/<hex>.json: the theme file for one source color, as a registry
 * item. `?level=AAA` raises the contrast target. Install it with
 *
 *   npx shadcn@latest add https://www.graphite-ui.com/r/theme/0f766e.json
 *
 * The item is a single registry:file with a target, so it installs without a
 * components.json: a project that only wants the theme needs nothing else.
 */
export async function GET(request: Request, { params }: { params: Promise<{ hex: string }> }) {
  const { hex } = await params
  const level = new URL(request.url).searchParams.get('level') === 'AAA' ? 'AAA' : 'AA'
  const item = hex.endsWith('.json') ? themeItem(hex.slice(0, -5), level) : null
  if (!item) {
    return Response.json(
      { error: 'Use a six-digit hex, like /r/theme/0f766e.json' },
      { status: 404 },
    )
  }
  return Response.json(item)
}
