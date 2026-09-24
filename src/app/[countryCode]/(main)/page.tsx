import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/sort"
import Hero from "@modules/home/components/hero"
import BentoGrid from "@modules/home/components/bento-grid"
import Philosophy from "@modules/home/components/philosophy"

export const metadata: Metadata = {
  title: {
    absolute: "Aceline Store | Premium Second-Hand Tennis Gear",
  },
  description:
    "Shop authenticated, second-hand tennis gear from Nike, Wilson, Asics and more — inspected, sustainable, and priced for players.",
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


