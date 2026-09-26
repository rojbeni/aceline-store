import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"

import ProductRailCarousel from "./product-rail-carousel"

export default async function ProductRail({
  collection,
  region,
}: {
  collection: HttpTypes.StoreCollection
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products: pricedProducts },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: collection.id,
      fields: "*variants.calculated_price",
    },
  })

  if (!pricedProducts?.length) {
    return null
  }

  return (
    <ProductRailCarousel
      title={collection.title}
      viewAllHref="/store"
      products={pricedProducts}
      region={region}
    />
  )
}
