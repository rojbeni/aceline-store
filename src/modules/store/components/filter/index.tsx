"use client"

import { useState } from "react"
import { ChevronDown, Funnel } from "@medusajs/icons"
import { clx, Text } from "@modules/common/components/ui"
import FilterChipGroup from "@modules/common/components/filter-chip-group"

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
  const [isOpen, setIsOpen] = useState(false)

  if (categories.length === 0 && optionGroups.length === 0) {
    return null
  }

  return (
    <div
      className="flex flex-col gap-y-5 p-5 mb-6 rounded-large border border-outline-variant bg-surface-container-low w-full small:w-64 small:flex-shrink-0 small:sticky small:top-24 small:mb-0"
      data-testid={dataTestId}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center justify-between text-surface-on small:pointer-events-none"
      >
        <span className="flex items-center gap-x-2">
          <Funnel className="w-4 h-4" />
          <Text className="text-sm font-semibold">Filters</Text>
        </span>
        <ChevronDown
          className={clx(
            "w-4 h-4 transition-transform small:hidden",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        className={clx(
          "flex-col gap-y-5 small:flex",
          isOpen ? "flex" : "hidden"
        )}
      >
        {categories.length > 0 && (
          <FilterChipGroup
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
          <FilterChipGroup
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
    </div>
  )
}

export default Filter
