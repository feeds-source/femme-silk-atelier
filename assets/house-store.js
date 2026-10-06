(() => {
  const BAG = "femme-house-bag";
  const WISH = "femme-wish";
  const ORDERS = "femme-orders";
  const SEEN = "femme-seen";
  const CATALOG = [{"id": "everyday-soft-bra", "title": "Everyday Soft Cup Bra", "cat": "Bras", "price": 42, "chart": "bra"}, {"id": "ultimate-tshirt-bra", "title": "Ultimate T-Shirt Bra", "cat": "Bras", "price": 48, "chart": "bra"}, {"id": "first-fit-teen-bra", "title": "First Fit Bralette", "cat": "Bras", "price": 28, "chart": "bra"}, {"id": "cloud-bralette", "title": "Cloud Wireless Bralette", "cat": "Bralettes", "price": 38, "chart": "bra"}, {"id": "studio-bra", "title": "Studio Soft Bra", "cat": "Active", "price": 44, "chart": "bra"}, {"id": "invisible-brief", "title": "Invisible Seamless Brief", "cat": "Seamless", "price": 18, "chart": "alpha"}, {"id": "silk-leakproof", "title": "Silk-Feel Leakproof Brief", "cat": "Leakproof", "price": 24, "chart": "alpha"}, {"id": "lace-balconette-set", "title": "Lace Balconette Set", "cat": "Bra Sets", "price": 78, "chart": "bra"}, {"id": "daily-hipster", "title": "Daily Hipster Brief", "cat": "Panties", "price": 16, "chart": "alpha"}, {"id": "seamless-thong", "title": "Seamless Soft Thong", "cat": "Panties", "price": 14, "chart": "alpha"}, {"id": "ruby-brazilian", "title": "Ruby Silk Brazilian", "cat": "Panties", "price": 22, "chart": "alpha"}, {"id": "lace-camisole", "title": "Champagne Lace Camisole", "cat": "Camisole", "price": 36, "chart": "alpha"}, {"id": "ruby-babydoll", "title": "Ruby Lace Babydoll", "cat": "Babydoll", "price": 88, "chart": "nighty"}, {"id": "satin-night-set", "title": "Satin Night Cami Set", "cat": "Short Nighty", "price": 64, "chart": "nighty"}, {"id": "champagne-sleep-set", "title": "Champagne Sleep Set", "cat": "Sleep Sets", "price": 78, "chart": "nighty"}, {"id": "atelier-slip", "title": "Atelier Half Slip", "cat": "Slips", "price": 58, "chart": "alpha"}, {"id": "short-lace-nighty", "title": "Noir Short Lace Nighty", "cat": "Short Nighty", "price": 72, "chart": "nighty"}, {"id": "silk-night-slip", "title": "Champagne Night Slip", "cat": "Long Nighty", "price": 86, "chart": "nighty"}, {"id": "satin-gown", "title": "Black Satin Gown", "cat": "Gowns", "price": 96, "chart": "gown"}, {"id": "noir-teddy", "title": "Noir Lace Teddy", "cat": "Teddies", "price": 98, "chart": "alpha"}, {"id": "emerald-teddy", "title": "Emerald Silk Teddy", "cat": "Teddies", "price": 108, "chart": "alpha"}, {"id": "mesh-bodysuit", "title": "Mesh Contour Bodysuit", "cat": "Teddies", "price": 88, "chart": "alpha"}, {"id": "ivory-bridal-set", "title": "Ivory Pearl Bridal Set", "cat": "Bridal", "price": 148, "chart": "bra"}, {"id": "getting-ready-robe", "title": "Pearl Getting-Ready Robe", "cat": "Bridal", "price": 118, "chart": "nighty"}, {"id": "emerald-bustier", "title": "Emerald Silk Bustier", "cat": "Corsetry", "price": 128, "chart": "alpha"}, {"id": "ruby-waspie", "title": "Ruby Lace Waspie", "cat": "Corsetry", "price": 96, "chart": "alpha"}, {"id": "seamed-stockings", "title": "Champagne Seamed Stockings", "cat": "Hosiery", "price": 32, "chart": "alpha"}, {"id": "lace-holdups", "title": "Noir Lace Hold-Ups", "cat": "Hosiery", "price": 28, "chart": "alpha"}, {"id": "lace-garter", "title": "Noir Lace Garter", "cat": "Hosiery", "price": 48, "chart": "alpha"}, {"id": "body-stocking", "title": "Noir Lace Body Stocking", "cat": "Body Stockings", "price": 42, "chart": "free"}, {"id": "high-waist-shaper", "title": "High-Waist Soft Shaper", "cat": "Shapewear", "price": 54, "chart": "alpha"}, {"id": "slip-short", "title": "Everyday Slip Short", "cat": "Shapewear", "price": 36, "chart": "alpha"}, {"id": "sculpt-midi", "title": "Sculpt Midi Slip", "cat": "Shapewear", "price": 62, "chart": "alpha"}, {"id": "silk-bikini", "title": "Ruby Silk Bikini", "cat": "Swim", "price": 58, "chart": "alpha"}, {"id": "cloud-robe", "title": "Cloud Knit Robe", "cat": "Loungewear", "price": 72, "chart": "alpha"}, {"id": "noir-robe", "title": "Noir Atelier Robe", "cat": "Robes", "price": 84, "chart": "nighty"}, {"id": "lounge-wide-pant", "title": "Wide-Leg Lounge Pant", "cat": "Loungewear", "price": 58, "chart": "alpha"}, {"id": "silk-kaftan", "title": "Jewel Silk Kaftan", "cat": "Resort", "price": 132, "chart": "alpha"}, {"id": "orchid-sarong", "title": "Orchid Silk Sarong", "cat": "Resort", "price": 64, "chart": "free"}, {"id": "thermal-set", "title": "Soft Thermal Set", "cat": "Thermal", "price": 68, "chart": "alpha"}, {"id": "plum-wrap", "title": "Plum Cashmere Wrap", "cat": "Thermal", "price": 94, "chart": "alpha"}, {"id": "silk-eye-mask", "title": "Champagne Silk Mask", "cat": "Accessories", "price": 24, "chart": "free"}, {"id": "gold-body-chain", "title": "Gold Body Chain", "cat": "Accessories", "price": 54, "chart": "free"}];
  const SIZES = {
    bra: ["30B","32A","32B","32C","32D","34A","34B","34C","34D","36B","36C","36D","38B","38C","38D","40B","40C","42B","42C"],
    nighty: ["Free Size","S","M","L","XL"],
    gown: ["M","L","XL","XXL"],
    free: ["Free Size"],
    alpha: ["XS","S","M","L","XL","XXL"]
  };
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "\u0026amp;", "<": "\u0026lt;", ">": "\u0026gt;", '"': "\u0026quot;", "'": "\u0026#39;" }[c]));
  const money = (n) => `$${Number(n).toFixed(2)}`;
  const read = (k) => { try { return JSON.parse(localStorage.getItem(k) || "[]"); } catch (e) { return []; } };
  const write = (k, v) => localStorage.setItem(k, JSON.stringify(v));
  const asset = (name) => (window.FEMME && window.FEMME.asset) ? window.FEMME.asset(name) : name;
  const byId = (id) => CATALOG.find((p) => p.id === id);
  const enrich = (p) => p && ({ ...p, image: asset(p.id + ".jpg"), video: asset(p.id + ".mp4"), sizes: SIZES[p.chart] || SIZES.alpha });

  function paintWishCount() {
    const n = read(WISH).length;
    document.querySelectorAll("[data-wish-count]").forEach((el) => { el.textContent = String(n); });
    document.querySelectorAll("[data-wish]").forEach((btn) => {
      const on = read(WISH).some((w) => w.id === btn.dataset.wish);
      btn.classList.toggle("is-on", on);
      btn.textContent = on ? "♥" : "♡";
    });
  }

  function openLayer(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeLayer(el) {
    el.hidden = true;
    if (![...document.querySelectorAll(".house-layer")].some((n) => !n.hidden)) document.body.style.overflow = "";
  }

  function reviews(id) {
    const names = ["Amelia", "Nora", "Leila", "Sable", "June"];
    let h = 0;
    for (const c of id) h = (h * 33 + c.charCodeAt(0)) % 997;
    return [0, 1].map((i) => ({
      name: names[(h + i) % names.length],
      stars: 5 - ((h + i) % 2 === 0 ? 0 : 0),
      text: i === 0
        ? "The cloth sits where the size chart said it would. Discreet box, and the film matches the piece."
        : "Ordered my usual size and it needed no exchange. The gold trim is quiet in daylight."
    }));
  }

  function renderPdp(id) {
    const p = enrich(byId(id));
    const host = document.getElementById("house-pdp");
    if (!p || !host) return;
    const seen = read(SEEN).filter((x) => x !== id);
    seen.unshift(id);
    write(SEEN, seen.slice(0, 8));
    const related = CATALOG.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
    const saved = read(WISH).some((w) => w.id === p.id);
    host.innerHTML = `
      <div class="house-veil" data-close-layer></div>
      <article class="pdp" data-piece="${esc(p.id)}" role="dialog" aria-modal="true" aria-label="${esc(p.title)}">
        <button type="button" class="pdp-x" data-close-layer aria-label="Close">&times;</button>
        <div class="pdp-media media-fill">
          <img src="${esc(p.image)}" alt="${esc(p.title)}">
          <video class="motion-video" autoplay muted loop playsinline poster="${esc(p.image)}"><source src="${esc(p.video)}" type="video/mp4"></video>
        </div>
        <div class="pdp-copy">
          <p class="kicker">${esc(p.cat)}</p>
          <h2 class="display">${esc(p.title)}</h2>
          <p class="price">${money(p.price)}</p>
          <p class="muted">${esc(p.title)} is cut in the ${esc(p.cat)} room. Lined where the body asks, finished by hand, and packed in a plain box.</p>
          <label class="kicker">Size</label>
          <select class="size-select" aria-label="Size">
            ${p.sizes.map((s, i) => `<option ${i === Math.min(2, p.sizes.length - 1) ? "selected" : ""}>${esc(s)}</option>`).join("")}
          </select>
          <label class="kicker">Quantity</label>
          <input data-qty-input type="number" min="1" value="1" class="qty-input">
          <div class="card-action-row">
            <button type="button" class="btn" data-house-add data-id="${esc(p.id)}" data-title="${esc(p.title)}" data-price="${p.price}" data-image="${esc(p.image)}">Add to bag</button>
            <button type="button" class="btn btn--ghost" data-wish="${esc(p.id)}">${saved ? "♥ Saved" : "♡ Save"}</button>
          </div>
          <details open><summary>Cloth & care</summary><p>Hand wash cold or dry clean. Keep gold hardware away from perfume. Store flat, out of the sun.</p></details>
          <details><summary>Delivery & returns</summary><p>Cash on delivery worldwide. Complimentary shipping over $150. Unworn pieces exchange free within 14 days.</p></details>
          <details><summary>Reviews</summary>
            ${reviews(p.id).map((r) => `<p><strong>${r.name}</strong> · ★★★★★<br>${esc(r.text)}</p>`).join("")}
          </details>
          ${related.length ? `<p class="kicker">Also in ${esc(p.cat)}</p><div class="pdp-related">${related.map((r) => `<button type="button" data-open-piece="${esc(r.id)}"><img src="${esc(asset(r.id + ".jpg"))}" alt=""><span>${esc(r.title)}</span></button>`).join("")}</div>` : ""}
        </div>
      </article>`;
    openLayer("house-pdp");
    const url = new URL(window.location.href);
    url.searchParams.set("piece", id);
    history.replaceState({}, "", url);
  }

  function renderWish() {
    const host = document.getElementById("house-wish");
    const items = read(WISH);
    host.innerHTML = `
      <div class="house-veil" data-close-layer></div>
      <aside class="side-panel" role="dialog" aria-label="Saved pieces">
        <header><p class="kicker">Saved</p><button type="button" data-close-layer aria-label="Close">&times;</button></header>
        ${items.length ? items.map((w) => `
          <div class="side-row">
            <img src="${esc(w.image)}" alt="">
            <div><strong>${esc(w.title)}</strong><p class="price">${money(w.price)}</p>
              <button type="button" class="gold" data-open-piece="${esc(w.id)}">View</button>
              <button type="button" data-wish="${esc(w.id)}">Remove</button>
            </div>
          </div>`).join("") : `<p class="muted">Nothing saved yet. Tap the heart on a piece.</p>`}
      </aside>`;
    openLayer("house-wish");
  }

  function renderOrders() {
    const host = document.getElementById("house-orders");
    const items = read(ORDERS);
    host.innerHTML = `
      <div class="house-veil" data-close-layer></div>
      <aside class="side-panel" role="dialog" aria-label="Orders">
        <header><p class="kicker">Orders</p><button type="button" data-close-layer aria-label="Close">&times;</button></header>
        ${items.length ? items.map((o) => `
          <article class="order-card">
            <p class="kicker">${esc(o.id)}</p>
            <h3>${esc(o.name)}</h3>
            <p class="muted">${esc(o.when)} · ${money(o.total)} · Cash on delivery</p>
            <ol class="track"><li class="is-on">Placed</li><li class="is-on">Atelier packing</li><li>Out for delivery</li><li>Delivered</li></ol>
            <p class="subtle">${o.lines.map((l) => `${esc(l.title)} · ${esc(l.size)} × ${l.qty}`).join("<br>")}</p>
          </article>`).join("") : `<p class="muted">No orders yet. Add a piece, then checkout.</p>`}
      </aside>`;
    openLayer("house-orders");
  }

  function bagTotals(code) {
    const items = read(BAG);
    const sub = items.reduce((n, i) => n + i.price * i.qty, 0);
    let off = 0;
    const c = String(code || "").trim().toUpperCase();
    if (c === "ATELIER10") off = 0.1;
    if (c === "WELCOME15") off = 0.15;
    const discount = Math.round(sub * off * 100) / 100;
    const ship = sub - discount >= 150 || sub === 0 ? 0 : 12;
    return { items, sub, discount, ship, total: Math.max(0, sub - discount + ship), code: off ? c : "" };
  }

  function renderCheckout() {
    const host = document.getElementById("house-checkout");
    const t = bagTotals("");
    if (!t.items.length) { renderOrders(); return; }
    host.innerHTML = `
      <div class="house-veil" data-close-layer></div>
      <form class="checkout" role="dialog" aria-label="Checkout">
        <header><p class="kicker">Checkout</p><button type="button" data-close-layer aria-label="Close">&times;</button></header>
        <div class="checkout-grid">
          <div>
            <label>Full name<input name="name" required autocomplete="name"></label>
            <label>Email<input name="email" type="email" required autocomplete="email"></label>
            <label>Phone<input name="phone" required autocomplete="tel"></label>
            <label>Address<input name="address" required autocomplete="street-address"></label>
            <label>City<input name="city" required autocomplete="address-level2"></label>
            <label>Country<input name="country" required value="United States" autocomplete="country-name"></label>
            <label>Code<input name="code" placeholder="ATELIER10" data-code></label>
            <p class="subtle">Cash on delivery. The atelier confirms by email before packing.</p>
            <button class="btn" type="submit">Place order</button>
          </div>
          <aside data-summary>
            ${summaryHtml(t)}
          </aside>
        </div>
      </form>`;
    openLayer("house-checkout");
    host.querySelector("[data-code]").addEventListener("input", (e) => {
      host.querySelector("[data-summary]").innerHTML = summaryHtml(bagTotals(e.target.value));
    });
    host.querySelector("form").addEventListener("submit", (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      const tot = bagTotals(data.code);
      const order = {
        id: "SM-" + String(1000 + read(ORDERS).length + 1),
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: `${data.address}, ${data.city}, ${data.country}`,
        when: new Date().toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }),
        total: tot.total,
        lines: tot.items.map((i) => ({ title: i.title, size: i.size, qty: i.qty, price: i.price }))
      };
      write(ORDERS, [order, ...read(ORDERS)]);
      write(BAG, []);
      host.innerHTML = `
        <div class="house-veil" data-close-layer></div>
        <aside class="side-panel" role="dialog" aria-label="Order placed">
          <header><p class="kicker">Confirmed</p><button type="button" data-close-layer>&times;</button></header>
          <h2 class="display">${esc(order.id)}</h2>
          <p class="muted">Thank you, ${esc(order.name)}. Pay ${money(order.total)} in cash when the box arrives.</p>
          <button type="button" class="btn" data-orders-open>Track this order</button>
        </aside>`;
      document.querySelectorAll("[data-cart-count], [data-drawer-count]").forEach((el) => { el.textContent = "0"; });
    });
  }

  function summaryHtml(t) {
    return `
      ${t.items.map((i) => `<p>${esc(i.title)} · ${esc(i.size)} × ${i.qty}<br><span class="gold">${money(i.price * i.qty)}</span></p>`).join("")}
      <p>Subtotal ${money(t.sub)}</p>
      ${t.discount ? `<p>Code ${esc(t.code)} −${money(t.discount)}</p>` : ""}
      <p>${t.ship ? `Delivery ${money(t.ship)}` : "Complimentary delivery"}</p>
      <p class="price">Total ${money(t.total)}</p>`;
  }

  function mountTools() {
    document.querySelectorAll(".grid-shop").forEach((grid) => {
      if (!grid.querySelector("[data-piece]")) return;
      if (grid.previousElementSibling?.hasAttribute("data-shop-tools")) return;
      [...grid.querySelectorAll("[data-piece]")].forEach((card, i) => { card.dataset.order = String(i); });
      grid.insertAdjacentHTML("beforebegin", `
        <div class="shop-tools" data-shop-tools>
          <label>Sort
            <select data-sort>
              <option value="featured">Featured</option>
              <option value="price-asc">Price, low to high</option>
              <option value="price-desc">Price, high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label>Price
            <select data-price>
              <option value="all">All prices</option>
              <option value="under">Under $40</option>
              <option value="mid">$40 – $80</option>
              <option value="high">$80 and over</option>
            </select>
          </label>
          <span class="muted" data-tool-count></span>
        </div>`);
    });
  }

  function applyTools(bar) {
    const grid = bar.nextElementSibling;
    if (!grid) return;
    const sort = bar.querySelector("[data-sort]").value;
    const band = bar.querySelector("[data-price]").value;
    const cards = [...grid.querySelectorAll("[data-piece]")];
    cards.forEach((card) => {
      const p = Number(card.dataset.price);
      const ok = band === "all" || (band === "under" && p < 40) || (band === "mid" && p >= 40 && p < 80) || (band === "high" && p >= 80);
      card.hidden = !ok;
    });
    cards.slice().sort((a, b) => {
      if (sort === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      if (sort === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (sort === "name") return a.dataset.title.localeCompare(b.dataset.title);
      return Number(a.dataset.order) - Number(b.dataset.order);
    }).forEach((c) => grid.appendChild(c));
    const n = cards.filter((c) => !c.hidden).length;
    const count = bar.querySelector("[data-tool-count]");
    if (count) count.textContent = `${n} ${n === 1 ? "piece" : "pieces"}`;
  }

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-house-add]");
    if (add && e.eventPhase === Event.CAPTURING_PHASE) {
      const qty = add.closest("article, .pdp")?.querySelector("[data-qty-input]");
      if (qty) add.dataset.qty = String(Math.max(1, Number(qty.value) || 1));
    }
  }, true);

  document.addEventListener("click", (e) => {
    const wish = e.target.closest("[data-wish]");
    if (wish) {
      e.preventDefault();
      e.stopPropagation();
      const id = wish.dataset.wish;
      const p = enrich(byId(id));
      let items = read(WISH);
      if (items.some((w) => w.id === id)) items = items.filter((w) => w.id !== id);
      else if (p) items.push({ id, title: p.title, price: p.price, image: p.image, cat: p.cat });
      write(WISH, items);
      paintWishCount();
      if (!document.getElementById("house-wish").hidden) renderWish();
      return;
    }
    const open = e.target.closest("[data-open-piece]");
    if (open) {
      e.preventDefault();
      renderPdp(open.dataset.openPiece);
      return;
    }
    if (e.target.closest("[data-wish-open]")) { renderWish(); return; }
    if (e.target.closest("[data-orders-open]")) { renderOrders(); return; }
    if (e.target.closest("[data-auth-open]")) { renderAuth(); return; }
    const oauth = e.target.closest("[data-auth0]");
    if (oauth) { startAuth0(oauth.dataset.auth0); return; }
    if (e.target.closest("[data-auth-out]")) { logoutAuth0(); return; }
    if (e.target.closest("[data-close-layer]")) {
      const layer = e.target.closest(".house-layer");
      if (layer) closeLayer(layer);
      if (layer?.id === "house-pdp") {
        const url = new URL(window.location.href);
        url.searchParams.delete("piece");
        history.replaceState({}, "", url);
      }
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-sort], [data-price]")) applyTools(e.target.closest("[data-shop-tools]"));
  });

  document.addEventListener("submit", (e) => {
    const form = e.target.closest("#cart-drawer-form, #cart");
    if (!form) return;
    if (read(BAG).length) {
      e.preventDefault();
      e.stopPropagation();
      renderCheckout();
    }
  }, true);

  function authSession() {
    try { return JSON.parse(localStorage.getItem("femme-auth") || "null"); } catch (e) { return null; }
  }
  function paintAuth() {
    const user = authSession();
    document.querySelectorAll("[data-auth-label]").forEach((el) => {
      el.textContent = user ? (user.name || user.email || "Account") : "Sign in";
    });
  }
  function b64url(bytes) {
    let s = "";
    bytes.forEach((b) => { s += String.fromCharCode(b); });
    return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  }
  function auth0Domain() {
    return String(window.FEMME?.auth0Domain || "silkmoments.us.auth0.com").replace(/^https?:\/\//, "").replace(/\/$/, "");
  }
  function auth0Client() {
    return window.FEMME?.auth0ClientId || "NFWd6eudI4TbilRjYSsduUjIqGtrBYn5";
  }
  function redirectUri() {
    return window.location.origin + "/";
  }
  async function startAuth0(screen) {
    const domain = auth0Domain();
    const clientId = auth0Client();
    const bytes = new Uint8Array(32);
    crypto.getRandomValues(bytes);
    const verifier = b64url(bytes);
    const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)));
    const challenge = b64url(digest);
    sessionStorage.setItem("femme-auth0-verifier", verifier);
    const url = new URL("https://" + domain + "/authorize");
    url.searchParams.set("response_type", "code");
    url.searchParams.set("client_id", clientId);
    url.searchParams.set("redirect_uri", redirectUri());
    url.searchParams.set("scope", "openid profile email");
    url.searchParams.set("code_challenge", challenge);
    url.searchParams.set("code_challenge_method", "S256");
    if (screen === "signup") url.searchParams.set("screen_hint", "signup");
    window.location.assign(url.toString());
  }
  function logoutAuth0() {
    const url = new URL("https://" + auth0Domain() + "/v2/logout");
    url.searchParams.set("client_id", auth0Client());
    url.searchParams.set("returnTo", redirectUri());
    localStorage.removeItem("femme-auth");
    window.location.assign(url.toString());
  }
  async function finishAuth0() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");
    const verifier = sessionStorage.getItem("femme-auth0-verifier");
    const domain = auth0Domain();
    const clientId = auth0Client();
    if (!code || !verifier || !domain || !clientId) return;
    const tokenRes = await fetch("https://" + domain + "/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: clientId,
        code_verifier: verifier,
        code,
        redirect_uri: redirectUri()
      })
    });
    const tok = await tokenRes.json();
    if (!tok.access_token) return;
    const info = await fetch("https://" + domain + "/userinfo", {
      headers: { Authorization: "Bearer " + tok.access_token }
    }).then((r) => r.json());
    localStorage.setItem("femme-auth", JSON.stringify(info));
    sessionStorage.removeItem("femme-auth0-verifier");
    const clean = new URL(window.location.href);
    ["code", "state"].forEach((k) => clean.searchParams.delete(k));
    history.replaceState({}, "", clean.pathname + clean.search + clean.hash);
    paintAuth();
    renderAuth();
  }
  function renderAuth() {
    const host = document.getElementById("house-auth");
    if (!host) return;
    const user = authSession();
    const shop = window.FEMME?.accountsEnabled
      ? `<a class="gold" href="${esc(user ? window.FEMME.accountUrl : window.FEMME.accountLogin)}">Shopify account</a>`
      : "";
    host.innerHTML = `
      <div class="house-veil" data-close-layer></div>
      <aside class="side-panel" role="dialog" aria-label="Sign in">
        <header><p class="kicker">Account</p><button type="button" data-close-layer aria-label="Close">&times;</button></header>
        ${user ? `
          <p>Logged in as ${esc(user.email || user.name || "")}</p>
          <h2 class="display">User Profile</h2>
          <pre class="auth-profile">${esc(JSON.stringify(user, null, 2))}</pre>
          <button type="button" class="btn" data-auth-out>Logout</button>
        ` : `
          <h2 class="display">Sign in</h2>
          <button type="button" class="btn" data-auth0="signup">Signup</button>
          <button type="button" class="btn btn--ghost" data-auth0="login">Login</button>
        `}
        <p style="margin-top:1rem">${shop}</p>
      </aside>`;
    openLayer("house-auth");
  }

  mountTools();
  document.querySelectorAll("[data-shop-tools]").forEach(applyTools);
  paintWishCount();
  paintAuth();
  finishAuth0();
  const piece = new URLSearchParams(window.location.search).get("piece");
  if (piece && byId(piece)) renderPdp(piece);
})();
