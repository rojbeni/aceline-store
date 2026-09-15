import React, { Suspense } from "react"

import ProductActions from "@modules/products/components/product-actions"
import ProductOnboardingCta from "@modules/products/components/product-onboarding-cta"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ProductActionsWrapper from "./product-actions-wrapper"
import Carousel from "@modules/common/components/carousel"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  return (
    <>
      <div
        className="content-container flex flex-col small:flex-row small:items-start relative gap-y-8 small:gap-x-12 medium:gap-x-16 py-8"
        data-testid="product-container"
      >
        {/* Left Column: Product Gallery */}
        <div className="block w-full small:flex-1 relative">
          <Carousel images={images.map((img) => img.url!)} />
        </div>

        {/* Right Column: Sticky Product Actions and details */}
        <div className="flex flex-col small:sticky small:top-28 w-full small:max-w-[400px] medium:max-w-[440px] py-4 gap-y-8">
          <ProductOnboardingCta />
          <ProductInfo product={product} />
          <div className="h-px bg-border/40 w-full" />
          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <div className="h-px bg-border/40 w-full" />

          <ProductTabs product={product} />
        </div>
      </div>
      <div
        className="content-container"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate
