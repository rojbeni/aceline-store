"use client"

import { useCallback, useMemo, useState } from "react"
import { HttpTypes } from "@medusajs/types"

import Filter, { FilterItem } from "@modules/store/components/filter"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = ({
  countryCode,
  categories,
}: {
  countryCode: string
  categories?: HttpTypes.StoreProductCategory[]
}) => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [selectedVariant, setSelectedVariant] = useState("")
  const [variantOptions, setVariantOptions] = useState<FilterItem[]>([])

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value)
    setSelectedVariant("")
  }, [])

  const filter = useMemo(
    () => ({
      categoryId: selectedCategory || undefined,
      variant: selectedVariant || undefined,
    }),
    [selectedCategory, selectedVariant]
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
          variants={variantOptions}
          selectedVariant={selectedVariant}
          onVariantChange={setSelectedVariant}
          data-testid="store-filters"
        />
        <PaginatedProducts
          page={1}
          countryCode={countryCode}
          filter={filter}
          onVariantsChange={setVariantOptions}
        />
      </div>
    </div>
  )
}

export default StoreTemplate
