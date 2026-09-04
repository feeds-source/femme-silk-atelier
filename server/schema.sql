-- Cloudflare D1 Schema for Femme Silk Atelier

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

CREATE INDEX IF NOT EXISTS idx_d1_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_d1_wishlist_user ON wishlist_items(user_id);
CREATE INDEX IF NOT EXISTS idx_d1_orders_user ON order_records(user_id);
CREATE INDEX IF NOT EXISTS idx_d1_sessions_user ON auth_sessions(user_id);
