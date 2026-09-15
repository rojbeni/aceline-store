"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from "@headlessui/react"
import { ArrowUpDown, ChevronDown } from "lucide-react"
import { clx } from "@modules/common/components/ui"
import { Fragment } from "react"

export type SortOptions = "price_asc" | "price_desc" | "created_at"

type SortProductsProps = {
  sortBy: SortOptions
  "data-testid"?: string
}

const sortOptions = [
  {
    value: "created_at",
    label: "Latest Arrivals",
  },
  {
    value: "price_asc",
    label: "Price: Low -> High",
  },
  {
    value: "price_desc",
    label: "Price: High -> Low",
  },
] as const

const ProductSort = ({ sortBy, "data-testid": dataTestId }: SortProductsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const setQueryParams = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value === "all" || !value) {
      params.delete(name)
    } else {
      params.set(name, value)
    }
    params.delete("page") // Reset page when filtering
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const activeSortOption = sortOptions.find((o) => o.value === sortBy) || sortOptions[0]

  return (
    <div className="relative inline-block text-left" data-testid={dataTestId}>
      <Listbox value={sortBy} onChange={(value) => setQueryParams("sortBy", value)}>
        {({ open }) => (
          <>
            <ListboxButton className="flex items-center gap-x-2 px-4 py-2.5 text-sm font-medium text-ui-fg-subtle bg-white hover:bg-gray-50 border border-gray-200 hover:text-ui-fg-base rounded-full shadow-sm transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-900 select-none">
              <ArrowUpDown className="w-4 h-4 text-ui-fg-muted" />
              <span>Sort by: {activeSortOption.label}</span>
              <ChevronDown className={clx("w-4 h-4 text-ui-fg-muted transition-transform duration-200", open && "rotate-180")} />
            </ListboxButton>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <ListboxOptions className="absolute right-0 mt-2 w-52 origin-top-right divide-y divide-gray-100 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                <div className="py-1">
                  {sortOptions.map((option) => (
                    <ListboxOption
                      key={option.value}
                      value={option.value}
                      className={({ active, selected }) =>
                        clx(
                          "cursor-pointer select-none relative py-2.5 px-4 text-sm transition-colors",
                          selected ? "font-semibold text-ui-fg-base bg-gray-50" : "text-ui-fg-subtle",
                          active ? "bg-gray-100 text-ui-fg-base" : ""
                        )
                      }
                    >
                      {({ selected }) => (
                        <div className="flex items-center justify-between font-sans">
                          <span>{option.label}</span>
                          {selected && (
                            <span className="w-1.5 h-1.5 rounded-full bg-black" />
                          )}
                        </div>
                      )}
                    </ListboxOption>
                  ))}
                </div>
              </ListboxOptions>
            </Transition>
          </>
        )}
      </Listbox>
    </div>
  )
}

export default ProductSort
