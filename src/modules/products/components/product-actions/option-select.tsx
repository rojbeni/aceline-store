import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
  isValDisabled?: (val: string) => boolean
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
  isValDisabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-ui-fg-subtle">
        Select {title}
      </span>
      <div
        className="flex flex-wrap gap-3"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isCurrentValDisabled = isValDisabled ? isValDisabled(v) : false
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border text-sm font-medium h-11 rounded-xl px-4 flex-1 transition-all duration-200 ease-in-out hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none min-w-[60px]",
                {
                  "border-black dark:border-[#c3f400] bg-ui-bg-base text-ui-fg-base font-semibold ring-1 ring-black dark:ring-[#c3f400]":
                    v === current,
                  "border-ui-border-base bg-ui-bg-subtle text-ui-fg-subtle hover:border-ui-border-interactive hover:text-ui-fg-base hover:bg-ui-bg-base/50":
                    v !== current && !isCurrentValDisabled,
                  "opacity-40 cursor-not-allowed line-through border-ui-border-base bg-ui-bg-subtle text-ui-fg-muted":
                    isCurrentValDisabled,
                }
              )}
              disabled={disabled || isCurrentValDisabled}
              data-testid="option-button"
            >
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
