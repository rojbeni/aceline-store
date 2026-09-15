"use client"

import { Dialog, Transition } from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { ShoppingCart, X } from "lucide-react"
import { useTranslation } from "@lib/context/translation-context"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const { t } = useTranslation()
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div className="h-full z-50">
      <button
        onClick={open}
        className="h-full relative hover:text-ui-fg-base"
        data-testid="nav-cart-link"
      >
        <div className="relative">
          <ShoppingCart size={20} />
          {totalItems > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-1 border border-surface">
              {totalItems}
            </span>
          )}
        </div>
      </button>

      <Transition show={cartDropdownOpen} as={Fragment}>
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
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
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
                      <div className="p-6 flex items-center justify-between border-b border-gray-200 dark:border-outline-variant bg-gray-50/50 dark:bg-surface-container-low/50">
                        <h3 className="text-xl font-bold">{t("Cart")}</h3>
                        <button
                          onClick={close}
                          className="p-2 hover:bg-gray-200 dark:hover:bg-surface-container-high rounded-full transition-all text-gray-400 dark:text-surface-on-variant hover:text-gray-600 dark:hover:text-surface-on"
                          data-testid="close-cart-button"
                        >
                          <X size={20} />
                        </button>
                      </div>

                      {/* Content */}
                      {cartState && cartState.items?.length ? (
                        <>
                          <div className="flex-1 overflow-y-auto p-6 space-y-6 no-scrollbar">
                            {cartState.items
                              .sort((a, b) => {
                                return (a.created_at ?? "") > (b.created_at ?? "")
                                  ? -1
                                  : 1
                              })
                              .map((item) => (
                                <div
                                  className="grid grid-cols-[100px_1fr] gap-x-4 border-b border-gray-100 dark:border-outline-variant/40 pb-6 last:border-b-0 last:pb-0"
                                  key={item.id}
                                  data-testid="cart-item"
                                >
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    className="w-20"
                                    onClick={close}
                                  >
                                    <Thumbnail
                                      thumbnail={item.thumbnail}
                                      images={item.variant?.product?.images}
                                      size="square"
                                    />
                                  </LocalizedClientLink>
                                  <div className="flex flex-col justify-between flex-1">
                                    <div className="flex flex-col flex-1">
                                      <div className="flex items-start justify-between">
                                        <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-2 w-[180px]">
                                          <h4 className="text-base font-semibold overflow-hidden text-ellipsis">
                                            <LocalizedClientLink
                                              href={`/products/${item.product_handle}`}
                                              data-testid="product-link"
                                              onClick={close}
                                            >
                                              {item.title}
                                            </LocalizedClientLink>
                                          </h4>
                                          <LineItemOptions
                                            variant={item.variant}
                                            data-testid="cart-item-variant"
                                            data-value={item.variant}
                                          />
                                          <span
                                            className="text-small-regular text-gray-500 dark:text-surface-on-variant mt-0.5"
                                            data-testid="cart-item-quantity"
                                            data-value={item.quantity}
                                          >
                                            {t("Quantity: ")}{item.quantity}
                                          </span>
                                        </div>
                                        <div className="flex justify-end font-semibold text-gray-900 dark:text-surface-on">
                                          <LineItemPrice
                                            item={item}
                                            style="tight"
                                            currencyCode={cartState.currency_code}
                                          />
                                        </div>
                                      </div>
                                    </div>
                                    <DeleteButton
                                      id={item.id}
                                      className="mt-2 text-ui-fg-subtle dark:text-surface-on-variant hover:text-ui-fg-base dark:hover:text-surface-on text-left self-start"
                                      data-testid="cart-item-remove-button"
                                    >
                                      {t("Remove")}
                                    </DeleteButton>
                                  </div>
                                </div>
                              ))}
                          </div>
                          <div className="p-6 flex flex-col gap-y-4 text-small-regular border-t border-gray-200 dark:border-outline-variant bg-gray-50/50 dark:bg-surface-container-low/50">
                            <div className="flex items-center justify-between">
                              <span className="text-base font-semibold text-ui-fg-base dark:text-surface-on">
                                {t("Subtotal")}{" "}
                                <span className="font-normal text-gray-500 dark:text-surface-on-variant">({t("excl. taxes")})</span>
                              </span>
                              <span
                                className="text-lg font-bold text-gray-900 dark:text-surface-on"
                                data-testid="cart-subtotal"
                                data-value={subtotal}
                              >
                                {convertToLocale({
                                  amount: subtotal,
                                  currency_code: cartState.currency_code,
                                })}
                              </span>
                            </div>
                            <LocalizedClientLink href="/cart" passHref onClick={close}>
                              <Button
                                className="w-full text-center flex items-center justify-center"
                                size="large"
                                data-testid="go-to-cart-button"
                              >
                                {t("Go to cart")}
                              </Button>
                            </LocalizedClientLink>
                          </div>
                        </>
                      ) : (
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
                          <LocalizedClientLink href="/store" onClick={close}>
                            <Button>{t("Explore products")}</Button>
                          </LocalizedClientLink>
                        </div>
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
