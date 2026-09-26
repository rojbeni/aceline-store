import { MetadataRoute } from "next"

import { getBaseURL } from "@lib/util/env"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*/checkout", "/*/cart", "/*/account", "/*/order"],
    },
    sitemap: `${getBaseURL()}/sitemap.xml`,
  }
}
