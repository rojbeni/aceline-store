"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type MobileCategoryItemProps = {
  category: HttpTypes.StoreProductCategory
  onNavigate: () => void
}

const MobileCategoryItem = ({
  category,
  onNavigate,
}: MobileCategoryItemProps) => {
  const [expanded, setExpanded] = useState(false)
  const children = category.category_children ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <LocalizedClientLink
          href={`/categories/${category.handle}`}
          className="flex-1 py-1 text-ui-fg-base dark:text-surface-on"
          onClick={onNavigate}
          data-testid="mobile-menu-category-link"
        >
          {category.name}
        </LocalizedClientLink>
        {children.length > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            aria-label={expanded ? "Collapse" : "Expand"}
            aria-expanded={expanded}
            className="p-2 text-surface-on-variant"
            data-testid="mobile-menu-category-toggle"
          >
            <ChevronDown
              size={16}
              className={clx("transition-transform duration-200", {
                "rotate-180": expanded,
              })}
            />
          </button>
        )}
      </div>
      {expanded && children.length > 0 && (
        <ul className="flex flex-col gap-y-1 py-1 pl-4">
          {children.map((child) => (
            <li key={child.id}>
              <LocalizedClientLink
                href={`/categories/${child.handle}`}
                className="block py-1 text-small-regular text-surface-on-variant"
                onClick={onNavigate}
                data-testid="mobile-menu-subcategory-link"
              >
                {child.name}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MobileCategoryItem
