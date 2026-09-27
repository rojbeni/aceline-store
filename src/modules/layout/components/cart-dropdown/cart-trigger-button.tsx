"use client"

import { ShoppingCart } from "lucide-react"
import { useTranslation } from "@lib/context/translation-context"

type CartTriggerButtonProps = {
  itemCount: number
  onClick: () => void
}

const CartTriggerButton = ({ itemCount, onClick }: CartTriggerButtonProps) => {
  const { t } = useTranslation()
  return (
    <button
      onClick={onClick}
      className="h-full relative hover:text-ui-fg-base"
      data-testid="nav-cart-link"
      aria-label={t("Open cart")}
    >
      <div className="relative">
        <ShoppingCart size={20} />
        {itemCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 border border-surface">
            {itemCount}
          </span>
        )}
      </div>
    </button>
  )
}

export default CartTriggerButton
