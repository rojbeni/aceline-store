import { HttpTypes } from "@medusajs/types"

import { getBaseURL } from "@lib/util/env"
import { getProductPrice } from "@lib/util/get-product-price"
import { SITE_NAME } from "@lib/util/seo"

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

export const getProductJsonLd = (
  product: HttpTypes.StoreProduct,
  countryCode: string
) => {
  const { cheapestPrice } = getProductPrice({ product })

  // The catalog is second-hand by default; a product can opt out with
  // `metadata.condition = "new"` in the Medusa admin.
  const itemCondition =
    product.metadata?.condition === "new"
      ? "https://schema.org/NewCondition"
      : "https://schema.org/UsedCondition"

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.title,
    image: product.images?.map((img) => img.url).filter(Boolean),
    sku: product.variants?.[0]?.sku ?? undefined,
    brand: product.collection?.title
      ? { "@type": "Brand", name: product.collection.title }
      : undefined,
    offers: {
      "@type": "Offer",
      url: absoluteUrl(countryCode, `/products/${product.handle}`),
      itemCondition,
      priceCurrency: cheapestPrice?.currency_code?.toUpperCase(),
      price: cheapestPrice
        ? cheapestPrice.calculated_price_number.toFixed(2)
        : undefined,
      availability: product.variants?.some(
        (v) =>
          !v.manage_inventory ||
          v.allow_backorder ||
          (v.inventory_quantity ?? 0) > 0
      )
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
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
