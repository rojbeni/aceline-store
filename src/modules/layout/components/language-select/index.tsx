"use client"

import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react"
import { Fragment, useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"

import { StateType } from "@lib/hooks/use-toggle-state"
import { updateLocale } from "@lib/data/locale-actions"
import { Locale } from "@lib/data/locales"
import { useTranslation } from "@lib/context/translation-context"
import RoundFlag from "@modules/common/components/round-flag"

type LanguageOption = {
  code: string
  name: string
  localizedName: string
  countryCode: string
}

const getCountryCodeFromLocale = (localeCode: string): string => {
  try {
    const locale = new Intl.Locale(localeCode)
    if (locale.region) {
      return locale.region.toUpperCase()
    }
    const maximized = locale.maximize()
    return maximized.region?.toUpperCase() ?? localeCode.toUpperCase()
  } catch {
    const parts = localeCode.split(/[-_]/)
    return parts.length > 1 ? parts[1].toUpperCase() : parts[0].toUpperCase()
  }
}

type LanguageSelectProps = {
  toggleState: StateType
  locales: Locale[]
  currentLocale: string | null
}

/**
 * Gets the localized display name for a language code using Intl API.
 * Falls back to the provided name if Intl is unavailable.
 */
const getLocalizedLanguageName = (
  code: string,
  fallbackName: string,
  displayLocale: string = "en-US"
): string => {
  try {
    const displayNames = new Intl.DisplayNames([displayLocale], {
      type: "language",
    })
    return displayNames.of(code) ?? fallbackName
  } catch {
    return fallbackName
  }
}

// An empty locale code means Medusa's base content, which is English. It is
// no longer the default (visitors without a choice get fr-FR, see getLocale),
// so it is labelled as the language it actually serves.
const DEFAULT_OPTION: LanguageOption = {
  code: "",
  name: "English",
  localizedName: "English",
  countryCode: "GB",
}

const LanguageSelect = ({
  toggleState,
  locales,
  currentLocale,
}: LanguageSelectProps) => {
  const { t } = useTranslation()
  const [current, setCurrent] = useState<LanguageOption | undefined>(undefined)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  const { state, close } = toggleState

  const options = useMemo(() => {
    const localeOptions = locales.map((locale) => ({
      code: locale.code,
      name: locale.name,
      localizedName: getLocalizedLanguageName(
        locale.code,
        locale.name,
        currentLocale || "en-US"
      ),
      countryCode: getCountryCodeFromLocale(locale.code),
    }))
    const defaultOpt = {
      ...DEFAULT_OPTION,
      localizedName: getLocalizedLanguageName(
        "en",
        DEFAULT_OPTION.name,
        currentLocale || "en-US"
      ),
    }
    return [defaultOpt, ...localeOptions]
  }, [locales, currentLocale])

  useEffect(() => {
    if (currentLocale) {
      const option = options.find(
        (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
      )
      setCurrent(option ?? DEFAULT_OPTION)
    } else {
      setCurrent(DEFAULT_OPTION)
    }
  }, [options, currentLocale])

  const handleChange = (option: LanguageOption) => {
    startTransition(async () => {
      await updateLocale(option.code)
      close()
      router.refresh()
    })
  }

  return (
    <div>
      <Listbox
        as="span"
        onChange={handleChange}
        defaultValue={
          currentLocale
            ? options.find(
              (o) => o.code.toLowerCase() === currentLocale.toLowerCase()
            ) ?? DEFAULT_OPTION
            : DEFAULT_OPTION
        }
        disabled={isPending}
      >
        <ListboxButton
          className="flex items-center gap-x-1.5 py-1"
          data-testid="language-select-button"
        >
          <span className="sr-only small:not-sr-only">{t("Language:")}</span>
          {current && (
            <span className="flex items-center gap-x-1.5">
              {current.countryCode && (
                <RoundFlag countryCode={current.countryCode} />
              )}
              <span className="hidden small:inline capitalize">
                {isPending ? "..." : current.localizedName}
              </span>
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
              {options.map((o) => (
                <ListboxOption
                  key={o.code || "default"}
                  value={o}
                  className="flex cursor-pointer items-center gap-x-2 px-3 py-2 data-[focus]:bg-surface-container-highest data-[selected]:text-primary-container capitalize"
                >
                  <RoundFlag countryCode={o.countryCode} />
                  {o.localizedName}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  )
}

export default LanguageSelect
