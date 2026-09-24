import repeat from "@lib/util/repeat"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"

import CartLineItem from "@modules/cart/components/cart-line-item"
import SkeletonCartLineItem from "@modules/skeletons/components/skeleton-cart-line-item"
import { getLocale } from "@lib/data/locale-actions"
import { getTranslation } from "@lib/util/translations"
import { getVariantInventory } from "@lib/data/products"

type ItemsTemplateProps = {
  cart?: HttpTypes.StoreCart
}

const ItemsTemplate = async ({ cart }: ItemsTemplateProps) => {
  const locale = await getLocale()
  const t = (key: string) => getTranslation(locale, key)

  const items = cart?.items
  const inventoryByVariantId = await getVariantInventory(
    (items ?? []).map((item) => item.variant?.product_id).filter((id): id is string => !!id)
  )

  const sortedItems = items
    ? [...items].sort((a, b) =>
        (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
      )
    : undefined

  return (
    <div>
      <div className="pb-4 flex items-baseline gap-x-2">
        <Heading className="text-[2rem] leading-[2.75rem]">{t("Cart")}</Heading>
        {sortedItems && (
          <span className="text-small-regular text-surface-on-variant">
            ({sortedItems.length})
          </span>
        )}
      </div>
      <div className="rounded-large border border-outline-variant bg-surface-container-low px-4 small:px-6">
        {sortedItems
          ? sortedItems.map((item) => (
              <CartLineItem
                key={item.id}
                item={item}
                currencyCode={cart?.currency_code ?? ""}
                inventory={
                  item.variant?.id
                    ? inventoryByVariantId[item.variant.id]
                    : undefined
                }
              />
            ))
          : repeat(3).map((i) => <SkeletonCartLineItem key={i} />)}
      </div>
    </div>
  )
}

export default ItemsTemplate
