"use client"

import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { useTranslation } from "@lib/context/translation-context"

type MegaMenuPanelProps = {
  category: HttpTypes.StoreProductCategory
  onNavigate: () => void
}

const MegaMenuPanel = ({ category, onNavigate }: MegaMenuPanelProps) => {
  const { t } = useTranslation()
  const children = category.category_children ?? []
  const featuredProduct = category.products?.[0]

  return (
    <div className="grid grid-cols-[1fr_180px] gap-6 p-6">
      <div>
        <span className="text-xsmall-regular font-semibold uppercase tracking-wider text-surface-on-variant">
          {t("Shop")} {category.name}
        </span>
        <ul className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
          {children.length ? (
            children.map((child) => (
              <li key={child.id}>
                <LocalizedClientLink
                  href={`/categories/${child.handle}`}
                  className="block py-1 text-base-regular text-surface-on hover:text-primary-on-container"
                  data-testid="mega-menu-subcategory-link"
                  onClick={onNavigate}
                >
                  {child.name}
                </LocalizedClientLink>
              </li>
            ))
          ) : (
            <li>
              <LocalizedClientLink
                href={`/categories/${category.handle}`}
                className="block py-1 text-base-regular text-surface-on hover:text-primary-on-container"
                onClick={onNavigate}
              >
                {t("View all")}
              </LocalizedClientLink>
            </li>
          )}
        </ul>
      </div>
      {featuredProduct && (
        <LocalizedClientLink
          href={`/products/${featuredProduct.handle}`}
          className="block"
          data-testid="mega-menu-featured-product"
          onClick={onNavigate}
        >
          <Thumbnail
            thumbnail={featuredProduct.thumbnail}
            alt={featuredProduct.title}
            size="square"
          />
          <span className="mt-2 block truncate text-small-regular text-surface-on">
            {featuredProduct.title}
          </span>
        </LocalizedClientLink>
      )}
    </div>
  )
}

export default MegaMenuPanel
