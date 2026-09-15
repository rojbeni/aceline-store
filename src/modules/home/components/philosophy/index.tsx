import { ShieldCheck, Leaf, CircleDollarSign } from "lucide-react"

export default function Philosophy() {
  return (
    <section className="bg-surface-container-lowest py-16 md:py-24 border-t border-outline-variant">
      <div className="max-w-[1440px] mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-primary-container p-4 bg-surface-container-low rounded-full border-2 border-primary-container neon-glow mb-2">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-semibold text-primary">Meticulously Inspected</h4>
          <p className="text-ui-fg-subtle text-sm md:text-base leading-relaxed">
            Every piece of gear undergoes a 20-point inspection by our experts before it hits the store.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-primary-container p-4 bg-surface-container-low rounded-full border-2 border-primary-container neon-glow mb-2">
            <Leaf className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-semibold text-primary">Sustainability First</h4>
          <p className="text-ui-fg-subtle text-sm md:text-base leading-relaxed">
            Reduce waste and promote circular economy by giving premium tennis equipment a second life.
          </p>
        </div>
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="text-primary-container p-4 bg-surface-container-low rounded-full border-2 border-primary-container neon-glow mb-2">
            <CircleDollarSign className="h-8 w-8" />
          </div>
          <h4 className="text-xl font-semibold text-primary">Pro Gear, Smarter Prices</h4>
          <p className="text-ui-fg-subtle text-sm md:text-base leading-relaxed">
            Access top-tier performance rackets and shoes for up to 60% less than original retail costs.
          </p>
        </div>
      </div>
    </section>
  )
}
