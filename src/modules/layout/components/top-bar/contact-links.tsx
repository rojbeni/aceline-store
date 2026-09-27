import { SiFacebook, SiWhatsapp } from "@icons-pack/react-simple-icons"
import { Phone } from "lucide-react"

import {
  FACEBOOK_URL,
  PHONE_DISPLAY,
  PHONE_E164,
  WHATSAPP_URL,
} from "@lib/util/seo"

type ContactLinksProps = {
  callLabel: string
  whatsappLabel: string
  facebookLabel: string
}

const linkClassName =
  "flex items-center gap-x-1.5 transition-colors hover:text-primary-container"

export default function ContactLinks({
  callLabel,
  whatsappLabel,
  facebookLabel,
}: ContactLinksProps) {
  return (
    <div className="flex items-center gap-x-4">
      <a
        href={`tel:${PHONE_E164}`}
        aria-label={`${callLabel} ${PHONE_DISPLAY}`}
        className={linkClassName}
        data-testid="top-bar-phone-link"
      >
        <Phone className="h-3.5 w-3.5" aria-hidden />
        <span className="whitespace-nowrap">{PHONE_DISPLAY}</span>
      </a>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={whatsappLabel}
        className={linkClassName}
        data-testid="top-bar-whatsapp-link"
      >
        <SiWhatsapp className="h-3.5 w-3.5" color="currentColor" aria-hidden />
        <span className="hidden small:inline">WhatsApp</span>
      </a>
      <a
        href={FACEBOOK_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={facebookLabel}
        className={linkClassName}
        data-testid="top-bar-facebook-link"
      >
        <SiFacebook className="h-3.5 w-3.5" color="currentColor" aria-hidden />
        <span className="hidden small:inline">Facebook</span>
      </a>
    </div>
  )
}
