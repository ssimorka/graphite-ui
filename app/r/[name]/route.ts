import { registryItem, registryNames } from '@/lib/registry'

/**
 * GET /r/<name>.json: one registry item, for `npx shadcn add`.
 *
 * Built from the repo on request rather than committed as JSON, so an item is
 * always the component as it is on main. Dependencies point back at this same
 * origin, so a preview deployment installs from itself.
 */
export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params
  const base = `${new URL(request.url).origin}/r`

  if (name === 'index.json') {
    return Response.json({
      name: 'graphite',
      homepage: new URL(request.url).origin,
      items: registryNames().map((n) => ({ name: n, url: `${base}/${n}.json` })),
    })
  }

  const item = name.endsWith('.json') ? registryItem(name.slice(0, -5), base) : null
  if (!item) return Response.json({ error: `No registry item named ${name}` }, { status: 404 })
  return Response.json(item)
}
