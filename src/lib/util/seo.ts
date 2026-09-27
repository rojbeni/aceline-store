import { HttpTypes } from "@medusajs/types"
import { Metadata } from "next"

import { listRegions } from "@lib/data/regions"
import { getProductPrice } from "@lib/util/get-product-price"
import { getOptionValues, getProductBrand } from "@lib/util/product-options"

export const SITE_NAME = "Aceline Store"

export const DEFAULT_DESCRIPTION =
  "Matériel de tennis d'occasion authentifié : chaussures, sacs et vêtements Nike, Wilson, Asics et plus, inspectés et à petit prix en Tunisie."

const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

// Page content language is cookie-driven, not URL-driven, so crawlers always
// get the default locale (see DEFAULT_LOCALE in locale-actions) — hreflang
// tags must advertise that language.
const DEFAULT_LANGUAGE = "fr"

/** hreflang code for a country's URLs, e.g. "tn" → "fr-TN". */
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

/** "38,5–44" for numeric sizes, otherwise the first few values ("S, M, L"). */
const formatSizes = (sizes: string[]) => {
  const numeric = sizes.map(Number)
  if (numeric.every((n) => !Number.isNaN(n))) {
    // French decimal comma: 38.5 → "38,5".
    const fr = (n: number) => `${n}`.replace(".", ",")
    const min = Math.min(...numeric)
    const max = Math.max(...numeric)
    return min === max ? fr(min) : `${fr(min)}–${fr(max)}`
  }
  return sizes.slice(0, 4).join(", ")
}

/** A non-empty string from product metadata (admin-editable SEO fields). */
const getMetadataString = (product: HttpTypes.StoreProduct, key: string) => {
  const value = product.metadata?.[key]
  return typeof value === "string" && value.trim() ? value.trim() : undefined
}

/**
 * SEO overrides set per product in the Medusa admin under metadata:
 * `seo_title` (used as-is — it already carries the brand suffix),
 * `seo_description`, and `seo_keywords` (comma-separated).
 */
export const getProductSeoOverrides = (product: HttpTypes.StoreProduct) => ({
  title: getMetadataString(product, "seo_title"),
  keywords: getMetadataString(product, "seo_keywords")
    ?.split(",")
    .map((k) => k.trim())
    .filter(Boolean),
})

/**
 * Meta description for a product page. Prefers `metadata.seo_description`,
 * then the Medusa description when one is written; otherwise builds one from
 * brand, condition, sizes and price so pages without copy still get a
 * specific, non-duplicate snippet.
 */
export const getProductMetaDescription = (
  product: HttpTypes.StoreProduct
) => {
  const seoDescription = getMetadataString(product, "seo_description")
  if (seoDescription) {
    return seoDescription
  }

  const written = product.description?.trim()
  if (written) {
    return written.length > META_DESCRIPTION_MAX
      ? `${written.slice(0, META_DESCRIPTION_MAX - 1).trimEnd()}…`
      : written
  }

  // French: crawlers are served the fr-FR locale (see DEFAULT_LOCALE).
  const brand = getProductBrand(product)
  const condition = product.metadata?.condition === "new" ? "neuf" : "d'occasion"
  const sizes = getOptionValues(product, "size")
  const { cheapestPrice } = getProductPrice({ product })

  const parts = [
    `${product.title}${
      brand && !product.title?.toLowerCase().includes(brand.toLowerCase())
        ? ` ${brand}`
        : ""
    } ${condition}`,
    sizes.length
      ? `${sizes.length > 1 ? "tailles" : "taille"} ${formatSizes(sizes)}`
      : "",
    cheapestPrice
      ? `à partir de ${Math.round(cheapestPrice.calculated_price_number)} ${cheapestPrice.currency_code.toUpperCase()}`
      : "",
  ].filter(Boolean)

  return `${parts.join(", ")}. Matériel de tennis inspecté et authentifié chez ${SITE_NAME}.`
}
