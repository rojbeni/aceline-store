"use server"

import { sdk } from "@lib/config"
import { sortProducts } from "@lib/util/sort-products"
import { HttpTypes } from "@medusajs/types"
import { SortOptions } from "@modules/store/components/sort"
import { getAuthHeaders, getCacheOptions } from "./cookies"
import { getRegion, retrieveRegion } from "./regions"

export const listProducts = async ({
  pageParam = 1,
  queryParams,
  countryCode,
  regionId,
}: {
  pageParam?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
  countryCode?: string
  regionId?: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductListParams
}> => {
  if (!countryCode && !regionId) {
    throw new Error("Country code or region ID is required")
  }

  const limit = queryParams?.limit || 12
  const _pageParam = Math.max(pageParam, 1)
  const offset = _pageParam === 1 ? 0 : (_pageParam - 1) * limit

  let region: HttpTypes.StoreRegion | undefined | null

  if (countryCode) {
    region = await getRegion(countryCode)
  } else {
    region = await retrieveRegion(regionId!)
  }

  if (!region) {
    return {
      response: { products: [], count: 0 },
      nextPage: null,
    }
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  const next = {
    ...(await getCacheOptions("products")),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[]; count: number }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          limit,
          offset,
          region_id: region?.id,
          fields:
            "*variants.calculated_price,+variants.inventory_quantity,*variants.images,*variants.options,+metadata,+tags,*collection,*options,*options.values,",
          ...queryParams,
        },
        headers,
        next:{ tags: ["products"] },
        cache: "force-cache",
      }
    )
    .then(({ products, count }) => {
      const nextPage = count > offset + limit ? pageParam + 1 : null

      return {
        response: {
          products,
          count,
        },
        nextPage: nextPage,
        queryParams,
      }
    })
}

/**
 * Looks up real stock levels for a set of variants, keyed by variant ID.
 *
 * Cart line items don't expose `variant.inventory_quantity` — Medusa's cart
 * endpoint doesn't compute that field the way the product listing endpoint
 * does (confirmed: identical `+variants.inventory_quantity` field expansion
 * works on `/store/products` but is silently dropped on `/store/carts/:id`).
 * So callers that need real stock counts for items already in a cart (e.g.
 * capping the quantity selector) look them up via the product endpoint
 * instead, keyed by the variant's parent product ID.
 */
export const getVariantInventory = async (
  productIds: string[]
): Promise<
  Record<string, { manageInventory: boolean; inventoryQuantity: number | null }>
> => {
  const uniqueProductIds = Array.from(new Set(productIds)).filter(Boolean)

  if (uniqueProductIds.length === 0) {
    return {}
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.client
    .fetch<{ products: HttpTypes.StoreProduct[] }>("/store/products", {
      method: "GET",
      query: {
        id: uniqueProductIds,
        limit: uniqueProductIds.length,
        fields: "id,variants.id,variants.manage_inventory,+variants.inventory_quantity",
      },
      headers,
      cache: "no-store",
    })
    .then(({ products }) => {
      const inventoryByVariantId: Record<
        string,
        { manageInventory: boolean; inventoryQuantity: number | null }
      > = {}

      products.forEach((product) => {
        product.variants?.forEach((variant) => {
          inventoryByVariantId[variant.id] = {
            manageInventory: !!variant.manage_inventory,
            inventoryQuantity: variant.inventory_quantity ?? null,
          }
        })
      })

      return inventoryByVariantId
    })
    .catch(() => ({}))
}

/**
 * This will fetch 100 products to the Next.js cache and sort them based on the sortBy parameter.
 * It will then return the paginated products based on the page and limit parameters.
 */
export const listProductsWithSort = async ({
  page = 0,
  queryParams,
  sortBy = "created_at",
  countryCode,
}: {
  page?: number
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
  sortBy?: SortOptions
  countryCode: string
}): Promise<{
  response: { products: HttpTypes.StoreProduct[]; count: number }
  nextPage: number | null
  queryParams?: HttpTypes.FindParams & HttpTypes.StoreProductParams
}> => {
  const limit = queryParams?.limit || 12

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: 0,
    queryParams: {
      ...queryParams,
      limit: 100,
    },
    countryCode,
  })

  const sortedProducts = sortProducts(products, sortBy)

  const pageParam = (page - 1) * limit

  const nextPage = count > pageParam + limit ? pageParam + limit : null

  const paginatedProducts = sortedProducts.slice(pageParam, pageParam + limit)

  return {
    response: {
      products: paginatedProducts,
      count,
    },
    nextPage,
    queryParams,
  }
}
