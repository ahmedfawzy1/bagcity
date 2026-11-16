# BagCity API

REST API powering the bagcity storefront and admin dashboard. Built with
Express 5 and MongoDB (Mongoose), with JWT auth, Stripe payments, Google OAuth,
and email-based password reset.

## Stack

- Node.js (ESM) + Express 5
- MongoDB via Mongoose 8
- JWT (access + refresh) auth, bcrypt password hashing
- Helmet, CORS, express-rate-limit, express-validator
- Stripe SDK for card payments
- Nodemailer for OTP and password-reset email
- google-auth-library for Google ID-token verification
- Docker + docker-compose for containerized runs

## Project layout

```
backend/
├── config/         DB, CORS, allowed origins
├── controllers/    Route handlers (one per resource)
├── middleware/     auth.middleware.js, validation.middleware.js
├── models/         Mongoose schemas
├── routes/         Express routers, mounted from server.js
├── seed/           seed.js — sample categories, colors, products
├── server.js       App entry; security middleware + route mounting
├── Dockerfile
└── docker-compose.yml
```

## Getting started

### Prerequisites

- Node.js 20+
- MongoDB 6+ (local or Atlas)

### Install & run

```bash
npm install
cp .env.example .env   # fill in real values, see "Environment variables" below
npm run dev            # nodemon, http://localhost:5001
```

Production:

```bash
npm start
```

### Seed sample data

```bash
npm run seed
```

### Docker

```bash
docker compose up --build
```

This starts the API on port `5001` and a MongoDB 7 container on `27017`.
Environment values are read from your shell / `.env`.

## Environment variables

| Variable                                               | Description                                        |
| ------------------------------------------------------ | -------------------------------------------------- |
| `PORT`                                                 | API port (default `5001`)                          |
| `NODE_ENV`                                             | `development` or `production`                      |
| `DATABASE_URL`                                         | MongoDB connection string                          |
| `BACKEND_API_URL`                                      | Public API URL (used in emails, links)             |
| `ACCESS_TOKEN_SECRET`                                  | JWT access-token secret                            |
| `REFRESH_TOKEN_SECRET`                                 | JWT refresh-token secret                           |
| `NEXTAUTH_SECRET`                                      | Shared secret with the frontend's NextAuth         |
| `GOOGLE_CLIENT_ID`                                     | Google OAuth client ID (for ID-token verification) |
| `STRIPE_SECRET_KEY`                                    | Stripe secret key                                  |
| `EMAIL_ADDRESS` / `EMAIL_API_KEY` / `EMAIL_SECRET_KEY` | SMTP credentials for OTP and password-reset emails |

## Security

`server.js` configures:

- **Helmet** with a strict CSP allowing Stripe and Google sign-in only.
- **CORS** restricted to origins listed in `config/allowedOrigins.js`.
- **Rate limits** — 200 req / 15 min globally, 50 req / 15 min on `/api/auth/*`,
  20 req / minute on `/api/auth/check`.
- **Body size limit** of 10 MB on JSON and URL-encoded payloads.
- **Input sanitization** via `sanitizeHtml` middleware on auth endpoints and
  `express-validator` on user registration.

## API overview

All routes are JSON. Mutating routes return `{ message, <resource> }`; list
routes return arrays or `{ items, total }` shapes depending on the controller.
Authenticated routes expect a valid access token (cookie-based session);
admin routes additionally require `role === "admin"`.

| Mount path                            | Router               | Auth                          |
| ------------------------------------- | -------------------- | ----------------------------- |
| `POST /api/auth/*`                    | `auth.route.js`      | public (rate-limited)         |
| `GET/POST/PUT /api/customers`         | `customer.route.js`  | admin                         |
| `GET/POST/PUT/DELETE /api/products`   | `product.route.js`   | public read, admin write      |
| `GET /api/filters`                    | `filters.route.js`   | public                        |
| `GET/POST/PUT/DELETE /api/categories` | `category.route.js`  | admin                         |
| `GET/POST/PUT/DELETE /api/colors`     | `color.route.js`     | admin                         |
| `GET/POST /api/reviews`               | `review.route.js`    | mixed                         |
| `GET/POST/DELETE /api/wishlist`       | `wishlist.route.js`  | user                          |
| `GET/POST/PUT/DELETE /api/cart`       | `cart.route.js`      | user                          |
| `GET/POST/PUT/DELETE /api/address`    | `address.route.js`   | user                          |
| `GET/POST /api/orders`                | `order.route.js`     | user (admin for `/admin/all`) |
| `GET/POST/PUT/DELETE /api/coupons`    | `coupon.route.js`    | admin (+ public `/validate`)  |
| `GET/POST/DELETE /api/admins`         | `admin.routes.js`    | admin                         |
| `GET /api/dashboard/*`                | `dashboard.route.js` | admin                         |

### Auth endpoints

- `POST /api/auth/signup` — register (validated)
- `POST /api/auth/login` — email + password
- `POST /api/auth/google-sync` — exchange a Google ID token for a session
- `POST /api/auth/request-otp` — start password reset
- `POST /api/auth/verify-otp` — verify OTP from email
- `POST /api/auth/reset-password` — set new password after OTP verification
- `PUT /api/auth/profile` — update own profile (authenticated)

### Order flow

1. `POST /api/orders` — creates the order; for `paymentMethod: "card"`, a
   Stripe payment intent is created and `paymentDetails.stripePaymentId` is
   stored. For `cod`, the order goes straight to `pending`.
2. `GET /api/orders` — current user's orders.
3. `GET /api/orders/:id` — order detail (owner or admin).
4. `POST /api/orders/:id/cancel` — user cancels a pending order.
5. `PUT /api/orders/:id/status` — admin updates status
   (`pending → processing → shipped → delivered`, or `cancelled`).
6. `GET /api/orders/admin/all` — admin order list.

### Models

Mongoose schemas in `models/` — `User`, `Product`, `Category`, `Color`,
`Review`, `Wishlist`, `Cart`, `Address`, `Order`, `Coupon`. The `Product`
schema computes `inventory` virtually as the sum of variant stocks and flips
`availableForSale` to `false` automatically when total stock hits zero.
