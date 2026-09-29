import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ComponentDocPage } from '@/components/component-doc/component-doc-page'
import { COMPONENT_DOCS } from '@/components/component-doc/registry'

// Every governed component, prerendered. A slug with no config is a 404 rather
// than a page rendered on demand.
export const dynamicParams = false

export function generateStaticParams() {
  return Object.keys(COMPONENT_DOCS).map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const doc = COMPONENT_DOCS[slug]?.()
  if (!doc) return {}
  return {
    title: `${doc.name} · Graphite UI`,
    description: doc.description ?? doc.lede,
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const doc = COMPONENT_DOCS[slug]
  if (!doc) notFound()
  return <ComponentDocPage config={doc()} />
}
