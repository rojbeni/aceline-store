"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { HttpTypes } from "@medusajs/types"
import { Heading } from "@modules/common/components/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"

type ProductRailCarouselProps = {
  title: string
  viewAllHref: string
  products: HttpTypes.StoreProduct[]
  region: HttpTypes.StoreRegion
}

const ProductRailCarousel = ({
  title,
  viewAllHref,
  products,
  region,
}: ProductRailCarouselProps) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    dragFree: true,
    containScroll: "trimSnaps",
  })
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  return (
    <div className="content-container py-12 small:py-24">
      <div className="flex justify-between items-center mb-8">
        <Heading level="h2" className="text-2xl md:text-3xl text-primary">
          {title}
        </Heading>
        <div className="flex items-center gap-x-4">
          <InteractiveLink href={viewAllHref}>View all</InteractiveLink>
          {/* Rail nav sits beside the heading rather than over the cards below,
              since card height varies with title/price text and would overlap. */}
          <div className="hidden small:flex items-center gap-x-2">
            <button
              type="button"
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              className="flex items-center justify-center rounded-full border border-outline-variant p-2 text-surface-on transition-all duration-200 hover:bg-surface-container-low disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              aria-label="Previous products"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              disabled={!canScrollNext}
              className="flex items-center justify-center rounded-full border border-outline-variant p-2 text-surface-on transition-all duration-200 hover:bg-surface-container-low disabled:opacity-30 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              aria-label="Next products"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-x-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="min-w-0 flex-[0_0_75%] xsmall:flex-[0_0_50%] small:flex-[0_0_33.333%] medium:flex-[0_0_25%]"
            >
              <ProductPreview product={product} region={region} isFeatured />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductRailCarousel
