import { Metadata } from "next"

import { buildAlternates, PHONE_DISPLAY } from "@lib/util/seo"
import { SUPPORT_PAGES } from "@lib/util/site-pages"
import { getBreadcrumbJsonLd } from "@lib/util/structured-data"
import JsonLd from "@modules/common/components/json-ld"
import ContactTemplate from "@modules/support/templates/contact"

type Props = {
  params: Promise<{ countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode } = await props.params

  return {
    title: "Contactez-nous",
    description: `Une question sur un article, une taille ou une commande ? Contactez Aceline Store par téléphone ou WhatsApp au ${PHONE_DISPLAY}, ou sur Facebook.`,
    alternates: await buildAlternates(countryCode, SUPPORT_PAGES.contact),
  }
}

export default async function ContactPage(props: Props) {
  const { countryCode } = await props.params

  return (
    <>
      <JsonLd
        data={getBreadcrumbJsonLd(countryCode, [
          { name: "Contact", path: SUPPORT_PAGES.contact },
        ])}
      />
      <ContactTemplate />
    </>
  )
}
