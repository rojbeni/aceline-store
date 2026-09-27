import LocalizedClientLink from "@modules/common/components/localized-client-link"

type FooterLink = {
  href: string
  label: string
  "data-testid"?: string
}

type FooterBottomBarProps = {
  rightsLabel: string
  locationLabel: string
  links: FooterLink[]
}

export default function FooterBottomBar({
  rightsLabel,
  locationLabel,
  links,
}: FooterBottomBarProps) {
  return (
    <div className="flex flex-col gap-y-3 text-xsmall-regular text-surface-on-variant small:flex-row small:items-center small:justify-between">
      <p data-testid="footer-copyright">
        &copy; {new Date().getFullYear()} Aceline Store. {rightsLabel}
      </p>
      <nav className="flex flex-wrap items-center gap-x-5 gap-y-2">
        {links.map((link) => (
          <LocalizedClientLink
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-primary-container"
            data-testid={link["data-testid"]}
          >
            {link.label}
          </LocalizedClientLink>
        ))}
        <span>{locationLabel}</span>
      </nav>
    </div>
  )
}
