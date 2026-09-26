import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/sort"
import Hero from "@modules/home/components/hero"
import BentoGrid from "@modules/home/components/bento-grid"
import Philosophy from "@modules/home/components/philosophy"
import JsonLd from "@modules/common/components/json-ld"
import { buildAlternates, DEFAULT_DESCRIPTION, SITE_NAME } from "@lib/util/seo"
import { getSiteJsonLd } from "@lib/util/structured-data"

export async function generateMetadata(props: {
  params: Promise<{ countryCode: string }>
}): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: {
      absolute: `${SITE_NAME} | Premium Second-Hand Tennis Gear`,
    },
    description: DEFAULT_DESCRIPTION,
    alternates: await buildAlternates(countryCode),
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
    category?: string
  }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)
  const { collections } = await listCollections({ fields: "id, handle, title", })
  if (!collections || !region) {
    return null
  }

  return (
    <>
      <JsonLd data={getSiteJsonLd(countryCode)} />
      <Hero />

      <div className="content-container py-12">
        <BentoGrid />
      </div>

      <ul className="flex flex-col">
        <FeaturedProducts collections={collections} region={region} />
      </ul>
      <Philosophy />
    </>
  )
}


