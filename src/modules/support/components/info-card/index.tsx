import { clx } from "@modules/common/components/ui"

type InfoCardProps = {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
  "data-testid"?: string
}

/** Icon + heading + body block used on the support pages. */
export default function InfoCard({
  icon,
  title,
  children,
  className,
  "data-testid": dataTestId,
}: InfoCardProps) {
  return (
    <section
      className={clx(
        "flex gap-x-4 rounded-large border border-outline-variant bg-surface-container-low p-5 small:p-6",
        className
      )}
      data-testid={dataTestId}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-primary-container text-primary-container">
        {icon}
      </div>
      <div className="flex flex-col gap-y-2">
        <h2 className="text-base-semi text-surface-on">{title}</h2>
        <div className="text-small-regular text-surface-on-variant">
          {children}
        </div>
      </div>
    </section>
  )
}
