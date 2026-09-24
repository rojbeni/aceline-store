import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import MobileMenu from "@modules/layout/components/mobile-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"
import { CircleUser, ShoppingCart } from 'lucide-react';

export default async function Nav() {
  const categories = await listCategories()
  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  )

  return (
    <div >
      <header className="relative h-16 mx-auto border-b duration-200 border-ui-border-base">
        <nav className="content-container flex items-center justify-between w-full h-full">
          <div className="flex items-center h-full gap-x-8">
            <LocalizedClientLink
              className="hover:text-ui-fg-base"
              href="/"
              data-testid="nav-logo-link"
            >
              Aceline Store
            </LocalizedClientLink>
            <MegaMenu categories={topLevelCategories} />
          </div>

          <div className="flex items-center gap-x-6 h-full justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <ThemeToggle />
              <LocalizedClientLink
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                <CircleUser></CircleUser>
              </LocalizedClientLink>
            </div>
            <div className="small:hidden">
              <ThemeToggle />
            </div>
            <MobileMenu categories={topLevelCategories} />
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
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
