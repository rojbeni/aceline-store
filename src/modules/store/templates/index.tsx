"use client"

import { useCallback, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"

import Filter, { OptionFilterGroup } from "@modules/store/components/filter"
import { PriceBounds, PriceRange } from "@modules/store/components/filter/price-filter"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  countryCode,
  categories,
}: {
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
}) => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({})
  const [optionGroups, setOptionGroups] = useState<OptionFilterGroup[]>([])
  const [priceRange, setPriceRange] = useState<PriceRange>({})
  const [priceBounds, setPriceBounds] = useState<PriceBounds>()

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value)
    setSelectedOptions({})
    setPriceRange({})
  }, [])

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
      categoryId: selectedCategory || undefined,
      options: selectedOptions,
      priceRange,
    }),
    [selectedCategory, selectedOptions, priceRange]
  )

  const categoryOptions = useMemo(
    () => (categories ?? []).map((c) => ({ value: c.id, label: c.name })),
    [categories]
  )

  return (
    <div className="py-6 content-container" data-testid="category-container">
      <div className="flex flex-col small:flex-row small:items-start gap-8">
        <Filter
          categories={categoryOptions}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          optionGroups={optionGroups}
          selectedOptions={selectedOptions}
          onOptionChange={handleOptionChange}
          priceBounds={priceBounds}
          priceRange={priceRange}
          onPriceRangeChange={setPriceRange}
          data-testid="store-filters"
        />
        <PaginatedProducts
          page={1}
          countryCode={countryCode}
          filter={filter}
          onOptionGroupsChange={setOptionGroups}
          onPriceBoundsChange={setPriceBounds}
        />
      </div>
    </div>
  )
}

export default StoreTemplate
