## Design Reference
Design inspiration: https://www.tennispro.fr — a dense, merchandising-heavy 
sports-retail layout. Adapt the *structure and UX patterns* below, not the 
literal branding/colors (Tennispro is unrelated to our brand).

### Navigation
- Mega-menu on hover/click for top-level categories, with nested columns: 
  Brand / Type / Attribute filters, plus one featured product tile per menu
- Sticky header with search, account, cart icon, and a slim promo bar above nav 
  (e.g. "Free shipping over €49")

### Homepage
- Full-width hero carousel (3-4 slides, autoplay, manual arrows + dot indicators)
- Below hero: 2x2 or 4-across grid of promotional/category tiles
- Horizontal-scroll carousel for featured products or brand spotlights
- Trust-badge row (icons + short text): shipping speed, support, returns, selection
- Newsletter capture block with a clear incentive (discount code)

### Product Listing Page
- Left sidebar filters: Brand, Type, Price, Attribute-specific (e.g. surface, 
  level) — collapsible accordion sections
- Grid of product cards: image, brand, name, price, quick "discover" CTA
- Sort + result count bar above grid

### Product Detail Page
- Image gallery left, sticky buy-box right (price, variant selectors, add to cart)
- Below fold: tabs or accordion for description, specs, reviews

### Footer
- Multi-column: Company / Services / Help / Legal / Language switcher
- Payment security badges + social icons row at the very bottom

### Component priorities for implementation
1. MegaMenu component (nav)
2. HeroCarousel component (homepage)
3. PromoTileGrid component (homepage)
4. TrustBadgeRow component (homepage + maybe checkout)
5. ProductFilterSidebar component (PLP)


### Design tokens (from src/styles/global.css)

**Color system** — Material Design 3-style surface scale, light/dark aware

| Token | Light | Dark | Use |
|---|---|---|---|
| `--primary` | #101319 | #ffffff | Primary text/UI color, inverts per mode |
| `--primary-foreground` | #ffffff | #101319 | Text on primary |
| `--primary-container` | #c3f400 | #c3f400 | **Brand accent — neon lime, mode-stable** |
| `--on-primary-container` | #3d4d00 | #556d00 | Text on accent container |
| `--surface` | #ffffff | #101319 | Page background |
| `--surface-dim` | #f2f3f6 | #101319 | Dimmed surface |
| `--surface-bright` | #ffffff | #363940 | Brightest surface |
| `--surface-container-lowest` | #ffffff | #0b0e14 | |
| `--surface-container-low` | #f7f8fa | #191c22 | |
| `--surface-container` | #f0f1f4 | #1d2026 | Card background |
| `--surface-container-high` | #e8e9ed | #272a31 | Elevated card |
| `--surface-container-highest` | #dfe1e6 | #32353b | Highest elevation |
| `--on-surface` | #101319 | #e1e2eb | Primary text |
| `--on-surface-variant` | #53565f | #c4c9ac | Secondary/muted text |
| `--outline` | #75787f | #8e9379 | Default border/outline |
| `--outline-variant` | #c8cbd1 | #444933 | Subtle border |
| `--border` | #e5e7eb | #444933 | Component borders |

**Brand identity note:** the neon lime (#c3f400) accent, `.neon-glow` box-shadow utility, and `.performance-card` hover treatment signal a **dark-mode-forward, performance/tech aesthetic** — closer to a sports-tech brand (think running/training gear) than tennispro.fr's bright retail-catalog look. Lean into this: use the lime accent sparingly for CTAs, active states, and hover glows against dark surfaces; keep tennispro's *structural* patterns (mega-menu, hero carousel, promo grid) but skin them dark with neon accents rather than light/bright.

**Typography scale** (Tailwind utility classes, no custom font-family set — inherits system/Tailwind default)

| Class | Size / Line-height | Weight |
|---|---|---|
| `text-xsmall-regular` | 10px / 16px | 400 |
| `text-small-regular` | 12px / 20px | 400 |
| `text-small-semi` | 12px / 20px | 600 |
| `text-base-regular` | 14px / 24px | 400 |
| `text-base-semi` | 14px / 24px | 600 |
| `text-large-regular` | 16px / 24px | 400 |
| `text-large-semi` | 16px / 24px | 600 |
| `text-xl-regular` | 24px / 36px | 400 |
| `text-xl-semi` | 24px / 36px | 600 |
| `text-2xl-regular` | 30px / 48px | 400 |
| `text-2xl-semi` | 30px / 48px | 600 |
| `text-3xl-regular` | 32px / 44px | 400 |
| `text-3xl-semi` | 32px / 44px | 600 |

**Layout / spacing**
- Container: `max-w-[1440px]`, `px-6` horizontal padding
- Buttons: `rounded-full`, border-based contrast style (`.contrast-btn`: border, fills black on hover)
- Transitions: 0.2s ease on background/color/border (mode switching), 0.3s ease on card hover