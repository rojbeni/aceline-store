import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function BentoGrid() {
  return (
    <section className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:h-[600px]">
        {/* Pro Performance Rackets */}
        <div className="md:col-span-8 relative group overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant performance-card transition-all duration-300 min-h-[300px] md:min-h-0">
          <LocalizedClientLink href="/store" className="absolute inset-0 z-20" />
          <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
            <h3 className="text-2xl md:text-3xl font-semibold text-white mb-2">Pro Performance Rackets</h3>
            <p className="text-white/80 text-sm md:text-base max-w-md">Certified pre-owned frames from Wilson, Babolat, and Head.</p>
          </div>
          <div
            className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 bg-cover bg-center absolute inset-0"
            style={{ backgroundImage: `url('https://media.aceline.online/rackets.webp')` }}
          />
        </div>

        {/* Right Side: Shoes and Accessories */}
        <div className="md:col-span-4 grid grid-rows-2 gap-6 h-[400px] md:h-full">
          {/* Court Shoes */}
          <div className="relative group overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant performance-card transition-all duration-300">
            <LocalizedClientLink href="/categories/shoes" className="absolute inset-0 z-20" />
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-xl md:text-2xl font-semibold text-white">Court Shoes</h3>
            </div>
            <div
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 bg-cover bg-center absolute inset-0"
              style={{ backgroundImage: `url('https://media.aceline.online/shoes.webp')` }}
            />
          </div>

          {/* Accessories */}
          <div className="relative group overflow-hidden rounded-xl bg-surface-container-low border border-outline-variant performance-card transition-all duration-300">
            <LocalizedClientLink href="/store" className="absolute inset-0 z-20" />
            <div className="absolute inset-0 z-10 p-6 flex flex-col justify-end bg-gradient-to-t from-black/50 to-transparent">
              <h3 className="text-xl md:text-2xl font-semibold text-white">Accessories</h3>
            </div>
            <div
              className="w-full h-full transform group-hover:scale-105 transition-transform duration-700 bg-cover bg-center absolute inset-0"
              style={{ backgroundImage: `url('https://media.aceline.online/accessories.webp')` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
