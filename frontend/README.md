# BagCity Storefront

Next.js 16 storefront and admin dashboard for the BagCity e-commerce platform.
Talks to the [BagCity API](../backend/readme.md) over REST.

## Stack

- Next.js 16.2.4 (App Router, Turbopack)
- React 19.2.4, TypeScript 5
- Tailwind CSS 4
- `next-intl` 4 (English + Arabic, RTL-aware)
- NextAuth.js 4 (credentials + Google OAuth)
- TanStack Query 5 (server state) + Zustand 5 (client state)
- Radix UI primitives, lucide-react icons
- React Hook Form + Zod for forms
- next-cloudinary for image uploads
- Recharts for admin analytics
- Sonner + React Hot Toast for notifications

> **Heads up** — this project pins Next.js 16, which has breaking changes from
> Next 13/14/15. See [AGENTS.md](AGENTS.md). Notably the request middleware file
> is named `proxy.ts`, not `middleware.ts`.

## Getting started

```bash
npm install
cp .env.example .env   # fill in real values
npm run dev
```

The dev server runs at [http://localhost:3000](http://localhost:3000) and
expects the backend on `http://localhost:5001`.

### Scripts

| Script          | What it does                   |
| --------------- | ------------------------------ |
| `npm run dev`   | Next.js dev server (Turbopack) |
| `npm run build` | Production build               |
| `npm start`     | Serve the production build     |
| `npm run lint`  | ESLint                         |

### Environment variables

| Variable                                    | Description                                         |
| ------------------------------------------- | --------------------------------------------------- |
| `NEXT_PUBLIC_BASE_URL`                      | Backend API base URL (e.g. `http://localhost:5001`) |
| `NEXTAUTH_URL`                              | Public site URL used by NextAuth                    |
| `NEXTAUTH_SECRET`                           | Shared secret with the backend                      |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google OAuth credentials                            |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`         | Cloudinary cloud name                               |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`            | Cloudinary API key                                  |
| `CLOUDINARY_API_SECRET`                     | Cloudinary API secret (server-only)                 |
| `NEXT_PUBLIC_STRIPE_PUBLIC_KEY`             | Stripe publishable key                              |
| `STRIPE_SECRET_KEY`                         | Stripe secret key (server-only)                     |

## Project structure

```
frontend/
├── app/
│   ├── [locale]/            All user-facing routes (en, ar)
│   │   ├── shop/            Catalog with filters
│   │   ├── product/[slug]/  Product detail page
│   │   ├── cart/, checkout/, orders/, wishlist/, profile/
│   │   ├── login/, signup/, forgot-password/
│   │   ├── blog/, about/, contact/, faq/, ...
│   │   └── admin/           Admin dashboard (protected)
│   │       ├── products/    create + edit
│   │       ├── categories/, customers/, coupons/, orders/, staff/
│   └── api/auth/token/      NextAuth bridge for backend session
├── components/
│   ├── Admin/               Dashboard, Orders, Products
│   ├── auth/, home/, layout/, product/
│   └── ui/                  Tailwind + Radix UI primitives
├── hooks/                   TanStack Query hooks (admin/* per resource)
├── i18n/                    next-intl routing + request config
├── lib/                     API clients per resource (products, cart, ...)
├── messages/                en.json, ar.json — translation catalogs
├── store/                   Zustand stores (auth, cart, order, wishlist)
├── types/                   Shared TS types
├── proxy.ts                 NextAuth + next-intl request middleware
└── next.config.ts           Turbopack root, image remote patterns
```

## Internationalization

- Locales: `en` (default) and `ar`. Configured in
  [i18n/routing.ts](i18n/routing.ts) with `localePrefix: 'as-needed'`, so
  English URLs are unprefixed and Arabic URLs use `/ar`.
- Translation catalogs live in [messages/en.json](messages/en.json) and
  [messages/ar.json](messages/ar.json). Add new keys to both — `next-intl` will
  throw at runtime on a missing key.
- RTL is detected via `isRtlLocale` in `i18n/routing.ts` and applied on the
  `<html dir>` attribute in the locale layout.
- Inside server components, use `getTranslations`; inside client components, use
  the `useTranslations` hook. Use the `Link` exported from `i18n/navigation.ts`
  for locale-aware navigation.

## Auth & routing

`proxy.ts` (the Next 16 successor to `middleware.ts`) does two things:

1. Combines the NextAuth JWT check with the `next-intl` middleware so locale
   routing and auth gates run in one pass.
2. Redirects authenticated users away from `/login`, `/signup`,
   `/forgot-password`, and unauthenticated users away from `/dashboard`.

Sessions are issued by NextAuth on the frontend and minted into a backend JWT
via `app/api/auth/token/route.ts`, which the API treats as a normal cookie
session.

## Data fetching

- **Server components** call the backend through `lib/server-fetch.ts` /
  `lib/server-auth.ts`, which forward the user's session cookie.
- **Client components** call through `lib/axios.ts`, which attaches the access
  token from NextAuth and retries on 401 by hitting `/api/auth/token`.
- TanStack Query hooks live in `hooks/admin/*` (one per admin resource) and
  return typed data + mutation helpers.

## Admin dashboard

Reachable at `/admin/*`. All pages require `role === "admin"` on the backend.
Sections:

- **Dashboard** — sales overview, order status, weekly chart, recent orders.
- **Products** — list, create, edit (variants, images via Cloudinary).
- **Categories**, **Colors** — taxonomy.
- **Customers** — list and edit users.
- **Coupons** — percentage discounts with validation rules.
- **Orders** — list, view, update status.
- **Staff** — promote / demote admin users.
