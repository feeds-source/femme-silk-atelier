/**
 * Femme Silk Atelier — Clientele & Sizing API Server
 */

const express = require("express");
const cors = require("cors");
const crypto = require("node:crypto");
const { Queries, hashPassword, verifyPassword, seedSampleData } = require("./db");
const { calculateProfile } = require("./fit-engine");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

/* -------------------------------------------------------------
 * Auth Middleware
 * ------------------------------------------------------------- */
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Authentication token required" });
  }

  const token = authHeader.split(" ")[1];
  const session = Queries.findSession.get(token);
  if (!session || new Date(session.expires_at) < new Date()) {
    return res.status(401).json({ error: "Session invalid or expired" });
  }

  const user = Queries.findUserById.get(session.user_id);
  if (!user) {
    return res.status(401).json({ error: "User not found" });
  }

  req.user = user;
  req.sessionToken = token;
  next();
}

/* -------------------------------------------------------------
 * Health Check & Overview
 * ------------------------------------------------------------- */
app.get("/api/health", (req, res) => {
  const users = Queries.listAllUsers.all();
  res.json({
    status: "healthy",
    house: "Femme Silk Atelier",
    engine: "node:sqlite native",
    registeredUsersCount: users.length,
    timestamp: new Date().toISOString(),
  });
});

/* -------------------------------------------------------------
 * Authentication Endpoints
 * ------------------------------------------------------------- */
app.post("/api/auth/register", (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, newsletter, measurements } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const existing = Queries.findUserByEmail.get(email);
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const now = new Date().toISOString();
    const userUuid = crypto.randomUUID();
    const passwordHash = hashPassword(password);

    const result = Queries.createUser.run(
      userUuid,
      email,
      passwordHash,
      firstName || null,
      lastName || null,
      phone || null,
      "client",
      "Noir Standard",
      newsletter !== false ? 1 : 0,
      now,
      now
    );

    const userId = Number(result.lastInsertRowid);

    // Initial measurements / sizing calculation if provided
    let sizing = null;
    if (measurements && (measurements.underbust || measurements.bust || measurements.waist)) {
      sizing = calculateProfile(measurements);
      Queries.upsertSizingProfile.run(
        userId,
        sizing.unit,
        sizing.underbust,
        sizing.bust,
        sizing.waist,
        sizing.hip,
        sizing.height,
        sizing.thigh,
        sizing.braSize,
        JSON.stringify(sizing.sisterSizes),
        sizing.bodySize,
        sizing.nightySize,
        sizing.gownSize,
        sizing.corsetSize,
        sizing.hosierySize,
        "Initial registration fitting.",
        now
      );
    }

    // Issue Session Token (valid for 30 days)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    Queries.createSession.run(token, userId, expiresAt, now);

    const user = Queries.findUserById.get(userId);

    res.status(201).json({
      message: "Atelier account created successfully",
      token,
      user,
      sizing,
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Failed to create account" });
  }
});

app.post("/api/auth/login", (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const userWithPass = Queries.findUserByEmail.get(email);
    if (!userWithPass || !verifyPassword(password, userWithPass.password_hash)) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Issue Session Token
    const now = new Date().toISOString();
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    Queries.createSession.run(token, userWithPass.id, expiresAt, now);

    const user = Queries.findUserById.get(userWithPass.id);
    const sizing = Queries.getSizingProfile.get(userWithPass.id);
    if (sizing && sizing.sister_sizes) {
      sizing.sister_sizes = JSON.parse(sizing.sister_sizes);
    }

    res.json({
      message: "Welcome to the salon",
      token,
      user,
      sizing,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
});

app.get("/api/auth/me", requireAuth, (req, res) => {
  const sizing = Queries.getSizingProfile.get(req.user.id);
  if (sizing && sizing.sister_sizes) {
    sizing.sister_sizes = JSON.parse(sizing.sister_sizes);
  }
  const wishlist = Queries.getWishlist.all(req.user.id);
  const orders = Queries.getOrders.all(req.user.id);
  const addresses = Queries.getAddresses.all(req.user.id);

  res.json({
    user: req.user,
    sizing,
    wishlistCount: wishlist.length,
    orderCount: orders.length,
    addresses,
  });
});

app.post("/api/auth/logout", requireAuth, (req, res) => {
  Queries.deleteSession.run(req.sessionToken);
  res.json({ message: "Successfully logged out" });
});

/* -------------------------------------------------------------
 * Atelier Sizing Profile Endpoints
 * ------------------------------------------------------------- */
app.get("/api/sizing", requireAuth, (req, res) => {
  const sizing = Queries.getSizingProfile.get(req.user.id);
  if (!sizing) {
    return res.json({ profile: null, note: "No sizing measurements recorded yet." });
  }
  if (sizing.sister_sizes) {
    sizing.sister_sizes = JSON.parse(sizing.sister_sizes);
  }
  res.json({ profile: sizing });
});

app.post("/api/sizing", requireAuth, (req, res) => {
  try {
    const measurements = req.body;
    const computed = calculateProfile(measurements);
    const now = new Date().toISOString();

    Queries.upsertSizingProfile.run(
      req.user.id,
      computed.unit,
      computed.underbust,
      computed.bust,
      computed.waist,
      computed.hip,
      computed.height,
      computed.thigh,
      computed.braSize,
      JSON.stringify(computed.sisterSizes),
      computed.bodySize,
      computed.nightySize,
      computed.gownSize,
      computed.corsetSize,
      computed.hosierySize,
      measurements.fitNotes || "Atelier Studio calibration.",
      now
    );

    res.json({
      message: "Atelier fit matrix updated",
      profile: computed,
    });
  } catch (err) {
    console.error("Sizing save error:", err);
    res.status(500).json({ error: "Failed to update sizing profile" });
  }
});

/* -------------------------------------------------------------
 * Wishlist Endpoints
 * ------------------------------------------------------------- */
app.get("/api/wishlist", requireAuth, (req, res) => {
  const items = Queries.getWishlist.all(req.user.id);
  res.json({ wishlist: items });
});

app.post("/api/wishlist", requireAuth, (req, res) => {
  try {
    const { productHandle, productTitle, category, priceCents, imageUrl, preferredSize } = req.body;
    if (!productHandle || !productTitle) {
      return res.status(400).json({ error: "Product handle and title are required" });
    }

    const now = new Date().toISOString();
    Queries.addWishlistItem.run(
      req.user.id,
      productHandle,
      productTitle,
      category || null,
      priceCents || 0,
      imageUrl || null,
      preferredSize || null,
      now
    );

    const items = Queries.getWishlist.all(req.user.id);
    res.status(201).json({ message: "Piece saved to your atelier wishlist", wishlist: items });
  } catch (err) {
    console.error("Wishlist add error:", err);
    res.status(500).json({ error: "Failed to save piece to wishlist" });
  }
});

app.delete("/api/wishlist/:handle", requireAuth, (req, res) => {
  Queries.removeWishlistItem.run(req.user.id, req.params.handle);
  const items = Queries.getWishlist.all(req.user.id);
  res.json({ message: "Piece removed from wishlist", wishlist: items });
});

/* -------------------------------------------------------------
 * Membership & Order History Endpoints
 * ------------------------------------------------------------- */
app.get("/api/membership", requireAuth, (req, res) => {
  const orders = Queries.getOrders.all(req.user.id);
  const totalSpentCents = orders.reduce((sum, o) => sum + o.total_amount_cents, 0);

  let tier = req.user.membership_tier || "Noir Standard";
  if (totalSpentCents >= 50000 && tier !== "Emerald VIP") {
    tier = "Emerald VIP";
    Queries.updateMembershipTier.run(tier, new Date().toISOString(), req.user.id);
  } else if (totalSpentCents >= 25000 && tier === "Noir Standard") {
    tier = "Champagne Elite";
    Queries.updateMembershipTier.run(tier, new Date().toISOString(), req.user.id);
  }

  const benefits = {
    "Noir Standard": [
      "Complimentary discreet presentation packaging",
      "Worldwide Cash on Delivery access",
      "Interactive atelier sizing matrix save",
    ],
    "Champagne Elite": [
      "All Noir Standard privileges",
      "Private salon early access to drops",
      "Complimentary priority worldwide courier dispatch",
      "Annual anniversary silk gift",
    ],
    "Emerald VIP": [
      "All Champagne Elite privileges",
      "Direct private consultation with atelier master cutter",
      "Bespoke embroidery & custom monogramming on pure silk gowns",
      "Invitation to private salon viewings in Paris and London",
    ],
  };

  res.json({
    tier,
    totalSpentFormatted: `$${(totalSpentCents / 100).toFixed(2)}`,
    ordersCount: orders.length,
    benefits: benefits[tier] || benefits["Noir Standard"],
  });
});

app.get("/api/orders", requireAuth, (req, res) => {
  const orders = Queries.getOrders.all(req.user.id);
  res.json({ orders });
});

/* -------------------------------------------------------------
 * Admin & Seeding
 * ------------------------------------------------------------- */
app.post("/api/admin/seed", (req, res) => {
  const result = seedSampleData();
  res.json({ message: "Sample data seeded", result });
});

app.get("/api/admin/users", (req, res) => {
  const users = Queries.listAllUsers.all();
  res.json({ users });
});

/* -------------------------------------------------------------
 * Server Start
 * ------------------------------------------------------------- */
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Femme Silk Atelier Database API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
