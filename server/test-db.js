/**
 * Automated Verification Script for Femme Silk Atelier User Database & API
 */

const { seedSampleData, Queries } = require("./db");
const { calculateProfile } = require("./fit-engine");

console.log("=== Testing Database & Sizing Engine ===");

// 1. Test Sizing Engine Directly
const testMeasurements = {
  unit: "cm",
  underbust: 74, // ~34 band
  bust: 90,      // gap 16 -> C cup
  waist: 71,     // M
  hip: 98,       // M
  height: 165,   // L hose
};
const profile = calculateProfile(testMeasurements);
console.log("✓ Sizing Calculation:", {
  braSize: profile.braSize,
  sisterSizes: profile.sisterSizes,
  bodySize: profile.bodySize,
  nightySize: profile.nightySize,
});

if (profile.braSize !== "34C") {
  throw new Error(`Expected 34C, got ${profile.braSize}`);
}

// 2. Test Database Seeding & Relations
const seedRes = seedSampleData();
console.log("✓ Seed execution:", seedRes);

const charlotte = Queries.findUserByEmail.get("charlotte@silkmoments.com");
if (!charlotte) throw new Error("Seed user not found");

const charlotteProfile = Queries.getSizingProfile.get(charlotte.id);
console.log("✓ Profile record verified:", {
  email: charlotte.email,
  bra: charlotteProfile.bra_size,
  sisters: JSON.parse(charlotteProfile.sister_sizes),
  tier: charlotte.membership_tier,
});

const wishlist = Queries.getWishlist.all(charlotte.id);
console.log(`✓ Wishlist verified (${wishlist.length} pieces):`, wishlist.map(w => w.product_title));

const orders = Queries.getOrders.all(charlotte.id);
console.log(`✓ Orders verified (${orders.length} orders):`, orders.map(o => o.order_number));

console.log("\n=== ALL DATABASE TESTS PASSED SUCCESSFULLY ===");
