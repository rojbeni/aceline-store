import { EllipseMiniSolid } from "@medusajs/icons"
import { Label, RadioGroup, Text, clx } from "@modules/common/components/ui"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: string
  handleChange: (value: string) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-y-3">
      <Text className="text-xs font-semibold uppercase tracking-wider text-ui-fg-muted">
        {title}
      </Text>
      <RadioGroup className="flex flex-col gap-y-1" data-testid={dataTestId}>
        {items?.map((i) => {
          const isActive = i.value === value

          return (
            <Label
              key={i.value}
              htmlFor={i.value}
              className={clx(
                "flex items-center gap-x-2.5 rounded-base px-2 py-1.5 font-normal transition-colors cursor-pointer hover:bg-ui-bg-base",
                isActive
                  ? "text-ui-fg-base font-semibold bg-ui-bg-base"
                  : "text-ui-fg-subtle"
              )}
              data-testid="radio-label"
              data-active={isActive}
            >
              <span
                className={clx(
                  "flex items-center justify-center w-4 h-4 flex-shrink-0 rounded-full border transition-colors",
                  isActive
                    ? "border-black dark:border-neon"
                    : "border-ui-border-base"
                )}
              >
                {isActive && (
                  <EllipseMiniSolid className="text-black dark:text-neon" />
                )}
              </span>
              <RadioGroup.Item
                checked={isActive}
                onChange={() => handleChange(i.value)}
                className="hidden"
                id={i.value}
                value={i.value}
              />
              {i.label}
            </Label>
          )
        })}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup
