import { Metadata } from "next"

import FeaturedProducts from "@modules/home/components/featured-products"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { SortOptions } from "@modules/store/components/sort"
import Hero from "@modules/home/components/hero"
import BentoGrid from "@modules/home/components/bento-grid"
import Philosophy from "@modules/home/components/philosophy"

export const metadata: Metadata = {
  title: "aceline store",
  description:
    "A performant storefront for premium second-hand tennis gear.",
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
      <div className="content-container flex pt-6">
        <Hero />
        <BentoGrid />
      </div>

      {/* <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          <FeaturedProducts collections={collections} region={region} />
        </ul>
      </div> */}
      <Philosophy />
    </>
  )
}


