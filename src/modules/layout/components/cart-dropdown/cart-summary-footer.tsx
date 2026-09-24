"use client"

import { convertToLocale } from "@lib/util/money"
import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/context/translation-context"

type CartSummaryFooterProps = {
  subtotal: number
  currencyCode: string
  onNavigate: () => void
}

const CartSummaryFooter = ({
  subtotal,
  currencyCode,
  onNavigate,
}: CartSummaryFooterProps) => {
  const { t } = useTranslation()

  return (
    <div className="p-4 sm:p-6 flex flex-col gap-y-4 text-small-regular border-t border-gray-200 dark:border-outline-variant bg-gray-50/50 dark:bg-surface-container-low/50">
      <div className="flex items-center justify-between gap-2">
        <span className="text-base font-semibold text-ui-fg-base dark:text-surface-on">
          {t("Subtotal")}{" "}
          <span className="font-normal text-gray-500 dark:text-surface-on-variant">
            ({t("excl. taxes")})
          </span>
        </span>
        <span
          className="text-lg font-bold text-gray-900 dark:text-surface-on"
          data-testid="cart-subtotal"
          data-value={subtotal}
        >
          {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
        </span>
      </div>
      <LocalizedClientLink href="/cart" passHref onClick={onNavigate}>
        <Button
          className="w-full text-center flex items-center justify-center"
          size="large"
          data-testid="go-to-cart-button"
        >
          {t("Go to cart")}
        </Button>
      </LocalizedClientLink>
    </div>
  )
}

export default CartSummaryFooter
