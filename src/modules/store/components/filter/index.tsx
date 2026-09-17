"use client"

import { Funnel } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import FilterRadioGroup from "@modules/common/components/filter-radio-group"

export type FilterItem = {
  value: string
  label: string
}

export type OptionFilterGroup = {
  title: string
  items: FilterItem[]
}

export type ProductFilter = {
  categoryId?: string
  options?: Record<string, string>
}

type FilterProps = {
  categories: FilterItem[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  optionGroups: OptionFilterGroup[]
  selectedOptions: Record<string, string>
  onOptionChange: (title: string, value: string) => void
  "data-testid"?: string
}

const Filter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  optionGroups,
  selectedOptions,
  onOptionChange,
  "data-testid": dataTestId,
}: FilterProps) => {
  if (categories.length === 0 && optionGroups.length === 0) {
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
      {optionGroups.map((group) => (
        <FilterRadioGroup
          key={group.title}
          title={group.title}
          items={[
            { value: "all", label: `All ${group.title}` },
            ...group.items,
          ]}
          value={selectedOptions[group.title] || "all"}
          handleChange={(value) =>
            onOptionChange(group.title, value === "all" ? "" : value)
          }
          data-testid={`${group.title.toLowerCase()}-filter`}
        />
      ))}
    </div>
  )
}

export default Filter
