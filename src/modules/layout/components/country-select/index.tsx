"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState } from "react"
import RoundFlag from "@modules/common/components/round-flag"

import { StateType } from "@lib/hooks/use-toggle-state"
import { useParams, usePathname } from "next/navigation"
import { updateRegion } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/context/translation-context"

type CountryOption = {
  country: string
  region: string
  label: string
}

type CountrySelectProps = {
  toggleState: StateType
  regions: HttpTypes.StoreRegion[]
}

const CountrySelect = ({ toggleState, regions }: CountrySelectProps) => {
  const { t } = useTranslation()
  const [current, setCurrent] = useState<CountryOption | undefined>(undefined)

  const { countryCode } = useParams()
  const currentPath = usePathname().split(`/${countryCode}`)[1]

  const { state, close } = toggleState

  const options = useMemo(() => {
    return regions
      ?.map((r) => {
        return r.countries?.map((c) => ({
          country: c.iso_2 ?? "",
          region: r.id,
          label: c.display_name ?? "",
        }))
      })
      .flat()
      .filter((o): o is CountryOption => !!o)
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [regions])

  useEffect(() => {
    if (countryCode) {
      const option = options?.find((o) => o?.country === countryCode)
      setCurrent(option)
    }
  }, [options, countryCode])

  const handleChange = (option: CountryOption) => {
    updateRegion(option.country, currentPath)
    close()
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          countryCode
            ? options?.find((o) => o?.country === countryCode)
            : undefined
        }
      >
        <ListboxButton
          className="flex items-center gap-x-1.5 py-1"
          data-testid="country-select-button"
        >
          <span className="sr-only small:not-sr-only">{t("Shipping to:")}</span>
          {current && (
            <span className="flex items-center gap-x-1.5">
              <RoundFlag countryCode={current.country ?? ""} />
              <span className="hidden small:inline">{current.label}</span>
            </span>
          )}
        </ListboxButton>
        <div className="relative">
          <Transition
            show={state}
            as={Fragment}
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute right-0 top-full mt-1 z-[900] w-56 max-h-[320px] overflow-y-auto no-scrollbar rounded-large border border-outline-variant bg-surface-container-high py-1 text-small-regular text-surface-on shadow-2xl"
              static
            >
              {options?.map((o, index) => {
                return (
                  <ListboxOption
                    key={index}
                    value={o}
                    className="flex cursor-pointer items-center gap-x-2 px-3 py-2 data-[focus]:bg-surface-container-highest data-[selected]:text-primary-container"
                  >
                    <RoundFlag countryCode={o?.country ?? ""} />
                    {o?.label}
                  </ListboxOption>
                )
              })}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default CountrySelect
