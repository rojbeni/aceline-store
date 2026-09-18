import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"

export default function ProductPrice({
  product,
  variant,
}: {
  product: HttpTypes.StoreProduct
  variant?: HttpTypes.StoreProductVariant
}) {
  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: variant?.id,
  })

  const selectedPrice = variant ? variantPrice : cheapestPrice

  if (!selectedPrice) {
    return <div className="block w-24 h-7 rounded-base bg-surface-container-high animate-pulse" />
  }

  return (
    <div className="flex flex-col gap-y-1 text-surface-on">
      <div className="flex items-center gap-x-2">
        <span className="text-large-semi">
          {!variant && "From "}
          <span
            data-testid="product-price"
            data-value={selectedPrice.calculated_price_number}
          >
            {selectedPrice.calculated_price}
          </span>
        </span>
        {selectedPrice.price_type === "sale" && (
          <span className="rounded-full bg-primary-container px-1.5 py-0.5 text-xsmall-regular font-semibold text-primary-on-container">
            -{selectedPrice.percentage_diff}%
          </span>
        )}
      </div>
      {selectedPrice.price_type === "sale" && (
        <p className="text-small-regular text-surface-on-variant">
          Original:{" "}
          <span
            className="line-through"
            data-testid="original-product-price"
            data-value={selectedPrice.original_price_number}
          >
            {selectedPrice.original_price}
          </span>
        </p>
      )}
    </div>
  )
}
