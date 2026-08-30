# Femme Silk Atelier — Shopify theme

Online Store 2.0 theme. Ink, champagne gold, cinematic home, size + inventory, visual size guide.

Theme folders sit at the **repo root** (`layout/`, `config/`, `sections/`, `templates/`, `snippets/`, `assets/`, `locales/`, `blocks/`). Shopify GitHub connect needs that — do not nest them in a subfolder.

## Connect from GitHub

1. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**
2. Authorize GitHub if asked
3. Pick this repo: **`feeds-source/femme-silk-atelier`** (not `vite-react-template`)
4. Branch **`main`**
5. Preview, then Publish

If you previously connected a different repo, disconnect it and connect this one.

## Store setup

Create **collections** that match the aisles (handles suggested):

- `babydoll` `short-nighty` `long-nighty` `gowns` `teddies`
- `bras` `bra-sets` `panties` `camisole` `corsetry` `hosiery` `body-stockings` `shapewear`
- `bridal` `swim` `loungewear` `resort` `thermal` `accessories`

**Products — size + inventory**

- Option 1 must be named **Size**
- Track quantity **per variant**
- Product **type** = aisle name
- Tag `featured` / `Exotic` / `Best seller` to span two columns

**Pages:** create **Size guide** (handle `size-guide`, template **size-guide**), plus `about` and `contact`.

**Payments:** enable Cash on Delivery if you use it.
