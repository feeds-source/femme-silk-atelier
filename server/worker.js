/**
 * Cloudflare Worker for Femme Silk Atelier
 * Edge API connected to Cloudflare D1 Serverless SQLite
 */

import { calculateProfile } from "./fit-engine.js";

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}

// Web Crypto SHA-256 + Salt for Edge Workers
async function hashPassword(password) {
  const salt = crypto.randomUUID().replace(/-/g, "");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `${salt}:${hashHex}`;
}

async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(":")) return false;
  const [salt, originalHash] = stored.split(":");
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const derived = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: enc.encode(salt),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );
  const hashHex = Array.from(new Uint8Array(derived))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex === originalHash;
}

async function getAuthUser(request, env) {
  const auth = request.headers.get("Authorization");
  if (!auth || !auth.startsWith("Bearer ")) return null;
  const token = auth.split(" ")[1];
  const session = await env.DB.prepare(
    "SELECT * FROM auth_sessions WHERE token = ? AND expires_at > datetime('now')"
  )
    .bind(token)
    .first();
  if (!session) return null;
  const user = await env.DB.prepare(
    "SELECT id, uuid, email, first_name, last_name, phone, role, membership_tier, newsletter_subscribed, created_at FROM users WHERE id = ?"
  )
    .bind(session.user_id)
    .first();
  return { user, token };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const { pathname } = url;

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
        },
      });
    }

    // Health
    if (pathname === "/api/health") {
      const stats = await env.DB.prepare("SELECT count(*) as count FROM users").first();
      return json({
        status: "healthy",
        edge: "Cloudflare Workers",
        database: "Cloudflare D1",
        usersCount: stats?.count || 0,
        timestamp: new Date().toISOString(),
      });
    }

    // Register
    if (pathname === "/api/auth/register" && request.method === "POST") {
      const body = await request.json();
      const { email, password, firstName, lastName, phone, measurements } = body;
      if (!email || !password) return json({ error: "Email and password required" }, 400);

      const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?").bind(email).first();
      if (existing) return json({ error: "User already exists" }, 409);

      const passHash = await hashPassword(password);
      const uuid = crypto.randomUUID();
      const now = new Date().toISOString();

      const insert = await env.DB.prepare(`
        INSERT INTO users (uuid, email, password_hash, first_name, last_name, phone, role, membership_tier, newsletter_subscribed, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, 'client', 'Noir Standard', 1, ?, ?)
      `).bind(uuid, email, passHash, firstName || null, lastName || null, phone || null, now, now).run();

      const userId = insert.meta.last_row_id;
      let sizing = null;
      if (measurements) {
        sizing = calculateProfile(measurements);
        await env.DB.prepare(`
          INSERT INTO sizing_profiles (user_id, unit, underbust, bust, waist, hip, height, thigh, bra_size, sister_sizes, body_size, nighty_size, gown_size, corset_size, hosiery_size, fit_notes, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Edge initial fitting', ?)
        `).bind(
          userId, sizing.unit, sizing.underbust, sizing.bust, sizing.waist, sizing.hip, sizing.height, sizing.thigh,
          sizing.braSize, JSON.stringify(sizing.sisterSizes), sizing.bodySize, sizing.nightySize, sizing.gownSize, sizing.corsetSize, sizing.hosierySize, now
        ).run();
      }

      const token = crypto.randomUUID() + crypto.randomUUID();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await env.DB.prepare("INSERT INTO auth_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(token, userId, expires, now).run();

      return json({ message: "Registered on Cloudflare edge", token, userId, sizing }, 201);
    }

    // Login
    if (pathname === "/api/auth/login" && request.method === "POST") {
      const { email, password } = await request.json();
      const user = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(email).first();
      if (!user || !(await verifyPassword(password, user.password_hash))) {
        return json({ error: "Invalid email or password" }, 401);
      }

      const token = crypto.randomUUID() + crypto.randomUUID();
      const now = new Date().toISOString();
      const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
      await env.DB.prepare("INSERT INTO auth_sessions (token, user_id, expires_at, created_at) VALUES (?, ?, ?, ?)").bind(token, user.id, expires, now).run();

      delete user.password_hash;
      return json({ message: "Welcome to the salon", token, user });
    }

    // Authenticated routes
    const auth = await getAuthUser(request, env);
    if (!auth) {
      return json({ error: "Unauthorized" }, 401);
    }

    // /api/auth/me
    if (pathname === "/api/auth/me" && request.method === "GET") {
      const sizing = await env.DB.prepare("SELECT * FROM sizing_profiles WHERE user_id = ?").bind(auth.user.id).first();
      if (sizing && sizing.sister_sizes) {
        sizing.sister_sizes = JSON.parse(sizing.sister_sizes);
      }
      return json({ user: auth.user, sizing });
    }

    // Sizing
    if (pathname === "/api/sizing") {
      if (request.method === "GET") {
        const sizing = await env.DB.prepare("SELECT * FROM sizing_profiles WHERE user_id = ?").bind(auth.user.id).first();
        if (sizing && sizing.sister_sizes) sizing.sister_sizes = JSON.parse(sizing.sister_sizes);
        return json({ profile: sizing });
      }
      if (request.method === "POST") {
        const body = await request.json();
        const computed = calculateProfile(body);
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT INTO sizing_profiles (user_id, unit, underbust, bust, waist, hip, height, thigh, bra_size, sister_sizes, body_size, nighty_size, gown_size, corset_size, hosiery_size, fit_notes, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Edge recalculation', ?)
          ON CONFLICT(user_id) DO UPDATE SET
            unit=excluded.unit, underbust=excluded.underbust, bust=excluded.bust, waist=excluded.waist, hip=excluded.hip,
            height=excluded.height, thigh=excluded.thigh, bra_size=excluded.bra_size, sister_sizes=excluded.sister_sizes,
            body_size=excluded.body_size, nighty_size=excluded.nighty_size, gown_size=excluded.gown_size, corset_size=excluded.corset_size,
            hosiery_size=excluded.hosiery_size, updated_at=excluded.updated_at
        `).bind(
          auth.user.id, computed.unit, computed.underbust, computed.bust, computed.waist, computed.hip, computed.height, computed.thigh,
          computed.braSize, JSON.stringify(computed.sisterSizes), computed.bodySize, computed.nightySize, computed.gownSize, computed.corsetSize, computed.hosierySize, now
        ).run();
        return json({ message: "Sizing profile updated", profile: computed });
      }
    }

    // Wishlist
    if (pathname === "/api/wishlist") {
      if (request.method === "GET") {
        const items = await env.DB.prepare("SELECT * FROM wishlist_items WHERE user_id = ? ORDER BY id DESC").bind(auth.user.id).all();
        return json({ wishlist: items.results });
      }
      if (request.method === "POST") {
        const { productHandle, productTitle, category, priceCents, preferredSize } = await request.json();
        const now = new Date().toISOString();
        await env.DB.prepare(`
          INSERT OR REPLACE INTO wishlist_items (user_id, product_handle, product_title, category, price_cents, preferred_size, added_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `).bind(auth.user.id, productHandle, productTitle, category || null, priceCents || 0, preferredSize || null, now).run();
        const items = await env.DB.prepare("SELECT * FROM wishlist_items WHERE user_id = ?").bind(auth.user.id).all();
        return json({ message: "Piece saved to wishlist", wishlist: items.results }, 201);
      }
    }

    return json({ error: "Endpoint not found" }, 404);
  },
};
