"use client"

import { Star } from "lucide-react"

import { Text } from "@modules/common/components/ui"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"

import Accordion from "@modules/common/components/accordion"
import { HttpTypes } from "@medusajs/types"
import { useTranslation } from "@lib/context/translation-context"
import { RETURN_POLICY, SHIPPING_POLICY } from "@lib/util/store-policy"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const { t } = useTranslation()
  const tabs = [
    {
      label: t("Product Information"),
      component: <ProductInfoTab product={product} />,
    },
    {
      label: t("Shipping & Returns"),
      component: <ShippingInfoTab />,
    },
    {
      label: t("Reviews"),
      component: <ReviewsTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  const { t } = useTranslation()
  return (
    <div className="text-xsmall-regular py-4">
      <div className="grid grid-cols-2 gap-x-6">
        <div className="flex flex-col gap-y-3">
          <div>
            <span className="font-semibold">{t("Material")}</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("Country of origin")}</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("Type")}</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div>
            <span className="font-semibold">{t("Weight")}</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">{t("Dimensions")}</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  const { t } = useTranslation()
  return (
    <div className="text-xsmall-regular py-4">
      <div className="grid grid-cols-1 gap-y-5">
        <div className="flex items-start gap-x-2.5 text-surface-on-variant">
          <FastDelivery
            size={14}
            className="text-primary-container flex-shrink-0"
          />
          <div>
            <span className="font-semibold text-surface-on">
              {t("Delivery in {days} days").replace(
                "{days}",
                `${SHIPPING_POLICY.deliveryDays}`
              )}
            </span>
            <p className="max-w-sm">
              {t(
                "Delivered anywhere in Tunisia within {days} business days, for a flat fee of {fee} {currency}."
              )
                .replace("{days}", `${SHIPPING_POLICY.deliveryDays}`)
                .replace("{fee}", `${SHIPPING_POLICY.fee}`)
                .replace("{currency}", SHIPPING_POLICY.currencyCode)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2.5 text-surface-on-variant">
          <Back
            size={14}
            className="text-primary-container flex-shrink-0"
          />
          <div>
            <span className="font-semibold text-surface-on">
              {t("Right of withdrawal")}
            </span>
            <p className="max-w-sm">
              {t(
                "Under Tunisian Law No. {law}, you have {days} working days from receipt to return your item. Return shipping is at your expense; we refund you within {refundDays} working days of receiving it."
              )
                .replace("{law}", RETURN_POLICY.lawReference)
                .replace("{days}", `${RETURN_POLICY.windowWorkingDays}`)
                .replace("{refundDays}", `${RETURN_POLICY.refundWorkingDays}`)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ReviewsTab = () => {
  return (
    <div className="text-xsmall-regular py-4">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <div className="flex items-center gap-x-1 text-surface-on-variant" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5" strokeWidth={1.5} />
          ))}
        </div>
        <Text className="text-small-semi text-surface-on">No reviews yet</Text>
        <Text className="max-w-sm text-xsmall-regular text-surface-on-variant">
          Be the first to share what you think about this product.
        </Text>
      </div>
    </div>
  )
}

export default ProductTabs
