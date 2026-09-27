import { SiFacebook, SiWhatsapp } from "@icons-pack/react-simple-icons"
import { Phone, Truck } from "lucide-react"

import { getLocale } from "@lib/data/locale-actions"
import {
  FACEBOOK_URL,
  PHONE_DISPLAY,
  PHONE_E164,
  WHATSAPP_URL,
} from "@lib/util/seo"
import { SUPPORT_PAGES } from "@lib/util/site-pages"
import { SHIPPING_POLICY } from "@lib/util/store-policy"
import { getTranslation } from "@lib/util/translations"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoCard from "@modules/support/components/info-card"
import PageHeader from "@modules/support/components/page-header"

const linkClassName =
  "font-semibold text-primary-container underline-offset-4 hover:underline"

export default async function ContactTemplate() {
  const locale = await getLocale()
  const t = (key: string) => getTranslation(locale, key)

  return (
    <div className="content-container max-w-3xl py-10 small:py-16">
      <PageHeader
        title={t("Contact us")}
        intro={t(
          "Questions about an item, your size or an order? Reach us by phone, WhatsApp or Facebook."
        )}
      />
      <div className="grid grid-cols-1 gap-4 small:grid-cols-2">
        <InfoCard
          icon={<Phone className="h-4 w-4" aria-hidden />}
          title={t("Phone")}
          data-testid="contact-phone"
        >
          <a href={`tel:${PHONE_E164}`} className={linkClassName}>
            {PHONE_DISPLAY}
          </a>
        </InfoCard>
        <InfoCard
          icon={
            <SiWhatsapp className="h-4 w-4" color="currentColor" aria-hidden />
          }
          title="WhatsApp"
          data-testid="contact-whatsapp"
        >
          <p className="mb-2">
            {t("Send us a message, we reply as soon as possible.")}
          </p>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {t("Chat on WhatsApp")}
          </a>
        </InfoCard>
        <InfoCard
          icon={
            <SiFacebook className="h-4 w-4" color="currentColor" aria-hidden />
          }
          title="Facebook"
          data-testid="contact-facebook"
        >
          <p className="mb-2">
            {t("Follow our new arrivals and message us on our page.")}
          </p>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClassName}
          >
            {t("Follow us on Facebook")}
          </a>
        </InfoCard>
        <InfoCard
          icon={<Truck className="h-4 w-4" aria-hidden />}
          title={t("Shipping & Returns")}
          data-testid="contact-shipping"
        >
          <p className="mb-2">
            {t(
              "Delivered anywhere in Tunisia within {days} business days, for a flat fee of {fee} {currency}."
            )
              .replace("{days}", `${SHIPPING_POLICY.deliveryDays}`)
              .replace("{fee}", `${SHIPPING_POLICY.fee}`)
              .replace("{currency}", SHIPPING_POLICY.currencyCode)}
          </p>
          <LocalizedClientLink
            href={SUPPORT_PAGES.shippingReturns}
            className={linkClassName}
          >
            {t("Read our shipping & returns policy")}
          </LocalizedClientLink>
        </InfoCard>
      </div>
    </div>
  )
}
