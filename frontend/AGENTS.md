<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may
all differ from your training data. Read the relevant guide in
`node_modules/next/dist/docs/` before writing any code. Heed deprecation
notices.

<!-- END:nextjs-agent-rules -->

## Project: bagcity (frontend)

E-commerce storefront + admin built on Next.js 16 App Router with bilingual
(EN/AR + RTL) support. The backend lives outside this directory and is reached
via `NEXT_PUBLIC_BASE_URL` (`http://localhost:5001` by default).

## Tech stack

- **Next.js 16.2.4** — App Router, Turbopack, React Server Components by default
- **React 19.2.4**
- **TypeScript 5** — strict mode, path alias `@/*` → `./`
- **next-intl 4** — i18n routing, `[locale]` segment, `as-needed` locale prefix
- **next-auth 4** — JWT sessions; client uses `getSession()`, server uses
  helpers in `lib/server-auth.ts`
- **TanStack Query 5** — server state and caching
- **Zustand 5** — client-only state (cart, wishlist, auth-mirror, orders)
- **React Hook Form + Zod** — all forms
- **Tailwind CSS v4** — via `@tailwindcss/postcss`
- **Radix UI + shadcn-style wrappers** in `components/ui/`
- **axios** — `lib/axios.ts` (singleton with auth interceptor)

## Commands

```bash
npm run dev      # next dev (Turbopack)
npm run build    # next build
npm run start    # next start
npm run lint     # eslint (flat config in eslint.config.mjs)
```

There is no test runner configured. Don't fabricate `npm test` — if asked to add
tests, surface that decision first.

## Directory map

| Path                                                                               | Purpose                                                                                |
| ---------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `app/[locale]/`                                                                    | All user-facing pages live under the locale segment                                    |
| `app/[locale]/admin/`                                                              | Admin dashboard (gated; see `proxy.ts`)                                                |
| `app/api/auth/`                                                                    | Next-auth route handlers + token endpoint consumed by axios interceptor                |
| `components/ui/`                                                                   | Primitive wrappers around Radix (button, dialog, form, etc.)                           |
| `components/layout/`                                                               | Header, footer, locale-switcher, site chrome                                           |
| `components/home/`, `components/product/`, `components/auth/`, `components/Admin/` | Feature components                                                                     |
| `lib/`                                                                             | Data-access helpers (one file per resource: `products.ts`, `cart.ts`, `orders.ts`, …)  |
| `lib/filters/`                                                                     | Shop filter logic                                                                      |
| `lib/axios.ts`                                                                     | Client axios instance — adds bearer from `/api/auth/token`                             |
| `lib/server-fetch.ts`, `lib/server-auth.ts`                                        | Server-side data + auth helpers (use these in RSCs/route handlers, never `axios`)      |
| `store/`                                                                           | Zustand stores                                                                         |
| `hooks/admin/`                                                                     | TanStack Query hooks for admin resources                                               |
| `i18n/`                                                                            | `routing.ts` (locales: `en`, `ar`), `request.ts`, `navigation.ts`                      |
| `messages/`                                                                        | `en.json`, `ar.json` translation catalogs                                              |
| `proxy.ts`                                                                         | **This is the middleware file.** Next.js 16 uses `proxy.ts` instead of `middleware.ts` |
| `data/products.ts`                                                                 | Static seed/fallback product data                                                      |
| `types/next-auth.d.ts`                                                             | Module augmentation for next-auth session shape                                        |

## Conventions to follow

### Routing & i18n

- All pages live under `app/[locale]/`. Read the `locale` param in server
  components and pass to `setRequestLocale` if doing dynamic rendering.
- Use `Link` and `useRouter` from `@/i18n/navigation`, **not** from `next/link`
  or `next/navigation`, so locale prefixing works.
- Locale prefix is `as-needed` — `/` is English, `/ar/...` is Arabic.
- For RTL, check `isRtlLocale(locale)` from `@/i18n/routing` and set `dir="rtl"`
  on the `<html>` tag (already wired in the root layout).
- Translations: keys go in `messages/en.json` AND `messages/ar.json`. Never add
  a key to one without the other.

### Auth

- **Client components**: `useSession()` / `getSession()` from `next-auth/react`.
  Authenticated requests go through `lib/axios.ts` (already injects bearer).
- **Server components / route handlers**: use helpers in `lib/server-auth.ts`.
  Do not import `lib/axios.ts` on the server — it relies on `getSession()` + a
  fetch to `/api/auth/token`.
- The `proxy.ts` middleware redirects authed users away from `/login`,
  `/signup`, and `/forgot-password` (to `/`). Update `authPages` if you add
  another auth-only page. There is no global unauthed-route guard — gate
  protected pages individually (e.g. admin uses its own check).

### Data access

- One module per backend resource in `lib/` (e.g. `products.ts`, `orders.ts`,
  `wishlist.ts`). New resources go in their own file following the same shape.
- Wrap reads in TanStack Query hooks. Admin-side hooks live under
  `hooks/admin/`.
- Mutations: use `useMutation` and invalidate the relevant query keys; don't
  manually refetch.
- Never call the backend directly from a component — always go through a
  `lib/<resource>.ts` function.

### State

- Server data → TanStack Query.
- Cross-page client state (cart, wishlist, auth mirror, orders) → Zustand store
  in `store/`.
- Local UI state → component state.
- Don't reach for Zustand for things that already live in a query cache.

### Components

- UI primitives are shadcn-style wrappers in `components/ui/`. Compose these —
  don't import Radix directly in feature code.
- Forms: `react-hook-form` + `zodResolver` + the `Form*` primitives from
  `components/ui/form.tsx`.
- Toasts: prefer `sonner` (`components/ui/sonner.tsx`) for new code. The older
  `react-hot-toast` and Radix toast are present but being phased out.

### Styling

- Tailwind v4 (CSS-first config — there is no `tailwind.config.ts`). Tokens live
  in `app/globals.css`.
- Use `cn()` from `lib/utils.ts` (clsx + tailwind-merge) to combine classes.

### Images

- Remote images: only `cdn.sanity.io` and `*.supabase.co` are whitelisted in
  `next.config.ts`. Add new hosts there before using them with `next/image`.
- Cloudinary uploads go through `next-cloudinary`.

### TypeScript

- Strict mode is on. `@typescript-eslint/no-explicit-any` is **off** in
  `eslint.config.mjs` — `any` is tolerated but still discouraged for new code.
- Path alias is only `@/*`. There is no `@components/*` etc.

## Things to avoid

- Don't create `middleware.ts` — this version uses `proxy.ts`.
- Don't import from `next/link` or `next/navigation` in pages under `[locale]` —
  use `@/i18n/navigation`.
- Don't add a translation key to only one of `messages/en.json` /
  `messages/ar.json`.
- Don't import `lib/axios.ts` from server components or route handlers.
