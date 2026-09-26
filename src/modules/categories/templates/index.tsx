"use client"

import { useCallback, useMemo, useState } from "react"
import { notFound } from "next/navigation"

import InteractiveLink from "@modules/common/components/interactive-link"
import Filter, { OptionFilterGroup } from "@modules/store/components/filter"
import { PriceBounds, PriceRange } from "@modules/store/components/filter/price-filter"
import ProductSort, { SortOptions } from "@modules/store/components/sort"
import PaginatedProducts, {
  ProductGridData,
} from "@modules/store/templates/paginated-products"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

export default function CategoryTemplate({
  category,
  sortBy,
  page,
  countryCode,
  initialData,
}: {
  category: HttpTypes.StoreProductCategory
  sortBy?: SortOptions
  page?: string
  countryCode: string
  initialData?: ProductGridData
}) {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [optionGroups, setOptionGroups] = useState<OptionFilterGroup[]>([])
  const [priceRange, setPriceRange] = useState<PriceRange>({})
  const [priceBounds, setPriceBounds] = useState<PriceBounds>()

  const handleOptionChange = useCallback((title: string, value: string) => {
    setSelectedOptions((prev) => {
      if (!value) {
        const { [title]: _removed, ...rest } = prev
        return rest
      }
      return { ...prev, [title]: value }
    })
  }, [])

  const filter = useMemo(
    () => ({
      categoryId: category?.id,
      options: selectedOptions,
      priceRange,
    }),
    [category?.id, selectedOptions, priceRange]
  )

  if (!category || !countryCode) notFound()

  const parents = [] as HttpTypes.StoreProductCategory[]

  const getParents = (category: HttpTypes.StoreProductCategory) => {
    if (category.parent_category) {
      parents.push(category.parent_category)
      getParents(category.parent_category)
    }
  }

  getParents(category)

  return (
    <div
      className="py-6 content-container"
      data-testid="category-container"
    >
      <div className="w-full">
        <div className="flex flex-col small:flex-row small:items-center justify-between mb-8 gap-4">
          <div className="flex flex-row text-2xl-semi gap-4">
            {parents &&
              parents.map((parent) => (
                <span key={parent.id} className="text-ui-fg-subtle">
                  <LocalizedClientLink
                    className="mr-4 hover:text-black"
                    href={`/categories/${parent.handle}`}
                    data-testid="sort-by-link"
                  >
                    {parent.name}
                  </LocalizedClientLink>
                  /
                </span>
              ))}
            <h1 data-testid="category-page-title">{category.name}</h1>
          </div>
          <ProductSort sortBy={sort} />
        </div>
        {category.description && (
          <div className="mb-8 text-base-regular">
            <p>{category.description}</p>
          </div>
        )}
        {category.category_children && category.category_children.length > 0 && (
          <div className="mb-8 text-base-large">
            <ul className="grid grid-cols-1 gap-2">
              {category.category_children?.map((c) => (
                <li key={c.id}>
                  <InteractiveLink href={`/categories/${c.handle}`}>
                    {c.name}
                  </InteractiveLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-col small:flex-row small:items-start gap-8">
          <Filter
            categories={[]}
            selectedCategory=""
            onCategoryChange={() => {}}
            optionGroups={optionGroups}
            selectedOptions={selectedOptions}
            onOptionChange={handleOptionChange}
            priceBounds={priceBounds}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            data-testid="category-filters"
          />
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            filter={filter}
            initialData={initialData}
            onOptionGroupsChange={setOptionGroups}
            onPriceBoundsChange={setPriceBounds}
          />
        </div>
      </div>
    </div>
  )
}
