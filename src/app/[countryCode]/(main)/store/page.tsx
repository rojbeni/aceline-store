import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import { listCategories } from "@lib/data/categories"
import { listProductGrid } from "@lib/data/products"
import { buildAlternates } from "@lib/util/seo"

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: "Shop All Second-Hand Tennis Gear",
    description:
      "Browse every authenticated, second-hand racket, shoe and apparel piece at Aceline Store — inspected, sustainable, and priced for players.",
    alternates: await buildAlternates(countryCode, "/store"),
  }
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const [categories, initialData] = await Promise.all([
    // Only the category filter chips need these; the default fields include
    // every product, which would be serialized into the page.
    listCategories({ fields: "id,name" }),
    listProductGrid({ countryCode: params.countryCode }),
  ])

  return (
    <StoreTemplate
      countryCode={params.countryCode}
      categories={categories}
      initialData={initialData}
    />
  )
}
