"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { clx, Text } from "@modules/common/components/ui"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { OptionFilterGroup, ProductFilter } from "@modules/store/components/filter"
import { PriceBounds } from "@modules/store/components/filter/price-filter"
import { SortOptions } from "@modules/store/components/sort"

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  countryCode: string
  filter?: ProductFilter
  onOptionGroupsChange?: (groups: OptionFilterGroup[]) => void
  onPriceBoundsChange?: (bounds: PriceBounds | undefined) => void
}

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  filter,
  onOptionGroupsChange,
  onPriceBoundsChange,
}: PaginatedProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [region, setRegion] = useState<HttpTypes.StoreRegion>()
  const [isPending, startTransition] = useTransition()

  const categoryId = filter?.categoryId
  const selectedOptions = filter?.options
  const priceRange = filter?.priceRange

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

  const cheapestPriceByProductId = useMemo(() => {
    const map = new Map<string, { amount: number; currencyCode: string }>()
    products.forEach((p) => {
      const cheapest = getProductPrice({ product: p }).cheapestPrice
      if (cheapest) {
        map.set(p.id, {
          amount: cheapest.calculated_price_number,
          currencyCode: cheapest.currency_code,
        })
      }
    })
    return map
  }, [products])

  useEffect(() => {
    if (!onPriceBoundsChange) return

    const amounts = Array.from(cheapestPriceByProductId.values())
    if (amounts.length === 0) {
      onPriceBoundsChange(undefined)
      return
    }

    onPriceBoundsChange({
      min: Math.floor(Math.min(...amounts.map((a) => a.amount))),
      max: Math.ceil(Math.max(...amounts.map((a) => a.amount))),
      currencyCode: amounts[0].currencyCode,
    })
  }, [cheapestPriceByProductId, onPriceBoundsChange])

  const filteredProducts = useMemo(() => {
    const activeOptionFilters = Object.entries(selectedOptions ?? {}).filter(
      ([, value]) => value
    )

    return products.filter((p) => {
      if (activeOptionFilters.length > 0) {
        const optionTitleById = new Map(
          p.options?.map((option) => [option.id, option.title]) ?? []
        )

        const matchesOptions = activeOptionFilters.every(([title, value]) =>
          p.variants?.some((variant) =>
            variant.options?.some(
              (optionValue) =>
                optionValue.value === value &&
                optionTitleById.get(optionValue.option_id ?? "") === title
            )
          )
        )

        if (!matchesOptions) return false
      }

      if (priceRange?.min !== undefined || priceRange?.max !== undefined) {
        const price = cheapestPriceByProductId.get(p.id)?.amount
        if (price === undefined) return false
        if (priceRange.min !== undefined && price < priceRange.min) return false
        if (priceRange.max !== undefined && price > priceRange.max) return false
      }

      return true
    })
  }, [products, selectedOptions, priceRange, cheapestPriceByProductId])

  if ((isPending && products.length === 0) || !region) {
    return <SkeletonProductGrid />
  }

  return (
    <div className="w-full">
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
