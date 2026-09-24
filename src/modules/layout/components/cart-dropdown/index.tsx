"use client"

import { Dialog, Transition } from "@headlessui/react"
import { HttpTypes } from "@medusajs/types"
import { Fragment } from "react"
import { X } from "lucide-react"
import { useTranslation } from "@lib/context/translation-context"
import { useAutoOpenCart } from "./use-auto-open-cart"
import CartTriggerButton from "./cart-trigger-button"
import CartItemRow from "./cart-item"
import EmptyCart from "./empty-cart"
import CartSummaryFooter from "./cart-summary-footer"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { t } = useTranslation()

  const totalItems =
    cartState?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cartState?.subtotal ?? 0

  const { isOpen, open, close } = useAutoOpenCart(totalItems)

  return (
    <div className="h-full z-50">
      <CartTriggerButton itemCount={totalItems} onClick={open} />

      <Transition show={isOpen} as={Fragment}>
        <Dialog onClose={close} className="relative z-[9999]">
          {/* Backdrop */}
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/45 backdrop-blur-sm" />
          </Transition.Child>

          {/* Slide-over container */}
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-300"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-200"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel
                    className="pointer-events-auto w-screen max-w-md"
                    data-testid="nav-cart-dropdown"
                  >
                    <div className="flex h-full flex-col bg-white dark:bg-surface-container-lowest shadow-2xl border-l border-gray-200 dark:border-outline-variant text-ui-fg-base dark:text-surface-on">
                      {/* Header */}
                      <div className="p-4 sm:p-6 flex items-center justify-between border-b border-gray-200 dark:border-outline-variant bg-gray-50/50 dark:bg-surface-container-low/50">
                        <h3 className="text-xl font-bold">{t("Cart")}</h3>
                        <button
                          onClick={close}
                          className="p-2.5 hover:bg-gray-200 dark:hover:bg-surface-container-high rounded-full transition-all text-gray-400 dark:text-surface-on-variant hover:text-gray-600 dark:hover:text-surface-on"
                          data-testid="close-cart-button"
                          aria-label={t("Close cart")}
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Content */}
                      {cartState && cartState.items?.length ? (
                        <>
                          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 no-scrollbar">
                            {[...cartState.items]
                              .sort((a, b) =>
                                (a.created_at ?? "") > (b.created_at ?? "")
                                  ? -1
                                  : 1
                              )
                              .map((item) => (
                                <CartItemRow
                                  key={item.id}
                                  item={item}
                                  currencyCode={cartState.currency_code}
                                  onNavigate={close}
                                />
                              ))}
                          </div>
                          <CartSummaryFooter
                            subtotal={subtotal}
                            currencyCode={cartState.currency_code}
                            onNavigate={close}
                          />
                        </>
                      ) : (
                        <EmptyCart onNavigate={close} />
                      )}
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default CartDropdown
