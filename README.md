# BagCity

A full-stack e-commerce platform for fashion and accessories. The frontend is a
Next.js 16 / React 19 storefront with English and Arabic (RTL) localization,
NextAuth-based authentication, and an admin dashboard. The backend is an Express
5 + MongoDB (Mongoose) REST API that handles auth, catalog, cart, orders,
coupons, addresses, reviews, wishlist, and Stripe payments.

## Repository layout

```
bagcity/
├── backend/    Express 5 + Mongoose REST API (port 5001)
└── frontend/   Next.js 16 storefront and admin (port 3000)
```

Each side has its own README with setup details — see [backend/readme.md](backend/readme.md)
and [frontend/README.md](frontend/README.md).

## Features

- **Storefront** — product catalog with filtering by category, color, and price;
  search with live suggestions; product detail pages with variants, images, and
  reviews; cart, wishlist, checkout, and order tracking.
- **Internationalization** — English and Arabic via `next-intl`, with RTL
  layout, locale-aware routing (`/`, `/ar`), and an Arabic-tuned font stack.
- **Authentication** — email/password and Google OAuth via NextAuth on the
  frontend, JWT-backed sessions on the backend, password reset by email OTP.
- **Checkout & payments** — Stripe card payments and cash-on-delivery, coupon
  validation, multi-address management.
- **Admin dashboard** — products, categories, colors, customers, orders,
  coupons, staff (admin users), and a sales/orders analytics overview.
- **Reviews & ratings** — verified-buyer reviews with average rating roll-up on
  each product.
- **Editorial blog** — static, locally-authored posts under `/blog`.

## Tech stack

**Frontend** ([frontend/](frontend/))

- Next.js 16.2.4 (App Router, Turbopack), React 19.2.4, TypeScript 5
- Tailwind CSS 4, Radix UI primitives, lucide-react icons
- `next-intl` 4 for i18n, custom `proxy.ts` for auth + locale routing
- NextAuth.js 4 (credentials + Google OAuth)
- TanStack Query 5 for server state, Zustand 5 for client state
- React Hook Form + Zod for forms and validation
- next-cloudinary for image uploads, Recharts for admin analytics
- Sonner + React Hot Toast for notifications

**Backend** ([backend/](backend/))

- Node.js + Express 5 (ESM)
- MongoDB via Mongoose 8
- JWT auth (access + refresh tokens), bcrypt password hashing
- Helmet, CORS, express-rate-limit, express-validator
- Stripe SDK for card payments
- Nodemailer for OTP / password-reset emails
- google-auth-library for Google OAuth verification
- Docker + docker-compose for containerized runs

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB instance (local or Atlas)
- Stripe test keys (for card checkout)
- Google OAuth client (for Google sign-in)
- A Cloudinary account (for product image uploads)

### Setup

```bash
git clone https://github.com/ahmedfawzy1/bagcity
cd bagcity
```

Install and run the backend:

```bash
cd backend
npm install
cp .env.example .env   # then fill in real values
npm run dev            # starts on http://localhost:5001
```

In a second terminal, install and run the frontend:

```bash
cd frontend
npm install
cp .env.example .env   # then fill in real values
npm run dev            # starts on http://localhost:3000
```

Each `.env` is documented in the respective sub-README.

### Seeding

The backend ships with a seed script that populates categories, colors, and
sample products:

```bash
cd backend
npm run seed
```

### Docker

A `Dockerfile` and `docker-compose.yml` are provided in `backend/` to run the
API alongside a MongoDB 7 container:

```bash
cd backend
docker compose up --build
```

## Project conventions

- Frontend uses a custom `proxy.ts` (not `middleware.ts`) to combine NextAuth
  session checks with `next-intl` locale routing.
- All app routes live under `app/[locale]/...`; the default locale is `en` with
  `localePrefix: 'as-needed'`, so English URLs are unprefixed and Arabic URLs
  are prefixed with `/ar`.
- Admin routes are protected at the API level by `adminProtectRoute`
  middleware; protected user routes use `protectRoute`.
- Image uploads go through `next-cloudinary` on the client; product images are
  stored as Cloudinary URLs on the product document.

## License

Private project. All rights reserved.
