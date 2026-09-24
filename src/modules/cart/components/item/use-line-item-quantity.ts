import { useState } from "react"
import { updateLineItem } from "@lib/data/cart"

const FALLBACK_MAX_QUANTITY = 10

export type LineItemInventory = {
  manageInventory: boolean
  inventoryQuantity: number | null
}

/**
 * Shared quantity-change + max-quantity logic for a cart line item, used by
 * both the full cart page row and the checkout-summary preview row.
 */
export const useLineItemQuantity = (lineId: string, inventory?: LineItemInventory) => {
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const changeQuantity = async (quantity: number) => {
    setError(null)
    setUpdating(true)

    await updateLineItem({ lineId, quantity })
      .catch((err) => {
        setError(err.message)
      })
      .finally(() => {
        setUpdating(false)
      })
  }

  const maxQuantity =
    inventory?.manageInventory && inventory.inventoryQuantity != null
      ? Math.max(1, Math.min(inventory.inventoryQuantity, FALLBACK_MAX_QUANTITY))
      : FALLBACK_MAX_QUANTITY

  return { updating, error, changeQuantity, maxQuantity }
}
