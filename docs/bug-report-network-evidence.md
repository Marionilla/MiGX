# Bug Report — DEF-02: `problem_user` renders the same image for every product

> **Role of this document.** This write-up specifically satisfies the
> challenge's "Bug Reproduction at the Network Level" scenario — DEF-02 has a
> genuine, clean request/response signature in DevTools. The **primary**
> deep bug write-up (highest severity/business impact) is `bug-report.md`
> (DEF-04), a checkout-blocking, purely client-side defect with no
> request/response of its own.

| Field | Value |
|-------|-------|
| **Bug ID** | DEF-02 |
| **Title** | All product images are identical for `problem_user` — every `<img>` resolves to the same resource |
| **Severity** | **S3 – Minor** (data-integrity; arguably S2 in a real store — see Impact) |
| **Priority** | P2 |
| **Component** | Product catalog / static asset resolution |
| **Environment** | <https://www.saucedemo.com/>, Chromium (Playwright) / Chrome latest, reproducible in a fresh profile and Incognito |
| **Reported by** | Maryna Mykhailova (QA) |
| **Related test case** | TC-A06 (problem_user), TC-B05 |
| **Status** | Confirmed (intentional demo seed) |

---

## Summary
When logged in as **`problem_user`**, the inventory page shows the correct
product names, descriptions and prices, but **every product tile displays the
same image** (the "sl-404" placeholder). The baseline `standard_user` shows six
distinct, correct images. This is a data-integrity / asset-resolution defect: the
DOM binds all tiles to one image resource instead of each product's own asset.
It is chosen for the network-level write-up because its signature is unambiguous
in DevTools — the six image requests collapse to a **single URL**.

## Preconditions
- No feature flags / special setup. Password for all demo users: `secret_sauce`.
- Compare against `standard_user` as the known-good baseline.

## Steps to reproduce
1. Open <https://www.saucedemo.com/>.
2. Log in as **`problem_user`** / `secret_sauce`.
3. Land on `/inventory.html`.
4. Open **DevTools → Network**, filter by **Img**, and reload.
5. Inspect the `src` of each `.inventory_item_img img` (**DevTools → Elements**)
   and the image request URLs in **Network**.

## Expected result
Each of the six products requests and displays **its own** image
(`sauce-backpack-*.jpg`, `bike-light-*.jpg`, …) — six distinct image resources.

## Actual result
All six `<img>` elements have the **same** `src`, pointing to the placeholder
(`/static/media/sl-404.<hash>.jpg` — the "dog" image). The catalog is visually
indistinguishable product-to-product.

## Evidence (from a live run)
- **Elements:** the `src` attribute is identical across all six product images.
- **Network (Img filter):** every product image request resolves to the same URL;
  a single `200 OK` image (subsequent tiles served from cache).
- **Console:** typically clean — this is a data-binding issue, not a failed
  request; the absence of errors is itself evidence the wrong-but-valid URL is
  requested deliberately.
- **Console one-liner to confirm:**
  ```js
  new Set(
    [...document.querySelectorAll('.inventory_item_img img')].map((i) => i.src),
  ).size
  ```
  **Expected:** `6` (all distinct). **Actual for `problem_user`:** `1`.
- **Baseline diff:** the same capture as `standard_user` shows six different
  request URLs — include side by side.

## Impact / business risk
Minor on the demo, but the same defect in a real store means shoppers cannot
visually distinguish products — eroding trust and directly hurting conversion and
returns. In an e-commerce context this would be argued up to **S2 (Major)**. It
also signals a broken product-image data mapping that could hide other per-record
binding errors.

## Suggested fix
- Bind each product tile to **its own** image field rather than a shared/default
  asset; use the placeholder only as a genuine fallback when an image is missing.
- Add a guard/log when an image falls back to the placeholder, so a mis-mapped
  catalog is caught in monitoring rather than by customers.
- **Regression coverage:** assert image-`src` **uniqueness** per product (the
  Console one-liner above encodes the check) so this cannot silently return.

## Notes
Intentional SauceDemo seed for `problem_user`; reported to demonstrate detection,
network-level evidencing, triage and a concrete fix. See `defect-log.md` for the
full set of `problem_user` / `performance_glitch_user` findings.
