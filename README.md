# Femme Silk Atelier — Shopify theme

Online Store 2.0. Theme folders are at the **repo root** (not in a subfolder).

## Connect from GitHub

Use this repo only: **`feeds-source/femme-silk-atelier`**, branch **`main`**.  
Do **not** connect `vite-react-template` (that is the Cloudflare Worker shop).

1. [GitHub → Settings → Applications → Authorized GitHub Apps → Shopify](https://github.com/settings/installations)  
   Repository access must include **femme-silk-atelier**. Save.
2. Shopify admin → **Online Store → Themes → Add theme → Connect from GitHub**
3. Pick **`feeds-source/femme-silk-atelier`** → **`main`**

### If Shopify says “main isn’t a valid theme”

| Cause | Fix |
|---|---|
| Wrong repo | Connect `femme-silk-atelier`, not `vite-react-template` |
| Shopify app can’t see this repo | Grant the Shopify GitHub app access (step 1), then connect again |
| Connected while the repo was empty | Disconnect / skip that card, connect **main** again after commit `4fb8ce2`+ |
| Theme nested in a folder | Must see `layout/theme.liquid` at the **root** of main — it is |

Root of `main` must look like:

```
assets/  blocks/  config/  layout/  locales/  sections/  snippets/  templates/
```

Required files present: `layout/theme.liquid`, `config/settings_schema.json`.

After a failed connect: remove the broken theme card, then **Add theme → Connect from GitHub** again.

Theme check: structure is valid (only image width/height lint).

## Store setup

Collections: `bras` `babydoll` `gowns` `swim` `corsetry` …  
Products: option **Size**, track qty per variant.  
Page **Size guide**, handle `size-guide`, template **size-guide**.
