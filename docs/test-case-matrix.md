# Test Case Matrix

Traceable test cases for the MIGx QA Challenge. Each maps to a scenario from the
Test Plan and carries a priority (P1–P3), an automation flag, and a result
column to fill during execution.

**Legend**
- **Priority:** P1 (must / automated) · P2 (should) · P3 (could / exploratory)
- **Auto:** ✅ automated · ✍️ manual
- **Result:** Pass / Fail / Blocked / Not Run · link a defect ID from `defect-log.md`

---

## A. Login & Access Control (UI) — `login.feature`
| ID | Title | Steps | Expected result | Priority | Auto | Result |
|----|-------|-------|-----------------|----------|------|--------|
| TC-A01 | standard_user logs in | Enter `standard_user` / `secret_sauce`, submit | Redirect to `/inventory.html`; products shown | P1 | ✅ | |
| TC-A02 | locked_out_user blocked | Log in as `locked_out_user` | Error "Epic sadface: Sorry, this user has been locked out." | P1 | ✅ | |
| TC-A03 | Invalid password | Valid user + wrong password | Error "Username and password do not match any user in this service" | P1 | ✅ | |
| TC-A04 | Empty username | Blank username + password, submit | Error "Username is required" | P1 | ✅ | |
| TC-A05 | Empty password | Valid username, blank password, submit | Error "Password is required" | P1 | ✅ | |
| TC-A06 | problem_user authenticates | Log in as `problem_user` | Reaches inventory (seeded defects surface later) | P2 | ✍️ | |
| TC-A07 | performance_glitch_user | Log in as `performance_glitch_user` | Reaches inventory, noticeably slower load | P2 | ✍️ | |

## B. Product Sorting (UI) — `sorting.feature`
| ID | Title | Steps | Expected result | Priority | Auto | Result |
|----|-------|-------|-----------------|----------|------|--------|
| TC-B01 | Name (A→Z) | Select "Name (A to Z)" | Names sorted ascending | P1 | ✅ | |
| TC-B02 | Name (Z→A) | Select "Name (Z to A)" | Names sorted descending | P1 | ✅ | |
| TC-B03 | Price (low→high) | Select "Price (low to high)" | Prices ascending | P1 | ✅ | |
| TC-B04 | Price (high→low) | Select "Price (high to low)" | Prices descending | P1 | ✅ | |
| TC-B05 | Sorting for problem_user | Repeat B01–B04 as `problem_user` | Compare vs standard; document incorrect ordering | P2 | ✍️ | |

## C. Cart (UI) — `cart.feature`
| ID | Title | Steps | Expected result | Priority | Auto | Result |
|----|-------|-------|-----------------|----------|------|--------|
| TC-C01 | Add single product | Add "Sauce Labs Backpack" | Cart badge shows 1 | P1 | ✅ | |
| TC-C02 | Remove from cart page | Add product, open cart, remove | Badge empty after remove | P1 | ✅ | |
| TC-C03 | Add multiple products | Add several products | Badge shows correct count; all listed in cart | P2 | ✍️ | |

## D. Checkout (UI) — `checkout.feature`
| ID | Title | Steps | Expected result | Priority | Auto | Result |
|----|-------|-------|-----------------|----------|------|--------|
| TC-D01 | Complete order end to end | Cart → checkout → fill info → finish | "Thank you for your order!" confirmation | P1 | ✅ | |
| TC-D02 | Totals arithmetic | On overview, read item total / tax / total | Total == item total + tax | P1 | ✅ | |
| TC-D03 | Empty first name | Blank first name, Continue | Error "Error: First Name is required" | P1 | ✅ | |
| TC-D04 | Empty last name | Blank last name, Continue | Error "Error: Last Name is required" | P1 | ✅ | |
| TC-D05 | Empty postal code | Blank ZIP, Continue | Error "Error: Postal Code is required" | P1 | ✅ | |

## E. Session / Authentication (UI infrastructure)
| ID | Title | Steps | Expected result | Priority | Auto | Result |
|----|-------|-------|-----------------|----------|------|--------|
| TC-E01 | Session reuse (storageState) | Authenticated flows start from a saved session (setup project) | Authenticated scenarios run without re-logging in | P2 | ✅ | |

## F. API Contract — ReqRes (`/api`)
| ID | Title | Request | Expected result | Priority | Auto | Result |
|----|-------|---------|-----------------|----------|------|--------|
| TC-F01 | List users | `GET /users?page=2` | 200; schema `page,per_page,total,total_pages,data[]`; each user `id,email,first_name,last_name,avatar` | P1 | ✅ | |
| TC-F02 | Single user | `GET /users/2` | 200; `data` matches user schema; email well-formed | P1 | ✅ | |
| TC-F03 | User not found | `GET /users/23` | 404; empty body | P1 | ✅ | |
| TC-F04 | List resources | `GET /unknown` | 200; list schema with `data[]` | P2 | ✅ | |
| TC-F05 | Resource not found | `GET /unknown/23` | 404; empty body | P2 | ✅ | |
| TC-F06 | Create user | `POST /users` `{name,job}` | 201; echoes `name,job` + `id`, ISO `createdAt` | P1 | ✅ | |
| TC-F07 | Update user (PUT) | `PUT /users/2` `{name,job}` | 200; echoes fields + `updatedAt` | P1 | ✅ | |
| TC-F08 | Update user (PATCH) | `PATCH /users/2` `{job}` | 200; echoes field + `updatedAt` | P2 | ✅ | |
| TC-F09 | Delete user | `DELETE /users/2` | 204; empty body | P1 | ✅ | |
| TC-F10 | Register success | `POST /register` valid known user | 200; returns `id` and `token` | P1 | ✅ | |
| TC-F11 | Register missing password | `POST /register` `{email}` only | 400; `{"error":"Missing password"}` | P1 | ✅ | |
| TC-F12 | Login missing password | `POST /login` `{email}` only | 400; `{"error":"Missing password"}` | P1 | ✅ | |
| TC-F13 | Delayed response | `GET /users?delay=3` | 200 after ~3s; schema still valid | P3 | ✅ | |

---

## Traceability summary
| Scenario (Test Plan) | Covered by |
|----------------------|-----------|
| Login & Access Control | TC-A01…A07 → `login.feature` |
| Sorting & Data Display | TC-B01…B05 → `sorting.feature` |
| Cart | TC-C01…C03 → `cart.feature` |
| Checkout | TC-D01…D05 → `checkout.feature` |
| Session / auth reuse | TC-E01 → `auth.setup.ts` (storageState) |
| API Contract Validation | TC-F01…F13 → `api-tests/` (pytest) |
| Network-level bug evidence | TC-A06 / TC-B05 → `bug-report.md` |

**Counts:** P1 = 20 · P2 = 8 · P3 = 1 · Automated = 26 · Manual = 3
