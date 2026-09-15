"use client"

import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { Fragment } from "react"
import { useTranslation } from "@lib/context/translation-context"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const { t } = useTranslation()
  const formatStatus = (str: string) => {
    const formatted = str.split("_").join(" ")

    return formatted.slice(0, 1).toUpperCase() + formatted.slice(1)
  }

  return (
    <div>
      <Text>
        {t("We have sent the order confirmation details to {email}.").split("{email}").map((part, index) => (
          <Fragment key={index}>
            {index > 0 && (
              <span
                className="text-ui-fg-medium-plus font-semibold"
                data-testid="order-email"
              >
                {order.email}
              </span>
            )}
            {part}
          </Fragment>
        ))}
      </Text>
      <Text className="mt-2">
        {t("Order date: ")}
        <span data-testid="order-date">
          {new Date(order.created_at).toDateString()}
        </span>
      </Text>
      <Text className="mt-2 text-ui-fg-interactive">
        {t("Order number: ")}<span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="flex items-center text-compact-small gap-x-4 mt-4">
        {showStatus && (
          <>
            <Text>
              {t("Order status: ")}
              <span className="text-ui-fg-subtle " data-testid="order-status">
                {t(formatStatus(order.fulfillment_status))}
              </span>
            </Text>
            <Text>
              {t("Payment status: ")}
              <span
                className="text-ui-fg-subtle "
                sata-testid="order-payment-status"
              >
                {t(formatStatus(order.payment_status))}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
