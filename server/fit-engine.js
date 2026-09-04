/**
 * Femme Silk Atelier — Sizing & Fit Engine
 * Mathematical calculation for bra band/cup, sister sizes, body silhouette, and atelier corsetry.
 */

const BANDS = [
  { band: "30", lo: 63, hi: 67 },
  { band: "32", lo: 68, hi: 72 },
  { band: "34", lo: 73, hi: 77 },
  { band: "36", lo: 78, hi: 82 },
  { band: "38", lo: 83, hi: 87 },
  { band: "40", lo: 88, hi: 92 },
  { band: "42", lo: 93, hi: 97 },
];

const CUT_SET = new Set([
  "30B", "32A", "32B", "32C", "32D",
  "34A", "34B", "34C", "34D",
  "36B", "36C", "36D",
  "38B", "38C", "38D",
  "40B", "40C",
  "42B", "42C",
]);

const ALPHA = [
  { size: "XS", bust: [78, 82], waist: [60, 64], hip: [86, 90] },
  { size: "S",  bust: [83, 87], waist: [65, 69], hip: [91, 95] },
  { size: "M",  bust: [88, 92], waist: [70, 74], hip: [96, 100] },
  { size: "L",  bust: [93, 97], waist: [75, 79], hip: [101, 105] },
  { size: "XL", bust: [98, 104], waist: [80, 86], hip: [106, 112] },
  { size: "XXL", bust: [105, 112], waist: [87, 94], hip: [113, 120] },
];

const HOSE = [
  { size: "XS", height: [150, 158], thigh: [48, 52] },
  { size: "S",  height: [155, 163], thigh: [50, 54] },
  { size: "M",  height: [160, 168], thigh: [53, 57] },
  { size: "L",  height: [165, 173], thigh: [56, 61] },
  { size: "XL", height: [170, 178], thigh: [60, 66] },
  { size: "XXL", height: [173, 182], thigh: [65, 72] },
];

const CORSET = [
  { size: "XS", open: [64, 68] },
  { size: "S",  open: [69, 73] },
  { size: "M",  open: [74, 78] },
  { size: "L",  open: [79, 83] },
  { size: "XL", open: [84, 90] },
  { size: "XXL", open: [91, 98] },
];

function inSpan(n, span) {
  return n >= span[0] && n <= span[1];
}

function pick(rows, key, n) {
  const hit = rows.find((r) => inSpan(n, r[key]));
  if (hit) return hit.size;
  return n < rows[0][key][0] ? rows[0].size : rows[rows.length - 1].size;
}

function cupOf(gap) {
  if (gap < 14) return "A";
  if (gap < 16) return "B";
  if (gap < 18) return "C";
  return "D";
}

function bandOf(under) {
  const hit = BANDS.find((b) => under >= b.lo && under <= b.hi);
  if (hit) return hit.band;
  return BANDS.reduce(
    (best, b) => {
      const mid = (b.lo + b.hi) / 2;
      const d = Math.abs(under - mid);
      return d < best.d ? { band: b.band, d } : best;
    },
    { band: "34", d: Infinity }
  ).band;
}

function calculateSisterSizes(size) {
  const band = Number(size.slice(0, -1));
  const cups = "ABCD";
  const ci = cups.indexOf(size.slice(-1));
  if (!band || ci < 0) return [];
  const vol = (band - 30) / 2 + ci;
  const out = [];
  for (const b of [30, 32, 34, 36, 38, 40, 42]) {
    const c = vol - (b - 30) / 2;
    if (Number.isInteger(c) && c >= 0 && c < 4) {
      const candidate = `${b}${cups[c]}`;
      if (candidate !== size && CUT_SET.has(candidate)) {
        out.push(candidate);
      }
    }
  }
  return out;
}

/**
 * Calculate full atelier profile from measurements
 * @param {Object} m - measurements { underbust, bust, waist, hip, height, thigh, unit }
 */
function calculateProfile(m) {
  const toCm = (val) => {
    if (val == null || isNaN(val)) return undefined;
    const num = Number(val);
    return m.unit === "in" ? num * 2.54 : num;
  };

  const under = toCm(m.underbust);
  const bust = toCm(m.bust);
  const waist = toCm(m.waist);
  const hip = toCm(m.hip);
  const height = toCm(m.height);
  const thigh = toCm(m.thigh);

  let braSize = null;
  let sisterSizes = [];
  let bodySize = null;
  let nightySize = null;
  let gownSize = null;
  let corsetSize = null;
  let hosierySize = null;

  if (under && bust) {
    const theoretical = `${bandOf(under)}${cupOf(bust - under)}`;
    const sisters = calculateSisterSizes(theoretical);
    braSize = CUT_SET.has(theoretical)
      ? theoretical
      : sisters[0] || theoretical;
    sisterSizes = calculateSisterSizes(braSize);
  }

  if (bust || waist || hip) {
    const votes = [];
    if (bust) votes.push(pick(ALPHA, "bust", bust));
    if (waist) votes.push(pick(ALPHA, "waist", waist));
    if (hip) votes.push(pick(ALPHA, "hip", hip));
    const counts = {};
    votes.forEach((s) => {
      counts[s] = (counts[s] || 0) + 1;
    });
    bodySize = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    nightySize = bodySize === "XS" ? "S" : bodySize === "XXL" ? "XL" : bodySize;
    gownSize = bodySize === "XS" || bodySize === "S" ? "M" : bodySize;
  }

  if (waist) {
    corsetSize = pick(CORSET, "open", waist);
  }

  if (height) {
    hosierySize = pick(HOSE, "height", height);
    if (thigh) {
      const byThigh = pick(HOSE, "thigh", thigh);
      if (byThigh !== hosierySize) {
        hosierySize = byThigh;
      }
    }
  }

  return {
    unit: m.unit || "cm",
    underbust: m.underbust || null,
    bust: m.bust || null,
    waist: m.waist || null,
    hip: m.hip || null,
    height: m.height || null,
    thigh: m.thigh || null,
    braSize,
    sisterSizes,
    bodySize,
    nightySize,
    gownSize,
    corsetSize,
    hosierySize,
  };
}

module.exports = {
  calculateProfile,
  calculateSisterSizes,
};
