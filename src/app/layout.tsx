import { getBaseURL } from "@lib/util/env"
import { DEFAULT_DESCRIPTION, SITE_NAME } from "@lib/util/seo"
import { Metadata } from "next"
import { Geist } from 'next/font/google';
import "styles/globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { getLocale } from "@lib/data/locale-actions"
import { TranslationProvider } from "@lib/context/translation-context"

const font = Geist({ subsets: ['latin'], weight: ['200'] });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    type: "website",
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  const langCode = locale ? locale.split("-")[0].toLowerCase() : "en"

  return (
    <html lang={langCode} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"){t="dark"}var r=document.documentElement;r.classList.toggle("dark",t==="dark");r.setAttribute("data-mode",t)}catch(e){document.documentElement.classList.add("dark")}})();`,
          }}
        />
      </head>
      <body className={font.className}>
        <TranslationProvider locale={locale}>
          <main className="relative flex flex-col min-h-screen">{props.children}</main>
        </TranslationProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
    </html>
  )
}
