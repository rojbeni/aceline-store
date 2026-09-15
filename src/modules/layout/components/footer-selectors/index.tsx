"use client"

import useToggleState from "@lib/hooks/use-toggle-state"
import { ArrowRightMini } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { Locale } from "@lib/data/locales"

type FooterSelectorsProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

export default function FooterSelectors({
  regions,
  locales,
  currentLocale,
}: FooterSelectorsProps) {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="text-xs">
      {!!locales?.length && (
        <div
          className="flex justify-between items-center gap-x-2 cursor-pointer text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
          onMouseEnter={languageToggleState.open}
          onMouseLeave={languageToggleState.close}
        >
          <LanguageSelect
            toggleState={languageToggleState}
            locales={locales}
            currentLocale={currentLocale}
          />
          <ArrowRightMini
            className={clx(
              "transition-transform duration-150",
              languageToggleState.state ? "-rotate-90" : ""
            )}
          />
        </div>
      )}
      {regions && regions.length > 0 && (
        <div
          className="flex justify-between items-center gap-x-2 cursor-pointer text-ui-fg-subtle hover:text-ui-fg-base transition-colors"
          onMouseEnter={countryToggleState.open}
          onMouseLeave={countryToggleState.close}
        >
          <CountrySelect
            toggleState={countryToggleState}
            regions={regions}
          />
          <ArrowRightMini
            className={clx(
              "transition-transform duration-150",
              countryToggleState.state ? "-rotate-90" : ""
            )}
          />
        </div>
      )}
    </div>
  )
}
