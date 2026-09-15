"use client"

import { Funnel } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type FilterItem = {
  value: string
  label: string
}

export type ProductFilter = {
  categoryId?: string
  variant?: string
}

type FilterProps = {
  categories: FilterItem[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  variants: FilterItem[]
  selectedVariant: string
  onVariantChange: (value: string) => void
  "data-testid"?: string
}

const Filter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  variants,
  selectedVariant,
  onVariantChange,
  "data-testid": dataTestId,
}: FilterProps) => {
  if (categories.length === 0 && variants.length === 0) {
    return null
  }

  return (
    <div
      className="flex flex-col gap-y-8 p-5 mb-8 rounded-large border border-ui-border-base bg-ui-bg-subtle small:w-64 small:flex-shrink-0 small:sticky small:top-24 small:mb-0"
      data-testid={dataTestId}
    >
      <div className="flex items-center gap-x-2 text-ui-fg-base">
        <Funnel className="w-4 h-4" />
        <Text className="text-sm font-semibold">Filters</Text>
      </div>
      {categories.length > 0 && (
        <FilterRadioGroup
          title="Category"
          items={[{ value: "all", label: "All Categories" }, ...categories]}
          value={selectedCategory || "all"}
          handleChange={(value) =>
            onCategoryChange(value === "all" ? "" : value)
          }
          data-testid="category-filter"
        />
      )}
      {variants.length > 0 && (
        <FilterRadioGroup
          title="Variant"
          items={[{ value: "all", label: "All Variants" }, ...variants]}
          value={selectedVariant || "all"}
          handleChange={(value) =>
            onVariantChange(value === "all" ? "" : value)
          }
          data-testid="variant-filter"
        />
      )}
    </div>
  )
}

export default Filter
