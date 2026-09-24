"use client"

import { useState } from "react"
import { Text } from "@modules/common/components/ui"

export type PriceBounds = {
  min: number
  max: number
  currencyCode: string
}

export type PriceRange = {
  min?: number
  max?: number
}

type PriceFilterProps = {
  bounds: PriceBounds
  value: PriceRange
  onChange: (range: PriceRange) => void
  "data-testid"?: string
}

const PriceFilter = ({
  bounds,
  value,
  onChange,
  "data-testid": dataTestId,
}: PriceFilterProps) => {
  const [minInput, setMinInput] = useState(value.min?.toString() ?? "")
  const [maxInput, setMaxInput] = useState(value.max?.toString() ?? "")

  const commit = () => {
    const min = minInput === "" ? undefined : Number(minInput)
    const max = maxInput === "" ? undefined : Number(maxInput)
    onChange({
      min: min !== undefined && !Number.isNaN(min) ? min : undefined,
      max: max !== undefined && !Number.isNaN(max) ? max : undefined,
    })
  }

  return (
    <div className="flex flex-col gap-y-2" data-testid={dataTestId}>
      <Text className="text-xs font-semibold uppercase tracking-wider text-surface-on-variant">
        Price ({bounds.currencyCode.toUpperCase()})
      </Text>
      <div className="flex items-center gap-x-2">
        <input
          type="number"
          inputMode="decimal"
          min={bounds.min}
          max={bounds.max}
          placeholder={bounds.min.toString()}
          value={minInput}
          onChange={(e) => setMinInput(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-full min-w-0 rounded-base border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-small-regular text-surface-on focus:border-primary-container focus:outline-none"
          aria-label="Minimum price"
        />
        <span className="text-surface-on-variant">–</span>
        <input
          type="number"
          inputMode="decimal"
          min={bounds.min}
          max={bounds.max}
          placeholder={bounds.max.toString()}
          value={maxInput}
          onChange={(e) => setMaxInput(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          className="w-full min-w-0 rounded-base border border-outline-variant bg-surface-container-lowest px-2 py-1.5 text-small-regular text-surface-on focus:border-primary-container focus:outline-none"
          aria-label="Maximum price"
        />
      </div>
    </div>
  )
}

export default PriceFilter
