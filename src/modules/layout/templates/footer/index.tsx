import { getLocale } from "@lib/data/locale-actions"
import { SUPPORT_PAGES } from "@lib/util/site-pages"
import { getTranslation } from "@lib/util/translations"
import FooterBottomBar from "@modules/layout/components/footer-bottom-bar"

export default async function Footer() {
  const currentLocale = await getLocale()
  const t = (key: string) => getTranslation(currentLocale, key)

  return (
    // While the PDP's fixed mobile buy bar (MobileActions, lg:hidden) is on
    // screen it covers the bottom of the page — pad the footer to clear it.
    <footer
      className="w-full border-t border-outline-variant bg-surface-container-lowest [body:has([data-testid=mobile-actions])_&]:pb-32 lg:[body:has([data-testid=mobile-actions])_&]:pb-0"
      data-testid="footer"
    >
      <div className="content-container py-6">
        <FooterBottomBar
          rightsLabel={t("All rights reserved.")}
          locationLabel={t("Second-hand tennis gear · Tunisia")}
          links={[
            {
              href: SUPPORT_PAGES.contact,
              label: t("Contact"),
              "data-testid": "footer-contact-link",
            },
            {
              href: SUPPORT_PAGES.shippingReturns,
              label: t("Shipping & Returns"),
              "data-testid": "footer-shipping-returns-link",
            },
          ]}
        />
      </div>
    </footer>
  )
}
