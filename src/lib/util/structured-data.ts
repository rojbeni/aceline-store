import { HttpTypes } from "@medusajs/types"

import { getBaseURL } from "@lib/util/env"
import { getProductPrice } from "@lib/util/get-product-price"
import {
  getProductBrand,
  getProductMetaDescription,
  SITE_NAME,
} from "@lib/util/seo"

type Crumb = { name: string; path: string }

const absoluteUrl = (countryCode: string, path: string) =>
  `${getBaseURL()}/${countryCode}${path}`

export const getBreadcrumbJsonLd = (countryCode: string, crumbs: Crumb[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [{ name: SITE_NAME, path: "" }, ...crumbs].map(
    (crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(countryCode, crumb.path),
    })
  ),
})

const isVariantInStock = (variant: HttpTypes.StoreProductVariant) =>
  !variant.manage_inventory ||
  !!variant.allow_backorder ||
  (variant.inventory_quantity ?? 0) > 0

// Variant titles in the admin are inconsistent ("38.5" vs "Nike / 41"), so
// name offers from the Size option: "Nike Vapor – Size 41".
const getVariantOfferName = (
  product: HttpTypes.StoreProduct,
  variant: HttpTypes.StoreProductVariant
) => {
  const sizeOptionId = product.options?.find(
    (o) => o.title?.toLowerCase() === "size"
  )?.id
  const size = variant.options?.find((o) => o.option_id === sizeOptionId)?.value

  return size ? `${product.title} – Size ${size}` : product.title
}

export const getProductJsonLd = (
  product: HttpTypes.StoreProduct,
  countryCode: string
) => {
  // The catalog is second-hand by default; a product can opt out with
  // `metadata.condition = "new"` in the Medusa admin.
  const itemCondition =
    product.metadata?.condition === "new"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition"

  const url = absoluteUrl(countryCode, `/products/${product.handle}`)
  const brand = getProductBrand(product)

  // Each variant is a distinct piece (usually one size, stock of 1) with its
  // own price, so each gets its own Offer rather than one "cheapest" Offer.
  const offers = (product.variants ?? []).flatMap((variant) => {
    const price = getProductPrice({ product, variantId: variant.id }).variantPrice
    if (!price) return []

    return [
      {
        "@type": "Offer",
        url,
        sku: variant.sku ?? undefined,
        name: getVariantOfferName(product, variant),
        itemCondition,
        priceCurrency: price.currency_code.toUpperCase(),
        price: price.calculated_price_number.toFixed(2),
        availability: isVariantInStock(variant)
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    ]
  })

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || getProductMetaDescription(product),
    image: product.images?.map((img) => img.url).filter(Boolean),
    sku: offers.length === 1 ? offers[0].sku : undefined,
    brand: brand ? { "@type": "Brand", name: brand } : undefined,
    offers: offers.length === 1 ? offers[0] : offers,
  }
}

export const getSiteJsonLd = (countryCode: string) => [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: getBaseURL(),
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl(countryCode, ""),
  },
]
