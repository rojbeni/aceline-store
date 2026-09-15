import { clx } from "@modules/common/components/ui"

const Divider = ({ className }: { className?: string }) => (
  <div
    className={clx("h-px w-full border-b border-gray-200 dark:border-outline-variant mt-1", className)}
  />
)

export default Divider
