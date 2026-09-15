import { Suspense } from "react"
import { HttpTypes } from "@medusajs/types"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import ProductSort, { SortOptions } from "@modules/store/components/sort"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  sortBy,
  page,
  categoryId,
  categories,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  categoryId?: string
  categories?: HttpTypes.StoreProductCategory[]
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const activeCategory = categories?.find((c) => c.id === categoryId)
  const title = activeCategory ? activeCategory.name : "All products"

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        categories={categories}
        categoryId={categoryId}
      />
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-8 gap-4">
          <h1 data-testid="store-page-title" className="text-2xl-semi">{title}</h1>
          <ProductSort sortBy={sort} />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            categoryId={categoryId}
            countryCode={countryCode}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
