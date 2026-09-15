import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Geist } from 'next/font/google';
import "styles/globals.css"
import { GoogleAnalytics } from "@next/third-parties/google"
import { getLocale } from "@lib/data/locale-actions"
import { TranslationProvider } from "@lib/context/translation-context"

const font = Geist({ subsets: ['latin'], weight: ['200'] });

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const locale = await getLocale()
  const langCode = locale ? locale.split("-")[0].toLowerCase() : "en"

  return (
    <html lang={langCode} data-mode="dark" className="dark" suppressHydrationWarning>
      <body className={font.className}>
        <TranslationProvider locale={locale}>
          <main className="relative flex flex-col min-h-screen">{props.children}</main>
        </TranslationProvider>
      </body>
      <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ""} />
    </html>
  )
}
