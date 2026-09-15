import { MetadataRoute } from 'next'

const MEDUSA_API_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
const STORE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://yourstore.com"
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""

// Helper to fetch regions from Medusa
async function getMedusaRegions() {
    try {
        const res = await fetch(`${MEDUSA_API_URL}/store/regions`, {
            headers: {
                "x-publishable-api-key": PUBLISHABLE_API_KEY
            },
            next: { revalidate: 3600 }
        })
        const { regions } = await res.json()
        return regions || []
    } catch (error) {
        console.error("Failed to fetch regions for sitemap:", error)
        return []
    }
}

// Helper to fetch all active product handles from Medusa
async function getMedusaProducts() {
    try {
        const res = await fetch(`${MEDUSA_API_URL}/store/products?limit=100`, {
            headers: {
                "x-publishable-api-key": PUBLISHABLE_API_KEY
            },
            next: { revalidate: 3600 }
        })
        const { products } = await res.json()
        return products || []
    } catch (error) {
        console.error("Failed to fetch products for sitemap:", error)
        return []
    }
}

// Helper to fetch categories or collections
async function getMedusaCategories() {
    try {
        const res = await fetch(`${MEDUSA_API_URL}/store/product-categories`, {
            headers: {
                "x-publishable-api-key": PUBLISHABLE_API_KEY
            },
            next: { revalidate: 3600 }
        })
        const { product_categories } = await res.json()
        return product_categories || []
    } catch (error) {
        console.error("Failed to fetch categories for sitemap:", error)
        return []
    }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // 1. Fetch regions to get all country codes
    const regions = await getMedusaRegions()
    let countryCodes: string[] = regions.flatMap((region: any) => 
        region.countries?.map((c: any) => c.iso_2?.toLowerCase()) || []
    ).filter(Boolean)

    // Fallback to default region or us if none found
    if (countryCodes.length === 0) {
        countryCodes = [process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"]
    }

    // 2. Fetch dynamic routes from Medusa
    const products = await getMedusaProducts()
    const categories = await getMedusaCategories()

    // 3. Define static routes for each country code
    const staticPaths = ["", "/store"]
    const staticRoutes = countryCodes.flatMap((countryCode) => 
        staticPaths.map((path) => ({
            url: `${STORE_URL}/${countryCode}${path}`,
            lastModified: new Date().toISOString(),
            changeFrequency: 'daily' as const,
            priority: path === "" ? 1.0 : 0.9,
        }))
    )

    // 4. Map products to sitemap entries for each country code
    const productRoutes = countryCodes.flatMap((countryCode) => 
        products.map((product: any) => ({
            url: `${STORE_URL}/${countryCode}/products/${product.handle}`,
            lastModified: product.updated_at || new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }))
    )

    // 5. Map categories to sitemap entries for each country code
    const categoryRoutes = countryCodes.flatMap((countryCode) => 
        categories.map((category: any) => ({
            url: `${STORE_URL}/${countryCode}/categories/${category.handle}`,
            lastModified: category.updated_at || new Date().toISOString(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))
    )

    return [...staticRoutes, ...productRoutes, ...categoryRoutes]
}