"use client"

import { HttpTypes } from "@medusajs/types"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useTranslation } from "@lib/context/translation-context"

type CartItemRowProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  onNavigate: () => void
}

const CartItemRow = ({ item, currencyCode, onNavigate }: CartItemRowProps) => {
  const { t } = useTranslation()

  return (
    <div
      className="flex gap-x-4 border-b border-gray-100 dark:border-outline-variant/40 pb-6 last:border-b-0 last:pb-0"
      data-testid="cart-item"
    >
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="w-16 sm:w-20 shrink-0"
        onClick={onNavigate}
      >
        <Thumbnail
          thumbnail={item.thumbnail}
          images={item.variant?.product?.images}
          size="square"
        />
      </LocalizedClientLink>
      <div className="flex flex-col justify-between flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col min-w-0">
            <h4 className="text-base font-semibold truncate">
              <LocalizedClientLink
                href={`/products/${item.product_handle}`}
                data-testid="product-link"
                onClick={onNavigate}
              >
                {item.title}
              </LocalizedClientLink>
            </h4>
            <LineItemOptions
              variant={item.variant}
              data-testid="cart-item-variant"
              data-value={item.variant}
            />
            <span
              className="text-small-regular text-gray-500 dark:text-surface-on-variant mt-0.5"
              data-testid="cart-item-quantity"
              data-value={item.quantity}
            >
              {t("Quantity: ")}
              {item.quantity}
            </span>
          </div>
          <div className="shrink-0 font-semibold text-gray-900 dark:text-surface-on">
            <LineItemPrice
              item={item}
              style="tight"
              currencyCode={currencyCode}
            />
          </div>
        </div>
        <DeleteButton
          id={item.id}
          className="mt-2 text-ui-fg-subtle dark:text-surface-on-variant hover:text-ui-fg-base dark:hover:text-surface-on text-left self-start"
          data-testid="cart-item-remove-button"
        >
          {t("Remove")}
        </DeleteButton>
      </div>
    </div>
  )
}

export default CartItemRow
