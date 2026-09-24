"use client"

import { Text } from "@modules/common/components/ui"
import { HttpTypes } from "@medusajs/types"
import CartItemSelect from "@modules/cart/components/cart-item-select"
import ErrorMessage from "@modules/checkout/components/error-message"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Spinner from "@modules/common/icons/spinner"
import Thumbnail from "@modules/products/components/thumbnail"
import { useTranslation } from "@lib/context/translation-context"
import {
  LineItemInventory,
  useLineItemQuantity,
} from "@modules/cart/components/item/use-line-item-quantity"

type CartLineItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  /** Real stock for this line item's variant — see `getVariantInventory`. */
  inventory?: LineItemInventory
}

const CartLineItem = ({ item, currencyCode, inventory }: CartLineItemProps) => {
  const { t } = useTranslation()
  const { updating, error, changeQuantity, maxQuantity } = useLineItemQuantity(
    item.id,
    inventory
  )

  return (
    <div
      className="flex gap-4 py-4 border-b border-outline-variant last:border-b-0"
      data-testid="product-row"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="w-16 small:w-24 shrink-0"
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
        />
      </LocalizedClientLink>

      <div className="flex flex-1 min-w-0 flex-col gap-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Text className="text-ui-fg-base truncate" data-testid="product-title">
              {item.product_title}
            </Text>
            <LineItemOptions variant={item.variant} data-testid="product-variant" />
            <div className="small:hidden mt-1 text-small-regular text-surface-on-variant">
              <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
            </div>
          </div>
          <div className="shrink-0 text-right font-semibold">
            <LineItemPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="w-16 h-10"
              data-testid="product-select-button"
            >
              {Array.from({ length: maxQuantity }, (_, i) => (
                <option value={i + 1} key={i}>
                  {i + 1}
                </option>
              ))}
            </CartItemSelect>
            <DeleteButton id={item.id} data-testid="product-delete-button">
              {t("Remove")}
            </DeleteButton>
            {updating && <Spinner />}
          </div>

          <div className="hidden small:block text-small-regular text-surface-on-variant">
            <LineItemUnitPrice item={item} style="tight" currencyCode={currencyCode} />
          </div>
        </div>

        <ErrorMessage error={error} data-testid="product-error-message" />
      </div>
    </div>
  )
}

export default CartLineItem
