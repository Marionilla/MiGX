# Defect Log — SauceDemo & ReqRes

Findings recorded during functional and exploratory testing. Severity uses the
S1–S4 scale defined in `test-plan.md` §7.

> **Nature of the SauceDemo findings.** SauceDemo intentionally seeds per-user
> defects for QA candidates. DEF-02…DEF-04 are those **intentional, expected demo
> behaviours** — logged here to demonstrate detection, triage and severity
> reasoning, not because they are unknown production bugs. They are documented via
> exploratory charters and kept out of the automated regression gate (which runs
> against `standard_user`), so the build stays meaningful while every finding is
> still recorded and traceable to a test case.

## Status legend
| Status | Meaning |
|--------|---------|
| Confirmed (seed) | Reproduced; a known, intentional SauceDemo demo seed |
| Verified working | Checked and behaves correctly (no defect) |

---

## Defects
| ID | Title | Area | Severity | Steps to reproduce (brief) | Expected | Actual | Status | Related TC |
|----|-------|------|----------|----------------------------|----------|--------|--------|------------|
| **DEF-01** | locked_out_user is blocked at login | Access control | **N/A** (verified working) | Log in as `locked_out_user` / `secret_sauce` | Clear error, access denied | Error "Epic sadface: Sorry, this user has been locked out." shown; access blocked | **Verified working** (automated) | TC-A02 |
| **DEF-02** | `problem_user`: all product images identical | Catalog / data integrity | **S3** | Log in as `problem_user`; view inventory; DevTools → Network → Img | Each product shows its own distinct image | Every tile renders the same placeholder ("sl-404") image — all `<img>` `src` point to one resource | **Confirmed (seed)** — see `bug-report.md` | TC-A06 |
| **DEF-03** | `problem_user`: sorting does not reorder the catalog | Sorting / data display | **S2** | Log in as `problem_user`; change the sort dropdown; compare order | Product order updates to match the selected sort | Sort selection does not reorder the list correctly vs `standard_user` | **Confirmed (seed)** | TC-B05 |
| **DEF-04** | `problem_user`: checkout Last Name field misbehaves | Checkout | **S2** | Log in as `problem_user`; checkout step one; type into Last Name | Field accepts input; checkout can complete | Last Name field will not accept input, blocking checkout | **Confirmed (seed)** | TC-A06 |
| **DEF-05** | `performance_glitch_user`: slow inventory load | Performance (signal) | **S3** | Log in as `performance_glitch_user`; measure `/inventory.html` load vs `standard_user` (DevTools waterfall) | Inventory loads comparably to `standard_user` | Inventory load is noticeably delayed (multi-second) for this user only | **Confirmed (seed)** | TC-A07 |

---

## Triage notes
- **DEF-03 / DEF-04 (S2 – Major):** break a *core* feature (sorting, checkout) for
  the affected user, but a workaround exists (use another account) → not S1.
- **DEF-02 / DEF-05 (S3 – Minor):** visible and annoying, but neither blocks the
  purchase flow nor exposes data.
- **DEF-02** is written up in full in `bug-report.md`: its identical-image
  request/response signature is the cleanest bug to evidence at the network level,
  which is exactly what the challenge asks for.
- The seeded defects (DEF-02…DEF-05) are **not** treated as automated-suite
  failures — the regression suite runs against `standard_user`; these are recorded
  via exploratory charters and traced to a TC.
