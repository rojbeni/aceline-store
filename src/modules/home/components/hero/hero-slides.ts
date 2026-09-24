export type HeroSlide = {
  id: string
  eyebrow?: string
  headline: string
  description: string
  ctaLabel: string
  ctaHref: string
  /** CSS background-position for the slide's radial accent glow, e.g. "15% 20%" */
  accentPosition: string
}

export const heroSlides: HeroSlide[] = [
  {
    id: "welcome",
    headline: "Premium Second-Hand Tennis Gear & Shoes",
    description:
      "Welcome to Aceline Store. We offer high-quality, meticulously inspected pre-owned tennis rackets, court shoes, and premium equipment from top brands. Play harder, spend smarter, and give great gear a second life.",
    ctaLabel: "Shop",
    ctaHref: "/store",
    accentPosition: "15% 20%",
  },
  {
    id: "inspected",
    eyebrow: "Quality you can trust",
    headline: "20-Point Inspected Before It Ships",
    description:
      "Every racket, shoe, and piece of gear passes a meticulous quality check by our experts before it reaches you.",
    ctaLabel: "Shop",
    ctaHref: "/store",
    accentPosition: "85% 15%",
  },
  {
    id: "value",
    eyebrow: "Pro gear, smarter prices",
    headline: "Save Up To 60% vs. Retail",
    description:
      "Access top-tier performance rackets and shoes for a fraction of original retail costs, without compromising on quality.",
    ctaLabel: "Shop",
    ctaHref: "/store",
    accentPosition: "50% 85%",
  },
]
