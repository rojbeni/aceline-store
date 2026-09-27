import ReactCountryFlag from "react-country-flag"

import { clx } from "@modules/common/components/ui"

// flag-icons' square (1x1) set — the library defaults to 4x3, which a
// border-radius would squash into an oval rather than a circle.
const SQUARE_FLAG_CDN = "https://cdn.jsdelivr.net/gh/lipis/flag-icons/flags/1x1/"

type RoundFlagProps = {
  countryCode: string
  size?: number
  className?: string
}

/** Circular country flag. `countryCode` is ISO 3166-1 alpha-2 (e.g. "TN"). */
export default function RoundFlag({
  countryCode,
  size = 16,
  className,
}: RoundFlagProps) {
  return (
    <ReactCountryFlag
      svg
      cdnUrl={SQUARE_FLAG_CDN}
      countryCode={countryCode}
      aria-hidden
      className={clx(
        "shrink-0 rounded-full object-cover ring-1 ring-outline-variant",
        className
      )}
      style={{ width: size, height: size }}
    />
  )
}
