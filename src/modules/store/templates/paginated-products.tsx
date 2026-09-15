"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { HttpTypes } from "@medusajs/types"

import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { FilterItem, ProductFilter } from "@modules/store/components/filter"
import { SortOptions } from "@modules/store/components/sort"

type PaginatedProductsProps = {
  sortBy?: SortOptions
  page: number
  countryCode: string
  filter?: ProductFilter
  onVariantsChange?: (variants: FilterItem[]) => void
}

export default function PaginatedProducts({
  sortBy,
  page,
  countryCode,
  filter,
  onVariantsChange,
}: PaginatedProductsProps) {
  const [products, setProducts] = useState<HttpTypes.StoreProduct[]>([])
  const [region, setRegion] = useState<HttpTypes.StoreRegion>()
  const [isPending, startTransition] = useTransition()

  const categoryId = filter?.categoryId
  const selectedVariant = filter?.variant

  useEffect(() => {
    startTransition(async () => {
      const [{ response }, fetchedRegion] = await Promise.all([
        listProductsWithSort({
          page,
          queryParams: {
            limit: 100,
            ...(categoryId && { category_id: [categoryId] }),
          },
          sortBy,
          countryCode,
        }),
        getRegion(countryCode),
      ])

      setProducts(response.products)
      setRegion(fetchedRegion ?? undefined)
    })
  }, [categoryId, sortBy, page, countryCode])

  useEffect(() => {
    if (!onVariantsChange) return

    const titles = new Set<string>()
    products.forEach((p) =>
      p.variants?.forEach((v) => {
        if (v.title) titles.add(v.title)
      })
    )
    onVariantsChange(
      Array.from(titles).map((title) => ({ value: title, label: title }))
    )
  }, [products, onVariantsChange])

  const filteredProducts = useMemo(() => {
    if (!selectedVariant) return products
    return products.filter((p) =>
      p.variants?.some((v) => v.title === selectedVariant)
    )
  }, [products, selectedVariant])

  if ((isPending && products.length === 0) || !region) {
    return <SkeletonProductGrid />
  }

  return (
    <ul
      className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
      data-testid="products-list"
    >
      {filteredProducts.map((p) => (
        <li key={p.id}>
          <ProductPreview product={p} region={region} />
        </li>
      ))}
    </ul>
  )
}
