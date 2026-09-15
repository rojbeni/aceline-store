import { Metadata } from "next"

import StoreTemplate from "@modules/store/templates"
import { listCategories } from "@lib/data/categories"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

type Params = {
  params: Promise<{
    countryCode: string
  }>
}

export default async function StorePage(props: Params) {
  const params = await props.params
  const categories = await listCategories()

  return (
    <StoreTemplate countryCode={params.countryCode} categories={categories} />
  )
}
