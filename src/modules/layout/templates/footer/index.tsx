import { listCategories } from "@lib/data/categories";
import { listCollections } from "@lib/data/collections";
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import FooterSelectors from "@modules/layout/components/footer-selectors"

import LocalizedClientLink from "@modules/common/components/localized-client-link";
import { SiFacebook } from "@icons-pack/react-simple-icons";

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  });
  const productCategories = await listCategories();
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions(),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky">
      <footer className="border-t border-ui-border-base w-full py-6">
        <div className="content-container flex flex-col sm:flex-row justify-between items-center gap-y-4 w-full">
          <div>
            <LocalizedClientLink href="/">Aceline Store</LocalizedClientLink>
            <p>&copy; {new Date().getFullYear()} Aceline Store. All rights reserved.</p>
          </div>
          <div>
            <a href="https://facebook.com" target="_blank" aria-label="Facebook" className="flex justify-end" >
              <SiFacebook className="h-6 w-6 " color="default" />
            </a>
            <FooterSelectors regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>
        </div>
      </footer >
    </div>


  );
}
