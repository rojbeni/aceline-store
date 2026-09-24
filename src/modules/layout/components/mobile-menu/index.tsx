"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Menu, X, CircleUser } from "lucide-react"
import { HttpTypes } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MobileCategoryItem from "./mobile-category-item"

type MobileMenuProps = {
  categories?: HttpTypes.StoreProductCategory[]
}

const MobileMenu = ({ categories = [] }: MobileMenuProps) => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <button
        type="button"
        className="small:hidden flex items-center justify-center h-8 w-8 text-ui-fg-base dark:text-surface-on"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        data-testid="mobile-menu-toggle"
      >
        <Menu size={22} />
      </button>

      <Transition show={open} as={Fragment}>
        <Dialog as="div" className="relative z-[75] small:hidden" onClose={close}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-150"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-y-0 right-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-200"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-150"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="w-screen max-w-xs h-full bg-surface-container-low border-l border-outline-variant flex flex-col">
                  <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant shrink-0">
                    <span className="text-ui-fg-base dark:text-surface-on font-medium">Menu</span>
                    <button
                      type="button"
                      onClick={close}
                      aria-label="Close menu"
                      data-testid="mobile-menu-close"
                    >
                      <X size={20} className="text-ui-fg-base dark:text-surface-on" />
                    </button>
                  </div>
                  <nav className="flex flex-col gap-y-6 overflow-y-auto p-6 no-scrollbar">
                    <div className="flex flex-col gap-y-4">
                      <LocalizedClientLink
                        href="/account"
                        className="flex items-center gap-x-3 text-ui-fg-base dark:text-surface-on"
                        onClick={close}
                      >
                        <CircleUser size={20} />
                        Account
                      </LocalizedClientLink>
                      <LocalizedClientLink
                        href="/store"
                        className="flex items-center gap-x-3 text-ui-fg-base dark:text-surface-on"
                        onClick={close}
                      >
                        Shop
                      </LocalizedClientLink>
                    </div>

                    {categories.length > 0 && (
                      <div className="flex flex-col gap-y-1 border-t border-outline-variant pt-4">
                        {categories.map((category) => (
                          <MobileCategoryItem
                            key={category.id}
                            category={category}
                            onNavigate={close}
                          />
                        ))}
                      </div>
                    )}
                  </nav>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

export default MobileMenu
