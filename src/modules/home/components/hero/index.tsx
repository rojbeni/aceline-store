"use client"

import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ArrowRightMini } from "@medusajs/icons"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button, clx } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { heroSlides } from "./hero-slides"

const AUTOPLAY_INTERVAL_MS = 6000

const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap())
    onSelect()
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)

    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi])

  // Autoplay, paused on hover/focus and for users who prefer reduced motion
  useEffect(() => {
    if (!emblaApi || isPaused || heroSlides.length < 2) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return
    }

    const interval = setInterval(
      () => emblaApi.scrollNext(),
      AUTOPLAY_INTERVAL_MS
    )

    return () => clearInterval(interval)
  }, [emblaApi, isPaused])

  return (
    <section
      className="relative overflow-hidden min-h-[80vh] flex items-center bg-surface"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured promotions"
    >
      {/* Faint grid overlay, shared across all slides */}
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="overflow-hidden w-full" ref={emblaRef}>
        <div className="flex">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className="relative min-w-0 flex-[0_0_100%]"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${heroSlides.length}`}
              aria-hidden={selectedIndex !== index}
            >
              {/* Slide accent glow */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle at ${slide.accentPosition}, rgba(195,244,0,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(195,244,0,0.05) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(195,244,0,0.04) 0%, transparent 50%)`,
                }}
              />

              <div className="max-w-[1440px] mx-auto px-6 md:px-16 text-center relative z-10 w-full py-24">
                {slide.eyebrow && (
                  <span className="inline-block mb-4 text-small-semi uppercase tracking-wider text-primary-container">
                    {slide.eyebrow}
                  </span>
                )}
                {/* One <h1> per page — later slides use <h2>. */}
                {(() => {
                  const HeadlineTag = index === 0 ? "h1" : "h2"
                  return (
                    <HeadlineTag className="font-sans text-4xl md:text-6xl font-bold max-w-4xl mx-auto mb-8 text-primary-container leading-tight drop-shadow-[0_0_15px_rgba(195,244,0,0.2)]">
                      {slide.headline}
                    </HeadlineTag>
                  )
                })()}

                <p className="text-base md:text-lg text-ui-fg-subtle max-w-2xl mx-auto mb-12 leading-relaxed">
                  {slide.description}
                </p>

                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <LocalizedClientLink href={slide.ctaHref}>
                    <Button
                      variant="primary"
                      className="group px-10 py-4 rounded-lg text-base hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/5 flex items-center gap-2 neon-glow"
                    >
                      {slide.ctaLabel}
                      <ArrowRightMini className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </LocalizedClientLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Atmospheric visual element, shared across all slides */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 opacity-40 blur-3xl pointer-events-none z-0">
        <div className="h-64 bg-primary-container/10 rounded-full"></div>
      </div>

      {heroSlides.length > 1 && (
        <>
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 z-20 hidden small:flex items-center justify-between px-4 md:px-8 pointer-events-none">
            <button
              type="button"
              onClick={scrollPrev}
              className="pointer-events-auto rounded-full border border-white/10 bg-black/30 p-2.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              aria-label="Previous slide"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="pointer-events-auto rounded-full border border-white/10 bg-black/30 p-2.5 text-white shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/50 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container"
              aria-label="Next slide"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-8 z-20 flex items-center justify-center gap-1.5">
            {heroSlides.map((slide, index) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => scrollTo(index)}
                className={clx(
                  "h-1.5 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-container",
                  selectedIndex === index
                    ? "w-6 bg-primary-container"
                    : "w-1.5 bg-white/40 hover:bg-white/70"
                )}
                aria-label={`Go to slide ${index + 1}`}
                aria-current={selectedIndex === index}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}

export default Hero
