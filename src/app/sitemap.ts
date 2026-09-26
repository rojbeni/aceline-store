import { MetadataRoute } from "next"

import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { listProducts } from "@lib/data/products"
import { getBaseURL } from "@lib/util/env"
import { listCountryCodes, toHreflang } from "@lib/util/seo"

type Entry = {
  path: string
  lastModified?: string | Date | null
  changeFrequency: "daily" | "weekly"
  priority: number
}

const PRODUCT_PAGE_SIZE = 100

const listAllProducts = async (countryCode: string) => {
  const products: { handle?: string | null; updated_at?: string | Date | null }[] =
    []
  let page: number | null = 1

  try {
    while (page) {
      const { response, nextPage } = await listProducts({
        countryCode,
        pageParam: page,
        queryParams: { limit: PRODUCT_PAGE_SIZE, fields: "handle,updated_at" },
      })
      products.push(...response.products)
      page = nextPage
    }
  } catch (error) {
    console.error("Failed to fetch products for sitemap:", error)
  }

  return products
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getBaseURL()
  const countryCodes = await listCountryCodes()

  // Handles are region-independent, so one fetch per resource type is enough.
  const [products, categories, { collections }] = await Promise.all([
    listAllProducts(countryCodes[0]),
    listCategories({ fields: "handle,updated_at" }).catch(() => []),
    listCollections({ fields: "handle,updated_at" }).catch(() => ({
      collections: [],
    })),
  ])

  const entries: Entry[] = [
    { path: "", changeFrequency: "daily", priority: 1.0 },
    { path: "/store", changeFrequency: "daily", priority: 0.9 },
    ...products
      .filter((p) => p.handle)
      .map((p) => ({
        path: `/products/${p.handle}`,
        lastModified: p.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ...(categories ?? [])
      .filter((c) => c.handle)
      .map((c) => ({
        path: `/categories/${c.handle}`,
        lastModified: c.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ...(collections ?? [])
      .filter((c) => c.handle)
      .map((c) => ({
        path: `/collections/${c.handle}`,
        lastModified: c.updated_at,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
  ]

  // One URL per country, each listing its sibling-country alternates (hreflang).
  return entries.flatMap((entry) => {
    const languages = Object.fromEntries(
      countryCodes.map((code) => [
        toHreflang(code),
        `${baseUrl}/${code}${entry.path}`,
      ])
    )

    return countryCodes.map((countryCode) => ({
      url: `${baseUrl}/${countryCode}${entry.path}`,
      lastModified: entry.lastModified ?? undefined,
      changeFrequency: entry.changeFrequency,
      priority: entry.priority,
      alternates: { languages },
    }))
  })
}
