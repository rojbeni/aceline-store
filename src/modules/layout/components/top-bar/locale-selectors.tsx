"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { Locale } from "@lib/data/locales"
import { HttpTypes } from "@medusajs/types"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"

type LocaleSelectorsProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

/** Language + delivery-country pickers; each dropdown opens on hover. */
export default function LocaleSelectors({
  regions,
  locales,
  currentLocale,
}: LocaleSelectorsProps) {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="flex items-center gap-x-4">
      {!!locales?.length && (
        <div
          className="cursor-pointer transition-colors hover:text-surface-on"
          onMouseEnter={languageToggleState.open}
          onMouseLeave={languageToggleState.close}
        >
          <LanguageSelect
            toggleState={languageToggleState}
            locales={locales}
            currentLocale={currentLocale}
          />
        </div>
      )}
      {!!regions?.length && (
        <div
          className="cursor-pointer transition-colors hover:text-surface-on"
          onMouseEnter={countryToggleState.open}
          onMouseLeave={countryToggleState.close}
        >
          <CountrySelect toggleState={countryToggleState} regions={regions} />
        </div>
      )}
    </div>
  )
}
