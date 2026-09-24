"use client"

import { useEffect, useState } from "react"
import { ChevronDown, Funnel } from "@medusajs/icons"
import { clx, Text } from "@modules/common/components/ui"
import Accordion from "@modules/common/components/accordion"
import FilterChipGroup from "@modules/common/components/filter-chip-group"
import PriceFilter, { PriceBounds, PriceRange } from "./price-filter"

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
  priceRange?: PriceRange
}

type FilterProps = {
  categories: FilterItem[]
  selectedCategory: string
  onCategoryChange: (value: string) => void
  optionGroups: OptionFilterGroup[]
  selectedOptions: Record<string, string>
  onOptionChange: (title: string, value: string) => void
  priceBounds?: PriceBounds
  priceRange: PriceRange
  onPriceRangeChange: (range: PriceRange) => void
  "data-testid"?: string
}

const Filter = ({
  categories,
  selectedCategory,
  onCategoryChange,
  optionGroups,
  selectedOptions,
  onOptionChange,
  priceBounds,
  priceRange,
  onPriceRangeChange,
  "data-testid": dataTestId,
}: FilterProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const validPriceBounds =
    priceBounds && priceBounds.min < priceBounds.max ? priceBounds : undefined
  const hasPriceFilter = !!validPriceBounds

  const sectionValues = [
    ...(categories.length > 0 ? ["Category"] : []),
    ...(hasPriceFilter ? ["Price"] : []),
    ...optionGroups.map((group) => group.title),
  ]

  // Sections (Price, Brand, Size, ...) appear asynchronously once product data
  // loads, after Accordion's initial mount — merge them into the open set as
  // they show up instead of relying on defaultValue, which only reads once.
  const [openSections, setOpenSections] = useState<string[]>(sectionValues)
  useEffect(() => {
    setOpenSections((prev) => [
      ...prev,
      ...sectionValues.filter((value) => !prev.includes(value)),
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionValues.join("|")])

  if (categories.length === 0 && optionGroups.length === 0 && !hasPriceFilter) {
    return null
  }

  return (
    <div
      className="flex flex-col gap-y-1 p-5 mb-6 rounded-large border border-outline-variant bg-surface-container-low w-full small:w-64 small:flex-shrink-0 small:sticky small:top-24 small:mb-0"
      data-testid={dataTestId}
    >
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        className="flex items-center justify-between text-surface-on small:pointer-events-none pb-4"
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
      <div className={clx("small:block", isOpen ? "block" : "hidden")}>
        <Accordion
          type="multiple"
          value={openSections}
          onValueChange={setOpenSections}
        >
          {categories.length > 0 && (
            <Accordion.Item title="Category" value="Category" className="first:border-t-0">
              <div className="pb-3">
                <FilterChipGroup
                  items={[
                    { value: "all", label: "All Categories" },
                    ...categories,
                  ]}
                  value={selectedCategory || "all"}
                  handleChange={(value) =>
                    onCategoryChange(value === "all" ? "" : value)
                  }
                  data-testid="category-filter"
                />
              </div>
            </Accordion.Item>
          )}
          {validPriceBounds && (
            <Accordion.Item
              title="Price"
              value="Price"
              className={categories.length === 0 ? "first:border-t-0" : undefined}
            >
              <div className="pb-3">
                <PriceFilter
                  bounds={validPriceBounds}
                  value={priceRange}
                  onChange={onPriceRangeChange}
                  data-testid="price-filter"
                />
              </div>
            </Accordion.Item>
          )}
          {optionGroups.map((group) => (
            <Accordion.Item key={group.title} title={group.title} value={group.title}>
              <div className="pb-3">
                <FilterChipGroup
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
              </div>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>
    </div>
  )
}

export default Filter
