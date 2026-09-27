import { listProductGrid } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/sort"

type CategoryPageContentProps = {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
}

/**
 * Fetches the first page of the category's grid, then renders the template.
 * Rendered inside the route's <Suspense> *after* the route has confirmed the
 * category exists — a route-level loading.tsx would start streaming a 200
 * before notFound() could set the 404 status.
 */
export default async function CategoryPageContent({
  category,
  sortBy,
  page,
  countryCode,
}: CategoryPageContentProps) {
  const initialData = await listProductGrid({
    page: page ? parseInt(page) : 1,
    sortBy: sortBy || "created_at",
    countryCode,
    categoryId: category.id,
  })

  return (
    <CategoryTemplate
      category={category}
      sortBy={sortBy}
      page={page}
      countryCode={countryCode}
      initialData={initialData}
    />
  )
}
