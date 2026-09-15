"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import FilterRadioGroup from "@modules/common/components/filter-radio-group"

type RefinementListProps = {
  categories?: HttpTypes.StoreProductCategory[]
  categoryId?: string
  'data-testid'?: string
}

const RefinementList = ({
  categories,
  categoryId,
  'data-testid': dataTestId,
}: RefinementListProps) => {
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
    router.push(`${pathname}?${params.toString()}`)
  }

  const categoryItems = [
    { value: "all", label: "All Categories" },
    ...(categories?.map((c) => ({
      value: c.id,
      label: c.name,
    })) || []),
  ]

  return (
    <div className="flex small:flex-col gap-12 py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]" data-testid={dataTestId}>
      <FilterRadioGroup
        title="Categories"
        items={categoryItems}
        value={categoryId || "all"}
        handleChange={(value) => setQueryParams("category", value)}
      />
    </div>
  )
}

export default RefinementList
