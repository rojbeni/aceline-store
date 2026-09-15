'use client';

import React, { useState, useEffect, useCallback } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    images: string[];
    autoSlide?: boolean;
    autoSlideInterval?: number;
}

export default function Carousel({
    images,
    autoSlide = false,
    autoSlideInterval = 3000,
}: CarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

    const scrollPrev = useCallback(() => {
        if (emblaApi) emblaApi.scrollPrev();
    }, [emblaApi]);

    const scrollNext = useCallback(() => {
        if (emblaApi) emblaApi.scrollNext();
    }, [emblaApi]);

    const scrollTo = useCallback(
        (index: number) => {
            if (emblaApi) emblaApi.scrollTo(index);
        },
        [emblaApi]
    );

    const onSelect = useCallback((emblaApi: any) => {
        setSelectedIndex(emblaApi.selectedScrollSnap());
    }, []);

    useEffect(() => {
        if (!emblaApi) return;

        onSelect(emblaApi);
        setScrollSnaps(emblaApi.scrollSnapList());
        emblaApi.on('select', onSelect);
        emblaApi.on('reInit', onSelect);
    }, [emblaApi, onSelect]);

    // Handle auto-sliding
    useEffect(() => {
        if (!autoSlide || !emblaApi) return;

        const interval = setInterval(() => {
            emblaApi.scrollNext();
        }, autoSlideInterval);

        return () => clearInterval(interval);
    }, [autoSlide, autoSlideInterval, emblaApi]);

    return (
        <div className="relative w-full max-w-4xl mx-auto group">
            {/* Viewport wrapper for Embla */}
            <div className="overflow-hidden rounded-2xl shadow-xl" ref={emblaRef}>
                {/* Container */}
                <div className="flex">
                    {images.map((img, index) => (
                        <div key={index} className="flex-[0_0_100%] min-w-0 aspect-[16/9] relative">
                            <img
                                src={img}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover select-none"
                                draggable="false"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <button
                        onClick={scrollPrev}
                        className="p-2.5 rounded-full shadow-lg bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <button
                        onClick={scrollNext}
                        className="p-2.5 rounded-full shadow-lg bg-black/30 hover:bg-black/50 text-white backdrop-blur-md border border-white/10 transition-all duration-300 hover:scale-105 active:scale-95 pointer-events-auto"
                        aria-label="Next slide"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}

            {/* Indicator Dots */}
            {images.length > 1 && (
                <div className="absolute bottom-4 right-0 left-0 md:hidden">
                    <div className="flex items-center justify-center gap-1.5">
                        {scrollSnaps.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => scrollTo(i)}
                                className={`
                  transition-all duration-300 h-1.5 rounded-full
                  ${selectedIndex === i ? "w-6 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"}
                `}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="mt-5 flex justify-center gap-3 overflow-x-auto py-2 no-scrollbar">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => scrollTo(idx)}
                            className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ease-in-out flex-shrink-0 hover:scale-105
                                ${selectedIndex === idx 
                                    ? "border-black dark:border-[#c3f400] shadow-lg scale-105" 
                                    : "border-transparent hover:border-black/20 dark:hover:border-white/10 opacity-60 hover:opacity-100"}`}
                            aria-label={`Go to slide ${idx + 1}`}
                        >
                            <img
                                src={img}
                                alt={`Thumbnail ${idx + 1}`}
                                className="w-full h-full object-cover select-none"
                                draggable="false"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}