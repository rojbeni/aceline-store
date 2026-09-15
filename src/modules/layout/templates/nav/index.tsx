import { Suspense } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import { CircleUser, ShoppingCart } from 'lucide-react';
import { ArrowRightMini } from "@medusajs/icons"
import { Button } from "@modules/common/components/ui"
export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 group">
      <header className="relative h-16 mx-auto border-b duration-200 border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex-1 basis-0 h-full flex items-center">
            <LocalizedClientLink
              className="hover:text-ui-fg-base"
              href="/"
              data-testid="nav-account-link"
            >
              Aceline Store
            </LocalizedClientLink>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <CircleUser></CircleUser>
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-ui-fg-base"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  <div className="relative inline-flex items-center">
                    <ShoppingCart size={20} />
                  </div>
                </LocalizedClientLink>
              }
            >
              <CartButton />

              <LocalizedClientLink href="/store">
                <Button variant="primary" className="rounded-full flex items-center justify-center">
                  Shop
                  <ArrowRightMini className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </LocalizedClientLink>

            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
