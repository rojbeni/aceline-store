"use client"

import React, { useCallback, useEffect, useRef, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight, Expand, X } from "lucide-react"
import Image from "next/image"

import { clx } from "@modules/common/components/ui"

interface CarouselProps {
  images: string[]
  alt?: string
  autoSlide?: boolean
  autoSlideInterval?: number
}

export default function Carousel({
  images,
  alt = "Product image",
  autoSlide = false,
  autoSlideInterval = 3000,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!emblaApi) return

    onSelect(emblaApi)
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
  }, [emblaApi, onSelect])

  // Handle auto-sliding
  useEffect(() => {
    if (!autoSlide || !emblaApi) return

    const interval = setInterval(() => {
      emblaApi.scrollNext()
    }, autoSlideInterval)

    return () => clearInterval(interval)
  }, [autoSlide, autoSlideInterval, emblaApi])

  // Lightbox: keyboard nav, scroll lock, focus management
  useEffect(() => {
    if (!lightboxOpen) return

    closeRef.current?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowLeft") scrollPrev()
      if (e.key === "ArrowRight") scrollNext()
    }

    document.addEventListener("keydown", onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = previousOverflow
      triggerRef.current?.focus()
    }
  }, [lightboxOpen, scrollPrev, scrollNext])

  if (images.length === 0) {
    return null
  }

  const imageAlt = (index: number) =>
    images.length > 1 ? `${alt} - image ${index + 1} of ${images.length}` : alt

  return (
    <>
      <div className="relative w-full group">
        {/* Viewport wrapper for Embla */}
        <div
          className="overflow-hidden rounded-large border border-outline-variant bg-surface-container-low performance-card"
          ref={emblaRef}
        >
          {/* Container */}
          <div className="flex">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative min-w-0 flex-[0_0_100%] aspect-square"
              >
                <button
                  type="button"
                  ref={index === 0 ? triggerRef : undefined}
                  onClick={() => setLightboxOpen(true)}
                  className="absolute inset-0 cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary-container"
                  aria-label="Open full-size image viewer"
                >
                  <Image
                    src={img}
                    alt={imageAlt(index)}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover select-none"
                    draggable={false}
                  />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Expand affordance */}
        <div className="pointer-events-none absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/30 text-white opacity-0 backdrop-blur-md transition-opacity duration-300 group-hover:opacity-100">
          <Expand size={16} />
        </div>

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <div className="absolute inset-0 flex items-center justify-between p-4">
            <button
              onClick={scrollPrev}
              className="pointer-events-auto rounded-full border border-white/10 bg-black/30 p-2.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container small:opacity-0 small:group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={scrollNext}
              className="pointer-events-auto rounded-full border border-white/10 bg-black/30 p-2.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container small:opacity-0 small:group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}

        {/* Indicator Dots (mobile only) */}
        {images.length > 1 && (
          <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-1.5 small:hidden">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className={clx(
                  "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                  selectedIndex === i
                    ? "w-6 bg-white"
                    : "w-1.5 bg-white/50 hover:bg-white/80"
                )}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="mt-3 flex flex-wrap justify-center gap-2 py-1 small:justify-start">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => scrollTo(idx)}
              className={clx(
                "relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-base border-2 transition-all duration-300 ease-in-out hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
                selectedIndex === idx
                  ? "border-primary-container opacity-100"
                  : "border-transparent opacity-60 hover:border-outline-variant hover:opacity-100"
              )}
              aria-label={`Go to image ${idx + 1}`}
              aria-current={selectedIndex === idx}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="56px"
                className="object-cover select-none"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-black/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label="Product image viewer"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            ref={closeRef}
            onClick={() => setLightboxOpen(false)}
            className="absolute right-4 top-4 z-10 rounded-full border border-white/20 bg-black/40 p-2.5 text-white transition-colors hover:bg-black/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
            aria-label="Close image viewer"
          >
            <X size={20} />
          </button>

          <div className="relative flex flex-1 items-center justify-center p-6">
            <div
              className="relative h-full w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedIndex]}
                alt={imageAlt(selectedIndex)}
                fill
                sizes="100vw"
                className="object-contain"
                draggable={false}
              />
            </div>

            {images.length > 1 && (
              <div onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={scrollPrev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={scrollNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/10 bg-black/30 p-3 text-white backdrop-blur-md transition-all hover:bg-black/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div
              className="flex justify-center gap-1.5 pb-6"
              onClick={(e) => e.stopPropagation()}
            >
              {scrollSnaps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollTo(i)}
                  className={clx(
                    "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white",
                    selectedIndex === i
                      ? "w-6 bg-primary-container"
                      : "w-1.5 bg-white/40 hover:bg-white/70"
                  )}
                  aria-label={`Go to image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  )
}
