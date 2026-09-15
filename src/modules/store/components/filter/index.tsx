"use client"

import { useState, useEffect } from "react"
import { CategoryFilterItem, FilterGroup } from "@lib/util/filter-types"
import { HttpTypes } from "@medusajs/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface CatalogFilterFormProps {
    categories: (CategoryFilterItem | HttpTypes.StoreProductCategory)[]
    variantFilters: FilterGroup[]
}

const Filter = ({
    categories,
    variantFilters,
}: CatalogFilterFormProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const [isMobileOpen, setIsMobileOpen] = useState(false)
    const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

    const [localCategories, setLocalCategories] = useState<string[]>(() => [
        ...searchParams.getAll("categories"),
        ...searchParams.getAll("category_id"),
        ...searchParams.getAll("category"),
    ])

    const [localVariants, setLocalVariants] = useState<Record<string, string[]>>(() => {
        const initial: Record<string, string[]> = {}
        variantFilters.forEach((group) => {
            const key = group.title.toLowerCase()
            const vals = searchParams.getAll(key)
            if (vals.length > 0) {
                initial[key] = vals
            }
        })
        return initial
    })

    useEffect(() => {
        setLocalCategories([
            ...searchParams.getAll("categories"),
            ...searchParams.getAll("category_id"),
            ...searchParams.getAll("category"),
        ])

        const updatedVariants: Record<string, string[]> = {}
        variantFilters.forEach((group) => {
            const key = group.title.toLowerCase()
            const vals = searchParams.getAll(key)
            if (vals.length > 0) {
                updatedVariants[key] = vals
            }
        })
        setLocalVariants(updatedVariants)
    }, [searchParams, variantFilters])

    const activeLocalVariantCount = Object.values(localVariants).reduce(
        (acc, vals) => acc + vals.length,
        0
    )

    const totalLocalActiveFilters = localCategories.length + activeLocalVariantCount

    const toggleSection = (title: string) => {
        setCollapsedSections((prev) => ({
            ...prev,
            [title]: !prev[title],
        }))
    }

    const toggleLocalCategory = (catId: string) => {
        setLocalCategories((prev) =>
            prev.includes(catId) ? prev.filter((id) => id !== catId) : [...prev, catId]
        )
    }

    const toggleLocalVariantOption = (groupKey: string, val: string) => {
        setLocalVariants((prev) => {
            const current = prev[groupKey] || []
            const updated = current.includes(val)
                ? current.filter((v) => v !== val)
                : [...current, val]
            return {
                ...prev,
                [groupKey]: updated,
            }
        })
    }

    const handleApplyFilters = () => {
        const params = new URLSearchParams()

        searchParams.forEach((val, key) => {
            if (key === "sortBy") {
                params.append(key, val)
            }
        })

        localCategories.forEach((catId) => {
            params.append("categories", catId)
        })

        Object.entries(localVariants).forEach(([key, values]) => {
            values.forEach((v) => {
                params.append(key, v)
            })
        })

        params.delete("page")
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        setIsMobileOpen(false)
    }

    const handleClearAll = () => {
        setLocalCategories([])
        setLocalVariants({})

        const params = new URLSearchParams()
        searchParams.forEach((val, key) => {
            if (key === "sortBy") {
                params.append(key, val)
            }
        })

        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
        setIsMobileOpen(false)
    }

    return (
        <aside className="w-full md:w-64 flex-shrink-0">
            {/* Mobile Filter Toggle Button */}
            <div className="md:hidden mb-4">
                <button
                    type="button"
                    onClick={() => setIsMobileOpen(!isMobileOpen)}
                    className="w-full flex items-center justify-between px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border dark:border-neutral-800 rounded-md text-xs font-semibold text-neutral-900 dark:text-neutral-100 transition-colors"
                >
                    <span className="flex items-center gap-2 uppercase tracking-wider">
                        <svg
                            className="w-4 h-4 text-neutral-700 dark:text-neutral-300"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                            />
                        </svg>
                        Filters
                        {totalLocalActiveFilters > 0 && (
                            <span className="ml-1 px-1.5 py-0.5 text-[10px] bg-black text-white dark:bg-[#c3f400] dark:text-black font-bold rounded-full">
                                {totalLocalActiveFilters}
                            </span>
                        )}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {isMobileOpen ? "Hide" : "Show"}
                    </span>
                </button>
            </div>

            {/* Filter Drawer / Content */}
            <div className={`space-y-6 ${isMobileOpen ? "block" : "hidden md:block"}`}>
                <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 dark:text-neutral-100">
                            Filters
                        </h3>
                        {totalLocalActiveFilters > 0 && (
                            <span className="px-2 py-0.5 text-[10px] font-bold bg-neutral-900 text-white dark:bg-[#c3f400] dark:text-black rounded-full">
                                {totalLocalActiveFilters}
                            </span>
                        )}
                    </div>
                    {totalLocalActiveFilters > 0 && (
                        <button
                            type="button"
                            onClick={handleClearAll}
                            className="text-xs text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-[#c3f400] underline font-medium transition-colors"
                        >
                            Clear all
                        </button>
                    )}
                </div>

                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleApplyFilters()
                    }}
                    className="space-y-6"
                >
                    {/* Category Checkbox Filter Group */}
                    {categories.length > 0 && (
                        <div className="space-y-3 pb-4 border-b border-neutral-100 dark:border-neutral-800/80">
                            <button
                                type="button"
                                onClick={() => toggleSection("category")}
                                className="w-full flex items-center justify-between text-left group"
                            >
                                <div className="flex items-center gap-2">
                                    <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white uppercase tracking-wide transition-colors">
                                        Category
                                    </h4>
                                    {localCategories.length > 0 && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-[#c3f400]" />
                                    )}
                                </div>
                                <svg
                                    className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform ${collapsedSections["category"] ? "-rotate-90" : ""
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {!collapsedSections["category"] && (
                                <div className="space-y-2 pt-1">
                                    {categories.map((cat) => {
                                        const isChecked = localCategories.includes(cat.id)
                                        return (
                                            <label
                                                key={cat.id}
                                                className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer group"
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={isChecked}
                                                    onChange={() => toggleLocalCategory(cat.id)}
                                                    className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-[#c3f400] focus:ring-black dark:focus:ring-[#c3f400] accent-black dark:accent-[#c3f400] cursor-pointer transition-colors"
                                                />
                                                <span
                                                    className={`transition-colors ${isChecked
                                                        ? "font-semibold text-black dark:text-[#c3f400]"
                                                        : ""
                                                        }`}
                                                >
                                                    {cat.name}
                                                </span>
                                            </label>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Variant Option Filter Groups */}
                    {variantFilters.map((group) => {
                        const key = group.title.toLowerCase()
                        const activeValues = localVariants[key] || []
                        const isCollapsed = collapsedSections[group.title]

                        return (
                            <div
                                key={group.title}
                                className="space-y-3 pb-4 border-b border-neutral-100 dark:border-neutral-800/80"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleSection(group.title)}
                                    className="w-full flex items-center justify-between text-left group"
                                >
                                    <div className="flex items-center gap-2">
                                        <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200 group-hover:text-black dark:group-hover:text-white uppercase tracking-wide transition-colors">
                                            {group.title}
                                        </h4>
                                        {activeValues.length > 0 && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-[#c3f400]" />
                                        )}
                                    </div>
                                    <svg
                                        className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform ${isCollapsed ? "-rotate-90" : ""
                                            }`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                        />
                                    </svg>
                                </button>

                                {!isCollapsed && (
                                    <div className="space-y-2 pt-1">
                                        {group.values.map((val) => {
                                            const isChecked = activeValues.includes(val)
                                            return (
                                                <label
                                                    key={val}
                                                    className="flex items-center gap-2.5 text-xs text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer group"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleLocalVariantOption(key, val)}
                                                        className="h-4 w-4 rounded border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 text-black dark:text-[#c3f400] focus:ring-black dark:focus:ring-[#c3f400] accent-black dark:accent-[#c3f400] cursor-pointer transition-colors"
                                                    />
                                                    <span
                                                        className={`transition-colors ${isChecked
                                                            ? "font-semibold text-black dark:text-[#c3f400]"
                                                            : ""
                                                            }`}
                                                    >
                                                        {val}
                                                    </span>
                                                </label>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}

                    {/* Submit / Apply Filters Button */}
                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 dark:bg-[#c3f400] dark:hover:bg-[#b0dc00] text-white dark:text-black font-semibold text-xs rounded-md uppercase tracking-wider transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-[#c3f400] focus:ring-offset-2"
                        >
                            Apply Filters
                        </button>
                    </div>
                </form>
            </div>
        </aside>
    )
}

export default Filter



