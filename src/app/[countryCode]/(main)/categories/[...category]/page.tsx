import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { buildAlternates } from "@lib/util/seo"
import { getBreadcrumbJsonLd } from "@lib/util/structured-data"
import { HttpTypes, StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import JsonLd from "@modules/common/components/json-ld"
import { SortOptions } from "@modules/store/components/sort"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: HttpTypes.StoreProductCategory) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: string) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    const productCategory = await getCategoryByHandle(params.category)
    const title = productCategory.name
    const description =
      productCategory.description ||
      `Shop second-hand ${title} at Aceline Store — authenticated, inspected and priced for players.`

    return {
      title,
      description,
      alternates: await buildAlternates(
        params.countryCode,
        `/categories/${params.category.join("/")}`
      ),
    }
  } catch {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  const productCategory = await getCategoryByHandle(params.category)

  if (!productCategory) {
    notFound()
  }

  const parent = productCategory.parent_category

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(params.countryCode, [
          parent
            ? { name: parent.name, path: `/categories/${parent.handle}` }
            : { name: "Store", path: "/store" },
          {
            name: productCategory.name,
            path: `/categories/${params.category.join("/")}`,
          },
        ])}
      />
      <CategoryTemplate
        category={productCategory}
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
      />
    </>
  )
}
