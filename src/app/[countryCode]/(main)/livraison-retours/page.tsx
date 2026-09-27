import { Metadata } from "next"

import { buildAlternates } from "@lib/util/seo"
import { SUPPORT_PAGES } from "@lib/util/site-pages"
import { RETURN_POLICY, SHIPPING_POLICY } from "@lib/util/store-policy"
import { getBreadcrumbJsonLd } from "@lib/util/structured-data"
import JsonLd from "@modules/common/components/json-ld"
import ShippingReturnsTemplate from "@modules/support/templates/shipping-returns"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: "Livraison et retours",
    description: `Livraison partout en Tunisie en ${SHIPPING_POLICY.deliveryDays} jours pour ${SHIPPING_POLICY.fee} ${SHIPPING_POLICY.currencyCode}. Droit de rétractation de ${RETURN_POLICY.windowWorkingDays} jours ouvrables conformément à la loi n° ${RETURN_POLICY.lawReference}.`,
    alternates: await buildAlternates(
      countryCode,
      SUPPORT_PAGES.shippingReturns
    ),
  }
}

export default async function ShippingReturnsPage(props: Props) {
  const { countryCode } = await props.params

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(countryCode, [
          { name: "Livraison et retours", path: SUPPORT_PAGES.shippingReturns },
        ])}
      />
      <ShippingReturnsTemplate />
    </>
  )
}
