import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { getLocale } from "@lib/data/locale-actions"
import { listLocales } from "@lib/data/locales"
import { listRegions } from "@lib/data/regions"
import { getTranslation } from "@lib/util/translations"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import MegaMenu from "@modules/layout/components/mega-menu"
import MobileMenu from "@modules/layout/components/mobile-menu"
import ThemeToggle from "@modules/layout/components/theme-toggle"
import TopBar from "@modules/layout/components/top-bar"
import { CircleUser, ShoppingCart } from 'lucide-react';

export default async function Nav() {
  const [categories, regions, locales, currentLocale] = await Promise.all([
    listCategories(),
    listRegions(),
    listLocales(),
    getLocale(),
  ])
  const t = (key: string) => getTranslation(currentLocale, key)
  const topLevelCategories = categories.filter(
    (category) => !category.parent_category
  )

  return (
    <div>
      <TopBar
        regions={regions}
        locales={locales}
        currentLocale={currentLocale}
        t={t}
      />
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
