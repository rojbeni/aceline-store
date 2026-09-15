---
name: tailwind-conventions
description: Use whenever writing, editing, or reviewing markup that uses Tailwind CSS utility classes (React/Vue/Svelte components, HTML templates, etc). Covers class ordering, responsive/state variant patterns, avoiding arbitrary values and inline styles, dark mode conventions, and when to extract repeated class strings into components vs @apply.
---

# Tailwind CSS Conventions

Apply these rules any time you write or modify className/class attributes.

## Class ordering

Group utilities in this order, left to right. This matches Tailwind's official
Prettier plugin, so if the project has `prettier-plugin-tailwindcss` installed,
defer to its output instead of manually enforcing order.

1. Layout — `flex`, `grid`, `block`, `hidden`
2. Positioning — `relative`, `absolute`, `inset-0`, `top-0`, `z-10`
3. Box model — `w-`, `h-`, `p-`, `m-`, `gap-`
4. Typography — `text-`, `font-`, `leading-`, `tracking-`
5. Visual — `bg-`, `border-`, `rounded-`, `shadow-`
6. State/interaction — `hover:`, `focus:`, `active:`, `disabled:`
7. Responsive variants last, or interleaved right before the utility they modify (`md:flex-row`)

```
<!-- good -->
<div class="flex items-center gap-4 w-full p-4 text-sm font-medium bg-white rounded-lg shadow-sm hover:shadow-md md:gap-6">

<!-- avoid: no grouping, hard to scan -->
<div class="hover:shadow-md text-sm bg-white flex p-4 rounded-lg w-full shadow-sm gap-4 items-center font-medium md:gap-6">
```

## Prefer design tokens over arbitrary values

Check `tailwind.config.js` (or `theme` in a CSS-first v4 config) for existing
scale values before reaching for arbitrary bracket syntax.

- Bad: `mt-[17px]`, `text-[#3b82f6]`, `w-[calc(100%-32px)]` used repeatedly
- Good: `mt-4`, `text-blue-500`, or add a token to the theme if a value recurs 3+ times
- Arbitrary values are fine for one-off, truly custom cases (e.g. a specific SVG mask position) — don't ban them outright, just don't default to them

## No inline styles alongside Tailwind

If a project uses Tailwind, don't mix in `style={{ ... }}` for anything
expressible as a utility class. Exception: values computed at runtime
(e.g. a dynamic `translateX` from drag state).

## Responsive design

- Mobile-first: unprefixed utilities are the base/mobile style, add `sm: md: lg: xl:` to override upward. Never design desktop-first and override downward.
- Don't sprinkle every property with every breakpoint — only add a breakpoint variant where the layout actually needs to change.

## Dark mode

- Use the `dark:` variant consistently if the project has dark mode enabled (check for `darkMode: 'class'` or `'media'` in config).
- Pair every meaningful `bg-`/`text-`/`border-` utility with a `dark:` counterpart rather than leaving dark mode half-implemented on a component.

```
<div class="bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
```

## Extracting repeated patterns

- 2–3 uses of the same class string inline: leave it, don't over-abstract.
- Repeated 4+ times across files: extract into a component (React/Vue/Svelte), not `@apply` — components keep markup and logic together and are easier to find.
- Reserve `@apply` for truly global primitives (e.g. a `.btn-base` used by a design system layer with no component framework), not as the default de-duplication strategy.

## Conditional classes

Use a helper (`clsx`, `cn`, `tailwind-merge`) rather than manual string
concatenation or nested ternaries once there are more than 2 conditional
classes:

```jsx
// good
className={cn("rounded-lg px-4 py-2", isActive && "bg-blue-600 text-white", disabled && "opacity-50 cursor-not-allowed")}

// avoid past 2 conditions
className={"rounded-lg px-4 py-2 " + (isActive ? "bg-blue-600 text-white " : "") + (disabled ? "opacity-50 cursor-not-allowed" : "")}
```

## Before finishing

- Check whether `prettier-plugin-tailwindcss` is configured; if so, don't hand-order classes, just write them and let formatting run.
- Check `tailwind.config.js` / theme file for existing spacing, color, and font tokens before introducing new arbitrary values.
- Look at a sibling component for established patterns (button variants, card padding, etc.) before inventing new ones.
