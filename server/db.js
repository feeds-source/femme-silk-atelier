/**
 * Femme Silk Atelier — Database Module
 * Uses Node.js 24 native SQLite engine (DatabaseSync)
 */

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const fs = require("node:fs");
const crypto = require("node:crypto");

const DATA_DIR = path.join(__dirname, "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, "atelier.db");
const db = new DatabaseSync(DB_PATH);

// Enable Foreign Keys and WAL mode for performance
db.exec("PRAGMA foreign_keys = ON;");
db.exec("PRAGMA journal_mode = WAL;");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    uuid TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    role TEXT DEFAULT 'client',
    membership_tier TEXT DEFAULT 'Noir Standard',
    newsletter_subscribed INTEGER DEFAULT 1,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS user_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    address1 TEXT NOT NULL,
    address2 TEXT,
    city TEXT NOT NULL,
    province TEXT,
    postal_code TEXT,
    country TEXT NOT NULL,
    is_default INTEGER DEFAULT 1,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS sizing_profiles (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE NOT NULL,
    unit TEXT DEFAULT 'cm',
    underbust REAL,
    bust REAL,
    waist REAL,
    hip REAL,
    height REAL,
    thigh REAL,
    bra_size TEXT,
    sister_sizes TEXT,
    body_size TEXT,
    nighty_size TEXT,
    gown_size TEXT,
    corset_size TEXT,
    hosiery_size TEXT,
    fit_notes TEXT,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS wishlist_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    product_handle TEXT NOT NULL,
    product_title TEXT NOT NULL,
    category TEXT,
    price_cents INTEGER,
    image_url TEXT,
    preferred_size TEXT,
    added_at TEXT NOT NULL,
    UNIQUE(user_id, product_handle),
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS order_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    order_number TEXT UNIQUE NOT NULL,
    total_amount_cents INTEGER NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'delivered',
    payment_method TEXT DEFAULT 'Cash on Delivery',
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS auth_sessions (
    token TEXT PRIMARY KEY,
    user_id INTEGER NOT NULL,
    expires_at TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
  );

  CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
  CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist_items(user_id);
  CREATE INDEX IF NOT EXISTS idx_orders_user ON order_records(user_id);
  CREATE INDEX IF NOT EXISTS idx_sessions_user ON auth_sessions(user_id);
`);

/* -------------------------------------------------------------
 * Password Hashing with native scrypt
 * ------------------------------------------------------------- */
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, originalHash] = stored.split(":");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(originalHash, "hex"));
}

/* -------------------------------------------------------------
 * Query Helpers
 * ------------------------------------------------------------- */
const Queries = {
  // Users
  createUser: db.prepare(`
    INSERT INTO users (uuid, email, password_hash, first_name, last_name, phone, role, membership_tier, newsletter_subscribed, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `),
  findUserByEmail: db.prepare(`
    SELECT * FROM users WHERE email = ?
  `),
  findUserById: db.prepare(`
    SELECT id, uuid, email, first_name, last_name, phone, role, membership_tier, newsletter_subscribed, created_at, updated_at
    FROM users WHERE id = ?
  `),
  updateUserProfile: db.prepare(`
    UPDATE users SET first_name = ?, last_name = ?, phone = ?, newsletter_subscribed = ?, updated_at = ?
    WHERE id = ?
  `),
  updateMembershipTier: db.prepare(`
    UPDATE users SET membership_tier = ?, updated_at = ? WHERE id = ?
  `),
  listAllUsers: db.prepare(`
    SELECT id, uuid, email, first_name, last_name, phone, role, membership_tier, newsletter_subscribed, created_at
    FROM users ORDER BY id DESC
  `),

  // Sizing Profile
  getSizingProfile: db.prepare(`
    SELECT * FROM sizing_profiles WHERE user_id = ?
  `),
  upsertSizingProfile: db.prepare(`
    INSERT INTO sizing_profiles (
      user_id, unit, underbust, bust, waist, hip, height, thigh,
      bra_size, sister_sizes, body_size, nighty_size, gown_size, corset_size, hosiery_size, fit_notes, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(user_id) DO UPDATE SET
      unit = excluded.unit,
      underbust = excluded.underbust,
      bust = excluded.bust,
      waist = excluded.waist,
      hip = excluded.hip,
      height = excluded.height,
      thigh = excluded.thigh,
      bra_size = excluded.bra_size,
      sister_sizes = excluded.sister_sizes,
      body_size = excluded.body_size,
      nighty_size = excluded.nighty_size,
      gown_size = excluded.gown_size,
      corset_size = excluded.corset_size,
      hosiery_size = excluded.hosiery_size,
      fit_notes = excluded.fit_notes,
      updated_at = excluded.updated_at
  `),

  // Wishlist
  getWishlist: db.prepare(`
    SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY id DESC
  `),
  addWishlistItem: db.prepare(`
    INSERT OR REPLACE INTO wishlist_items (user_id, product_handle, product_title, category, price_cents, image_url, preferred_size, added_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),
  removeWishlistItem: db.prepare(`
    DELETE FROM wishlist_items WHERE user_id = ? AND product_handle = ?
  `),

  // Orders
  getOrders: db.prepare(`
    SELECT * FROM order_records WHERE user_id = ? ORDER BY id DESC
  `),
  addOrder: db.prepare(`
    INSERT INTO order_records (user_id, order_number, total_amount_cents, currency, status, payment_method, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `),

  // Addresses
  getAddresses: db.prepare(`
    SELECT * FROM user_addresses WHERE user_id = ?
  `),
  addAddress: db.prepare(`
    INSERT INTO user_addresses (user_id, address1, address2, city, province, postal_code, country, is_default)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `),

  // Sessions
  createSession: db.prepare(`
    INSERT INTO auth_sessions (token, user_id, expires_at, created_at)
    VALUES (?, ?, ?, ?)
  `),
  findSession: db.prepare(`
    SELECT * FROM auth_sessions WHERE token = ?
  `),
  deleteSession: db.prepare(`
    DELETE FROM auth_sessions WHERE token = ?
  `),
  cleanupExpiredSessions: db.prepare(`
    DELETE FROM auth_sessions WHERE expires_at < ?
  `),
};

/* -------------------------------------------------------------
 * Seed Luxury Sample Data for Instant Testing
 * ------------------------------------------------------------- */
function seedSampleData() {
  const existing = Queries.findUserByEmail.get("charlotte@silkmoments.com");
  if (existing) {
    return { status: "already_seeded", userId: existing.id };
  }

  const now = new Date().toISOString();
  const passHash = hashPassword("FemmeNoir2026!");

  // 1. Create VIP Client
  const res = Queries.createUser.run(
    crypto.randomUUID(),
    "charlotte@silkmoments.com",
    passHash,
    "Charlotte",
    "de Montmirail",
    "+33 6 12 34 56 78",
    "vip",
    "Emerald VIP",
    1,
    now,
    now
  );
  const userId = Number(res.lastInsertRowid);

  // 2. Add Atelier Address
  Queries.addAddress.run(
    userId,
    "18 Rue de la Paix",
    "Appartement 4B",
    "Paris",
    "Île-de-France",
    "75002",
    "France",
    1
  );

  // 3. Add Sizing Profile (Fitted for 32B / M)
  const sisterSizes = JSON.stringify(["30C", "34A"]);
  Queries.upsertSizingProfile.run(
    userId,
    "cm",
    70.5, // underbust
    86.0, // bust (gap 15.5cm -> B cup, 70.5cm -> 32 band)
    67.0, // waist -> S/M
    94.0, // hip -> S/M
    168.0, // height
    52.0, // thigh
    "32B",
    sisterSizes,
    "M",
    "M",
    "M",
    "S",
    "M",
    "Prefers silk charmeuse over stretch lace. Fits true 32B with slight preference for 34A in structured underwire balconettes.",
    now
  );

  // 4. Add Wishlist Items
  Queries.addWishlistItem.run(
    userId,
    "lace-balconette-set",
    "Lace Balconette Set",
    "Bra Sets",
    7800,
    "assets/lace-balconette-set.jpg",
    "32B",
    now
  );
  Queries.addWishlistItem.run(
    userId,
    "emerald-bustier",
    "Emerald Silk Bustier",
    "Corsetry",
    12800,
    "assets/emerald-bustier.jpg",
    "S",
    now
  );
  Queries.addWishlistItem.run(
    userId,
    "satin-gown",
    "Black Satin Gown",
    "Gowns",
    9600,
    "assets/satin-gown.jpg",
    "M",
    now
  );

  // 5. Add Purchase History
  Queries.addOrder.run(
    userId,
    "FSA-10492",
    20600,
    "USD",
    "delivered",
    "Cash on Delivery",
    "2026-08-20T14:30:00.000Z"
  );
  Queries.addOrder.run(
    userId,
    "FSA-10781",
    14800,
    "USD",
    "delivered",
    "Cash on Delivery",
    "2026-08-28T19:15:00.000Z"
  );

  return { status: "seeded", userId };
}

module.exports = {
  db,
  Queries,
  hashPassword,
  verifyPassword,
  seedSampleData,
};
