import type { ComponentType, SVGProps } from "react"
import { Headset, RotateCcw, ShieldCheck, Truck } from "lucide-react"

import { Text, clx } from "@modules/common/components/ui"

export type TrustBadgeItem = {
  icon: ComponentType<SVGProps<SVGSVGElement>>
  label: string
  description?: string
}

const defaultItems: TrustBadgeItem[] = [
  { icon: Truck, label: "Fast shipping", description: "Delivered in 3-5 business days" },
  { icon: ShieldCheck, label: "Secure checkout", description: "Encrypted, trusted payments" },
  { icon: RotateCcw, label: "Easy returns", description: "30-day hassle-free returns" },
  { icon: Headset, label: "Expert support", description: "Real humans, real fast" },
]

type TrustBadgeRowProps = {
  items?: TrustBadgeItem[]
  variant?: "compact" | "full"
  className?: string
}

const TrustBadgeRow = ({
  items = defaultItems,
  variant = "full",
  className,
}: TrustBadgeRowProps) => {
  if (variant === "compact") {
    return (
      <div
        className={clx(
          "flex flex-col divide-y divide-outline-variant rounded-large border border-outline-variant bg-surface-container-low xsmall:flex-row xsmall:divide-y-0 xsmall:divide-x",
          className
        )}
        data-testid="trust-badge-row"
      >
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-1 items-center gap-x-2 px-3 py-2"
          >
            <item.icon className="h-3.5 w-3.5 flex-shrink-0 text-primary-container" />
            <Text className="text-xsmall-regular text-surface-on-variant">
              {item.label}
            </Text>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      className={clx(
        "grid grid-cols-2 gap-6 medium:grid-cols-4 medium:gap-8",
        className
      )}
      data-testid="trust-badge-row"
    >
      {items.map((item) => (
        <div key={item.label} className="flex flex-col items-center gap-y-3 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-primary-container bg-surface-container-low text-primary-container neon-glow">
            <item.icon className="h-5 w-5" />
          </div>
          <div className="flex flex-col gap-y-1">
            <Text className="text-base-semi text-surface-on">{item.label}</Text>
            {item.description && (
              <Text className="text-small-regular text-surface-on-variant">
                {item.description}
              </Text>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default TrustBadgeRow
