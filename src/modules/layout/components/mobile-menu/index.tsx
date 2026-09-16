"use client"

import { Fragment, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Menu, X, CircleUser } from "lucide-react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

const MobileMenu = () => {
  const [open, setOpen] = useState(false)

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
        <Dialog as="div" className="relative z-[75] small:hidden" onClose={setOpen}>
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
                  <div className="flex items-center justify-between h-16 px-6 border-b border-outline-variant">
                    <span className="text-ui-fg-base dark:text-surface-on font-medium">Menu</span>
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      aria-label="Close menu"
                      data-testid="mobile-menu-close"
                    >
                      <X size={20} className="text-ui-fg-base dark:text-surface-on" />
                    </button>
                  </div>
                  <nav className="flex flex-col p-6 gap-y-6">
                    <LocalizedClientLink
                      href="/account"
                      className="flex items-center gap-x-3 text-ui-fg-base dark:text-surface-on"
                      onClick={() => setOpen(false)}
                    >
                      <CircleUser size={20} />
                      Account
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/store"
                      className="flex items-center gap-x-3 text-ui-fg-base dark:text-surface-on"
                      onClick={() => setOpen(false)}
                    >
                      Shop
                    </LocalizedClientLink>
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
