"use client"

import { Star } from "lucide-react"

import { Text } from "@modules/common/components/ui"
import Back from "@modules/common/icons/back"
import FastDelivery from "@modules/common/icons/fast-delivery"
import Refresh from "@modules/common/icons/refresh"

import Accordion from "./accordion"
import { HttpTypes } from "@medusajs/types"

type ProductTabsProps = {
  product: HttpTypes.StoreProduct
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  const tabs = [
    {
      label: "Product Information",
      component: <ProductInfoTab product={product} />,
    },
    {
      label: "Shipping & Returns",
      component: <ShippingInfoTab />,
    },
    {
      label: "Reviews",
      component: <ReviewsTab />,
    },
  ]

  return (
    <div className="w-full">
      <Accordion type="multiple">
        {tabs.map((tab, i) => (
          <Accordion.Item
            key={i}
            title={tab.label}
            headingSize="medium"
            value={tab.label}
          >
            {tab.component}
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  )
}

const ProductInfoTab = ({ product }: ProductTabsProps) => {
  return (
    <div className="text-xsmall-regular py-4">
      <div className="grid grid-cols-2 gap-x-6">
        <div className="flex flex-col gap-y-3">
          <div>
            <span className="font-semibold">Material</span>
            <p>{product.material ? product.material : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Country of origin</span>
            <p>{product.origin_country ? product.origin_country : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Type</span>
            <p>{product.type ? product.type.value : "-"}</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-3">
          <div>
            <span className="font-semibold">Weight</span>
            <p>{product.weight ? `${product.weight} g` : "-"}</p>
          </div>
          <div>
            <span className="font-semibold">Dimensions</span>
            <p>
              {product.length && product.width && product.height
                ? `${product.length}L x ${product.width}W x ${product.height}H`
                : "-"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ShippingInfoTab = () => {
  return (
    <div className="text-xsmall-regular py-4">
      <div className="grid grid-cols-1 gap-y-5">
        <div className="flex items-start gap-x-2.5 text-surface-on-variant">
          <FastDelivery
            size={14}
            className="text-primary-container flex-shrink-0"
          />
          <div>
            <span className="font-semibold text-surface-on">Fast delivery</span>
            <p className="max-w-sm">
              Your package will arrive in 3-5 business days at your pick up
              location or in the comfort of your home.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2.5 text-surface-on-variant">
          <Refresh
            size={14}
            className="text-primary-container flex-shrink-0"
          />
          <div>
            <span className="font-semibold text-surface-on">Simple exchanges</span>
            <p className="max-w-sm">
              Is the fit not quite right? No worries - we&apos;ll exchange your
              product for a new one.
            </p>
          </div>
        </div>
        <div className="flex items-start gap-x-2.5 text-surface-on-variant">
          <Back
            size={14}
            className="text-primary-container flex-shrink-0"
          />
          <div>
            <span className="font-semibold text-surface-on">Easy returns</span>
            <p className="max-w-sm">
              Just return your product and we&apos;ll refund your money. No
              questions asked – we&apos;ll do our best to make sure your return
              is hassle-free.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

const ReviewsTab = () => {
  return (
    <div className="text-xsmall-regular py-4">
      <div className="flex flex-col items-center gap-y-2 text-center">
        <div className="flex items-center gap-x-1 text-surface-on-variant" aria-hidden="true">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5" strokeWidth={1.5} />
          ))}
        </div>
        <Text className="text-small-semi text-surface-on">No reviews yet</Text>
        <Text className="max-w-sm text-xsmall-regular text-surface-on-variant">
          Be the first to share what you think about this product.
        </Text>
      </div>
    </div>
  )
}

export default ProductTabs
