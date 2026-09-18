import { Text, clx } from "@modules/common/components/ui"

type FilterChipGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

const FilterChipGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterChipGroupProps) => {
  return (
    <div className="flex flex-col gap-y-2" data-testid={dataTestId}>
      <Text className="text-xs font-semibold uppercase tracking-wider text-surface-on-variant">
        {title}
      </Text>
      <div className="flex flex-wrap gap-2">
        {items?.map((i) => {
          const isActive = i.value === value

          return (
            <button
              key={i.value}
              type="button"
              onClick={() => handleChange(i.value)}
              aria-pressed={isActive}
              className={clx(
                "capitalize rounded-full border px-3 py-1.5 text-small-regular transition-colors cursor-pointer",
                isActive
                  ? "border-primary-container bg-primary-container text-primary-on-container font-semibold"
                  : "border-outline-variant text-surface-on-variant hover:border-outline hover:text-surface-on"
              )}
              data-testid="chip-button"
              data-active={isActive}
            >
              {i.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default FilterChipGroup
