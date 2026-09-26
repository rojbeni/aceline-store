import { HttpTypes } from "@medusajs/types"

/** Values of the product option with this title (case-insensitive), e.g. "size". */
export const getOptionValues = (
  product: HttpTypes.StoreProduct,
  title: string
) =>
  product.options
    ?.find((o) => o.title?.toLowerCase() === title)
    ?.values?.map((v) => v.value)
    .filter(Boolean) ?? []

/** Brand from the product's "Brand" option, falling back to its collection. */
export const getProductBrand = (product: HttpTypes.StoreProduct) =>
  getOptionValues(product, "brand")[0] || product.collection?.title || undefined
