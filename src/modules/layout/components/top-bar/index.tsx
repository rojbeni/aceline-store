import { Locale } from "@lib/data/locales"
import { HttpTypes } from "@medusajs/types"
import ContactLinks from "./contact-links"
import LocaleSelectors from "./locale-selectors"

type TopBarProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
  t: (key: string) => string
}

/** Slim bar above the header: contact links left, language/country right. */
export default function TopBar({
  regions,
  locales,
  currentLocale,
  t,
}: TopBarProps) {
  return (
    <div
      className="border-b border-outline-variant bg-surface-container-lowest text-xsmall-regular text-surface-on-variant"
      data-testid="top-bar"
    >
      <div className="content-container flex h-9 items-center justify-between gap-x-4">
        <ContactLinks
          callLabel={t("Call us")}
          whatsappLabel={t("Chat on WhatsApp")}
          facebookLabel={t("Follow us on Facebook")}
        />
        <LocaleSelectors
          regions={regions}
          locales={locales}
          currentLocale={currentLocale}
        />
      </div>
    </div>
  )
}
