import ProductSort, { SortOptions } from "@modules/store/components/sort"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { HttpTypes } from "@medusajs/types"

export default function CollectionTemplate({
  sortBy,
  collection,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  collection: HttpTypes.StoreCollection
  page?: string
  countryCode: string
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  return (
    <div className="py-6 content-container">
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-8 gap-4">
          <h1 className="text-2xl-semi">{collection.title}</h1>
          <ProductSort sortBy={sort} />
        </div>
        <PaginatedProducts
          sortBy={sort}
          page={pageNumber}
          countryCode={countryCode}
        />
      </div>
    </div>
  )
}
