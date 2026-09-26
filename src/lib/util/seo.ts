import { HttpTypes } from "@medusajs/types"
import { Metadata } from "next"

import { listRegions } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"

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

const META_DESCRIPTION_MAX = 155

const getOptionValues = (product: HttpTypes.StoreProduct, title: string) =>
  product.options
    ?.find((o) => o.title?.toLowerCase() === title)
    ?.values?.map((v) => v.value)
    .filter(Boolean) ?? []

/** Brand from the product's "Brand" option, falling back to its collection. */
export const getProductBrand = (product: HttpTypes.StoreProduct) =>
  getOptionValues(product, "brand")[0] || product.collection?.title || undefined

/** "38.5–44" for numeric sizes, otherwise the first few values ("S, M, L"). */
const formatSizes = (sizes: string[]) => {
  const numeric = sizes.map(Number)
  if (numeric.every((n) => !Number.isNaN(n))) {
    const min = Math.min(...numeric)
    const max = Math.max(...numeric)
    return min === max ? `${min}` : `${min}–${max}`
  }
  return sizes.slice(0, 4).join(", ")
}

/**
 * Meta description for a product page. Uses the Medusa description when one
 * is written; otherwise builds one from brand, condition, sizes and price so
 * pages without copy still get a specific, non-duplicate snippet.
 */
export const getProductMetaDescription = (
  product: HttpTypes.StoreProduct
) => {
  const written = product.description?.trim()
  if (written) {
    return written.length > META_DESCRIPTION_MAX
      ? `${written.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`
      : written
  }

  const brand = getProductBrand(product)
  const condition = product.metadata?.condition === "new" ? "New" : "Second-hand"
  const sizes = getOptionValues(product, "size")
  const { cheapestPrice } = getProductPrice({ product })

  const parts = [
    `${condition} ${product.title}${
      brand && !product.title?.toLowerCase().includes(brand.toLowerCase())
        ? ` by ${brand}`
        : ""
    }`,
    sizes.length ? `${sizes.length > 1 ? "sizes" : "size"} ${formatSizes(sizes)}` : "",
    cheapestPrice
      ? `from ${Math.round(cheapestPrice.calculated_price_number)} ${cheapestPrice.currency_code.toUpperCase()}`
      : "",
  ].filter(Boolean)

  return `${parts.join(", ")}. Inspected and authenticated tennis gear at ${SITE_NAME}.`
}
