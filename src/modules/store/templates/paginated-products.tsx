"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { clx, Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { OptionFilterGroup, ProductFilter } from "@modules/store/components/filter"
import { SortOptions } from "@modules/store/components/sort"

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  countryCode: string
  filter?: ProductFilter
  onOptionGroupsChange?: (groups: OptionFilterGroup[]) => void
}

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  filter,
  onOptionGroupsChange,
}: PaginatedProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [region, setRegion] = useState<HttpTypes.StoreRegion>()
  const [isPending, startTransition] = useTransition()

  const categoryId = filter?.categoryId
  const selectedOptions = filter?.options

  useEffect(() => {
    startTransition(async () => {
      const [{ response }, fetchedRegion] = await Promise.all([
        listProductsWithSort({
          page,
          queryParams: {
            limit: 100,
            ...(categoryId && { category_id: [categoryId] }),
          },
          sortBy,
          countryCode,
        }),
        getRegion(countryCode),
      ])

      setProducts(response.products)
      setRegion(fetchedRegion ?? undefined)
    })
  }, [categoryId, sortBy, page, countryCode])

  useEffect(() => {
    if (!onOptionGroupsChange) return

    const valuesByTitle = new Map<string, Set<string>>()
    products.forEach((p) =>
      p.options?.forEach((option) => {
        if (!option.title) return
        const values = valuesByTitle.get(option.title) ?? new Set<string>()
        option.values?.forEach((v) => values.add(v.value))
        valuesByTitle.set(option.title, values)
      })
    )

    onOptionGroupsChange(
      Array.from(valuesByTitle.entries()).map(([title, values]) => ({
        title,
        items: Array.from(values)
          .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
          .map((value) => ({ value, label: value })),
      }))
    )
  }, [products, onOptionGroupsChange])

  const filteredProducts = useMemo(() => {
    const activeFilters = Object.entries(selectedOptions ?? {}).filter(
      ([, value]) => value
    )
    if (activeFilters.length === 0) return products

    return products.filter((p) => {
      const optionTitleById = new Map(
        p.options?.map((option) => [option.id, option.title]) ?? []
      )

      return activeFilters.every(([title, value]) =>
        p.variants?.some((variant) =>
          variant.options?.some(
            (optionValue) =>
              optionValue.value === value &&
              optionTitleById.get(optionValue.option_id ?? "") === title
          )
        )
      )
    })
  }, [products, selectedOptions])

  if ((isPending && products.length === 0) || !region) {
    return <SkeletonProductGrid />
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <Text
          className="text-surface-on-variant text-small-regular"
          data-testid="products-count"
        >
          {filteredProducts.length}{" "}
          {filteredProducts.length === 1 ? "product" : "products"}
        </Text>
      </div>
      {filteredProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-y-1 rounded-large border border-outline-variant bg-surface-container-low px-6 py-24 text-center">
          <Text className="text-surface-on text-base-semi">
            No products found
          </Text>
          <Text className="text-surface-on-variant text-small-regular">
            Try adjusting or clearing your filters.
          </Text>
        </div>
      ) : (
        <ul
          className={clx(
            "grid grid-cols-2 w-full small:grid-cols-4 medium:grid-cols-5 large:grid-cols-6 gap-x-5 gap-y-6 transition-opacity duration-200 ease-out",
            isPending && "opacity-60 pointer-events-none"
          )}
          data-testid="products-list"
        >
          {filteredProducts.map((p) => (
            <li key={p.id}>
              <ProductPreview product={p} region={region} />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
