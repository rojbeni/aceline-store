// lib/util/filter-types.ts
import { HttpTypes } from "@medusajs/types"

export type FilterGroup = {
    title: string
    values: string[]
}

export type CategoryFilterItem = {
    id: string
    name: string
    handle: string
}

export function extractVariantFilterOptions(
    products: HttpTypes.StoreProduct[]
): FilterGroup[] {
    const filterMap: Record<string, Set<string>> = {}

    products.forEach((product) => {
        product.options?.forEach((option) => {
            if (!option.title) return
            if (!filterMap[option.title]) {
                filterMap[option.title] = new Set<string>()
            }

            option.values?.forEach((val) => {
                if (val.value) {
                    filterMap[option.title].add(val.value)
                }
            })
        })
    })

    return Object.entries(filterMap).map(([title, set]) => ({
        title,
        values: Array.from(set).sort(),
    }))
}

export function filterProducts(
    products: HttpTypes.StoreProduct[],
    filters: Record<string, string | string[] | undefined>
): HttpTypes.StoreProduct[] {
    const toArray = (val: string | string[] | undefined): string[] => {
        if (!val) return []
        if (Array.isArray(val)) return val
        return [val]
    }

    const categoryIds = [
        ...toArray(filters.categories),
        ...toArray(filters.category_id),
        ...toArray(filters.category),
    ]

    const reservedKeys = new Set(["sortBy", "page", "categories", "category_id", "category", "countryCode"])

    const activeVariantFilters: Record<string, string[]> = {}
    Object.keys(filters).forEach((key) => {
        if (reservedKeys.has(key)) return
        const values = toArray(filters[key])
        if (values.length > 0) {
            activeVariantFilters[key.toLowerCase()] = values.map((v) => v.toLowerCase())
        }
    })

    return products.filter((product) => {
        if (categoryIds.length > 0) {
            const productCatIds = product.categories?.map((c) => c.id) || []
            const matchesCat = categoryIds.some((id) => productCatIds.includes(id))
            if (!matchesCat) return false
        }

        for (const [filterTitle, selectedValues] of Object.entries(activeVariantFilters)) {
            const hasMatchingOption = product.options?.some((opt) => {
                if (opt.title?.toLowerCase() !== filterTitle) return false
                return opt.values?.some(
                    (val) => val.value && selectedValues.includes(val.value.toLowerCase())
                )
            })

            const hasMatchingVariant = product.variants?.some((variant) => {
                return variant.options?.some((optVal) => {
                    const optTitle = optVal.option?.title?.toLowerCase()
                    const optValue = optVal.value?.toLowerCase()
                    return (
                        (optTitle === filterTitle || !optTitle) &&
                        optValue &&
                        selectedValues.includes(optValue)
                    )
                })
            })

            if (!hasMatchingOption && !hasMatchingVariant) {
                return false
            }
        }

        return true
    })
}