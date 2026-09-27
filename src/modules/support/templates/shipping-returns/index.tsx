import { RotateCcw, Truck } from "lucide-react"

import { getLocale } from "@lib/data/locale-actions"
import { SUPPORT_PAGES } from "@lib/util/site-pages"
import { RETURN_POLICY, SHIPPING_POLICY } from "@lib/util/store-policy"
import { getTranslation } from "@lib/util/translations"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoCard from "@modules/support/components/info-card"
import PageHeader from "@modules/support/components/page-header"

export default async function ShippingReturnsTemplate() {
  const locale = await getLocale()
  const t = (key: string) => getTranslation(locale, key)

  const returnSteps = [
    t(
      "Contact us by phone or WhatsApp within {days} working days of receiving your order."
    ).replace("{days}", `${RETURN_POLICY.windowWorkingDays}`),
    t("Send the item back to us; return shipping is at your expense."),
    t("We refund you within {days} working days of receiving the return.").replace(
      "{days}",
      `${RETURN_POLICY.refundWorkingDays}`
    ),
  ]

  return (
    <div className="content-container max-w-3xl py-10 small:py-16">
      <PageHeader
        title={t("Shipping & Returns")}
        intro={t(
          "Everything about delivery in Tunisia and your right of withdrawal."
        )}
      />
      <div className="flex flex-col gap-4">
        <InfoCard
          icon={<Truck className="h-4 w-4" aria-hidden />}
          title={t("Delivery in {days} days").replace(
            "{days}",
            `${SHIPPING_POLICY.deliveryDays}`
          )}
          data-testid="shipping-policy"
        >
          <p>
            {t(
              "Delivered anywhere in Tunisia within {days} business days, for a flat fee of {fee} {currency}."
            )
              .replace("{days}", `${SHIPPING_POLICY.deliveryDays}`)
              .replace("{fee}", `${SHIPPING_POLICY.fee}`)
              .replace("{currency}", SHIPPING_POLICY.currencyCode)}
          </p>
        </InfoCard>
        <InfoCard
          icon={<RotateCcw className="h-4 w-4" aria-hidden />}
          title={t("Right of withdrawal")}
          data-testid="return-policy"
        >
          <p className="mb-4">
            {t(
              "Under Tunisian Law No. {law}, you have {days} working days from receipt to return your item. Return shipping is at your expense; we refund you within {refundDays} working days of receiving it."
            )
              .replace("{law}", RETURN_POLICY.lawReference)
              .replace("{days}", `${RETURN_POLICY.windowWorkingDays}`)
              .replace("{refundDays}", `${RETURN_POLICY.refundWorkingDays}`)}
          </p>
          <h3 className="mb-2 text-small-semi text-surface-on">
            {t("How to return an item")}
          </h3>
          <ol className="list-decimal space-y-1 pl-5">
            {returnSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </InfoCard>
        <p className="text-small-regular text-surface-on-variant">
          {t("A question about a delivery or a return?")}{" "}
          <LocalizedClientLink
            href={SUPPORT_PAGES.contact}
            className="font-semibold text-primary-container underline-offset-4 hover:underline"
            data-testid="shipping-returns-contact-link"
          >
            {t("Contact us")}
          </LocalizedClientLink>
        </p>
      </div>
    </div>
  )
}
