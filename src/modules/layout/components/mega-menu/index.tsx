"use client"

import { HttpTypes } from "@medusajs/types"
import {
  Popover,
  PopoverButton,
  PopoverGroup,
  PopoverPanel,
} from "@headlessui/react"
import { ChevronDown } from "lucide-react"
import { clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MegaMenuPanel from "./mega-menu-panel"

type MegaMenuProps = {
  categories: HttpTypes.StoreProductCategory[]
}

const MegaMenu = ({ categories }: MegaMenuProps) => {
  return (
    <PopoverGroup className="hidden small:flex items-center h-full gap-x-1">
      {categories.map((category) => {
        const hasPanelContent =
          (category.category_children?.length ?? 0) > 0 ||
          (category.products?.length ?? 0) > 0

        if (!hasPanelContent) {
          return (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="flex h-full items-center px-3 text-small-semi hover:text-ui-fg-base"
              data-testid="mega-menu-link"
            >
              {category.name}
            </LocalizedClientLink>
          )
        }

        return (
          <Popover key={category.id} className="h-full">
            {({ open }) => (
              <>
                <PopoverButton
                  className={clx(
                    "flex h-full items-center gap-x-1 px-3 text-small-semi hover:text-ui-fg-base focus:outline-none",
                    { "text-ui-fg-base": open }
                  )}
                  data-testid="mega-menu-trigger"
                >
                  {category.name}
                  <ChevronDown
                    size={14}
                    className={clx("transition-transform duration-200", {
                      "rotate-180": open,
                    })}
                  />
                </PopoverButton>
                <PopoverPanel
                  transition
                  anchor={{ to: "bottom start", gap: 8 }}
                  className="z-[60] w-[420px] rounded-large border border-outline-variant bg-surface-container-lowest shadow-2xl transition duration-200 ease-out data-[closed]:opacity-0 data-[closed]:-translate-y-1"
                >
                  {({ close }) => (
                    <MegaMenuPanel category={category} onNavigate={close} />
                  )}
                </PopoverPanel>
              </>
            )}
          </Popover>
        )
      })}
    </PopoverGroup>
  )
}

export default MegaMenu
