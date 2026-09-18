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
    <div className="flex flex-col gap-y-2">
      <span className="text-xsmall-regular font-semibold uppercase tracking-wider text-surface-on-variant">
        Select {title}
      </span>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          const isCurrentValDisabled = isValDisabled ? isValDisabled(v) : false
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "border text-small-regular font-medium h-9 rounded-lg px-3 flex-1 transition-all duration-200 ease-in-out hover:scale-[1.02] disabled:opacity-50 disabled:pointer-events-none min-w-[52px] cursor-pointer",
                {
                  "border-primary-container bg-surface-container-high text-surface-on font-semibold ring-1 ring-primary-container":
                    v === current,
                  "border-outline-variant bg-surface-container-low text-surface-on-variant hover:border-outline hover:text-surface-on hover:bg-surface-container":
                    v !== current && !isCurrentValDisabled,
                  "opacity-40 cursor-not-allowed line-through border-outline-variant bg-surface-container-low text-surface-on-variant":
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
