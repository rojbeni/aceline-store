---
name: nextjs
description: Use this skill whenever working in a Next.js project — creating pages/routes, data fetching, server vs client components, layouts, API routes/route handlers, middleware, metadata/SEO, or project structure. Make sure to use this skill any time the user mentions Next.js, App Router, Pages Router, server components, or asks to build a page/feature in a Next.js codebase, even if they don't explicitly say "use the nextjs skill."
---

# Next.js

Guidance for building and modifying Next.js applications (App Router first, with Pages Router notes where relevant).

## 1. Detect the setup before writing code

Before making changes, check:
- **Router**: presence of `app/` → App Router. Presence of `pages/` without `app/` → Pages Router. Prefer App Router conventions for anything new unless the project is Pages-only.
- **Language**: `.ts`/`.tsx` vs `.js`/`.jsx` — match the existing convention.
- **Styling**: Tailwind config, CSS Modules, styled-components, etc. — match what's already there.
- **Package manager**: look for `package-lock.json`, `pnpm-lock.yaml`, or `yarn.lock` and use that one.
- **Next.js version**: check `package.json` — behavior (especially caching defaults, `fetch` semantics, and `params`/`searchParams` being async) differs between Next 13/14 and Next 15+.

## 2. App Router fundamentals

- **File conventions**: `page.tsx` (route UI), `layout.tsx` (shared shell, preserves state across navigation), `loading.tsx` (Suspense boundary), `error.tsx` (error boundary, must be a Client Component), `not-found.tsx`, `route.ts` (API/route handler).
- **Routing**: folder = route segment. `[slug]` = dynamic segment, `[...slug]` = catch-all, `[[...slug]]` = optional catch-all, `(group)` = route group (no URL impact), `@slot` = parallel route.
- **Server Components by default**: Every component in `app/` is a Server Component unless it starts with `"use client"`. Keep the `"use client"` boundary as low/leaf-level as possible — don't mark a whole page client just because one button needs `onClick`.
- **When you need `"use client"`**: hooks (`useState`, `useEffect`, `useContext`), event handlers, browser-only APIs, third-party libraries that rely on `useEffect`/refs.
- **`params` and `searchParams`**: in Next.js 15+ these are `Promise`s in Server Components and must be `await`ed (or unwrapped with `use()` in Client Components). Check the installed version before assuming sync access.

## 3. Data fetching

- Fetch data directly in Server Components with `async`/`await` — no `useEffect` + `useState` needed for initial data.
- `fetch()` is cached/deduped automatically in the App Router unless you opt out:
  - `fetch(url, { cache: 'no-store' })` — always fresh.
  - `fetch(url, { next: { revalidate: 60 } })` — ISR-style revalidation every 60s.
- For mutations, prefer **Server Actions** (`"use server"` functions) over client-side `fetch` to an API route when the action is same-app: simpler, no manual API route needed, works with `<form action={...}>`.
- Only build a `route.ts` handler when you need a real HTTP endpoint (webhooks, external consumers, non-form triggers).

## 4. Rendering & caching mental model

- Static by default: a route with no dynamic data/functions is prerendered at build time.
- Using `cookies()`, `headers()`, `searchParams`, or an uncached `fetch` opts a route into dynamic rendering.
- `export const dynamic = 'force-dynamic' | 'force-static'` and `export const revalidate = <seconds>` control this explicitly at the route level when needed.
- Don't fight the cache with ad hoc `useEffect` fetching where a server-side fetch + revalidate would do.

## 5. Layouts, metadata, SEO

- Shared UI (nav, footer) goes in `layout.tsx`, not repeated per page.
- Use the `metadata` export (static object) or `generateMetadata` (async function) for `<title>`/meta tags — don't hand-write `<head>` tags in App Router.
- For images, use `next/image` (automatic optimization, requires `width`/`height` or `fill`); for fonts, use `next/font` to avoid layout shift and avoid manual `<link>` to Google Fonts.
- For internal navigation, use `next/link`'s `<Link>`, not `<a>`, so client-side transitions work.

## 6. Project structure conventions

- Co-locate route-specific components inside the route segment folder, or put shared components in a top-level `components/` directory — match whatever the project already does.
- Keep Server/Client boundaries explicit: a common pattern is a Server Component page that renders a small Client Component for the interactive part, passing server-fetched data down as props.
- Environment variables: only vars prefixed `NEXT_PUBLIC_` are exposed to the browser; everything else stays server-only. Never put secrets in `NEXT_PUBLIC_*`.

## 7. Common pitfalls to avoid

- Don't add `"use client"` to a layout or page just to use `Link` or `Image` — those work fine in Server Components.
- Don't call server-only code (DB clients, secrets) from a Client Component.
- Don't use `useEffect` to fetch data that could be fetched on the server — it causes waterfalls and loading flicker.
- Don't assume `params`/`searchParams` are synchronous without checking the Next.js version.
- Middleware (`middleware.ts`) runs on the Edge runtime by default — avoid Node-only APIs there.

## 8. Quick checklist when adding a new route

1. Create the folder under `app/` matching the URL path.
2. Add `page.tsx` (Server Component) — fetch data here if needed.
3. Extract interactive bits into a small `"use client"` component if required.
4. Add `loading.tsx`/`error.tsx` if the route does real async work.
5. Add/adjust `metadata` for the route.
6. If a mutation is needed, prefer a Server Action co-located in the same file or an `actions.ts` file, marked `"use server"`.
