import { Metadata } from "next"

import { listRegions } from "@lib/data/regions"

export const SITE_NAME = "Aceline Store"

export const DEFAULT_DESCRIPTION =
  "Shop authenticated, second-hand tennis gear from Nike, Wilson, Asics and more — inspected, sustainable, and priced for players."

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// Page content language is cookie-driven, not URL-driven, so crawlers always
// get the default language — hreflang tags must advertise that language.
const DEFAULT_LANGUAGE = "en"

/** hreflang code for a country's URLs, e.g. "fr" → "en-FR". */
export const toHreflang = (countryCode: string) =>
  `${DEFAULT_LANGUAGE}-${countryCode.toUpperCase()}`

/** Every country code the storefront serves, lowercased and de-duplicated. */
export const listCountryCodes = async (): Promise<string[]> => {
  const regions = await listRegions().catch(() => null)

  const countryCodes = (regions ?? [])
    .flatMap((region) => region.countries?.map((c) => c.iso_2) ?? [])
    .filter((code): code is string => !!code)
    .map((code) => code.toLowerCase())

  return countryCodes.length
    ? Array.from(new Set(countryCodes))
    : [DEFAULT_REGION]
}

/**
 * Canonical URL + hreflang alternates for a localized path (e.g. "/store").
 * Paths are relative — they resolve against the root layout's `metadataBase`.
 */
export const buildAlternates = async (
  countryCode: string,
  path = ""
): Promise<Metadata["alternates"]> => {
  const countryCodes = await listCountryCodes()
  const xDefault = countryCodes.includes(DEFAULT_REGION)
    ? DEFAULT_REGION
    : countryCodes[0]

  return {
    canonical: `/${countryCode}${path}`,
    languages: {
      ...Object.fromEntries(
        countryCodes.map((code) => [toHreflang(code), `/${code}${path}`])
      ),
      "x-default": `/${xDefault}${path}`,
    },
  }
}
