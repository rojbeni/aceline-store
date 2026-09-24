import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"
import { getLocale } from "@lib/data/locale-actions"
import { getTranslation } from "@lib/util/translations"

export default async function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const t = (key: string) => getTranslation(locale, key)

  return (
    <div className="w-full bg-white dark:bg-surface relative small:min-h-screen">
      <div className="h-16 bg-white dark:bg-surface border-b border-gray-200 dark:border-outline-variant">
        <nav className="flex h-full items-center content-container justify-between">
          <LocalizedClientLink
            href="/cart"
            className="text-small-semi text-ui-fg-base flex items-center gap-x-2 uppercase"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block text-ui-fg-subtle hover:text-ui-fg-base ">
              {t("Back to shopping cart")}
            </span>
            <span className="mt-px block small:hidden text-ui-fg-subtle hover:text-ui-fg-base">
              {t("Back")}
            </span>
          </LocalizedClientLink>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">{children}</div>
    </div>
  )
}
