# Femme Silk Atelier — Clientele Database & Fit Engine API

A high-performance Node.js & native SQLite backend built for **Femme Silk Atelier**. Manages client accounts, sizing matrix calculations, wishlist pieces, and VIP Salon membership tiers.

---

## Quick Start

```powershell
# Navigate to server directory
cd server

# Install dependencies (Express, CORS, dotenv)
npm install

# Seed luxury sample clientele & sizing profiles
npm run seed

# Start API server on http://localhost:5000
npm start
```

---

## Database Architecture (`server/data/atelier.db`)

Engineered with Node.js 24's native `node:sqlite` engine with WAL mode and foreign key enforcement enabled:

1. **`users`**:
   - `id` (INTEGER PK), `uuid` (UUID), `email` (NOCASE UNIQUE), `password_hash` (scrypt), `first_name`, `last_name`, `phone`, `role` (`client` / `vip` / `admin`), `membership_tier` (`Noir Standard`, `Champagne Elite`, `Emerald VIP`), `newsletter_subscribed`, `created_at`, `updated_at`.
2. **`sizing_profiles`**:
   - `user_id` (FK), `unit` (`cm`/`in`), `underbust`, `bust`, `waist`, `hip`, `height`, `thigh`.
   - Auto-computed fields: `bra_size` (30B–42C), `sister_sizes` (JSON array), `body_size` (XS–XXL), `nighty_size`, `gown_size`, `corset_size`, `hosiery_size`, `fit_notes`.
3. **`wishlist_items`**:
   - `user_id` (FK), `product_handle`, `product_title`, `category`, `price_cents`, `image_url`, `preferred_size`, `added_at`.
4. **`user_addresses`**:
   - `user_id` (FK), `address1`, `address2`, `city`, `province`, `postal_code`, `country`, `is_default`.
5. **`order_records`**:
   - `user_id` (FK), `order_number`, `total_amount_cents`, `currency`, `status`, `payment_method` (e.g. Cash on Delivery), `created_at`.
6. **`auth_sessions`**:
   - `token` (PK), `user_id` (FK), `expires_at`, `created_at`.

---

## API Endpoints

### Authentication
* **`POST /api/auth/register`**:
  * Body: `{ "email", "password", "firstName", "lastName", "phone", "measurements": { "underbust": 74, "bust": 90, ... } }`
  * Returns: `{ "token", "user", "sizing" }`
* **`POST /api/auth/login`**:
  * Body: `{ "email", "password" }`
  * Returns: `{ "token", "user", "sizing" }`
* **`GET /api/auth/me`**:
  * Headers: `Authorization: Bearer <token>`
  * Returns: Complete user profile, address, sizing matrix, wishlist count, order count.
* **`POST /api/auth/logout`**:
  * Invalidate active session.

### Atelier Sizing Engine
* **`GET /api/sizing`**: Fetch authenticated client's atelier fit matrix.
* **`POST /api/sizing`**:
  * Body: `{ "unit": "cm", "underbust": 74, "bust": 90, "waist": 70, "hip": 96 }`
  * Automatically recalculates band, cup, sister sizes, and body silhouette.

### Wishlist
* **`GET /api/wishlist`**: Fetch saved atelier pieces.
* **`POST /api/wishlist`**: Save a piece `{ "productHandle", "productTitle", "category", "priceCents", "preferredSize" }`.
* **`DELETE /api/wishlist/:handle`**: Remove a piece.

### VIP Salon Membership & Orders
* **`GET /api/membership`**: View current membership tier (`Noir Standard`, `Champagne Elite`, `Emerald VIP`), qualifying spend, and exclusive perks.
* **`GET /api/orders`**: Purchase history and doorstep inspection / COD status.

---

## Pre-seeded Luxury Test Account

* **Email**: `charlotte@silkmoments.com`
* **Password**: `FemmeNoir2026!`
* **Tier**: Emerald VIP
* **Sizing**: 32B (Sisters: 30C, 34A) · Body: M
