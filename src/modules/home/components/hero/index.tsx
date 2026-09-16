import { ArrowRightMini } from "@medusajs/icons"
import { Button } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center bg-surface">
      {/* Atmospheric background: layered radial gradients in the theme's neon palette, no external image dependency */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(195,244,0,0.08) 0%, transparent 45%), radial-gradient(circle at 85% 15%, rgba(195,244,0,0.05) 0%, transparent 40%), radial-gradient(circle at 50% 100%, rgba(195,244,0,0.04) 0%, transparent 50%)",
        }}
      />
      <div
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="max-w-[1440px] mx-auto px-6 md:px-16 text-center relative z-10 w-full">
        <h1 className="font-sans text-4xl md:text-6xl font-bold max-w-4xl mx-auto mb-8 text-primary-container leading-tight drop-shadow-[0_0_15px_rgba(195,244,0,0.2)]">
          Premium Second-Hand Tennis Gear &amp; Shoes
        </h1>

        <p className="text-base md:text-lg text-ui-fg-subtle max-w-2xl mx-auto mb-12 leading-relaxed">
          Welcome to Aceline Store. We offer high-quality, meticulously inspected pre-owned tennis rackets, court shoes, and premium equipment from top brands. Play harder, spend smarter, and give great gear a second life.        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <LocalizedClientLink href="/store">
            <Button variant="primary" className="px-10 py-4 rounded-lg text-base hover:scale-[1.02] transition-all duration-300 shadow-lg shadow-black/5 flex items-center gap-2 neon-glow">
              Shop
              <ArrowRightMini />
            </Button>
          </LocalizedClientLink>
        </div>
      </div>

      {/* Atmospheric Visual Elements */}
      <div className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-full max-w-5xl px-6 opacity-40 blur-3xl pointer-events-none z-0">
        <div className="h-64 bg-primary-container/10 rounded-full"></div>
      </div>
    </section>
  )
}

export default Hero


