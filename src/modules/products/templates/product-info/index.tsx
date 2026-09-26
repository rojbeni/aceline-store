import { HttpTypes } from "@medusajs/types"
import { Heading, Text } from "@modules/common/components/ui"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-2">
        {product.collection && (
          <Text
            className="text-xsmall-regular uppercase tracking-wider text-surface-on-variant"
            data-testid="product-brand"
          >
            {product.collection.title}
          </Text>
        )}
        <Heading
          level="h1"
          className="text-xl-semi text-surface-on"
          data-testid="product-title"
        >
          {product.title}
        </Heading>

        <Text
          className="text-small-regular text-surface-on-variant whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
