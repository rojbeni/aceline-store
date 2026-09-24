## Code conventions

These are decisions this codebase has already made and enforces by convention, not by lint rule — deviating from them is a bug, not a style choice:

- **Route → template → module.** `src/app/[countryCode]/**/page.tsx` and `layout.tsx` stay thin: fetch data via `@lib/data/<domain>` server actions, then render a `templates/` component from the matching `src/modules/<domain>/`. `components/` holds reusable pieces; `templates/` holds page-level compositions that routes render directly.
- **All Medusa API calls live in `src/lib/data/<domain>.ts`** behind `"use server"`, using the shared `sdk` client from `@lib/config`, wrapped with `medusaError()` (`@lib/util/medusa-error`) rather than letting raw SDK errors propagate. Cart/auth state is read via `@lib/data/cookies`.
- **Server components by default.** Only add `"use client"` where state, effects, browser APIs, or event handlers require it — keep the client boundary as small as possible (push interactivity into small leaf components rather than marking a whole tree client).
- **Internal navigation always goes through `LocalizedClientLink`** (`@modules/common/components/localized-client-link`), never raw `next/link` — it's what resolves the `[countryCode]` locale prefix. `next/link` only appears inside `LocalizedClientLink`'s own implementation.
- **User-facing strings go through `useTranslation()`'s `t()`** (`@lib/context/translation-context`), not hardcoded literals.
- **Styling uses the semantic design tokens** (`bg-surface`, `text-surface-on`, `border-outline-variant`, `bg-primary-container`, etc. — defined in `tailwind.config.js` / `globals.css`) and the custom typography scale (`text-base-regular`, `text-large-semi`, etc.) over raw Tailwind color/size utilities where a token already covers it. Use the `clx` helper (`@modules/common/components/ui`) for conditional classes.
- **Interactive elements carry `data-testid`** (buttons, links, inputs, key data values) for e2e coverage.
- **Split, don't bloat.** When a component mixes multiple concerns (a trigger + a panel + a list + an empty state + timer/effect logic), split into sibling files in the same folder — one file per concern, stateful logic extracted into a `use-*.ts` hook. See `src/modules/layout/components/cart-dropdown/` for the pattern.
- **Async views pair with a matching skeleton** in `src/modules/skeletons/{components,templates}` (e.g. `skeleton-cart-page`, `skeleton-product-grid`, `skeleton-order-confirmed`) — don't ship a new data-dependent view without its loading state.

## Design tokens

**Brand identity note:** the neon lime (#c3f400) accent, `.neon-glow` box-shadow utility, and `.performance-card` hover treatment signal a **dark-mode-forward, performance/tech aesthetic** — closer to a sports-tech brand (think running/training gear) than tennispro.fr's bright retail-catalog look. Lean into this: use the lime accent sparingly for CTAs, active states, and hover glows against dark surfaces; keep tennispro's *structural* patterns (mega-menu, hero carousel, promo grid) but skin them dark with neon accents rather than light/bright.

(Color/typography/layout token values live in `src/styles/globals.css` and `tailwind.config.js` — read those directly rather than duplicating them here.)

See the `design-reference` skill for the tennispro.fr-inspired nav/homepage/PLP/PDP/footer structure and component build priority.
