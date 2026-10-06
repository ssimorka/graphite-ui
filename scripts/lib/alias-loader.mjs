// Resolve hook: lets a node script import the site's TypeScript modules.
//
// Node 24 strips TypeScript types by itself, but it does not know the `@/`
// alias from tsconfig.json, and its ESM resolver wants file extensions. This
// maps `@/x` to the repo root and tries .ts, .js and /index.ts for
// extensionless paths. Register it with `node --import ./scripts/lib/register-alias.mjs`.
import fs from 'node:fs'
import path from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const ROOT = process.cwd()
const TRY = ['', '.ts', '.js', '.mjs', '/index.ts']

function locate(base) {
  for (const ext of TRY) {
    const p = base + ext
    if (fs.existsSync(p) && fs.statSync(p).isFile()) return p
  }
  return null
}

export async function resolve(specifier, context, next) {
  let base = null
  if (specifier.startsWith('@/')) base = path.join(ROOT, specifier.slice(2))
  else if ((specifier.startsWith('./') || specifier.startsWith('../')) && context.parentURL?.startsWith('file:'))
    base = path.resolve(path.dirname(fileURLToPath(context.parentURL)), specifier)
  if (base) {
    const hit = locate(base)
    if (hit) return next(pathToFileURL(hit).href, context)
  }
  return next(specifier, context)
}
