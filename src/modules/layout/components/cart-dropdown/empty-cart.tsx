"use client"

import { ShoppingCart } from "lucide-react"
import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useTranslation } from "@lib/context/translation-context"

const EmptyCart = ({ onNavigate }: { onNavigate: () => void }) => {
  const { t } = useTranslation()

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-gray-100 dark:bg-surface-container-high text-ui-fg-base dark:text-surface-on flex items-center justify-center w-12 h-12 rounded-full mb-4">
        <ShoppingCart size={24} />
      </div>
      <span className="text-ui-fg-base dark:text-surface-on font-semibold mb-1">
        {t("Your shopping bag is empty.")}
      </span>
      <p className="text-gray-500 dark:text-surface-on-variant text-small-regular mb-6 max-w-[240px]">
        {t("Add products to your cart to see them here.")}
      </p>
      <LocalizedClientLink href="/store" onClick={onNavigate}>
        <Button>{t("Explore products")}</Button>
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCart
