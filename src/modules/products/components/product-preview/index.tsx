import { Text } from "@modules/common/components/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default function ProductPreview({
  product,
  isFeatured,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({product,})

  const discountPercentage =
    cheapestPrice?.price_type === "sale"
      ? Math.round(Number(cheapestPrice.percentage_diff))
      : null

  const brand = product.collection?.title

  const sizeOption = product.options?.find(
    (option) => option.title.toLowerCase() === "size"
  )
  const sizes = sizeOption?.values?.map((v) => v.value) ?? []

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <div className="relative">
          {discountPercentage ? (
            <span className="absolute top-3 left-3 z-20 rounded-full bg-primary-container px-2.5 py-1 text-xs font-semibold text-primary-on-container">
              -{discountPercentage}%
            </span>
          ) : null}
          <Thumbnail
            thumbnail={product.thumbnail}
            alt={product.title}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
            aspectRatio={isFeatured ? undefined : "aspect-[3/4]"}
          />
          {sizes.length > 0 ? (
            <div className="absolute inset-0 z-10 hidden flex-col items-center justify-center gap-3 rounded-large bg-black/70 p-4 opacity-0 scale-95 transition-all duration-200 ease-out [@media(hover:hover)]:flex [@media(hover:hover)]:group-hover:opacity-100 [@media(hover:hover)]:group-hover:scale-100">
              <div className="flex flex-wrap justify-center gap-2">
                {sizes.map((size) => (
                  <span
                    key={size}
                    className="rounded-full border border-white/30 px-3 py-1 text-small-semi text-white"
                  >
                    {size}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-col mt-2 gap-y-1">
          {brand ? (
            <Text
              className="text-surface-on-variant truncate text-xsmall-regular uppercase tracking-wide"
              data-testid="product-brand"
            >
              {brand}
            </Text>
          ) : null}
          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 [@media(hover:hover)]:hidden">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-outline-variant px-2 py-0.5 text-xsmall-regular text-surface-on-variant"
                >
                  {size}
                </span>
              ))}
            </div>
          ) : null}
          <div className="flex flex-col items-center gap-y-1 text-center">
            <Text
              className="text-surface-on w-full truncate text-sm font-medium"
              data-testid="product-title"
            >
              {product.title}
            </Text>
            {cheapestPrice ? (
              <PreviewPrice price={cheapestPrice} />
            ) : (
              <Text className="text-surface-on-variant text-small-regular whitespace-nowrap">
                Price unavailable
              </Text>
            )}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
