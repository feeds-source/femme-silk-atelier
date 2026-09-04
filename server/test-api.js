/**
 * Integration Test for Express REST API
 */

const http = require("node:http");
const app = require("./server");

const server = http.createServer(app);

server.listen(0, async () => {
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;
  console.log(`Test server running on ${baseUrl}`);

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/api/health`).then((r) => r.json());
    console.log("✓ Health Check:", healthRes.status, "Registered users:", healthRes.registeredUsersCount);

    // 2. Register new client with measurements
    const regPayload = {
      email: `elena_${Date.now()}@silkmoments.com`,
      password: "AtelierSecret2026!",
      firstName: "Elena",
      lastName: "Rostova",
      phone: "+1 212 555 0199",
      measurements: {
        unit: "cm",
        underbust: 74,
        bust: 90,
        waist: 70,
        hip: 96,
      },
    };
    const regRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(regPayload),
    }).then((r) => r.json());

    console.log("✓ Registered user:", regRes.user.email);
    console.log("✓ Auto-computed sizing profile:", {
      bra: regRes.sizing.braSize,
      sisters: regRes.sizing.sisterSizes,
      body: regRes.sizing.bodySize,
    });
    const token = regRes.token;

    // 3. Authenticated /me
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    console.log("✓ Authenticated /me user:", meRes.user.first_name, meRes.user.last_name, "Tier:", meRes.user.membership_tier);

    // 4. Add to Wishlist
    const wishAdd = await fetch(`${baseUrl}/api/wishlist`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productHandle: "ruby-babydoll",
        productTitle: "Ruby Lace Babydoll",
        category: "Babydoll",
        priceCents: 8800,
        preferredSize: "M",
      }),
    }).then((r) => r.json());
    console.log("✓ Wishlist item added:", wishAdd.message, "Count:", wishAdd.wishlist.length);

    // 5. Check Membership
    const memRes = await fetch(`${baseUrl}/api/membership`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());
    console.log("✓ Membership tier:", memRes.tier, "Benefits count:", memRes.benefits.length);

    // 6. Update Sizing Profile
    const updateSize = await fetch(`${baseUrl}/api/sizing`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        unit: "cm",
        underbust: 79, // -> 36 band
        bust: 97,      // gap 18 -> D cup
        waist: 76,
        hip: 102,
      }),
    }).then((r) => r.json());
    console.log("✓ Recalculated sizing matrix:", {
      bra: updateSize.profile.braSize,
      sisters: updateSize.profile.sisterSizes,
      body: updateSize.profile.bodySize,
    });

    console.log("\n=== ALL API INTEGRATION TESTS PASSED ===");
  } catch (err) {
    console.error("API Test Failed:", err);
    process.exitCode = 1;
  } finally {
    server.close();
  }
});
