# Femme Silk Atelier — Shopify theme

Online Store 2.0 theme for the exotic lingerie house. Ink, champagne gold, cinematic hero, silk marquee, magazine grids, size variants tied to inventory, visual size guide.

## Install

1. Shopify admin → **Online Store → Themes → Add theme → Upload zip**
2. Upload `femme-shopify-theme.zip`
3. **Publish** (or preview first)

## Store setup

Create **collections** that match the aisles (handles suggested):

- `babydoll` `short-nighty` `long-nighty` `gowns` `teddies`
- `bras` `bra-sets` `panties` `camisole` `corsetry` `hosiery` `body-stockings` `shapewear`
- `bridal` `swim` `loungewear` `resort` `thermal` `accessories`

In the theme editor, point each aisle / campaign block at the matching collection.

**Products — size + inventory**

- Option 1 must be named **Size**
- Bras: `30B, 32A, 32B, 32C, 32D, 34A, 34B, 34C, 34D, 36B, 36C, 36D, 38B, 38C, 38D, 40B, 40C, 42B, 42C`
- Nighties / babydolls: `Free Size, S, M, L, XL`
- Gowns: `M, L, XL, XXL`
- Body / lounge: `XS, S, M, L, XL, XXL`
- Body stockings / accessories: `Free Size`
- Track quantity **per variant** (Shopify inventory). Sold-out sizes grey out on cards and the product page. Checkout decrements stock.
- Product **type** = aisle name (Babydoll, Bras…)
- Tag `featured` / `Exotic` / `Best seller` to span two columns in the shop grid

**Pages**

1. Create a page titled **Size guide**, handle `size-guide`
2. In the page editor, set template to **size-guide** (this theme’s visual charts)
3. Also create `about` and `contact`

The header **Sizes** link and footer **Size guide** point at `/pages/size-guide`.

**Payments:** enable **Cash on Delivery** in Shopify Payments / manual payment methods.

**Hero video:** upload MP4 to Settings → Files, paste the CDN URL into the Cinematic hero / Campaign rotator “MP4 URL” setting.

## Navigation

Create menus **Night**, **Body**, **After dusk** and assign them in the footer section.

## Notes

Checkout, taxes, inventory, and customer accounts are Shopify’s.
The live Grok shop remains a separate app until you cut over DNS to this theme.
