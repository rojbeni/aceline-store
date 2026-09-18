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
import TrustBadgeRow from "@modules/common/components/trust-badge-row"

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
        className="content-container grid grid-cols-1 gap-y-6 py-6 small:grid-cols-[minmax(0,520px)_minmax(0,380px)] small:justify-center small:items-start small:gap-x-10 medium:gap-x-12"
        data-testid="product-container"
      >
        <div className="block w-full relative">
          <Carousel
            images={images.map((img) => img.url!)}
            alt={product.title}
          />
        </div>

        <div className="flex flex-col small:sticky small:top-20 w-full py-3 gap-y-6">
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
      </div>
    </>
  )
}

export default ProductTemplate
