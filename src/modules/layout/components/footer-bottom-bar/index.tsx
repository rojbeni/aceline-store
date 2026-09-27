type FooterBottomBarProps = {
  rightsLabel: string
  locationLabel: string
}

export default function FooterBottomBar({
  rightsLabel,
  locationLabel,
}: FooterBottomBarProps) {
  return (
    <div className="flex flex-col gap-y-2 text-xsmall-regular text-surface-on-variant small:flex-row small:items-center small:justify-between">
      <p data-testid="footer-copyright">
        &copy; {new Date().getFullYear()} Aceline Store. {rightsLabel}
      </p>
      <p>{locationLabel}</p>
    </div>
  )
}
